# JANI Platform

> **Agricultural Traceability & Supply Chain Management Platform**

JANI is a comprehensive agricultural traceability platform that empowers farmers, exporters, and consumers with blockchain-ready supply chain transparency. Built as a modern TypeScript monorepo, JANI combines mobile-first field data capture, powerful web dashboards, and intelligent microservices to track produce from seed to table.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](package.json)

## 🌟 Platform Overview

| Component | Technology | Purpose | Port |
|-----------|------------|---------|------|
| **Mobile App** | React Native + Expo 54 | Field data capture, offline-first farm management | - |
| **Web App** | Next.js 15 + React 19 | Marketing site, dashboards, traceability portal | 3000 |
| **Auth Service** | Express + MongoDB + JWT | Authentication, data management, media uploads | 4000 |
| **User Service** | Express + MongoDB | Farm management, access control | 5000 |
| **AI Service** | Express | ML/AI integrations (placeholder) | 5001 |
| **Traceability Service** | Express + MongoDB | Blockchain-ready event tracking | 3004 |
| **Infrastructure** | Docker Compose | MongoDB, Redis, service orchestration | - |

## 📚 Documentation

Comprehensive documentation is available for each component:

### Applications
- **[Mobile App Documentation](apps/mobile/README.md)** - React Native app for farmers
- **[Web App Documentation](apps/web/README.md)** - Next.js web platform

### Services
- **[Auth Service Documentation](services/auth/README.md)** - Authentication & data management
- **[User Service Documentation](services/user/README.md)** - Farm & user management
- **[AI Service Documentation](services/ai/README.md)** - AI/ML integrations (planned)
- **[Traceability Service Documentation](services/traceability/README.md)** - Event tracking

### Additional Resources
- **[Setup Guide](SETUP.md)** - Complete installation and configuration
- **[Project Blueprint](docs/jani-ai-project-blueprint.md)** - Architecture and design
- **[UX Design Guide](docs/jani-ai-ux-design.md)** - User experience principles

## 🚀 Quick Start

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Docker & Docker Compose** for local services
- **pnpm** 10.x (for services)
- **npm** (for apps)
- **Expo CLI** (for mobile development)

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/your-org/jani-platform.git
cd jani-platform

# Install all dependencies
npm install

# Start all services with Docker
docker-compose up -d

# Start web app (in new terminal)
cd apps/web
npm install
npm run dev

# Start mobile app (in new terminal)
cd apps/mobile
npm install
npm start
```

### Individual Service Setup

#### Start Backend Services

```bash
# Start MongoDB and Redis
docker-compose up -d mongo redis

# Start Auth Service
cd services/auth
pnpm install
pnpm run dev

# Start User Service
cd services/user
npm install
npm start

# Start Traceability Service
cd services/traceability
npm install
npm run dev

# Start AI Service
cd services/ai
npm install
npm start
```

#### Start Web Application

```bash
cd apps/web
npm install
npm run dev
```

Access at: `http://localhost:3000`

#### Start Mobile Application

