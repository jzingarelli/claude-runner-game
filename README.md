# Enterprise Social Media Analytics Platform

[![CI](https://github.com/your-org/enterprise-social-analytics/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/enterprise-social-analytics/actions)

A production-ready, full‑stack platform for managing social media analytics, reporting, scheduling, teams, and billing.

## Features
- Backend (Node.js/TypeScript)
  - 50+ REST endpoints across users, posts, comments, analytics, reports, notifications, teams, permissions, billing, webhooks
  - Auth: JWT, OAuth2 (Google/GitHub), refresh tokens, 2FA (TOTP)
  - RBAC with 5 roles (owner/admin/manager/analyst/viewer)
  - MongoDB with 15+ collections and validation
  - Redis caching (TTL, prefix invalidation)
  - Bull job queues (email, analytics, exports)
  - WebSocket server (Socket.IO)
  - Rate limiting, validation (Zod), error handling
  - Stripe integration (3 plan tiers), AWS S3 uploads (presigned), Nodemailer templates
  - Logging with Winston, Prometheus metrics, API versioning (v1, v2)
- Frontend (React/TypeScript)
  - 40+ components: dashboard, charts (5), user management, scheduler, report builder, settings (10 pages), billing, team mgmt, notifications
  - Redux Toolkit (15+ slices), React Query, RHF + Zod (forms), Recharts
  - Styled-components theme (dark/light), responsive layout, file uploads, realtime via WebSocket
- Infrastructure & Docs
  - Docker Compose, Nginx reverse proxy, GitHub Actions CI
  - K8s manifests (api/web), Prometheus/Grafana queries
  - OpenAPI docs, ADRs, deployment & security guides

## Quickstart

1. Prerequisites: Docker, Node 20, npm 9+
2. Copy env
```bash
cp .env.example .env
```
3. Start dev stack
```bash
docker compose up -d
```
4. Visit web: http://localhost:8080 — API: http://localhost:4000/api/docs

## Local development without Docker

- Backend
```bash
cd backend && npm i
npm run dev
```
- Frontend
```bash
cd frontend && npm i
npm run dev
```

## Testing
```bash
npm run test
```

## License
MIT
