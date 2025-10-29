# Deployment Guide

## Table of Contents

1. [Production Deployment Overview](#production-deployment-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Docker Deployment](#docker-deployment)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Security Considerations](#security-considerations)
11. [Scaling Strategies](#scaling-strategies)
12. [Troubleshooting](#troubleshooting)

## Production Deployment Overview

This guide provides comprehensive instructions for deploying the Social Media Analytics Platform to production environments. The platform supports multiple deployment strategies:

- **Docker Compose**: Quick deployment for small to medium scale
- **Kubernetes**: Enterprise-scale deployment with auto-scaling
- **Serverless**: AWS Lambda/ECS for serverless architecture

### Architecture

```
Internet → Load Balancer → Nginx → Backend (3 replicas)
                               ↓
                         MongoDB Cluster (3 nodes)
                               ↓
                           Redis Cluster
```

## Prerequisites

### Required Tools

- Docker 20.10+
- Docker Compose 2.0+
- Kubernetes 1.25+ (for K8s deployment)
- kubectl configured
- AWS CLI (for cloud deployment)
- Terraform (optional, for infrastructure as code)

### Required Services

- MongoDB 6.0+
- Redis 7.0+
- SMTP server for emails
- AWS S3 bucket for file storage
- Stripe account for payments

## Environment Configuration

### 1. Production Environment Variables

Create a `.env.production` file:

```bash
# Application
NODE_ENV=production
PORT=5000
API_VERSION=v1
APP_NAME=Social Media Analytics
APP_URL=https://socialmediaanalytics.com
API_URL=https://api.socialmediaanalytics.com

# Database
MONGODB_URI=mongodb://user:password@mongo1:27017,mongo2:27017,mongo3:27017/social_analytics?replicaSet=rs0
MONGODB_OPTIONS=retryWrites=true&w=majority

# Redis
REDIS_HOST=redis-cluster.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TLS=true

# JWT
JWT_SECRET=your-super-secret-256-bit-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=social-analytics-prod

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key
EMAIL_FROM=noreply@socialmediaanalytics.com

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
NEW_RELIC_LICENSE_KEY=your_new_relic_key
```

### 2. Secrets Management

**For Kubernetes:**

```bash
# Create secrets
kubectl create secret generic social-analytics-secrets \
  --from-literal=mongodb-uri='mongodb://...' \
  --from-literal=jwt-secret='your-jwt-secret' \
  --from-literal=stripe-secret='sk_live_...' \
  --from-literal=aws-access-key='AKIA...' \
  --from-literal=aws-secret-key='...'
```

**For Docker Compose:**

Use Docker secrets:

```bash
echo "your-secret-value" | docker secret create mongodb_password -
```

## Database Setup

### MongoDB Production Setup

1. **Deploy MongoDB Replica Set**:

```bash
# Initialize replica set
docker exec -it mongodb-primary mongo
> rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo1:27017" },
      { _id: 1, host: "mongo2:27017" },
      { _id: 2, host: "mongo3:27017" }
    ]
  })
```

2. **Create Database Users**:

```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["root"]
})

use social_analytics
db.createUser({
  user: "appuser",
  pwd: "app-password",
  roles: [
    { role: "readWrite", db: "social_analytics" }
  ]
})
```

3. **Run Migrations**:

```bash
npm run db:migrate
```

4. **Create Indexes**:

```bash
npm run db:create-indexes
```

### Redis Production Setup

1. **Deploy Redis Cluster**:

```bash
redis-cli --cluster create \
  redis1:6379 redis2:6379 redis3:6379 \
  redis4:6379 redis5:6379 redis6:6379 \
  --cluster-replicas 1
```

2. **Configure Persistence**:

```conf
# redis.conf
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfilename "appendonly.aof"
```

## Docker Deployment

### 1. Build Production Images

```bash
# Build backend
docker build -t social-analytics-backend:latest -f Dockerfile.backend .

# Build frontend
docker build -t social-analytics-frontend:latest -f frontend/Dockerfile frontend/
```

### 2. Deploy with Docker Compose

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### 3. Health Checks

```bash
# Check backend health
curl https://api.socialmediaanalytics.com/api/v1/health

# Check all services
docker-compose -f docker-compose.prod.yml ps
```

## Kubernetes Deployment

### 1. Apply Manifests

```bash
# Create namespace
kubectl create namespace social-analytics

# Apply all resources
kubectl apply -f infrastructure/kubernetes/ -n social-analytics

# Verify deployment
kubectl get all -n social-analytics
```

### 2. Configure Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: social-analytics-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - socialmediaanalytics.com
    secretName: tls-secret
  rules:
  - host: socialmediaanalytics.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

### 3. Horizontal Pod Autoscaling

```bash
kubectl autoscale deployment backend \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n social-analytics
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:

1. Runs tests
2. Builds Docker images
3. Pushes to registry
4. Deploys to staging
5. Deploys to production (on main branch)

### Manual Deployment

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git push origin main
```

### Rollback

```bash
# Kubernetes rollback
kubectl rollout undo deployment/backend -n social-analytics

# View rollout history
kubectl rollout history deployment/backend -n social-analytics
```

## Monitoring and Logging

### 1. Prometheus Monitoring

Access Prometheus at: `http://prometheus.socialmediaanalytics.com:9090`

Key metrics:
- API response times
- Error rates
- Database connections
- Cache hit rates
- Queue lengths

### 2. Grafana Dashboards

Access Grafana at: `http://grafana.socialmediaanalytics.com:3001`

Pre-configured dashboards:
- System Overview
- API Performance
- Database Metrics
- User Activity

### 3. Log Aggregation

Logs are collected using:
- Fluentd for log collection
- Elasticsearch for storage
- Kibana for visualization

## Backup and Recovery

### 1. MongoDB Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --uri="$MONGODB_URI" --out="/backups/$DATE"
aws s3 sync /backups/$DATE s3://backups-bucket/mongodb/$DATE
```

### 2. Redis Backup

```bash
# Save Redis snapshot
redis-cli BGSAVE

# Copy to S3
aws s3 cp /data/dump.rdb s3://backups-bucket/redis/dump-$DATE.rdb
```

### 3. Restore Procedure

```bash
# Restore MongoDB
mongorestore --uri="$MONGODB_URI" /backups/20240101

# Restore Redis
redis-cli FLUSHALL
redis-cli --pipe < dump.rdb
```

## Security Considerations

### 1. SSL/TLS Configuration

- Use Let's Encrypt for SSL certificates
- Enforce HTTPS for all traffic
- Enable HTTP Strict Transport Security (HSTS)

### 2. Network Security

- Configure VPC with private subnets
- Use security groups to restrict access
- Enable DDoS protection

### 3. Secrets Management

- Use AWS Secrets Manager or HashiCorp Vault
- Rotate secrets regularly
- Never commit secrets to git

### 4. Regular Updates

- Keep dependencies updated
- Apply security patches promptly
- Run security audits

## Scaling Strategies

### 1. Horizontal Scaling

- Scale backend pods based on CPU/memory
- Use load balancer for distribution
- Session affinity for WebSocket connections

### 2. Database Scaling

- Read replicas for read-heavy workloads
- Sharding for large datasets
- Connection pooling

### 3. Caching Strategy

- Redis for session storage
- CDN for static assets
- HTTP caching headers

## Troubleshooting

### Common Issues

**1. Database Connection Failures**
- Check MongoDB replica set status
- Verify network connectivity
- Check connection string format

**2. High Memory Usage**
- Check for memory leaks
- Review caching strategy
- Scale up pods if needed

**3. Slow API Responses**
- Review database indexes
- Check cache hit rates
- Analyze slow queries

**4. WebSocket Disconnections**
- Check load balancer timeout settings
- Verify session affinity
- Review client reconnection logic

### Debug Commands

```bash
# View pod logs
kubectl logs -f deployment/backend -n social-analytics

# Execute commands in pod
kubectl exec -it backend-pod -n social-analytics -- /bin/bash

# Check resource usage
kubectl top pods -n social-analytics

# View events
kubectl get events -n social-analytics --sort-by='.lastTimestamp'
```

## Performance Optimization

### 1. Database Optimization

- Create appropriate indexes
- Use aggregation pipelines efficiently
- Implement query result caching

### 2. API Optimization

- Enable response compression
- Implement pagination
- Use partial responses

### 3. Frontend Optimization

- Code splitting
- Lazy loading
- Service workers for offline support

## Support

For deployment issues:
- Email: devops@socialmediaanalytics.com
- Slack: #deployment-support
- Documentation: https://docs.socialmediaanalytics.com

---

**Last Updated**: 2025-10-29
**Version**: 1.0.0
