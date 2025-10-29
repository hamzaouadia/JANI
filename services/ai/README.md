# JANI AI Service

> AI and analytics microservice for the JANI platform

## Overview

Provides AI-powered analytics, predictions, and data processing for JANI apps and services.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB
- **AI/ML:** AI/ML libraries

---

## Features
- Data analytics
- Predictions and recommendations
- API endpoints for mobile and web clients

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
cd services/ai
pnpm install
```

### Development
```bash
pnpm run dev
```

### Environment Setup
Create a `.env` file:
```bash
AI_PORT=5001
MONGO_URI=mongodb://localhost:27017/jani-ai
```

---

## Project Structure
```
services/ai/
├── src/
│   ├── server.js
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