```bash
cd apps/mobile
npm install
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         JANI Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                           ┌──────────────┐   │
│  │  Mobile App  │◄──────── API ────────────►│   Web App    │   │
│  │  (React     │                            │  (Next.js)   │   │
│  │   Native)    │                            │              │   │
│  └──────────────┘                           └──────────────┘   │
│         │                                           │           │
│         │                                           │           │
│         └───────────────┬───────────────────────────┘           │
│                         │                                        │
│                    ┌────▼─────┐                                 │
│                    │   API    │                                 │
│                    │  Gateway │                                 │
│                    └────┬─────┘                                 │
│                         │                                        │
│         ┌───────────────┼───────────────┬──────────┐           │
│         │               │               │          │           │
│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐ ┌──▼──┐         │
│    │  Auth   │    │  User   │    │  Trace  │ │ AI  │         │
│    │ Service │    │ Service │    │ Service │ │ Svc │         │
│    └────┬────┘    └────┬────┘    └────┬────┘ └─────┘         │
│         │              │              │                         │
│         └──────┬───────┴──────┬───────┘                        │
│                │              │                                 │
│           ┌────▼─────┐   ┌───▼────┐                           │
│           │ MongoDB  │   │ Redis  │                           │
│           │          │   │        │                           │
│           └──────────┘   └────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Mobile**: React Native 0.81 + Expo SDK 54 + TypeScript
- **Web**: Next.js 15 + React 19 + Tailwind CSS 4
- **State**: Zustand + React Query (TanStack Query)
- **UI**: Custom components + Framer Motion + GSAP

#### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x/5.x
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB 8.x
- **Cache**: Redis (planned)
- **Auth**: JWT + bcrypt/scrypt

#### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Health checks + structured logging
- **Testing**: Jest + React Testing Library

## 📱 Key Features

### For Farmers

**Farm Management**
- ✅ Multi-farm support with GPS mapping
- ✅ Plot subdivision and crop tracking
- ✅ 5-stage lifecycle management (Planning → Planting → Growing → Harvesting → Completed)
- ✅ Photo/video documentation with GPS tagging
- ✅ Offline-first with automatic sync

**Activity Tracking**
- ✅ 26+ traceability event types
- ✅ Real-time event capture
- ✅ Quality assessments
- ✅ Harvest yield tracking
- ✅ Input application records (fertilizer, pesticide)

**Smart Features**
- ✅ Weather integration
- ✅ Crop recommendations (planned)
- ✅ Pest detection (planned)
- ✅ Yield predictions (planned)

### For Exporters

**Batch Management**
- ✅ Create and manage export batches
- ✅ Aggregate farm data
- ✅ Quality compliance tracking
- ✅ Document generation

**Traceability**
- ✅ QR code generation
- ✅ Complete product history
- ✅ Certificate verification
- ✅ Chain of custody

**Compliance**
- ✅ Export documentation
- ✅ Quality reports
- ✅ Certification tracking
- ✅ Audit trails

### For Consumers

**Product Transparency**
- ✅ QR code scanning
- ✅ Farm-to-table journey
- ✅ Farmer information
- ✅ Quality certifications
- ✅ Social sharing

## 🗂️ Project Structure

## 🗂️ Project Structure

```
jani-platform/
├── apps/                           # Application layer
│   ├── mobile/                     # React Native mobile app
│   │   ├── src/
│   │   │   ├── features/          # Feature modules (auth, farms, etc.)
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── navigation/        # React Navigation setup
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── stores/            # Zustand state management
│   │   │   ├── lib/               # API clients, database
│   │   │   └── theme/             # Design system
│   │   └── README.md              # Mobile app documentation
│   │
│   └── web/                        # Next.js web application
│       ├── src/
│       │   ├── app/               # App Router pages
│       │   ├── components/        # React components
│       │   └── utils/             # Utility functions
│       └── README.md              # Web app documentation
│
├── services/                       # Microservices layer
│   ├── auth/                       # Authentication service
│   │   ├── src/
│   │   │   ├── index.ts           # Service entry point
│   │   │   ├── routes.ts          # Auth routes
│   │   │   ├── dataRoutes.ts      # Data management routes
│   │   │   ├── syncRoutes.ts      # Sync routes
│   │   │   ├── mediaRoutes.ts     # Media upload routes
│   │   │   └── controllers.ts     # Business logic
│   │   └── README.md              # Auth service documentation
│   │
│   ├── user/                       # User/farm management service
│   │   ├── server.js              # Service entry point
│   │   └── README.md              # User service documentation
│   │
│   ├── traceability/               # Traceability events service
│   │   ├── src/
│   │   │   ├── index.js           # Service entry point
│   │   │   ├── models/            # MongoDB models
│   │   │   └── routes/            # API routes
│   │   └── README.md              # Traceability documentation
│   │
│   └── ai/                         # AI/ML service (placeholder)
│       ├── server.js              # Service entry point
│       └── README.md              # AI service documentation
│
├── docs/                           # Project documentation
│   ├── jani-ai-project-blueprint.md  # Architecture overview
│   ├── jani-ai-ux-design.md          # UX/UI guidelines
│   └── traceability_mobile_app_doc.md # Mobile app specs
│
├── docker-compose.yml              # Service orchestration
├── Makefile                        # Build automation
├── package.json                    # Root workspace config
├── README.md                       # This file
└── SETUP.md                        # Setup instructions
```

## 🔧 Development

### Environment Variables

Each service requires environment variables. Create `.env` files:

**services/auth/.env**
```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/jani_auth
JWT_SECRET=your-secret-key
AWS_S3_BUCKET=jani-media-uploads
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

