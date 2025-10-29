# JANI Operations Service

> Operations and logistics microservice for the JANI platform

## Overview

Manages operational data, logistics, and related activities for JANI apps and services.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB

---

## Features
- Operations data management
- Logistics tracking
- API endpoints for mobile and web clients

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
cd services/operations
pnpm install
```

### Development
```bash
pnpm run dev
```

### Environment Setup
Create a `.env` file:
```bash
OPERATIONS_PORT=5003
MONGO_URI=mongodb://localhost:27017/jani-operations
```

---

## Project Structure
```
services/operations/
├── src/
│   ├── controllers.ts
│   ├── routes.ts
│   └── ...
├── package.json
└── Dockerfile
```

---

## Scripts
```bash
pnpm run dev        # Start dev server
pnpm run lint       # Run ESLint
pnpm run typecheck  # TypeScript checks
```

---

## Troubleshooting & Tips
- Check MongoDB connection
- Use `pnpm run lint` for code issues

---

## License
Proprietary - JANI Platform
