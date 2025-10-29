# JANI Auth Service

> Authentication and user management microservice for the JANI platform

## Overview

Handles user registration, login, JWT authentication, and profile management for all JANI apps and services.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB
- **Auth:** JWT (jsonwebtoken, jose)

---

## Features
- User registration and login
- JWT-based authentication
- Profile management
- Password reset
- Role-based access control
- API endpoints for mobile and web clients

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
cd services/auth
pnpm install
```

### Development
```bash
pnpm run dev
```

### Environment Setup
Create a `.env` file:
```bash
AUTH_PORT=4000
MONGO_URI=mongodb://localhost:27017/jani-auth
JWT_SECRET=your-secret-key
```

---

## Project Structure
```
services/auth/
├── src/
│   ├── controllers.ts
│   ├── routes.ts
│   ├── userModel.ts
│   ├── config.ts
│   └── ...
├── seed-all-data.js
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
- Verify JWT secret in `.env`
- Use `pnpm run lint` for code issues

---

## License
Proprietary - JANI Platform
