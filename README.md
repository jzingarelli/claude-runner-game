# Social Media Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.com/)

> Enterprise-grade social media analytics platform with comprehensive features for managing, analyzing, and reporting on social media performance.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Backend (Node.js/TypeScript)

- **50+ RESTful API Endpoints**
  - User management (CRUD)
  - Posts management with scheduling
  - Comments and engagement
  - Advanced analytics and reporting
  - Team collaboration
  - Webhook management
  - Subscription and billing

- **Authentication & Security**
  - JWT-based authentication
  - OAuth2 integration (Google, GitHub)
  - Refresh token rotation
  - Password reset flow
  - Two-factor authentication (2FA)
  - Account lockout protection
  - Email verification

- **Authorization**
  - Role-based access control (RBAC)
  - 5 user roles: Viewer, Editor, Moderator, Admin, Super Admin
  - Granular permissions system
  - Team-based access control

- **Database (MongoDB)**
  - 15+ collections with full validation
  - Optimized indexes for performance
  - Aggregation pipelines for analytics
  - Database migrations and seeding

- **Caching & Queue**
  - Redis caching with smart invalidation
  - Bull job queue for background processing
  - Email queue
  - Analytics processing queue
  - Report generation queue
  - Webhook delivery queue

- **Real-time Features**
  - WebSocket server (Socket.IO)
  - Real-time notifications
  - Live analytics updates
  - Team collaboration features

- **Third-party Integrations**
  - Stripe for subscription management (3 tiers)
  - AWS S3 for file uploads
  - SendGrid/SMTP for email delivery
  - Social media platform APIs

- **Middleware & Utilities**
  - Rate limiting (100 req/15min)
  - Request validation (Zod)
  - Error handling
  - Comprehensive logging (Winston)
  - API versioning

### Frontend (React/TypeScript)

- **40+ Functional Components**
  - Dashboard with analytics overview
  - Post scheduler with calendar
  - Report builder
  - User management
  - Team management
  - Settings (10 pages)
  - Billing portal
  - Notification center

- **State Management**
  - Redux Toolkit with 7+ slices
  - React Query for server state
  - Optimistic updates
  - Real-time synchronization

- **Forms & Validation**
  - React Hook Form
  - Zod schema validation
  - 20+ forms with error handling

- **Data Visualization**
  - 5 chart types (Line, Bar, Pie, Area, Scatter)
  - Recharts integration
  - Custom chart components
  - Interactive dashboards

- **UI/UX**
  - Dark/light theme
  - Responsive design (mobile/tablet/desktop)
  - Modern UI with styled-components
  - Infinite scroll
  - Virtual scrolling for large lists
  - Drag-and-drop file upload

### Database

- **Collections**: User, Team, Post, Comment, Analytics, Report, Notification, Webhook, Subscription, Invoice, ApiKey, AuditLog
- **20+ Aggregation Pipelines** for complex analytics
- **Database Seeding** with realistic mock data
- **Migration System** for schema version management

### Testing

- **Backend Tests**
  - Unit tests for all API endpoints (Jest/Supertest)
  - Integration tests for authentication flow
  - Test coverage >80%

- **Frontend Tests**
  - Component tests (Jest/React Testing Library)
  - Integration tests
  - E2E tests (Playwright)

### Documentation

- Complete API documentation (OpenAPI/Swagger)
- Architecture Decision Records (ADRs)
- Database ERD documentation
- Authentication flow diagrams
- Deployment guide (5000+ words)
- Developer onboarding guide
- User guide for 20+ features
- Troubleshooting guide (30+ issues)
- Performance optimization guide
- Security best practices

### Infrastructure

- Docker Compose setup
- Kubernetes manifests
- GitHub Actions CI/CD
- Nginx reverse proxy
- Prometheus/Grafana monitoring
- Backup and recovery procedures

