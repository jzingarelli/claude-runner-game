# System Architecture

## Overview

The Social Media Analytics Platform is a modern, scalable enterprise application built with a microservices-oriented architecture. This document provides a comprehensive overview of the system design, components, and their interactions.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   Web App  │  │  Mobile    │  │   API      │                │
│  │  (React)   │  │   App      │  │  Clients   │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Load Balancer / CDN                          │
│                        (Nginx / CloudFront)                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────┐              ┌──────────────────┐
│   Frontend   │              │    API Gateway   │
│   (React)    │              │    (Express)     │
└──────────────┘              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌───────────────┐  ┌─────────────┐  ┌──────────────┐
            │  Auth Service │  │  API Layer  │  │  WebSocket   │
            │   (JWT/OAuth) │  │  (Express)  │  │  (Socket.IO) │
            └───────┬───────┘  └──────┬──────┘  └──────┬───────┘
                    │                 │                 │
                    └─────────┬───────┴─────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   Business Logic  │
                    │   (Controllers)   │
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌─────────────────┐   ┌────────────┐
│   MongoDB    │    │  Redis Cache    │   │   Bull     │
│  (Database)  │    │  (Session/Cache)│   │  (Queue)   │
└──────────────┘    └─────────────────┘   └────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                    ┌────────┴──────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   AWS S3     │    │   Stripe     │
            │ (Storage)    │    │  (Payments)  │
            └──────────────┘    └──────────────┘
```

## Component Details

### 1. Frontend Layer (React/TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Redux Toolkit for state management
- React Query for server state
- Styled Components for styling
- Vite for build tooling

**Key Features:**
- Server-side rendering ready
- Progressive Web App (PWA) capabilities
- Code splitting and lazy loading
- Optimistic UI updates
- Real-time data synchronization

**Component Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Charts/         # Data visualization
│   ├── Forms/          # Form components
│   └── Common/         # Common components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Redux store and slices
├── services/           # API services
└── utils/              # Utility functions
```

### 2. Backend Layer (Node.js/TypeScript)

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express.js framework
- Mongoose ODM
- Socket.IO for WebSocket
- Bull for job queues

**Architecture Pattern:**
```
Request → Middleware → Controller → Service → Repository → Database
```

**Middleware Chain:**
1. **Security Middleware**: Helmet, CORS
2. **Rate Limiting**: Express-rate-limit
3. **Authentication**: JWT verification
4. **Authorization**: Role-based access control
5. **Validation**: Request validation (Zod)
6. **Error Handling**: Centralized error handling
7. **Logging**: Request/response logging

**Service Layer:**
```
backend/
├── config/             # Configuration
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── services/           # Business logic
│   ├── authService     # Authentication
│   ├── emailService    # Email operations
│   ├── s3Service       # File storage
│   ├── stripeService   # Payment processing
│   ├── queueService    # Background jobs
│   └── websocketService# Real-time features
├── types/              # TypeScript definitions
└── utils/              # Utilities
```

### 3. Database Layer

#### MongoDB (Primary Database)

**Collections:**
- Users: User accounts and profiles
- Teams: Team organizations
- Posts: Social media posts
- Comments: Post comments
- Analytics: Time-series analytics data
- Reports: Generated reports
- Notifications: User notifications
- Webhooks: Webhook configurations
- Subscriptions: Billing subscriptions
- Invoices: Payment invoices
- ApiKeys: API access keys
- AuditLogs: Audit trail

**Indexes:**
- Compound indexes for common queries
- Text indexes for search
- TTL indexes for auto-expiration

**Example Schema (User):**
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  firstName: string,
  lastName: string,
  role: enum (indexed),
  subscriptionTier: enum (indexed),
  teamId: ObjectId (indexed),
  preferences: {
    theme: enum,
    language: string,
    timezone: string,
    notifications: object
  },
  metadata: object,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

#### Redis (Caching & Session Store)