**services/user/.env**
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/jani
JWT_SECRET=your-secret-key
```

**services/traceability/.env**
```bash
PORT=3004
MONGO_URI=mongodb://localhost:27017/jani_traceability
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

**apps/web/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
KINDE_CLIENT_ID=your-client-id
KINDE_CLIENT_SECRET=your-client-secret
```

**apps/mobile/.env**
```bash
API_URL=http://localhost:4000
TRACEABILITY_SERVICE_URL=http://localhost:3004
```

### Running Tests

```bash
# Test all packages
npm test

# Test specific app
cd apps/mobile
npm test

# Test specific service
cd services/auth
pnpm test

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Lint all code
npm run lint

# Format code with Prettier
npm run format

# Type check TypeScript
npm run typecheck
```

### Database Management

```bash
# Start MongoDB
docker-compose up -d mongo

# Connect to MongoDB
mongosh mongodb://localhost:27017/jani_auth

# View collections
show collections

# Seed demo data (auth service)
cd services/auth
pnpm run seed:demo
```

### API Testing

```bash
# Health checks
curl http://localhost:4000/health     # Auth service
curl http://localhost:5000/health     # User service
curl http://localhost:3004/health     # Traceability service
curl http://localhost:5001/health     # AI service

# Test authentication
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

## 🚢 Deployment

### Docker Production

```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Service Deployment

#### Auth Service
```bash
cd services/auth
docker build -t jani-auth:latest .
docker run -p 4000:4000 \
  -e MONGO_URI=mongodb://mongo:27017/jani_auth \
  -e JWT_SECRET=production-secret \
  jani-auth:latest
```

#### Web Application (Vercel)
```bash
cd apps/web
vercel --prod
```

#### Mobile Application (EAS)
```bash
cd apps/mobile
eas build --platform all --profile production
eas submit --platform all
```

## 📊 Monitoring & Observability

### Health Checks

All services expose `/health` endpoints:

```bash
# Check all services
./test-health.sh
```

### Logging

Services use structured JSON logging:

```json
{
  "level": "info",
  "message": "User authenticated",
  "userId": "123",
  "timestamp": "2025-10-22T10:30:00.000Z"
}
```

### Metrics (Planned)

- Request rate and latency
- Error rates by endpoint
- Database query performance
- Cache hit rates
- Active user sessions

## 🔒 Security

### Authentication

- **JWT Tokens**: HS256 signing with 7-day expiration
- **Password Hashing**: bcrypt (10 rounds) / scrypt
- **Token Storage**: Secure storage (Expo SecureStore / HttpOnly cookies)

### Authorization

- **Role-Based Access Control** (RBAC)
  - Farmer: Farm management, event creation
  - Exporter: Batch management, reports
  - Admin: Full system access

### Data Security

- **Encryption at Rest**: MongoDB encryption
- **Encryption in Transit**: HTTPS/TLS
- **Input Validation**: Joi/Zod schemas
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS**: Restricted origins

### API Security

- **Rate Limiting**: 100 requests per 15 minutes
- **Request Size Limits**: 10MB max payload
- **Security Headers**: Helmet.js middleware
- **API Keys**: Service-to-service authentication

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

### Code Review

- All PRs require review from at least 1 maintainer
- CI checks must pass (tests, linting, type checking)
- Code coverage should not decrease
- Documentation must be updated

## 📝 Roadmap

### Q1 2026 - Foundation Enhancement
- [ ] Redis caching layer
- [ ] GraphQL API gateway
- [ ] Advanced search functionality
- [ ] Real-time notifications (WebSockets)
- [ ] Enhanced analytics dashboard

### Q2 2026 - AI Integration
- [ ] Computer vision (pest/disease detection)
- [ ] Crop recommendations
- [ ] Yield predictions
- [ ] Quality assessment automation
- [ ] Market intelligence

### Q3 2026 - Blockchain
- [ ] Ethereum/Polygon integration
- [ ] Smart contracts for traceability
- [ ] NFT certificates
- [ ] Immutable event storage
- [ ] Token incentives

### Q4 2026 - Scale & Expansion
- [ ] Multi-language support (i18n)
- [ ] Regional customization
- [ ] Partner integrations (payment, logistics)
- [ ] B2B marketplace
- [ ] Supply chain financing

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Start MongoDB
docker-compose up -d mongo

# Check if running
docker ps | grep mongo

# View logs
docker logs jani-mongo
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>
```

