# JANI User Service

> User profile and data microservice for the JANI platform

## Overview

Manages user profiles, farm associations, and user-related data for JANI apps and services.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB

---

## Features
- User profile management
- Farm associations
- API endpoints for mobile and web clients

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
cd services/user
pnpm install
```

### Development
```bash
pnpm run dev
```

### Environment Setup
Create a `.env` file:
```bash
USER_PORT=5000
MONGO_URI=mongodb://localhost:27017/jani-user
```

---

## Project Structure
```
services/user/
├── src/
│   ├── controllers.ts
│   ├── routes.ts
│   ├── userModel.ts
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
