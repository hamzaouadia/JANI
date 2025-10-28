# 🌱 JANI Platform# 🌱 JANI Platform



> **Agricultural Traceability & Supply Chain Management Platform**> **Agricultural Traceability & Supply Chain Management Platform**



JANI is a comprehensive agricultural traceability platform that empowers farmers, exporters, and consumers with blockchain-ready supply chain transparency. Built as a modern TypeScript monorepo, JANI combines mobile-first field data capture, powerful web dashboards, and intelligent microservices to track produce from seed to table.JANI is a comprehensive agricultural traceability platform that empowers farmers, exporters, and consumers with blockchain-ready supply chain transparency. Built as a modern TypeScript monorepo, JANI combines mobile-first field data capture, powerful web dashboards, and intelligent microservices to track produce from seed to table.



[![Node](https://img.shields.io/badge/node-20.18.3+-green.svg)](package.json)[![Node](https://img.shields.io/badge/node-20.18.3+-green.svg)](package.json)

[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](package.json)[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](package.json)

[![React Native](https://img.shields.io/badge/react--native-0.81.5-61dafb.svg)](apps/mobile/package.json)[![React Native](https://img.shields.io/badge/react--native-0.81.5-61dafb.svg)](apps/mobile/package.json)

[![Next.js](https://img.shields.io/badge/next.js-15.4.7-black.svg)](apps/web/package.json)[![Next.js](https://img.shields.io/badge/next.js-15.4.7-black.svg)](apps/web/package.json)

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)



------



## 📑 Table of Contents## 📑 Table of Contents



- [Project Status](#-project-status)- [Project Status](#-project-status)

- [Platform Overview](#-platform-overview)- [Platform Overview](#-platform-overview)

- [Quick Start](#-quick-start)- [Quick Start](#-quick-start)

- [Documentation](#-documentation)- [Documentation](#-documentation)

- [Architecture](#-architecture)- [API Documentation](#-api-documentation)

- [Development](#-development)- [Development](#-development)

- [API Documentation](#-api-documentation)- [Testing](#-testing)

- [Testing](#-testing)- [Deployment](#-deployment)

- [Deployment](#-deployment)- [Known Issues](#-known-issues)

- [Known Issues](#-known-issues)

---

---

## ✅ Project Status

## ✅ Project Status

### CI/CD Status

### CI/CD Status

| Component | Lint | TypeCheck | Tests | Build | Overall |

| Component | Lint | TypeCheck | Tests | Build | Overall ||-----------|------|-----------|-------|-------|---------|

|-----------|------|-----------|-------|-------|---------|| **Mobile App** | ✅ 0 errors | ✅ 0 errors | ⚠️ 4/6 (67%) | N/A | 🟢 Good |

| **Mobile App** | ✅ 0 errors | ✅ 0 errors | ⚠️ 4/6 (67%) | N/A | 🟢 Good || **Web App** | ✅ 0 errors | ✅ 0 errors | N/A | ❌ SSG issue | 🟡 Fair |

| **Web App** | ✅ 0 errors | ✅ 0 errors | N/A | ❌ SSG issue | 🟡 Fair || **Auth Service** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent |

| **Auth Service** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent || **User Service** | ✅ Pass | N/A (JS) | ✅ Pass | ✅ Pass | 🟢 Excellent |

| **User Service** | ✅ Pass | N/A (JS) | ✅ Pass | ✅ Pass | 🟢 Excellent || **Traceability** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent |

| **Traceability** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent || **Operations** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent |

| **Operations** | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Pass | 🟢 Excellent || **AI Service** | ✅ Pass | N/A (JS) | ✅ Pass | ✅ Pass | 🟢 Excellent |

| **AI Service** | ✅ Pass | N/A (JS) | ✅ Pass | ✅ Pass | 🟢 Excellent |

### Recent Achievements ✨

### Recent Achievements ✨

- ✅ **npm Modernization**: Upgraded 9.2.0 → 11.6.2 for improved dependency resolution

- ✅ **npm Modernization**: Upgraded 9.2.0 → 11.6.2 for improved dependency resolution- ✅ **React Standardization**: Aligned entire monorepo on React 18.2.0

- ✅ **React Standardization**: Aligned entire monorepo on React 18.2.0- ✅ **TypeScript Strict**: All TS packages pass strict mode (0 errors)

- ✅ **TypeScript Strict**: All TS packages pass strict mode (0 errors)- ✅ **Dependency Cleanup**: Removed conflicting packages (@kinde-oss)

- ✅ **Dependency Cleanup**: Removed conflicting packages (@kinde-oss)- ✅ **Test Infrastructure**: Mobile tests at 67% with proper mocks

- ✅ **Test Infrastructure**: Mobile tests at 67% with proper mocks- ✅ **CI/CD Scripts**: Local GitHub Actions testing with `act`

- ✅ **CI/CD Scripts**: Local GitHub Actions testing with `act`- ✅ **API Documentation**: Complete endpoint documentation

- ✅ **Complete Documentation**: Individual READMEs for all services and apps- ✅ **Docker Compose**: Full stack orchestration

- ✅ **Docker Compose**: Full stack orchestration configured

### Known Issues 🔍

### Known Issues 🔍

- **Web Build**: Static page generation failing on 404 page (React error #31) - under investigation

- **Web Build**: Static page generation failing on 404 page (React error #31) - workaround: use `npm run dev`

- **Mobile Tests**: 2/6 tests need additional mocks (expo-secure-store, netinfo) - low priority



---1. **Web Build (Non-Critical)**- **Mobile Tests**: 2 tests need additional mocks (expo-secure-store, netinfo)



## 🌟 Platform Overview   - **Issue**: Next.js SSG fails on 404 page generation



### Technology Stack   - **Error**: React error #31 during static page pre-rendering## ✅ Project Status



| Component | Technology | Purpose | Port |   - **Impact**: Build fails but development works fine

|-----------|------------|---------|------|

| **Mobile App** | React Native + Expo 54 | Field data capture, offline-first farm management | - |   - **Status**: Under investigation - Next.js 15 + React 18 compatibility## 📚 Documentation

| **Web App** | Next.js 15 + React 18 | Marketing site, dashboards, traceability portal | 3000 |

| **Auth Service** | Express + MongoDB + JWT | Authentication, data management, media uploads | 4000 |   - **Workaround**: Use `npm run dev` for development

| **User Service** | Express + MongoDB | Farm & user management, access control | 5000 |

| **AI Service** | Express | ML/AI integrations (placeholder) | 5001 |### CI/CD Pipeline Status

| **Traceability** | Express + MongoDB | Blockchain-ready event tracking, QR codes | 5002 |

| **Operations** | Express + TypeScript | Farm operations and activities management | 5003 |2. **Mobile Tests (Minor)**

| **Infrastructure** | Docker Compose | MongoDB, Redis, MinIO (S3) | - |

   - **Issue**: 2/6 tests failingComprehensive documentation is available for each component:

### Key Features

   - **Missing**: expo-secure-store and netinfo mocks

#### 📱 Mobile App (React Native)

- **Offline-First**: Full functionality without internet   - **Impact**: Low - core functionality tested| Component | Lint | TypeCheck | Tests | Build | Status |

- **Farm Management**: Create/edit farms, plots, orders

- **Activity Tracking**: Log planting, irrigation, harvesting   - **Status**: Low priority

- **Photo Uploads**: Capture and sync images

- **QR Code Scanner**: Product traceability lookup|-----------|------|-----------|-------|-------|--------|### Applications

- **Multi-Language**: English & French support

---

#### 🌐 Web Application (Next.js)

- **Marketing Site**: Landing page with animations| **Mobile App** | ✅ Passing | ✅ Passing | ⚠️ 4/6 (67%) | N/A | 🟡 Good |- **[Mobile App Documentation](apps/mobile/README.md)** - React Native app for farmers

- **Admin Dashboard**: User, farm, and order management

- **Exporter Portal**: Lot tracking and analytics## 🚀 Quick Start

- **Consumer Traceability**: Product journey visualization

- **Responsive Design**: Mobile-friendly interface| **Web App** | ✅ Passing | ✅ Passing | N/A | ❌ Known Issue | 🟡 Good |- **[Web App Documentation](apps/web/README.md)** - Next.js web platform



#### ⚙️ Backend Services### Prerequisites

- **RESTful APIs**: Express-based microservices

- **JWT Authentication**: Secure token-based auth| **Auth Service** | ✅ Passing | ✅ Passing | ✅ Passing | ✅ Passing | 🟢 Excellent |

- **Media Storage**: S3-compatible MinIO

- **Offline Sync**: Queue-based synchronizationEnsure you have:

- **Background Jobs**: Merkle tree generation

- **Rate Limiting**: API protection| **User Service** | ✅ Passing | N/A | ✅ Passing | ✅ Passing | 🟢 Excellent |### Services



---- **Node.js** 20.18.3+ (20.19.4+ recommended for React Native)



## 🚀 Quick Start- **npm** 11.6.2+| **Traceability** | ✅ Passing | ✅ Passing | ✅ Passing | ✅ Passing | 🟢 Excellent |- **[Auth Service Documentation](services/auth/README.md)** - Authentication & data management



### Prerequisites- **Docker & Docker Compose**



Ensure you have the following installed:- **pnpm** 10.x (for TypeScript services)| **AI Service** | ✅ Passing | N/A | ✅ Passing | ✅ Passing | 🟢 Excellent |- **[User Service Documentation](services/user/README.md)** - Farm & user management



- **Node.js** 20.18.3 or higher (20.19.4+ recommended for React Native)- **Expo CLI** (optional, for mobile development)

- **npm** 11.6.2+ (for better override support)

- **Docker & Docker Compose** (for infrastructure services)- **[AI Service Documentation](services/ai/README.md)** - AI/ML integrations (planned)

- **pnpm** 10.x+ (for TypeScript services)

- **Expo CLI** (optional, for mobile development)### 🏃 Fast Setup (5 minutes)



### One-Command Setup### Recent Improvements ✨- **[Traceability Service Documentation](services/traceability/README.md)** - Event tracking



```bash```bash

# 1. Clone the repository

git clone https://github.com/hamzaouadia/JANI.git# 1. Clone repository

cd JANI

git clone https://github.com/hamzaouadia/JANI.git

# 2. Install workspace dependencies

npm installcd JANI- ✅ **npm Upgrade**: 9.2.0 → 11.6.2 for better dependency resolution and override support### Additional Resources



# 3. Copy environment configuration

cp .env.example .env

# Edit .env with your configuration# 2. Install dependencies- ✅ **React Alignment**: Standardized on React 18.2.0 across entire monorepo- **[Setup Guide](SETUP.md)** - Complete installation and configuration



# 4. Start infrastructure (MongoDB, Redis, MinIO)npm install

docker-compose up -d mongo redis minio

- ✅ **Dependency Cleanup**: Removed unused @kinde-oss dependency causing version conflicts- **[Project Blueprint](docs/jani-ai-project-blueprint.md)** - Architecture and design

# 5. Seed demo data

docker-compose run --rm seed-data# 3. Setup environment

```

cp .env.example .env- ✅ **TypeScript Fixes**: All packages passing strict mode type checking (0 errors)- **[UX Design Guide](docs/jani-ai-ux-design.md)** - User experience principles

### Running Individual Components

# Edit .env with your configuration

#### Mobile App

- ✅ **Test Coverage**: Mobile tests improved with proper mocks for Expo modules

```bash

cd apps/mobile# 4. Start infrastructure

npm install

npm startdocker-compose up -d mongo redis minio- ✅ **CI Scripts**: Added local testing scripts for GitHub Actions simulation## 🚀 Quick Start



# Scan QR code with Expo Go app on your phone

# Or press 'i' for iOS simulator, 'a' for Android emulator

```# 5. Start auth service (required for mobile/web)



#### Web Appcd services/auth



```bashpnpm install### Known Issues 🔍## 🚀 Quick Start

cd apps/web

npm installpnpm run dev

npm run dev



# Access at http://localhost:3000

```# 6. Seed demo data (optional)



#### Auth Service (Required for Mobile/Web)pnpm run seed:demo1. **Web Build (Non-blocking)**:### Prerequisites



```bash```

cd services/auth

pnpm install   - Static page generation failing on 404 page (React error #31)

pnpm run dev

Now you can start the mobile or web app!

# Service runs on http://localhost:4000

```   - Root cause: Next.js 15 + React 18 compatibility during SSG- **Node.js** 20.18.3 or higher (20.19.4+ recommended for React Native)



#### Traceability Service### 📱 Start Mobile App



```bash   - Impact: Build fails but lint/typecheck pass ✅- **npm** 11.6.2+ (upgraded for better dependency resolution)

cd services/traceability

pnpm install```bash

pnpm run dev

cd apps/mobile   - Status: Under investigation, does not block development- **Docker & Docker Compose** for local services

# Service runs on http://localhost:5002

```npm install



### Full Stack with Dockernpm start- **pnpm** 10.x (for TypeScript services: auth, operations, traceability)



```bash

# Start all services

docker-compose up -d# Then:2. **Mobile Tests (Minor)**:- **Expo CLI** (for mobile development)



# Check service health# Press 'i' for iOS Simulator

docker-compose ps

./test-health.sh# Press 'a' for Android Emulator   - 2/6 tests failing due to missing mocks



# View logs# Scan QR code with Expo Go app

docker-compose logs -f

```   - Needs: expo-secure-store and @react-native-community/netinfo mocks### Environment Setup

# Stop all services

docker-compose down

```

### 🌐 Start Web App   - Impact: Low, core functionality tested

---



## 📚 Documentation

```bash   - Status: Low priority1. **Install Node.js dependencies**:

Comprehensive documentation is available for each component:

cd apps/web

### Applications

npm install```bash

- **[Mobile App Documentation](apps/mobile/README.md)** - React Native app for farmers

- **[Web App Documentation](apps/web/README.md)** - Next.js web platformnpm run dev



### Services---# Install workspace dependencies (this installs for all packages)



- **[Auth Service Documentation](services/auth/README.md)** - Authentication & data management# Access at http://localhost:3000

- **[User Service Documentation](services/user/README.md)** - Farm & user management

- **[Traceability Service Documentation](services/traceability/README.md)** - Event tracking```npm install

- **[Operations Service Documentation](services/operations/README.md)** - Farm operations

- **[AI Service Documentation](services/ai/README.md)** - AI/ML integrations (planned)



### Additional Resources### 🐳 Full Docker Stack## 🚀 Quick Start



- **[Setup Guide](SETUP.md)** - Complete installation and configuration

- **[Copilot Instructions](.github/copilot-instructions.md)** - AI agent development guide

```bash# Verify npm version (should be 11.6.2+)

---

# Start everything

## 🏗️ Architecture

docker-compose up -d### Prerequisitesnpm --version

### System Architecture



```

┌─────────────────────────────────────────────────────────────────┐# View logs```

│                         JANI Platform                            │

├─────────────────────────────────────────────────────────────────┤docker-compose logs -f

│                                                                  │

│  ┌──────────────┐                           ┌──────────────┐   │Ensure you have the following installed:

│  │  Mobile App  │                            │   Web App    │   │

│  │   (Expo)     │◄────── REST APIs ─────────►│  (Next.js)   │   │# Check service health

│  │              │                            │              │   │

│  │ • Farm Mgmt  │                            │ • Marketing  │   │docker-compose ps2. **Configure environment variables**:

│  │ • Activities │                            │ • Dashboards │   │

│  │ • Offline    │                            │ • Analytics  │   │./test-health.sh

│  └──────┬───────┘                            └──────┬───────┘   │

│         │                                           │           │- **Node.js** 20.18.3 or higher (20.19.4+ recommended for React Native)```bash

│         │                 HTTP/JSON                 │           │

│         └────────────────┬──────────────────────────┘           │# Stop all services

│                          │                                       │

│              ┌───────────▼────────────┐                         │docker-compose down- **npm** 11.6.2+ (for better override support)# Copy the example environment file

│              │    Auth Service        │                         │

│              │    (Port 4000)         │                         │```

│              │                        │                         │

│              │  /auth    - Login      │                         │- **Docker & Docker Compose** (for infrastructure services)cp .env.example .env

│              │  /data    - Farms      │                         │

│              │  /sync    - Offline    │                         │---

│              │  /media   - Uploads    │                         │

│              │  /jobs    - Background │                         │- **pnpm** 10.x+ (for TypeScript services)

│              └───────────┬────────────┘                         │

│                          │                                       │## 🏗️ Architecture

│         ┌────────────────┼────────────────┬──────────┐          │

│         │                │                │          │          │- **Expo CLI** (optional, for mobile development)# Edit .env with your configuration

│    ┌────▼────┐     ┌────▼────┐     ┌────▼─────┐ ┌──▼───┐     │

│    │  User   │     │ Trace-  │     │Operations│ │  AI  │     │### System Architecture

│    │ Service │     │ ability │     │ Service  │ │ Svc  │     │

│    │ (5000)  │     │ (5002)  │     │ (5003)   │ │(5001)│     │# Key variables:

│    └────┬────┘     └────┬────┘     └────┬─────┘ └──────┘     │

│         │               │               │                      │```

│         └───────┬───────┴───────┬───────┘                      │

│                 │               │                               │┌─────────────────────────────────────────────────────────────────┐### Installation# - MONGODB_URI

│    ┌────────────▼──┐      ┌────▼────┐       ┌──────────┐     │

│    │   MongoDB     │      │  Redis  │       │  MinIO   │     ││                         JANI Platform                            │

│    │   (27017)     │      │  (6379) │       │  (9000)  │     │

│    │               │      │         │       │   S3     │     │├─────────────────────────────────────────────────────────────────┤# - JWT_SECRET

│    │ • Users       │      │ • Cache │       │ • Images │     │

│    │ • Farms       │      │ • Jobs  │       │ • Files  │     ││                                                                  │

│    │ • Orders      │      └─────────┘       └──────────┘     │

│    │ • Plots       │                                          ││  ┌──────────────┐                           ┌──────────────┐   │```bash# - Service ports (AUTH_PORT, USER_PORT, etc.)

│    │ • Events      │                                          │

│    └───────────────┘                                          ││  │  Mobile App  │                            │   Web App    │   │

│                                                                │

└────────────────────────────────────────────────────────────────┘│  │   (Expo)     │◄────── REST APIs ─────────►│  (Next.js)   │   │# 1. Clone the repository```

```

│  │              │                            │              │   │

### Data Flow Example

│  │ • Farm Mgmt  │                            │ • Marketing  │   │git clone https://github.com/hamzaouadia/JANI.git

```

Farmer opens mobile app│  │ • Activities │                            │ • Dashboards │   │

  ↓

1. Login → POST /auth/login (Auth Service)│  │ • Offline    │                            │ • Analytics  │   │cd JANI3. **Start infrastructure services**:

  ↓

2. JWT token stored in AsyncStorage│  └──────┬───────┘                            └──────┬───────┘   │

  ↓

3. Fetch farms → GET /data/farms (Auth Service)│         │                                           │           │```bash

  ↓

4. View farm details → Stored in Zustand + React Query cache│         │                 HTTP/JSON                 │           │

  ↓

5. Create activity → POST /sync/push (Auth Service)│         └────────────────┬──────────────────────────┘           │# 2. Install workspace dependencies# Start MongoDB, Redis, and MinIO

  ↓

6. Upload photo → POST /media/prepare (Auth Service → MinIO)│                          │                                       │

  ↓

7. Sync when offline → Queue in AsyncStorage → Sync later│              ┌───────────▼────────────┐                         │npm installdocker-compose up -d mongo redis minio

  ↓

8. Create traceability event → POST /api/events (Traceability Service)│              │    Auth Service        │                         │

  ↓

9. Generate QR code → GET /api/qr/generate/:lotId (Traceability Service)│              │    (Port 4000)         │                         │```

```

│              │                        │                         │

---

│              │  /auth    - Login      │                         │# 3. Copy environment configuration

## 💻 Development

│              │  /data    - Farms      │                         │

### Monorepo Structure

│              │  /sync    - Offline    │                         │cp .env.example .env### One-Command Setup

```

JANI/│              │  /media   - Uploads    │                         │

├── apps/

│   ├── mobile/              # React Native + Expo 54│              │  /jobs    - Background │                         │# Edit .env with your configuration

│   │   ├── src/

│   │   │   ├── components/  # UI components│              └───────────┬────────────┘                         │

│   │   │   ├── features/    # Feature modules

│   │   │   ├── lib/         # API clients, utilities│                          │                                       │```bash

│   │   │   ├── stores/      # Zustand state management

│   │   │   └── navigation/  # React Navigation config│         ┌────────────────┼────────────────┬──────────┐          │

│   │   ├── package.json

│   │   └── App.tsx│         │                │                │          │          │# 4. Start infrastructure (MongoDB, Redis, MinIO)# Full stack startup

│   │

│   └── web/                 # Next.js 15│    ┌────▼────┐     ┌────▼────┐     ┌────▼─────┐ ┌──▼───┐     │

│       ├── src/

│       │   ├── app/         # App Router pages│    │  User   │     │ Trace-  │     │Operations│ │  AI  │     │docker-compose up -d mongo redis minionpm install

│       │   ├── components/  # React components

│       │   └── utils/       # Utilities│    │ Service │     │ ability │     │ Service  │ │ Svc  │     │

│       ├── package.json

│       └── next.config.ts│    │ (5000)  │     │ (5002)  │     │ (5003)   │ │(5001)│     │```docker-compose up -d

│

├── services/│    └────┬────┘     └────┬────┘     └────┬─────┘ └──────┘     │

│   ├── auth/                # Authentication service (TypeScript)

│   │   ├── src/│         │               │               │                      │

│   │   │   ├── routes.ts    # Auth endpoints

│   │   │   ├── dataRoutes.ts # Data endpoints│         └───────┬───────┴───────┬───────┘                      │

│   │   │   ├── syncRoutes.ts # Offline sync

│   │   │   ├── mediaRoutes.ts # Media uploads│                 │               │                               │### Running the Platform# Web app

│   │   │   └── index.ts     # Main server

│   │   └── package.json│    ┌────────────▼──┐      ┌────▼────┐       ┌──────────┐     │

│   │

│   ├── user/                # User service (JavaScript)│    │   MongoDB     │      │  Redis  │       │  MinIO   │     │cd apps/web

│   ├── traceability/        # Traceability service (JavaScript)

│   ├── operations/          # Operations service (TypeScript)│    │   (27017)     │      │  (6379) │       │  (9000)  │     │

│   └── ai/                  # AI service (JavaScript, placeholder)

││    │               │      │         │       │   S3     │     │#### Option 1: Full Stack (Docker Compose)npm run dev

├── scripts/                 # Utility scripts

├── .github/                 # GitHub Actions CI/CD│    │ • Users       │      │ • Cache │       │ • Images │     │

├── docker-compose.yml       # Full stack orchestration

├── package.json             # Root workspace config│    │ • Farms       │      │ • Jobs  │       │ • Files  │     │

└── README.md                # This file

```│    │ • Orders      │      └─────────┘       └──────────┘     │



### Package Managers│    │ • Plots       │                                          │```bash# Mobile app  



- **npm** (11.6.2+): Used for apps (`apps/mobile`, `apps/web`) and root workspace│    │ • Events      │                                          │

- **pnpm** (10.x+): Used for TypeScript services (`services/auth`, `services/operations`, `services/traceability`)

│    └───────────────┘                                          │# Start all servicescd apps/mobile

### Environment Variables

│                                                                │

Create a `.env` file in the root directory:

└────────────────────────────────────────────────────────────────┘docker-compose up -dnpm start

```bash

# MongoDB```

MONGODB_URI=mongodb://localhost:27017/jani

```

# Redis

REDIS_URL=redis://localhost:6379### Data Flow Example



# MinIO (S3)# Check service health

S3_ENDPOINT=http://localhost:9000

S3_ACCESS_KEY=minioadmin```

S3_SECRET_KEY=minioadmin

S3_BUCKET=jani-mediaFarmer opens mobile appdocker-compose ps### Individual Service Setup



# JWT  ↓

JWT_SECRET=your-secret-key-change-in-production

1. Login → POST /auth/login (Auth Service)./test-health.sh

# Service Ports

AUTH_PORT=4000  ↓

USER_PORT=5000

AI_PORT=50012. JWT token stored in AsyncStorage```#### Start Backend Services

TRACEABILITY_PORT=5002

OPERATIONS_PORT=5003  ↓

WEB_PORT=3000

3. Fetch farms → GET /data/farms (Auth Service)

# Mobile

MOBILE_HOST=192.168.1.100  # Your local IP for Expo  ↓

EXPO_PUBLIC_AUTH_API=http://192.168.1.100:4000

EXPO_PUBLIC_TRACEABILITY_API=http://192.168.1.100:50024. View farm details → Stored in Zustand + React Query cache#### Option 2: Individual Services```bash

```

  ↓

### Development Workflow

5. Create activity → POST /sync/activities (Auth Service)# Start MongoDB and Redis

```bash

# Install dependencies for all packages  ↓

npm install

6. Upload photo → POST /media/upload (Auth Service → MinIO)**Start Backend Services:**docker-compose up -d mongo redis

# Start infrastructure

docker-compose up -d mongo redis minio  ↓



# Start auth service (terminal 1)7. Sync when offline → Queue in AsyncStorage → Sync later

cd services/auth

pnpm install```

pnpm run dev

```bash# Start Auth Service (TypeScript/pnpm)

# Start web app (terminal 2)

cd apps/web### Technology Stack

npm install

npm run dev# Auth Service (TypeScript/pnpm)cd services/auth



# Start mobile app (terminal 3)#### Frontend

cd apps/mobile

npm installcd services/authpnpm install

npm start

```**Mobile App** (apps/mobile/)



---- React Native 0.81.5pnpm installpnpm run dev        # Development with hot reload



## 📡 API Documentation- Expo SDK 54.0.17



### Auth Service (Port 4000)- TypeScript 5.9 (strict mode)pnpm run dev# or



**Authentication:**- State: Zustand + React Query v5

- `POST /auth/signup` - Create new user

- `POST /auth/login` - User login- Storage: AsyncStorage + expo-sqlitepnpm run seed:demo  # Seed database with demo data

- `POST /auth/verify` - Verify JWT token

- `GET /auth/me` - Get current user- UI: Custom components + React Native Reanimated



**Data Management:**- Testing: Jest + React Testing Library# User Service (JavaScript/npm)

- `GET /data/farms` - List farms

- `POST /data/farms/:id/link` - Link farm to user

- `GET /data/partners` - List partners

- `GET /data/orders` - List orders**Web App** (apps/web/)cd services/user# Start User Service (JavaScript/npm)



**Offline Sync:**- Next.js 15.4.7 (App Router)

- `POST /sync/push` - Push offline events

- `POST /sync/commit` - Commit sync- React 18.2.0npm installcd services/user

- `POST /sync/pull` - Pull server data

- TypeScript 5.x

**Media:**

- `POST /media/prepare` - Prepare media upload- Styling: Tailwind CSS 4npm startnpm install



**Background Jobs:**- Animations: Framer Motion + GSAP

- `POST /jobs/merkle/run` - Generate Merkle tree

- Auth: JWT-based (custom)npm start

### Traceability Service (Port 5002)



- `GET /api/events` - List events

- `POST /api/events` - Create event#### Backend Services# Traceability Service (TypeScript/pnpm)

- `GET /api/events/:id` - Get event

- `PUT /api/events/:id` - Update event

- `DELETE /api/events/:id` - Delete event

- `GET /api/events/lot/:lotId` - Get events by lot**Auth Service** (services/auth/) - **PRIMARY SERVICE**cd services/traceability# Start Traceability Service (TypeScript/pnpm)

- `GET /api/qr/generate/:lotId` - Generate QR code

- Express.js with TypeScript

### User Service (Port 5000)

- MongoDB (Mongoose)pnpm installcd services/traceability

- `GET /farms` - List farms

- `POST /farms` - Create farm- JWT authentication

- `GET /farms/:id` - Get farm

- `PATCH /farms/:id` - Update farm- S3/MinIO media uploadspnpm run devpnpm install

- `POST /farms/link` - Link farm to user

- `GET /data/orders` - List orders- Background job processing



### Operations Service (Port 5003)- **Routes**:pnpm run dev



- `GET /api/farms` - List farms  - `/auth` - Authentication

- `GET /api/fields` - List fields

- `GET /api/activities` - List activities  - `/data` - Farms, partners, orders# AI Service (JavaScript/npm)

- `POST /api/activities` - Create activity

- `GET /api/farms/:id/statistics` - Get farm stats  - `/sync` - Offline sync



For detailed API documentation with examples, see individual service READMEs.  - `/media` - File uploadscd services/ai# Start AI Service (JavaScript/npm)



---  - `/jobs` - Background tasks



## 🧪 Testingnpm installcd services/ai



### Run All Tests**User Service** (services/user/)



```bash- Express.js (JavaScript)npm startnpm install

# Root - runs all package tests

npm test- MongoDB



# Individual packages- User & farm management```npm start

cd apps/mobile && npm test

cd services/auth && pnpm test

```

**Traceability Service** (services/traceability/)```

### Linting

- Express.js with TypeScript

```bash

# Root- MongoDB**Start Web Application:**

npm run lint

- Blockchain-ready event tracking

# Individual packages

cd apps/mobile && npm run lint- QR code generation**Service Endpoints:**

cd apps/web && npm run lint

cd services/auth && pnpm run lint

```

**Operations Service** (services/operations/)```bash- Auth: `http://localhost:4000`

### Type Checking

- Express.js with TypeScript

```bash

# Root- Farm operations & activitiescd apps/web- User: `http://localhost:5000`

npm run typecheck



# Individual packages

cd apps/mobile && npm run typecheck**AI Service** (services/ai/)npm install- Traceability: `http://localhost:5002`

cd apps/web && npm run typecheck

cd services/auth && pnpm run typecheck- Express.js (JavaScript)

```

- Placeholder for ML/AI featuresnpm run dev- AI: `http://localhost:5001`

### CI Testing Locally



```bash

# Test mobile CI pipeline#### Infrastructure# Access at http://localhost:3000

./test-mobile-ci.sh



# Test all health endpoints

./test-health.sh- **Database**: MongoDB 6```#### Start Web Application



# Test with GitHub Actions locally (requires 'act')- **Cache**: Redis 7

./test-ci-locally.sh

```- **Storage**: MinIO (S3-compatible)



### Current Test Status- **Container**: Docker + Docker Compose



- **Mobile App**: 4/6 tests passing (67%)- **Package Managers**: npm 11.6.2 (apps), pnpm 10.x (TS services)**Start Mobile Application:**```bash

  - ✅ Component rendering

  - ✅ Navigation

  - ✅ State management

  - ✅ API mocking---cd apps/web

  - ❌ Secure storage (needs mock)

  - ❌ Network info (needs mock)



- **Services**: All passing## 🎯 Features & Functionality```bashnpm install

  - ✅ Auth service tests

  - ✅ Traceability tests

  - ✅ User service tests

  - ✅ Operations tests### 🌾 For Farmers (Mobile App)cd apps/mobilenpm run dev



---



## 🚀 Deployment#### Farm Managementnpm install```



### Docker Deployment- ✅ **Multi-farm support**: Manage multiple farms from one account



```bash- ✅ **GPS coordinates**: Geolocation for each farmnpm start

# Build all services

docker-compose build- ✅ **Plot subdivision**: Divide farms into plots with crops



# Start in production mode- ✅ **Crop tracking**: Track different crops per plot# Press 'i' for iOS, 'a' for Android, or scan QR codeAccess at: `http://localhost:3000`

docker-compose up -d

- ✅ **Lifecycle stages**: Planning → Planting → Growing → Harvesting → Completed

# View logs

docker-compose logs -f```



# Scale services#### Activity Logging

docker-compose up -d --scale auth=3

```- ✅ **Daily activities**: Log field work (planting, irrigation, harvest)#### Start Mobile Application



### Individual Service Deployment- ✅ **Photo documentation**: Capture and upload images



**Auth Service:**- ✅ **Resource tracking**: Water, fertilizers, pesticides usage### Seeding Data

```bash

cd services/auth- ✅ **Geotags**: GPS coordinates per activity

docker build -t jani-auth .

docker run -p 4000:4000 -e MONGODB_URI=$MONGODB_URI jani-auth- ✅ **Offline support**: Work without internet, sync later```bash

```



**Web App:**

```bash#### Offline-First Design```bashcd apps/mobile

cd apps/web

npm run build- ✅ **AsyncStorage**: Local data persistence

npm start

# Or deploy to Vercel- ✅ **SQLite**: Structured data storage# Seed demo data (farms, users, orders, etc.)npm install

vercel

```- ✅ **Queue system**: Background sync when online



**Mobile App:**- ✅ **Conflict resolution**: Smart merge on synccd services/authnpm start

```bash

cd apps/mobile

# iOS

eas build --platform ios### 📦 For Exporters (Web & Mobile)pnpm run seed:demo```

# Android

eas build --platform android

```

#### Order Management

### Environment-Specific Configurations

- ✅ **Create orders**: Link orders to specific farm lots

**Production:**

- Set `NODE_ENV=production`- ✅ **Track shipments**: Status tracking from farm to export# Or via DockerThen:

- Use secure JWT secrets

- Enable HTTPS- ✅ **QR codes**: Generate traceability QR codes

- Configure proper CORS origins

- Set up monitoring (PM2, New Relic)- ✅ **Documentation**: Compliance and certification docsdocker-compose run --rm seed-data- Press `i` for iOS Simulator



**Staging:**

- Mirror production config

- Use staging databases#### Supply Chain Visibility```- Press `a` for Android Emulator  

- Enable verbose logging

- ✅ **Farm-to-export tracking**: Complete journey visibility

**Development:**

- Use `.env` file- ✅ **Partner network**: Manage partner relationships- Scan QR code with Expo Go app on physical device

- Enable hot reload

- Verbose error messages- ✅ **Analytics dashboard**: Volume, value, performance metrics



------



## 🐛 Known Issues### 🔍 For Consumers (Web App)



### 1. Web Build Failure (Non-Critical)**Mobile Development:**



**Issue**: Next.js static site generation fails on 404 page  #### Product Traceability

**Error**: React error #31 during pre-rendering  

**Impact**: Cannot create production build  - ✅ **QR code scanning**: Scan product QR codes## 📁 Workspace Structure- Uses React Native 0.81.5 with Expo SDK 54

**Workaround**: Use `npm run dev` for development  

**Status**: Under investigation - Next.js 15 + React 18 compatibility- ✅ **Farm journey**: View complete production history



### 2. Mobile Test Failures (Minor)- ✅ **Farmer profiles**: Learn about the farmer- React 18.2.0 for compatibility



**Issue**: 2/6 tests failing  - ✅ **Photo timeline**: See production photos

**Missing**: expo-secure-store and netinfo mocks  

**Impact**: Low - core functionality tested  - ✅ **Treatment details**: Fertilizers, pesticides used```- Offline-first with AsyncStorage

**Status**: Low priority - will add mocks when needed



---

### 🛠️ Platform FeaturesJANI/- Comprehensive Jest tests with React Native Testing Library

## 🤝 Contributing



### Development Standards

#### Authentication & Authorization├── apps/

1. **Code Style**: Follow ESLint rules (auto-fix with `npm run lint:fix`)

2. **TypeScript**: Strict mode enabled, no `any` types- ✅ **JWT-based auth**: Secure token authentication

3. **Commits**: Conventional commits (feat:, fix:, docs:, etc.)

4. **Testing**: Write tests for new features- ✅ **Role-based access**: Farmer, Exporter, Admin roles│   ├── mobile/              # React Native + Expo mobile app## 🧪 Testing & Quality

5. **Documentation**: Update READMEs for API changes

- ✅ **Password hashing**: bcrypt/scrypt encryption

### Commit Message Format

- ✅ **Session management**: Redis-backed sessions│   │   ├── src/

```

type(scope): subject



body#### Media Management│   │   │   ├── components/  # Reusable UI components### Run All Tests



footer- ✅ **S3-compatible storage**: MinIO for images/files

```

- ✅ **Signed URLs**: Secure temporary access│   │   │   ├── features/    # Feature modules (auth, farms, etc.)

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

- ✅ **Image optimization**: Automatic resizing (planned)

**Example**:

```- ✅ **CDN support**: Ready for CloudFront integration│   │   │   ├── lib/         # API clients, utilities```bash

feat(mobile): add QR code scanner for product lookup



- Implement camera permissions

- Add QR code detection#### Data Synchronization│   │   │   ├── navigation/  # React Navigation setup# Full CI pipeline (lint + typecheck + build + test)

- Navigate to trace screen on scan

- ✅ **Offline queue**: Local queue for offline actions

Closes #123

```- ✅ **Background sync**: Automatic sync when online│   │   │   ├── stores/      # Zustand state managementnpm run ci



### Pull Request Process- ✅ **Conflict resolution**: Last-write-wins strategy



1. Fork the repository- ✅ **Sync status**: Real-time sync indicators│   │   │   └── types/       # TypeScript definitions

2. Create a feature branch (`git checkout -b feat/amazing-feature`)

3. Commit changes (`git commit -m 'feat: add amazing feature'`)

4. Push to branch (`git push origin feat/amazing-feature`)

5. Open a Pull Request---│   │   ├── package.json# Web CI only

6. Ensure CI passes

7. Request review from maintainers



---## 📡 API Reference│   │   └── README.md



## 📄 License



This project is proprietary software. All rights reserved.### Auth Service (Port 4000)│   │



© 2025 JANI Platform. Unauthorized copying, distribution, or use is strictly prohibited.



---**Base URL**: `http://localhost:4000`│   └── web/                 # Next.js web application# Mobile CI only



## 👥 Team



For questions or support, contact the development team.#### Authentication Endpoints│       ├── src/



---



**Built with ❤️ for sustainable agriculture**```bash│       │   ├── app/         # App router pages```


POST   /auth/signup          # Register new user

POST   /auth/login           # Login user│       │   ├── components/  # React components

POST   /auth/verify          # Verify JWT token

GET    /auth/me              # Get current user profile│       │   └── utils/       # Utilities### Individual Checks

```

│       ├── package.json

**Example Login Request**:

```bash│       └── README.md```bash

curl -X POST http://localhost:4000/auth/login \

  -H "Content-Type: application/json" \│# Linting

  -d '{

    "email": "farmer@example.com",├── services/npm run lint:web

    "password": "SecurePass123!"

  }'│   ├── auth/                # Authentication & data service (TypeScript)npm run lint:mobile



# Response:│   │   ├── src/

{

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",│   │   ├── seed-*.json      # Seed data files# Type checking

  "user": {

    "id": "507f1f77bcf86cd799439011",│   │   ├── seed-all-data.js # Seeding scriptnpm run typecheck:web

    "email": "farmer@example.com",

    "name": "John Farmer",│   │   └── package.jsonnpm run typecheck:mobile

    "role": "farmer"

  }│   │

}

```│   ├── user/                # User management service (JavaScript)# Tests



#### Data Endpoints│   │   ├── src/npm run test:mobile



```bash│   │   └── package.json

GET    /data/farms           # List all farms

POST   /data/farms/:id/link  # Link farm to user│   │# Build

GET    /data/partners        # List partners

GET    /data/orders          # List orders│   ├── traceability/        # Event tracking service (TypeScript)npm run build:web

```

│   │   ├── src/```

**Example Farms Request**:

```bash│   │   └── package.json

curl -X GET http://localhost:4000/data/farms \

  -H "Authorization: Bearer YOUR_JWT_TOKEN"│   │### Local CI Testing



# Response:│   ├── ai/                  # AI/ML service (JavaScript)

{

  "farms": [│   │   └── package.jsonWe provide scripts to simulate GitHub Actions locally:

    {

      "id": "farm_123",│   │

      "name": "Green Valley Farm",

      "location": {│   └── operations/          # Operations service (TypeScript)```bash

        "latitude": 34.0522,

        "longitude": -118.2437│       ├── src/# Test mobile CI locally (requires 'act' tool)

      },

      "area": 50,│       └── package.json./test-mobile-ci.sh

      "plots": [...]

    }│

  ]

}├── scripts/                 # Utility scripts# Test all CI workflows

```

│   ├── check-*-api.js       # API health check scripts./test-ci-locally.sh

#### Sync Endpoints

│   └── jscodeshift/         # Code transformation scripts

```bash

POST   /sync/activities      # Sync activities from mobile│# Check service health

POST   /sync/plots           # Sync plot updates

GET    /sync/status          # Get sync status├── .github/./test-health.sh

```

│   └── workflows/```

#### Media Endpoints

│       └── ci.yml           # GitHub Actions CI/CD

```bash

POST   /media/upload         # Upload image/file│### Code Quality Standards

GET    /media/:id            # Get media file

DELETE /media/:id            # Delete media├── docker-compose.yml       # Service orchestration

```

├── package.json             # Workspace configuration- **TypeScript**: Strict mode enabled across all packages

**Example Upload**:

```bash├── .env.example             # Environment template- **Linting**: ESLint 8.x with TypeScript plugins

curl -X POST http://localhost:4000/media/upload \

  -H "Authorization: Bearer YOUR_JWT_TOKEN" \└── README.md                # This file- **Formatting**: Prettier (mobile only, configured)

  -F "file=@/path/to/image.jpg" \

  -F "type=activity_photo"```- **Testing**: Jest with React Testing Library



# Response:- **Coverage**: Target 80%+ for critical paths

{

  "id": "media_abc123",---

  "url": "https://cdn.jani.com/media/abc123.jpg",

  "type": "activity_photo",## 🏗️ Architecture

  "size": 245678

}## 💻 Development Workflow

```

### System Architecture

#### Jobs Endpoints

### Package Managers

```bash

GET    /jobs/queue           # View job queue```

POST   /jobs/run             # Trigger background job

GET    /jobs/status/:id      # Check job statusThis monorepo uses **different package managers** based on the package type:┌─────────────────────────────────────────────────────────────────┐

```

│                         JANI Platform                            │

### User Service (Port 5000)

- **Root workspace**: `npm` (manages workspaces)├─────────────────────────────────────────────────────────────────┤

```bash

GET    /api/users            # List users- **TypeScript services** (auth, traceability, operations): `pnpm`│                                                                  │

POST   /api/users            # Create user

GET    /api/users/:id        # Get user- **JavaScript services** (user, ai): `npm`│  ┌──────────────┐                           ┌──────────────┐   │

PUT    /api/users/:id        # Update user

DELETE /api/users/:id        # Delete user- **Apps** (mobile, web): `npm`│  │  Mobile App  │◄──────── API ────────────►│   Web App    │   │

```

│  │  (React     │                            │  (Next.js)   │   │

### Traceability Service (Port 5002)

### Common Commands│  │   Native)    │                            │              │   │

```bash

GET    /api/events           # List traceability events│  └──────────────┘                           └──────────────┘   │

POST   /api/events           # Create event

GET    /api/events/:id       # Get event details```bash│         │                                           │           │

GET    /api/events/lot/:id   # Get events for specific lot

POST   /api/qr/generate      # Generate QR code# Workspace-level commands (run from root)│         │                                           │           │

```

npm run lint:web              # Lint web app│         └───────────────┬───────────────────────────┘           │

### Operations Service (Port 5003)

npm run lint:mobile           # Lint mobile app│                         │                                        │

```bash

GET    /api/operations       # List farm operationsnpm run typecheck:web         # TypeScript check web│                    ┌────▼─────┐                                 │

POST   /api/operations       # Create operation

GET    /api/operations/:id   # Get operationnpm run typecheck:mobile      # TypeScript check mobile│                    │   API    │                                 │

PUT    /api/operations/:id   # Update operation

```npm run test:mobile           # Run mobile tests│                    │  Gateway │                                 │



### Health Check Endpointsnpm run build:web             # Build web app│                    └────┬─────┘                                 │



All services expose `/health`:npm run ci                    # Run full CI pipeline│                         │                                        │



```bash                # Run web CI only│         ┌───────────────┼───────────────┬──────────┐           │

# Check auth service

curl http://localhost:4000/health             # Run mobile CI only│         │               │               │          │           │



# Response:│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐ ┌──▼──┐         │

{

  "service": "JANI Auth Service",# Service-level commands│    │  Auth   │    │  User   │    │  Trace  │ │ AI  │         │

  "status": "healthy",

  "timestamp": "2025-10-28T10:00:00Z",cd services/auth && pnpm run dev      # Auth service with hot reload│    │ Service │    │ Service │    │ Service │ │ Svc │         │

  "version": "1.0.0",

  "uptime": 3600,cd services/user && npm start          # User service│    └────┬────┘    └────┬────┘    └────┬────┘ └─────┘         │

  "mongodb": {

    "status": "connected",cd services/traceability && pnpm test # Traceability tests│         │              │              │                         │

    "readyState": 1

  }│         └──────┬───────┴──────┬───────┘                        │

}

```# App-level commands│                │              │                                 │



---cd apps/web && npm run dev            # Web dev server│           ┌────▼─────┐   ┌───▼────┐                           │



## 💻 Developmentcd apps/mobile && npm test            # Mobile tests│           │ MongoDB  │   │ Redis  │                           │



### Workspace Structure```│           │          │   │        │                           │



```│           └──────────┘   └────────┘                           │

JANI/

├── apps/### Git Workflow│                                                                 │

│   ├── mobile/                 # React Native + Expo

│   │   ├── src/└─────────────────────────────────────────────────────────────────┘

│   │   │   ├── components/     # UI components

│   │   │   ├── features/       # Feature modules```bash```

│   │   │   ├── lib/api/        # API clients

│   │   │   ├── navigation/     # React Navigation# Create feature branch

│   │   │   ├── stores/         # Zustand stores

│   │   │   └── types/          # TypeScript typesgit checkout -b feature/your-feature-name### Technology Stack

│   │   ├── package.json

│   │   └── README.md

│   │

│   └── web/                    # Next.js# Make changes and commit#### Frontend

│       ├── src/

│       │   ├── app/            # App router pagesgit add .- **Mobile**: React Native 0.81.5 + Expo SDK 54 + TypeScript 5.9

│       │   ├── components/     # React components

│       │   └── utils/          # Utilitiesgit commit -m "feat(scope): description"- **Web**: Next.js 15.4.7 + React 18.2.0 + Tailwind CSS 4

│       └── package.json

│- **State**: Zustand + React Query (TanStack Query v5)

├── services/

│   ├── auth/                   # TypeScript service (PRIMARY)# Run CI checks locally- **UI**: Custom components + Framer Motion + GSAP

│   │   ├── src/

│   │   │   ├── routes.ts       # Auth routesnpm run ci- **Offline**: AsyncStorage + SQLite (mobile)

│   │   │   ├── dataRoutes.ts   # Data routes

│   │   │   ├── syncRoutes.ts   # Sync routes

│   │   │   ├── mediaRoutes.ts  # Media routes

│   │   │   ├── jobsRoutes.ts   # Jobs routes# Push and create PR#### Backend

│   │   │   └── database.ts     # DB connection

│   │   ├── seed-*.json         # Seed data filesgit push origin feature/your-feature-name- **Runtime**: Node.js 20.18.3+

│   │   └── package.json

│   │```- **Framework**: Express.js 4.x/5.x

│   ├── user/                   # JavaScript service

│   ├── traceability/           # TypeScript service- **Language**: TypeScript 5.x (strict mode)

│   ├── operations/             # TypeScript service

│   └── ai/                     # JavaScript service### Code Style- **Database**: MongoDB 8.x

│

├── scripts/                    # Utility scripts- **Cache**: Redis 7.x

├── .github/workflows/          # CI/CD

├── docker-compose.yml- **Commit Convention**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)- **Storage**: MinIO (S3-compatible)

├── package.json                # Workspace root

└── README.md- **TypeScript**: Strict mode enabled- **Auth**: JWT + bcrypt/scrypt

```

- **Linting**: ESLint with TypeScript plugins

### Package Managers

- **Formatting**: Prettier (configured in mobile app)#### DevOps

- **Root & Apps**: `npm` 11.6.2+

- **TypeScript Services**: `pnpm` 10.x- **Containerization**: Docker + Docker Compose

- **JavaScript Services**: `npm`

---- **Package Managers**: npm 11.6.2 (apps), pnpm 10.x (TS services)

### Common Commands

- **CI/CD**: GitHub Actions workflows configured

```bash

# Workspace-level (from root)## 🧪 Testing & Quality- **Monitoring**: Health check endpoints + structured logging

npm run lint:web              # Lint web app

npm run lint:mobile           # Lint mobile app- **Testing**: Jest 29 + React Testing Library

npm run typecheck:web         # Type check web

npm run typecheck:mobile      # Type check mobile### Running Tests

npm run test:mobile           # Run mobile tests

npm run build:web             # Build web app## 📱 Key Features

npm run ci                    # Full CI pipeline

npm run ci:web                # Web CI only```bash

npm run ci:mobile             # Mobile CI only

# Run all CI checks### For Farmers

# Service commands

cd services/authnpm run ci

pnpm install                  # Install dependencies

pnpm run dev                  # Development with hot reload**Farm Management**

pnpm run build                # Build TypeScript

pnpm run seed:demo            # Seed demo data# Individual checks- ✅ Multi-farm support with GPS mapping

pnpm test                     # Run tests

npm run lint:mobile           # Mobile linting- ✅ Plot subdivision and crop tracking

# App commands

cd apps/mobilenpm run lint:web              # Web linting- ✅ 5-stage lifecycle management (Planning → Planting → Growing → Harvesting → Completed)

npm install

npm start                     # Start Exponpm run typecheck:mobile      # Mobile type checking- ✅ Photo/video documentation with GPS tagging

npm test                      # Run tests

npm run lint                  # Lint codenpm run typecheck:web         # Web type checking- ✅ Offline-first with automatic sync



cd apps/webnpm run test:mobile           # Mobile unit tests

npm install

npm run dev                   # Start dev servernpm run build:web             # Web production build**Activity Tracking**

npm run build                 # Production build

``````- ✅ 26+ traceability event types



### Environment Variables- ✅ Real-time event capture



Create `.env` in root:### Local CI Testing- ✅ Quality assessments



```bash- ✅ Harvest yield tracking

# Database

MONGODB_URI=mongodb://localhost:27017/jani-ai-authSimulate GitHub Actions locally using `act`:- ✅ Input application records (fertilizer, pesticide)

REDIS_URL=redis://localhost:6379



# Authentication

JWT_SECRET=your-super-secret-jwt-key-change-in-production```bash**Smart Features**

JWT_EXPIRES_IN=7d

# Install act (if not installed)- ✅ Weather integration

# Service Ports

AUTH_PORT=4000# macOS: brew install act- ✅ Crop recommendations (planned)

USER_PORT=5000

AI_PORT=5001# Linux: see https://github.com/nektos/act- ✅ Pest detection (planned)

TRACEABILITY_PORT=5002

OPERATIONS_PORT=5003- ✅ Yield predictions (planned)

WEB_PORT=3000

# Test mobile CI workflow

# Storage (MinIO/S3)

S3_ENDPOINT=http://localhost:9000./test-mobile-ci.sh### For Exporters

S3_ACCESS_KEY=minioadmin

S3_SECRET_KEY=minioadmin

S3_BUCKET=jani-media

S3_REGION=us-east-1# Test all CI workflows**Batch Management**

S3_FORCE_PATH_STYLE=true

./test-ci-locally.sh- ✅ Create and manage export batches

# CORS

CORS_ORIGIN=http://localhost:3000,exp://192.168.1.100:8081- ✅ Aggregate farm data



# Mobile Development (optional)# Health check all services- ✅ Quality compliance tracking

MOBILE_HOST=192.168.1.100     # Your machine's IP for Expo

```./test-health.sh- ✅ Document generation



### Code Style```



- **TypeScript**: Strict mode enabled**Traceability**

- **Linting**: ESLint with TypeScript plugins

- **Formatting**: Prettier (mobile)### Test Coverage Goals- ✅ QR code generation

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`)

- ✅ Complete product history

---

- **Unit Tests**: 80%+ coverage for business logic- ✅ Certificate verification

## 🧪 Testing

- **Integration Tests**: API endpoints and service interactions- ✅ Chain of custody

### Run All Tests

- **E2E Tests**: Critical user flows (planned)

```bash

# Full CI pipeline**Compliance**

npm run ci

### Quality Standards- ✅ Export documentation

# Individual suites

npm run ci:web                # Web: lint + typecheck + build- ✅ Quality reports

npm run ci:mobile             # Mobile: lint + typecheck + test

```- ✅ Zero TypeScript errors in strict mode- ✅ Certification tracking



### Local CI Testing- ✅ Zero ESLint errors- ✅ Audit trails



Simulate GitHub Actions locally:- ✅ All services pass health checks



```bash- ✅ Mobile tests: 67%+ passing (target: 100%)### For Consumers

# Install act (if needed)

# macOS: brew install act- ✅ API tests: 100% passing

# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

**Product Transparency**

# Test mobile workflow

./test-mobile-ci.sh---- ✅ QR code scanning



# Test all workflows- ✅ Farm-to-table journey

./test-ci-locally.sh

## 🏗️ Architecture- ✅ Farmer information

# Check service health

./test-health.sh- ✅ Quality certifications

```

### System Overview- ✅ Social sharing

### Test Coverage



- **Mobile**: 67% (4/6 tests passing)

  - ✅ Core functionality tested```## 🗂️ Project Structure

  - ⚠️ Missing: expo-secure-store, netinfo mocks

  ┌─────────────────────────────────────────────────────────────────┐

- **Services**: 100% API tests passing

  - ✅ All health checks working│                         JANI Platform                            │## 🗂️ Project Structure

  - ✅ All endpoints tested

├─────────────────────────────────────────────────────────────────┤

### Quality Gates

│                                                                  │```

- ✅ Zero TypeScript errors (strict mode)

- ✅ Zero ESLint errors│  ┌──────────────┐                           ┌──────────────┐   │jani-platform/

- ✅ All services healthy

- ✅ Mobile: 67%+ test coverage│  │  Mobile App  │◄──────── REST API ───────►│   Web App    │   │├── apps/                           # Application layer

- ✅ Services: 100% API coverage

│  │   (Expo)     │                            │  (Next.js)   │   ││   ├── mobile/                     # React Native mobile app

---

│  └──────┬───────┘                            └──────┬───────┘   ││   │   ├── src/

## 🚢 Deployment

│         │                                           │           ││   │   │   ├── features/          # Feature modules (auth, farms, etc.)

### Docker Deployment

│         │              Axios/Fetch                  │           ││   │   │   ├── components/        # Reusable UI components

```bash

# Production build│         └────────────────┬──────────────────────────┘           ││   │   │   ├── navigation/        # React Navigation setup

docker-compose build

│                          │                                       ││   │   │   ├── hooks/             # Custom React hooks

# Start all services

docker-compose up -d│                    ┌─────▼──────┐                               ││   │   │   ├── stores/            # Zustand state management



# View logs│                    │   Auth     │                               ││   │   │   ├── lib/               # API clients, database

docker-compose logs -f auth

│                    │  Service   │ JWT Validation                ││   │   │   └── theme/             # Design system

# Check status

docker-compose ps│                    │  (Port     │                               ││   │   └── README.md              # Mobile app documentation



# Stop services│                    │   4000)    │                               ││   │

docker-compose down

```│                    └─────┬──────┘                               ││   └── web/                        # Next.js web application



### Service Scaling│                          │                                       ││       ├── src/



```bash│         ┌────────────────┼────────────────┬────────────┐        ││       │   ├── app/               # App Router pages

# Scale auth service

docker-compose up -d --scale auth=3│         │                │                │            │        ││       │   ├── components/        # React components



# Scale with load balancer│    ┌────▼────┐     ┌────▼────┐     ┌────▼─────┐  ┌──▼───┐    ││       │   └── utils/             # Utility functions

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

```│    │  User   │     │ Trace-  │     │Operations│  │  AI  │    ││       └── README.md              # Web app documentation



### Production Checklist│    │ Service │     │ ability │     │ Service  │  │ Svc  │    ││



- [ ] Set strong JWT_SECRET│    │ (5000)  │     │ (5002)  │     │ (5003)   │  │(5001)│    │├── services/                       # Microservices layer

- [ ] Configure MongoDB replica set

- [ ] Enable Redis persistence│    └────┬────┘     └────┬────┘     └────┬─────┘  └──────┘    ││   ├── auth/                       # Authentication service

- [ ] Setup S3/CloudFront for media

- [ ] Configure proper CORS_ORIGIN│         │               │               │                      ││   │   ├── src/

- [ ] Enable HTTPS

- [ ] Setup monitoring (Datadog/New Relic)│         └───────┬───────┴───────┬───────┘                      ││   │   │   ├── index.ts           # Service entry point

- [ ] Configure backups

- [ ] Setup CI/CD pipeline│                 │               │                               ││   │   │   ├── routes.ts          # Auth routes

- [ ] Load testing

│            ┌────▼─────┐    ┌───▼────┐       ┌─────────┐       ││   │   │   ├── dataRoutes.ts      # Data management routes

---

│            │ MongoDB  │    │ Redis  │       │  MinIO  │       ││   │   │   ├── syncRoutes.ts      # Sync routes

## 📚 Additional Documentation

│            │  (27017) │    │ (6379) │       │  (S3)   │       ││   │   │   ├── mediaRoutes.ts     # Media upload routes

- **[Mobile App README](apps/mobile/README.md)** - Mobile app documentation

- **[Web App README](apps/web/README.md)** - Web app documentation│            └──────────┘    └────────┘       └─────────┘       ││   │   │   └── controllers.ts     # Business logic

- **[Auth Service README](services/auth/README.md)** - Auth API documentation

- **[Setup Guide](SETUP.md)** - Detailed setup instructions│                                                                 ││   │   └── README.md              # Auth service documentation

- **[CI Testing Guide](CI-TESTING-SUMMARY.md)** - CI/CD pipeline details

- **[Copilot Instructions](.github/copilot-instructions.md)** - AI development guide└─────────────────────────────────────────────────────────────────┘│   │



---```│   ├── user/                       # User/farm management service



## 🤝 Contributing│   │   ├── server.js              # Service entry point



### Development Workflow### Technology Stack│   │   └── README.md              # User service documentation



1. Fork the repository│   │

2. Create feature branch: `git checkout -b feature/amazing-feature`

3. Make changes#### Frontend│   ├── traceability/               # Traceability events service

4. Run tests: `npm run ci`

5. Commit: `git commit -m 'feat: add amazing feature'`│   │   ├── src/

6. Push: `git push origin feature/amazing-feature`

7. Open Pull Request- **Mobile**: React Native 0.81.5 + Expo SDK 54 + TypeScript 5.9│   │   │   ├── index.js           # Service entry point



### Commit Convention- **Web**: Next.js 15.4.7 + React 18.2.0 + Tailwind CSS 4│   │   │   ├── models/            # MongoDB models



```- **State Management**: │   │   │   └── routes/            # API routes

feat(scope): add new feature

fix(scope): fix bug    - Zustand (global state)│   │   └── README.md              # Traceability documentation

docs(scope): update documentation

chore(scope): update dependencies  - React Query v5 (server state, caching)│   │

test(scope): add tests

refactor(scope): refactor code  - AsyncStorage (mobile persistence)│   └── ai/                         # AI/ML service (placeholder)

```

- **UI/UX**: │       ├── server.js              # Service entry point

---

  - Framer Motion (animations)│       └── README.md              # AI service documentation

## 📄 License

  - GSAP (web animations)│

This project is proprietary software. All rights reserved.

  - React Native Reanimated (mobile animations)├── docs/                           # Project documentation

---

  - Custom neumorphic components│   ├── jani-ai-project-blueprint.md  # Architecture overview

## 👥 Team

│   ├── jani-ai-ux-design.md          # UX/UI guidelines

- **Project Lead**: Hamza Ouadia ([@hamzaouadia](https://github.com/hamzaouadia))

- **Contributors**: [GitHub Contributors](https://github.com/hamzaouadia/JANI/graphs/contributors)#### Backend│   └── traceability_mobile_app_doc.md # Mobile app specs



---│



## 🙏 Acknowledgments- **Runtime**: Node.js 20.18.3+├── docker-compose.yml              # Service orchestration



Built with:- **Framework**: Express.js 4.x/5.x├── Makefile                        # Build automation

- [Expo](https://expo.dev/) - React Native framework

- [Next.js](https://nextjs.org/) - React web framework- **Language**: TypeScript 5.x (strict mode) for services├── package.json                    # Root workspace config

- [MongoDB](https://www.mongodb.com/) - Database

- [Express.js](https://expressjs.com/) - Backend framework- **Database**: MongoDB 8.x├── README.md                       # This file

- [TypeScript](https://www.typescriptlang.org/) - Type safety

- **Cache**: Redis 7.x└── SETUP.md                        # Setup instructions

---

- **Storage**: MinIO (S3-compatible object storage)```

**Made with ❤️ for sustainable agriculture**

- **Authentication**: JWT + bcrypt/scrypt

*Empowering farmers, enabling traceability, ensuring transparency*

- **Validation**: Zod schema validation## 🔧 Development



#### Infrastructure### Environment Variables



- **Containerization**: Docker + Docker ComposeEach service requires environment variables. Create `.env` files:

- **Package Managers**: 

  - npm 11.6.2 (apps, workspace)**services/auth/.env**

  - pnpm 10.x (TypeScript services)```bash

- **CI/CD**: GitHub ActionsPORT=4000

- **Monitoring**: Health endpoints + structured loggingMONGO_URI=mongodb://localhost:27017/jani_auth

- **Testing**: Jest 29 + React Testing LibraryJWT_SECRET=your-secret-key

AWS_S3_BUCKET=jani-media-uploads

### Service CommunicationCORS_ORIGIN=http://localhost:3000,http://localhost:8081

```

```typescript

// Example: Mobile app calling Auth service**services/user/.env**

import { authClient } from '@/lib/api/authClient';```bash

PORT=5000

const user = await authClient.login({ email, password });MONGO_URI=mongodb://localhost:27017/jani

// → POST http://localhost:4000/api/auth/loginJWT_SECRET=your-secret-key

```

// JWT token stored in AsyncStorage

// Subsequent requests include Authorization header**services/traceability/.env**

``````bash

PORT=3004

### Data FlowMONGO_URI=mongodb://localhost:27017/jani_traceability

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

1. **User Action** → Mobile/Web UI```

2. **API Request** → Auth Service (validates JWT)

3. **Business Logic** → Specific service (User/Traceability/etc.)**apps/web/.env.local**

4. **Database** → MongoDB queries```bash

5. **Cache** → Redis for frequent dataNEXT_PUBLIC_API_URL=http://localhost:4000

6. **Response** → JSON back to clientKINDE_CLIENT_ID=your-client-id

7. **State Update** → React Query cache + ZustandKINDE_CLIENT_SECRET=your-client-secret

```

---

**apps/mobile/.env**

## 🎯 Key Features```bash

API_URL=http://localhost:4000

### For Farmers 🌾TRACEABILITY_SERVICE_URL=http://localhost:3004

```

- **Farm Management**

  - Multi-farm support with GPS coordinates### Running Tests

  - Plot subdivision and crop tracking

  - 5-stage lifecycle: Planning → Planting → Growing → Harvesting → Completed```bash

# Test all packages

- **Activity Tracking**npm test

  - Daily field activities logging

  - Photo documentation with geotags# Test specific app

  - Resource usage tracking (water, fertilizers, pesticides)cd apps/mobile

npm test

- **Offline Capability**

  - Full offline data capture# Test specific service

  - Automatic sync when onlinecd services/auth

  - Local SQLite storagepnpm test



### For Exporters 📦# Run tests with coverage

npm test -- --coverage

- **Order Management**```

  - Create and track export orders

  - Link to specific farm lots### Code Quality

  - QR code generation for traceability

```bash

- **Lot Traceability**# Lint all code

  - Complete farm-to-export trackingnpm run lint

  - Blockchain-ready event logs

  - Compliance documentation# Format code with Prettier

npm run format

- **Analytics Dashboard**

  - Volume and value tracking# Type check TypeScript

  - Supplier performance metricsnpm run typecheck

  - Export trends analysis```



### For Consumers 🔍### Database Management



- **Product Traceability**```bash

  - Scan QR codes on products# Start MongoDB

  - View complete farm journeydocker-compose up -d mongo

  - See farmer profiles and practices

# Connect to MongoDB

- **Transparency**mongosh mongodb://localhost:27017/jani_auth

  - Photo timeline of production

  - Treatment and certification details# View collections

  - Sustainability metricsshow collections



### Platform Features 🛠️# Seed demo data (auth service)

cd services/auth

- **Multi-tenant Architecture**pnpm run seed:demo

  - Role-based access control (Farmer, Exporter, Admin)```

  - Isolated data per organization

  - Flexible permissions### API Testing



- **Media Management**```bash

  - S3-compatible storage (MinIO)# Health checks

  - Image optimizationcurl http://localhost:4000/health     # Auth service

  - Secure pre-signed URLscurl http://localhost:5000/health     # User service

curl http://localhost:3004/health     # Traceability service

- **Real-time Updates**curl http://localhost:5001/health     # AI service

  - React Query for optimistic updates

  - WebSocket support (planned)# Test authentication

  - Push notifications (planned)curl -X POST http://localhost:4000/auth/register \

  -H "Content-Type: application/json" \

---  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

```

## 📡 API Documentation

## 🚢 Deployment

### Auth Service (Port 4000)

### Docker Production

**Base URL**: `http://localhost:4000/api`

```bash

```bash# Build all services

# Authenticationdocker-compose build

POST   /auth/register       # Register new user

POST   /auth/login          # Login user# Start in production mode

GET    /auth/me             # Get current userdocker-compose up -d

POST   /auth/logout         # Logout user

# View logs

# Usersdocker-compose logs -f

GET    /users               # List all users

GET    /users/:id           # Get user by ID# Stop all services

PUT    /users/:id           # Update userdocker-compose down

DELETE /users/:id           # Delete user```



# Farms### Individual Service Deployment

GET    /farms               # List all farms

POST   /farms               # Create farm#### Auth Service

GET    /farms/:id           # Get farm details```bash

PUT    /farms/:id           # Update farmcd services/auth

DELETE /farms/:id           # Delete farmdocker build -t jani-auth:latest .

docker run -p 4000:4000 \

# Plots  -e MONGO_URI=mongodb://mongo:27017/jani_auth \

GET    /farms/:farmId/plots       # List plots for farm  -e JWT_SECRET=production-secret \

POST   /farms/:farmId/plots       # Create plot  jani-auth:latest

GET    /plots/:id                 # Get plot details```

PUT    /plots/:id                 # Update plot

DELETE /plots/:id                 # Delete plot#### Web Application (Vercel)

```bash

# Orderscd apps/web

GET    /orders              # List all ordersvercel --prod

POST   /orders              # Create order```

GET    /orders/:id          # Get order details

PUT    /orders/:id          # Update order#### Mobile Application (EAS)

```bash

# Mediacd apps/mobile

POST   /media/upload        # Upload imageeas build --platform all --profile production

GET    /media/:id           # Get media fileeas submit --platform all

``````



### User Service (Port 5000)## 📊 Monitoring & Observability



```bash### Health Checks

GET    /api/users           # List users

POST   /api/users           # Create userAll services expose `/health` endpoints:

GET    /api/users/:id       # Get user details

PUT    /api/users/:id       # Update user```bash

DELETE /api/users/:id       # Delete user# Check all services

```./test-health.sh

```

### Traceability Service (Port 5002)

### Logging

```bash

GET    /api/events          # List traceability eventsServices use structured JSON logging:

POST   /api/events          # Create event

GET    /api/events/:id      # Get event details```json

GET    /api/events/lot/:lotId  # Get events for lot{

```  "level": "info",

  "message": "User authenticated",

### Example Request  "userId": "123",

  "timestamp": "2025-10-22T10:30:00.000Z"

```bash}

# Login```

curl -X POST http://localhost:4000/api/auth/login \

  -H "Content-Type: application/json" \### Metrics (Planned)

  -d '{"email": "farmer@example.com", "password": "password123"}'

- Request rate and latency

# Response- Error rates by endpoint

{- Database query performance

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",- Cache hit rates

  "user": {- Active user sessions

    "id": "123",

    "email": "farmer@example.com",## 🔒 Security

    "role": "farmer"

  }### Authentication

}

- **JWT Tokens**: HS256 signing with 7-day expiration

# Authenticated request- **Password Hashing**: bcrypt (10 rounds) / scrypt

curl -X GET http://localhost:4000/api/farms \- **Token Storage**: Secure storage (Expo SecureStore / HttpOnly cookies)

  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

```### Authorization



For detailed API documentation, see individual service READMEs:- **Role-Based Access Control** (RBAC)

- [Auth Service API](services/auth/README.md)  - Farmer: Farm management, event creation

- [User Service API](services/user/README.md)  - Exporter: Batch management, reports

- [Traceability Service API](services/traceability/README.md)  - Admin: Full system access



---### Data Security



## 🚢 Deployment- **Encryption at Rest**: MongoDB encryption

- **Encryption in Transit**: HTTPS/TLS

### Environment Variables- **Input Validation**: Joi/Zod schemas

- **SQL Injection Prevention**: Parameterized queries

Required environment variables (see `.env.example`):- **XSS Protection**: Input sanitization

- **CORS**: Restricted origins

```bash

# Database### API Security

MONGODB_URI=mongodb://localhost:27017/jani

REDIS_URL=redis://localhost:6379- **Rate Limiting**: 100 requests per 15 minutes

- **Request Size Limits**: 10MB max payload

# Authentication- **Security Headers**: Helmet.js middleware

JWT_SECRET=your-super-secret-jwt-key- **API Keys**: Service-to-service authentication

JWT_EXPIRES_IN=7d

## 🤝 Contributing

# Service Ports

AUTH_PORT=4000### Development Workflow

USER_PORT=5000

AI_PORT=50011. **Fork** the repository

TRACEABILITY_PORT=50022. **Create** a feature branch (`git checkout -b feature/amazing-feature`)

WEB_PORT=30003. **Commit** changes (`git commit -m 'feat: add amazing feature'`)

4. **Push** to branch (`git push origin feature/amazing-feature`)

# Storage (MinIO/S3)5. **Open** a Pull Request

S3_ENDPOINT=http://localhost:9000

S3_ACCESS_KEY=minioadmin### Commit Conventions

S3_SECRET_KEY=minioadmin

S3_BUCKET=jani-mediaFollow [Conventional Commits](https://www.conventionalcommits.org/):



# Mobile (for Docker development)```

MOBILE_HOST=192.168.1.100  # Your machine's IPfeat: Add new feature

```fix: Bug fix

docs: Documentation changes

### Production Deploymentstyle: Code style changes (formatting)

refactor: Code refactoring

```bashtest: Add or update tests

# Build all serviceschore: Maintenance tasks

docker-compose build```



# Start in production mode### Code Review

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

- All PRs require review from at least 1 maintainer

# Check logs- CI checks must pass (tests, linting, type checking)

docker-compose logs -f- Code coverage should not decrease

- Documentation must be updated

# Scale services

docker-compose up -d --scale auth=3## 📝 Roadmap

```

### Q1 2026 - Foundation Enhancement

### Cloud Deployment (Coming Soon)- [ ] Redis caching layer

- [ ] GraphQL API gateway

- **Hosting**: AWS/GCP/Azure- [ ] Advanced search functionality

- **Database**: MongoDB Atlas- [ ] Real-time notifications (WebSockets)

- **Storage**: AWS S3- [ ] Enhanced analytics dashboard

- **CDN**: CloudFront

- **Monitoring**: Datadog/New Relic### Q2 2026 - AI Integration

- [ ] Computer vision (pest/disease detection)

---- [ ] Crop recommendations

- [ ] Yield predictions

## 🤝 Contributing- [ ] Quality assessment automation

- [ ] Market intelligence

### Development Setup

### Q3 2026 - Blockchain

1. Fork the repository- [ ] Ethereum/Polygon integration

2. Create a feature branch: `git checkout -b feature/amazing-feature`- [ ] Smart contracts for traceability

3. Make your changes- [ ] NFT certificates

4. Run tests: `npm run ci`- [ ] Immutable event storage

5. Commit: `git commit -m 'feat: add amazing feature'`- [ ] Token incentives

6. Push: `git push origin feature/amazing-feature`

7. Open a Pull Request### Q4 2026 - Scale & Expansion

- [ ] Multi-language support (i18n)

### Coding Standards- [ ] Regional customization

- [ ] Partner integrations (payment, logistics)

- Follow TypeScript strict mode- [ ] B2B marketplace

- Write tests for new features- [ ] Supply chain financing

- Document API changes

- Use conventional commits## 🆘 Troubleshooting

- Keep PRs focused and small

### Common Issues

### Commit Convention

**MongoDB Connection Failed**

``````bash

feat(scope): add new feature# Start MongoDB

fix(scope): fix bugdocker-compose up -d mongo

docs(scope): update documentation

chore(scope): update dependencies# Check if running

test(scope): add testsdocker ps | grep mongo

refactor(scope): refactor code

```# View logs

docker logs jani-mongo

---```



## 📚 Additional Documentation**Port Already in Use**

```bash

- **[Setup Guide](SETUP.md)** - Detailed installation and configuration# Find process using port

- **[Mobile App README](apps/mobile/README.md)** - Mobile app documentationlsof -i :4000

- **[Web App README](apps/web/README.md)** - Web app documentation

- **[Auth Service README](services/auth/README.md)** - Auth service API docs# Kill process

- **[CI Testing Summary](CI-TESTING-SUMMARY.md)** - CI/CD pipeline detailskill -9 <PID>

- **[Copilot Instructions](.github/copilot-instructions.md)** - AI agent guidelines```



---**Expo Metro Bundler Issues**

```bash

## 📄 License# Clear cache

cd apps/mobile

This project is proprietary software. All rights reserved.npx expo start -c



---# Reset everything

rm -rf node_modules

## 👥 Teamnpm install

```

- **Project Lead**: Hamza Ouadia

- **Contributors**: See [GitHub Contributors](https://github.com/hamzaouadia/JANI/graphs/contributors)**Build Failures**

```bash

---# Clean all builds

make clean

## 🙏 Acknowledgments

# Rebuild everything

- Expo team for the amazing React Native frameworkmake build

- Next.js team for the powerful web framework```

- MongoDB team for the flexible database

- All open-source contributors## 📞 Support



---### Documentation

- [Mobile App Docs](apps/mobile/README.md)

**Made with ❤️ for sustainable agriculture**- [Web App Docs](apps/web/README.md)

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