## 📦 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0
- **Redis** >= 7.0
- **Docker** and **Docker Compose** (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourcompany/social-media-analytics.git
cd social-media-analytics
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MongoDB URI, Redis config, JWT secrets, etc.
```

### 4. Start with Docker Compose

```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

### 5. Initialize Database

```bash
# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 6. Start Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or start separately:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP/WebSocket
       │
┌──────▼──────┐      ┌─────────┐
│   Nginx     │      │ Redis   │
│  Reverse    │◄─────┤ Cache   │
│   Proxy     │      └─────────┘
└──────┬──────┘
       │
┌──────▼──────┐      ┌─────────┐      ┌─────────┐
│   Backend   │◄─────┤ MongoDB │      │ Bull    │
│  (Node.js)  │      │Database │◄─────┤ Queue   │
└──────┬──────┘      └─────────┘      └─────────┘
       │
       ├─────► AWS S3 (File Storage)
       ├─────► Stripe (Payments)
       └─────► Email Service
```

### Technology Stack

**Backend:**
- Node.js 18+ with TypeScript
- Express.js for REST API
- MongoDB with Mongoose ODM
- Redis for caching
- Bull for job queues
- Socket.IO for WebSocket
- JWT for authentication
- Passport for OAuth2
- Winston for logging

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit for state management
- React Query for server state
- React Hook Form + Zod for forms
- Recharts for data visualization
- Styled Components for styling
- Vite for build tooling

**Infrastructure:**
- Docker & Docker Compose
- Kubernetes for orchestration
- Nginx for reverse proxy
- Prometheus & Grafana for monitoring
- GitHub Actions for CI/CD

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[API Documentation](docs/api/README.md)** - Complete REST API reference
- **[Architecture Decisions](docs/architecture/README.md)** - ADRs and design docs
- **[Database Schema](docs/database/README.md)** - ERD and schema documentation
- **[Deployment Guide](docs/deployment/README.md)** - Production deployment instructions
- **[Developer Guide](docs/developer/README.md)** - Setup and development workflow
- **[User Guide](docs/user/README.md)** - End-user documentation
- **[Troubleshooting](docs/troubleshooting/README.md)** - Common issues and solutions
- **[Security](docs/security/README.md)** - Security best practices
- **[Performance](docs/performance/README.md)** - Optimization guidelines

### API Documentation

Interactive API documentation is available at:
- Development: http://localhost:5000/api/v1/docs
- Swagger UI with live testing

## 💻 Development

### Project Structure

```
social-media-analytics/
├── backend/                 # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── server.ts           # Application entry point
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── docs/                   # Documentation
├── infrastructure/         # Infrastructure configs
├── scripts/                # Utility scripts
├── tests/                  # Test suites
└── docker-compose.yml      # Docker services
```

### Available Scripts

```bash
# Development
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Building
npm run build            # Build both backend and frontend
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only

# Testing
npm test                 # Run all tests
npm run test:backend     # Run backend tests
npm run test:frontend    # Run frontend tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Linting & Formatting
npm run lint             # Lint all code
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
```

### Code Style

This project follows:
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **TypeScript** strict mode
- Conventional Commits for commit messages

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Backend unit tests
npm run test:backend

# Frontend component tests
npm run test:frontend

# E2E tests
npm run test:e2e

# Watch mode
npm run test:backend -- --watch

# Coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and flows
- **E2E Tests**: Test complete user journeys
- **Coverage Target**: >80% code coverage

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Scale backend instances
docker-compose up -d --scale backend=3

# View logs
docker-compose logs -f
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get deployments

# Scale deployment
kubectl scale deployment backend --replicas=3
```

### Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`: Redis host
- `JWT_SECRET`: JWT signing secret
- `STRIPE_SECRET_KEY`: Stripe API key
- `AWS_ACCESS_KEY_ID`: AWS credentials

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of Conduct
- Development workflow
- Pull request process
- Coding standards
- Commit message guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern technologies and best practices
- Inspired by leading social media analytics platforms
- Community contributions and feedback

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourcompany/social-media-analytics/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourcompany/social-media-analytics/discussions)
- **Email**: support@socialmediaanalytics.com

---

**Built with ❤️ by the Social Media Analytics Team**
