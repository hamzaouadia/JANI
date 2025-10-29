# JANI Traceability Service

> Product traceability microservice for the JANI platform

## Overview

Tracks product journeys, events, and certifications for agricultural products in the JANI ecosystem.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB

---

## Features
- Product event tracking
- Certification management
- API endpoints for mobile and web clients

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
cd services/traceability
pnpm install
```

### Development
```bash
pnpm run dev
```

### Environment Setup
Create a `.env` file:
```bash
TRACEABILITY_PORT=5002
MONGO_URI=mongodb://localhost:27017/jani-traceability
```

---

## Project Structure
```
services/traceability/
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
