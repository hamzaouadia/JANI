# JANI Platform

Modern supply-chain enablement platform built as a TypeScript-first monorepo. It bundles a Next.js marketing experience, an Expo mobile companion app, and several containerised backend services that run locally with Docker Compose or through automated CI/CD gates.

## Contents

- [Architecture Overview](#architecture-overview)
- [Repository Layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment & Secrets](#environment--secrets)
- [Installing Dependencies](#installing-dependencies)
- [Running the Stack with Docker](#running-the-stack-with-docker)
- [Running Apps Locally](#running-apps-locally)
- [Quality Checks](#quality-checks)
- [Continuous Integration](#continuous-integration)
- [Deployment Notes](#deployment-notes)

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                           Client Experiences                          │
│  • apps/web    – Next.js 15 landing + dashboards                      │
│  • apps/mobile – Expo (React Native) companion app                    │
└──────────────┬───────────────────────────────────────────────────────┘
               │ HTTPS / Metro (tunnel)
┌──────────────▼───────────────────────────────────────────────────────┐
│                        Backend Services (Docker)                     │
│  • services/auth  – Express + Mongoose auth API (JWT)                │
│  • services/user  – Express façade for profile endpoints             │
│  • services/ai    – Express placeholder for AI integrations          │
│  • MongoDB / Redis – provisioned by docker-compose                   │
└──────────────┬───────────────────────────────────────────────────────┘
               │ Internal networking (Docker bridge)
┌──────────────▼───────────────────────────────────────────────────────┐
│                    Shared Tooling & Operations                       │
│  • Make targets      – build/up/down/clean orchestration              │
│  • Jest / ESLint     – automated testing & linting for mobile         │
│  • GitHub Actions    – quality gates + container build validation     │
└──────────────────────────────────────────────────────────────────────┘
```

## Repository Layout

```text
.
├── apps
│   ├── mobile/   # Expo + TypeScript mobile client
│   └── web/      # Next.js 15 web experience
├── services
│   ├── ai/       # Express stub for AI integrations
│   ├── auth/     # Express + Mongoose auth service
│   └── user/     # Express user façade service
├── docker-compose.yml
├── Makefile
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

- **Node.js 20.x** (ships with npm 10)
- **npm** (workspace-aware)
- **pnpm 10** (required only for `services/auth`; run `corepack enable pnpm@10`)
- **Docker & Docker Compose**
- **Make** (GNU make for the automation targets)

## Environment & Secrets

The root `.env` powers `docker-compose.yml` and the services. Copy it from your secure store or craft a new one using:

```dotenv
AUTH_PORT=4000
WEB_PORT=3000
USER_PORT=5000
AI_PORT=5001
JWT_SECRET=supersecret123
NEXT_PUBLIC_AUTH_URL=http://localhost:4000
OPENAI_API_KEY=dummy-key
```

> **Warning:** never commit real credentials—use secrets managers for production workloads.

## Installing Dependencies

Install the packages for each workspace you intend to touch:

```bash
# Web client
npm install --workspace apps/web

# Mobile app (Expo)
npm install --workspace apps/mobile

# Auth service (pnpm for lockfile fidelity)
corepack prepare pnpm@10 --activate
pnpm install --dir services/auth --frozen-lockfile

# Optional lightweight services
npm install --workspace services/ai
npm install --workspace services/user
```

## Running the Stack with Docker

Use the provided Make targets for end-to-end workflows:

```bash
# Build and start all containers in detached mode
make

# Tail combined logs
make logs

# Stop everything
make down

# ⚠️ Remove ALL Docker containers, images, volumes, and networks on the host
make clean
```

> `make clean` is intentionally destructive—prefer it only on disposable development machines.

## Running Apps Locally

Run services outside Docker for iterative development:

```bash
# Web client
npm run dev --workspace apps/web

# Mobile app (starts Expo CLI)
npm run start --workspace apps/mobile

# Auth API (TypeScript build → Node runtime)
pnpm --dir services/auth run build
pnpm --dir services/auth run start

# User + AI stubs
npm run start --workspace services/user
npm run start --workspace services/ai
```

## Quality Checks

| Area           | Command                                                             |
| -------------- | -------------------------------------------------------------------- |
| Web (lint)     | `npm run lint --workspace apps/web`                                 |
| Mobile (lint)  | `npm run lint --workspace apps/mobile`                              |
| Mobile (types) | `npm run typecheck --workspace apps/mobile`                         |
| Mobile (tests) | `npm run test --workspace apps/mobile -- --watchAll=false`          |
| Auth (build)   | `pnpm --dir services/auth run build`                                |
| Node stubs     | `node --check services/ai/server.js` / `node --check services/user/server.js` |

## Continuous Integration

Automated checks live in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

1. **Web Quality Gate** – installs dependencies, executes `next lint`, and confirms production builds succeed.
2. **Mobile Quality Gate** – runs linting, TypeScript checks, and Jest tests in CI mode.
3. **Auth Service Build** – uses pnpm to install dependencies and compile the TypeScript API.
4. **Container Build Validation** – renders the Compose configuration and builds every image to detect infrastructure drift early.

Jobs cache npm/pnpm artifacts and execute in parallel for fast feedback on pull requests and pushes to `main`.

## Deployment Notes

- Container definitions live in `docker-compose.yml`; mirror them in your production orchestrator or extend the Dockerfiles with environment-specific entrypoints.
- Mobile releases should go through Expo Application Services (EAS) or an equivalent pipeline; the CI job focuses on linting, types, and unit tests.
- Always source secrets from a secure manager (GitHub Environments, AWS Secrets Manager, HashiCorp Vault, etc.).

Refer to workspace-specific READMEs for deeper dives into each application.