**Expo Metro Bundler Issues**
```bash
# Clear cache
cd apps/mobile
npx expo start -c

# Reset everything
rm -rf node_modules
npm install
```

**Build Failures**
```bash
# Clean all builds
make clean

# Rebuild everything
make build
```

## 📞 Support

### Documentation
- [Mobile App Docs](apps/mobile/README.md)
- [Web App Docs](apps/web/README.md)
- [Auth Service Docs](services/auth/README.md)
- [User Service Docs](services/user/README.md)
- [Traceability Service Docs](services/traceability/README.md)
- [AI Service Docs](services/ai/README.md)

### Contact
- **Email**: dev@jani.com
- **Issues**: [GitHub Issues](https://github.com/your-org/jani-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/jani-platform/discussions)

## 📄 License

**Proprietary** - JANI Platform © 2025

All rights reserved. This software is the property of JANI Platform and may not be copied, distributed, or modified without explicit permission.

## 🙏 Acknowledgments

Built with:
- [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

Special thanks to all contributors and the open-source community.

---

**Built with ❤️ by the JANI Platform Team**

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
- **pnpm 10.x** (used only by `services/auth`; install via `corepack prepare pnpm@10 --activate`)

## Environment Configuration

Create a root `.env` (used by Docker Compose) with values similar to:

```dotenv
AUTH_PORT=4000
USER_PORT=5000
AI_PORT=5001
WEB_PORT=3000
MONGO_URI=mongodb://mongo:27017/jani
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret
NEXT_PUBLIC_AUTH_URL=http://localhost:4000
OPENAI_API_KEY=dummy-key
```

Each service exposes a `/health` endpoint for quick diagnostics. Secret values should be rotated and injected from a secure manager in non-development environments.

## Quick Start (Docker)

```bash
# Build and start the full stack
make up

# Follow logs
make logs

# Stop everything
make down
```

The Compose file publishes:

- Web UI at `http://localhost:3000`
- Expo dev server at `http://localhost:8081`
- Auth API at `http://localhost:4000/auth`
- User API at `http://localhost:5000`
- AI stub at `http://localhost:5001`
- Traceability API at `http://localhost:5002` 🆕

## Mobile App Features

### 🔍 Traceability System
- **Event Recording** - Capture planting, harvesting, processing events
- **QR Code Generation** - Generate scannable codes for harvest lots
- **GPS Tagging** - Automatic location tracking
- **Photo Evidence** - Attach images to events
- **Hash Verification** - Blockchain-ready integrity checks
- **Offline Sync** - Queue events offline, auto-sync when online

### 🌾 Farm Management  
- **Multi-Plot Tracking** - Manage multiple farm plots
- **7-Stage Lifecycle** - Planning → Planting → Growing → Harvesting → Processing → Packaging → Distribution
- **Progress Indicators** - Visual tracking of farm state
- **Detailed Guides** - Tasks and tips for each farming stage
- **Activity Logging** - Record all farm activities

### 🎨 Enhanced UI/UX
- **Animated Loading States** - Smooth skeleton loaders
- **Sync Status Indicators** - See pending events and sync progress
- **Offline Mode Banner** - Clear indicators when offline
- **Beautiful Themes** - Light and dark mode support
- **Responsive Design** - Works on all device sizes

### 📱 Mobile API Integration
```typescript
// Create traceability event
import { useCreateEvent } from '@/features/traceability/hooks/useTraceability';

const { mutate } = useCreateEvent();
mutate({
  type: 'PLANTING',
  farmId: 'farm-123',
  cropType: 'Tomatoes',
  quantity: 100,
  location: { latitude: 6.5244, longitude: 3.3792 }
});
```

## Local Development (without Docker)

```bash
# Install dependencies per workspace
npm install --workspace apps/web
npm install --workspace apps/mobile
npm install --workspace services/ai
npm install --workspace services/user
corepack prepare pnpm@10 --activate
pnpm install --dir services/auth --frozen-lockfile

# Start runtimes
npm run dev --workspace apps/web
npm run start --workspace apps/mobile
pnpm --dir services/auth run build && pnpm --dir services/auth run start
npm run start --workspace services/user
npm run start --workspace services/ai
```

When running outside Docker, start your own MongoDB instance (defaults to `mongodb://localhost:27017/jani-ai-auth`).

## Quality Checks

| Scope              | Command |
|--------------------|---------|
| Web lint           | `npm run lint --workspace apps/web`
| Mobile lint        | `npm run lint --workspace apps/mobile`
| Mobile types       | `npm run typecheck --workspace apps/mobile`
| Mobile tests       | `npm run test --workspace apps/mobile -- --watchAll=false`
| Auth build         | `pnpm --dir services/auth run build`
| AI/User syntax     | `node --check services/ai/server.js` and `node --check services/user/server.js`

The CI workflow defined in `.github/workflows/ci.yml` mirrors these commands and additionally validates Docker Compose builds.

## Documentation

- [`services/auth/README.md`](services/auth/README.md)
- [`services/user/README.md`](services/user/README.md)
- [`services/ai/README.md`](services/ai/README.md)
- [`apps/web/README.md`](apps/web/README.md)
- 🆕 [`MOBILE_APP_COMPLETE_ENHANCEMENTS.md`](MOBILE_APP_COMPLETE_ENHANCEMENTS.md) - Full mobile enhancement details
- 🆕 [`MOBILE_DEV_QUICKREF.md`](MOBILE_DEV_QUICKREF.md) - Developer quick reference guide
- 🆕 [`MOBILE_APP_WORK_SUMMARY.md`](MOBILE_APP_WORK_SUMMARY.md) - Recent work summary

Refer to those guides for service-specific configuration, environment variables, and API notes.

## Useful Scripts

### Status Dashboard
```bash
./status-dashboard.sh    # Visual dashboard with all services status
```

### Health Checks
```bash
make health             # Check all services health
./test-health.sh        # Detailed health check script
```

### Mobile Testing
```bash
./test-mobile-enhancements.sh    # Test mobile app integrations
```

### Service Management
```bash
make up                 # Start all services
make down               # Stop all services
make restart service=mobile    # Restart specific service
make logs service=auth  # View service logs
```

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     JANI Platform                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Web App     │  │  Mobile App  │  │  Admin Panel │     │
│  │  (Next.js)   │  │  (Expo)      │  │  (Future)    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
│         │                  │                                │
│         └─────────┬────────┘                                │
│                   │                                         │
│  ┌────────────────┴────────────────────────────────┐       │
│  │              API Gateway / Services              │       │
│  ├──────────────────────────────────────────────────┤       │
│  │                                                   │       │
│  │  Auth (4000)  │  User (5000)  │  AI (5001)      │       │
│  │  Traceability (5002)                            │       │
│  └────────────────┬──────────────────────────────────┘      │
│                   │                                         │
│  ┌────────────────┴────────────────────────────────┐       │
│  │           Data Layer                             │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  MongoDB  │  Redis  │  MinIO (Future)           │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.
