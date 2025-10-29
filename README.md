# Enterprise Social Media Analytics Platform (Phase 1)

This repository contains a production-ready monorepo scaffold for an enterprise-grade social media analytics platform.

Phase 1 delivers:
- Backend (Node.js/TypeScript): Auth (JWT/refresh/reset/2FA), RBAC, Mongo models, CRUD for users/posts/comments, Redis cache, Bull jobs, WebSocket notifications, Stripe/S3/email services, logging, API v1 with OpenAPI.
- Frontend (React/TypeScript): App scaffold, routing, theming, Redux Toolkit, React Query, auth flows, Dashboard, User Management, Notification Center, Settings, Billing pages.
- Infra: Docker Compose (api, web, mongo, redis), GitHub Actions CI, lint/format configs, tsconfigs.

Next phases expand endpoints, components, tests, and documentation.

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

Services:
- API: http://localhost:4000
- Frontend: http://localhost:5173
- MongoDB: mongodb://localhost:27017/esm_analytics
- Redis: redis://localhost:6379

## Local dev

```bash
npm i
npm run -w backend dev
npm run -w frontend dev
```

## Monorepo structure

```
backend/   # Express + TS + Mongo/Redis/Bull/WebSocket
frontend/  # React + TS + Redux Toolkit + React Query
```