**Use Cases:**
- Session storage
- API response caching
- Rate limiting counters
- Real-time data
- Job queue backend

**Cache Strategy:**
- Cache-aside pattern
- TTL-based expiration
- Tag-based invalidation
- Write-through for critical data

### 4. Authentication & Authorization

**Authentication Flow:**

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT access token (15min expiry)
   ↓
4. Generate refresh token (7d expiry)
   ↓
5. Store refresh token in database
   ↓
6. Return both tokens to client
   ↓
7. Client stores tokens (localStorage)
   ↓
8. Client includes access token in requests
   ↓
9. Token expires → Use refresh token
   ↓
10. Refresh token expires → Re-authenticate
```

**Authorization Levels:**
1. **Viewer**: Read-only access
2. **Editor**: Create and edit own content
3. **Moderator**: Moderate content
4. **Admin**: Full team management
5. **Super Admin**: System-wide administration

**OAuth2 Integration:**
- Google OAuth
- GitHub OAuth
- Custom OAuth providers

**Two-Factor Authentication:**
- TOTP-based (compatible with Google Authenticator)
- Backup codes
- SMS verification (optional)

### 5. Real-time Features (WebSocket)

**Socket.IO Implementation:**

**Events:**
- `notification`: New notification
- `analytics:update`: Analytics data update
- `post:update`: Post status change
- `comment:added`: New comment
- `typing:start`: User typing indicator
- `typing:stop`: User stopped typing

**Rooms:**
- `user:{userId}`: Personal room
- `team:{teamId}`: Team room
- `post:{postId}`: Post-specific room

**Connection Flow:**
```
1. Client connects with JWT token
   ↓
2. Server authenticates connection
   ↓
3. Client joins relevant rooms
   ↓
4. Server broadcasts events to rooms
   ↓
5. Client receives and processes events
```

### 6. Background Jobs (Bull Queue)

**Queue Types:**
- **email**: Email delivery
- **analytics**: Analytics processing
- **reports**: Report generation
- **exports**: Data exports
- **webhooks**: Webhook delivery
- **notifications**: Push notifications

**Job Processing:**
```
1. API enqueues job with payload
   ↓
2. Bull stores job in Redis
   ↓
3. Worker picks up job
   ↓
4. Worker processes job
   ↓
5. Success → Remove from queue
   ↓
6. Failure → Retry with backoff
```

**Retry Strategy:**
- Exponential backoff
- Max 3 attempts
- Dead letter queue for failed jobs

### 7. File Storage (AWS S3)

**Upload Flow:**
```
1. Client requests upload URL
   ↓
2. Backend generates presigned URL
   ↓
3. Client uploads directly to S3
   ↓
4. S3 notifies backend via webhook
   ↓
5. Backend updates database
```

**File Organization:**
```
bucket/
├── uploads/
│   └── {userId}/
│       └── {timestamp}-{random}-{filename}
├── reports/
│   └── {reportId}/
│       └── {format}.{ext}
└── exports/
    └── {exportId}/
        └── data.zip
```

### 8. Payment Processing (Stripe)

**Subscription Flow:**
```
1. User selects plan
   ↓
2. Backend creates Stripe customer
   ↓
3. Backend creates subscription
   ↓
4. Client confirms payment
   ↓
5. Stripe webhook confirms
   ↓
6. Backend activates subscription
   ↓
7. User gets access to features
```

**Webhook Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### 9. Monitoring & Observability

**Metrics Collection:**
- **Prometheus**: Time-series metrics
- **Grafana**: Visualization dashboards
- **Winston**: Application logging
- **Sentry**: Error tracking

**Key Metrics:**
- Request rate and latency
- Error rate by endpoint
- Database query performance
- Cache hit/miss ratio
- Queue length and processing time
- WebSocket connection count

**Logging Levels:**
- ERROR: System errors
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Debug information

### 10. Security Architecture

**Security Layers:**

1. **Network Security**
   - VPC with private subnets
   - Security groups
   - DDoS protection

2. **Application Security**
   - Helmet.js headers
   - CORS configuration
   - Rate limiting
   - Input validation

3. **Authentication Security**
   - JWT with short expiry
   - Refresh token rotation
   - Password hashing (bcrypt)
   - 2FA support

4. **Data Security**
   - Encryption at rest
   - Encryption in transit (TLS)
   - Secure backup procedures

5. **API Security**
   - API key management
   - Request signing
   - Webhook signature verification

## Data Flow Examples

### Create Post Flow

```
1. User fills post form
   ↓
