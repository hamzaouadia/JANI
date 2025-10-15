# JANI Platform Monorepo

JANI is a supply-chain enablement platform that pairs a web experience, an Expo-powered mobile app, and a trio of lightweight Node.js services. Everything ships as a TypeScript-first monorepo with shared tooling, Docker orchestration, and CI automation.

## Project Overview

| Area            | Tech stack                                   | Purpose |
|-----------------|-----------------------------------------------|---------|
| `apps/web`      | Next.js 15, React 19, Tailwind CSS            | Marketing site and dashboard shell |
| `apps/mobile`   | Expo (React Native), TypeScript               | Field companion for traceability capture |
| `services/auth` | Express, MongoDB, JWT                         | User registration & login API |
| `services/user` | Express                                      | Lightweight façade for account metadata |
| `services/ai`   | Express                                      | Placeholder endpoint for AI integrations |
| `docker-compose.yml` | MongoDB, Redis, service containers     | Local infrastructure bundle |

Supporting tooling includes Jest, ESLint, Expo CLI, and GitHub Actions for quality gates.

## Repository Layout

```text
.
├── apps
│   ├── mobile/         Expo client (Metro bundle or native builds)
│   └── web/            Next.js marketing + dashboard app
├── services
│   ├── ai/             AI integration stub (Express)
│   ├── auth/           Authentication API (Express + MongoDB)
│   └── user/           User/account façade (Express)
├── docker-compose.yml  Local stack definition (web, mobile, services, Mongo, Redis)
├── Makefile            Convenience commands for build/run/clean
├── package.json        Root workspace metadata
└── README.md           You are here
```

## Prerequisites

- **Node.js 20.x** (ships with npm 10)
- **Docker & Docker Compose**
- **GNU Make**
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

Refer to those guides for service-specific configuration, environment variables, and API notes.
