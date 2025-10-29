# JANI Platform Monorepo

> Agricultural traceability platform for farms, exporters, and consumers

## Overview

JANI is a full-stack agricultural traceability platform. It provides mobile and web apps for farmers, exporters, and consumers, plus a suite of backend microservices for authentication, user management, product traceability, operations, and AI analytics.

---

## Monorepo Structure

- **apps/**
  - **mobile/**: Expo React Native app for farmers and field workers
  - **web/**: Next.js web app for dashboards, marketing, and traceability
- **services/**
  - **auth/**: Authentication and user management
  - **user/**: User profile and farm data
  - **traceability/**: Product journey and certification tracking
  - **operations/**: Logistics and operational data
  - **ai/**: AI analytics and predictions
- **scripts/**: Utility scripts for API checks and code cleanup
- **docker-compose.yml**: Orchestrates all services and infrastructure
- **Makefile**: Common build, dev, and test commands

---

## Tech Stack

- **Frontend:** React Native (Expo), Next.js, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB
- **State:** Zustand, React Query
- **Styling:** Tailwind CSS (web)
- **Auth:** JWT, jose, jsonwebtoken
- **Infra:** Docker, Docker Compose
- **AI/ML:** Custom analytics (ai service)

---

## Features

- 🌾 Farm management and activity logging
- 📦 Product traceability from farm to consumer
- 🚚 Exporter portal and logistics
- 📊 Dashboards and analytics
- 🔒 Authentication and user management
- 🤖 AI-powered predictions
- 🖥️ Modern web and mobile UIs

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker
- MongoDB (local or via Docker)

### Setup
```bash
# Install dependencies
npm install

# Start all services and infrastructure
docker compose up -d

# Start web app (in separate terminal)
cd apps/web
npm install
npm run dev

# Start mobile app (in separate terminal)
cd apps/mobile
npm install
npm start
```

### Data Seeding
```bash
# Seed demo data for auth service
cd services/auth
pnpm run seed:demo
# Or via Docker
docker compose run --rm seed-data
```

---

## Environment Variables

- Centralized in `.env` at root
- Each service reads from `.env` or its own `.env` file
- Example:
```bash
AUTH_PORT=4000
USER_PORT=5000
TRACEABILITY_PORT=5002
AI_PORT=5001
OPERATIONS_PORT=5003
MONGO_URI=mongodb://localhost:27017/jani
```

---

## Project Structure
```
JANI/
├── apps/
│   ├── mobile/
│   └── web/
├── services/
│   ├── auth/
│   ├── user/
│   ├── traceability/
│   ├── operations/
│   └── ai/
├── scripts/
├── docker-compose.yml
├── Makefile
├── package.json
└── .env
```

---

## Common Scripts
```bash
npm run lint        # Lint all code
npm run format      # Format all code
npm run typecheck   # TypeScript checks
make dev            # Start dev environment
make build          # Build all apps/services
```

---

## Troubleshooting & Tips

- Check Docker logs for service errors: `docker compose logs <service>`
- Use `.env` to configure ports and endpoints
- For mobile API access, use LAN IP (see `.env`)
- Run `npm run lint` and `npm run typecheck` before PRs
- See individual app/service READMEs for more details

---

## Contributing

1. Use TypeScript strict mode
2. Write tests for new features
3. Document complex logic in code
4. Follow monorepo and Docker best practices
5. Use PRs for all changes

---

## License
Proprietary - JANI Platform