2. Frontend validates with Zod
   ↓
3. POST /api/v1/posts with JWT token
   ↓
4. Rate limiter checks limit
   ↓
5. Authentication middleware verifies JWT
   ↓
6. Authorization checks user role
   ↓
7. Validation middleware checks payload
   ↓
8. Controller extracts data
   ↓
9. Service processes business logic
   ↓
10. Model saves to MongoDB
   ↓
11. Cache invalidates related data
   ↓
12. Queue schedules post if needed
   ↓
13. WebSocket broadcasts update
   ↓
14. Response sent to client
   ↓
15. Frontend updates optimistically
```

### Analytics Query Flow

```
1. User views analytics dashboard
   ↓
2. Frontend dispatches Redux action
   ↓
3. React Query checks cache
   ↓
4. Cache miss → API request
   ↓
5. GET /api/v1/analytics/dashboard
   ↓
6. Backend checks Redis cache
   ↓
7. Cache miss → MongoDB aggregation
   ↓
8. Aggregation pipeline processes data
   ↓
9. Results cached in Redis (5min TTL)
   ↓
10. Response sent to client
   ↓
11. React Query caches result
   ↓
12. Redux updates store
   ↓
13. Components re-render
```

## Scalability Considerations

### Horizontal Scaling

**Stateless Design:**
- No server-side session storage
- JWT tokens for authentication
- Redis for shared state

**Load Balancing:**
- Round-robin for API servers
- Sticky sessions for WebSocket
- Health check endpoints

### Database Scaling

**Read Replicas:**
- Read queries → Replica
- Write queries → Primary
- Automatic failover

**Sharding Strategy:**
- Shard key: userId or teamId
- Range-based sharding
- Consistent hashing

### Caching Strategy

**Multi-level Caching:**
1. Browser cache (static assets)
2. CDN cache (global)
3. Redis cache (application)
4. MongoDB query cache

## Disaster Recovery

**Backup Strategy:**
- MongoDB: Daily full backup + continuous oplog
- Redis: RDB snapshots every 15 minutes
- S3: Versioning enabled
- Retention: 30 days

**Recovery Time Objective (RTO):** 1 hour  
**Recovery Point Objective (RPO):** 15 minutes

**Failover Procedures:**
1. Automatic MongoDB replica failover
2. DNS-based failover for services
3. Multi-region deployment for DR

## Performance Optimization

**Backend Optimizations:**
- Connection pooling (MongoDB, Redis)
- Query result caching
- Database indexing
- Compression (gzip)
- Async processing for heavy operations

**Frontend Optimizations:**
- Code splitting
- Lazy loading
- Tree shaking
- Image optimization
- Service workers

**Database Optimizations:**
- Compound indexes
- Covered queries
- Aggregation pipeline optimization
- Read preference configuration

## Future Enhancements

**Planned Improvements:**
- GraphQL API
- Machine learning for analytics
- Multi-tenancy support
- Advanced reporting engine
- Mobile apps (React Native)
- ElasticSearch for full-text search
- Kafka for event streaming

## Conclusion

This architecture provides a solid foundation for an enterprise-grade social media analytics platform with:
- High availability (99.9% uptime)
- Horizontal scalability
- Strong security
- Real-time capabilities
- Comprehensive monitoring
- Disaster recovery

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-10-29  
**Maintained By**: Architecture Team
