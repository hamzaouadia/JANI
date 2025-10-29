# JANI Web App

> Next.js 15 web application for dashboards, marketing, and product traceability

## Overview

The JANI Web App is a comprehensive web platform built with Next.js and React. It provides dashboards, admin tools, exporter portals, and consumer-facing traceability features for the JANI platform.

---

## Tech Stack

- **Framework:** Next.js 15.4.7 (App Router)
- **UI Library:** React 18.2.0
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion, GSAP
- **3D Graphics:** Three.js

---

## Features

### Core Functionality
- 📊 **Dashboard:** Analytics, farm management, reporting
- 🛠️ **Admin Panel:** User and system management
- 🚚 **Exporter Portal:** Order and shipment tracking
- 🔍 **Traceability:** Product lookup, event timeline, certification
- 🖥️ **Marketing Site:** Landing page, features, contact

### User Experience
- Responsive design for desktop and mobile
- Modern UI with card layouts and smooth animations
- Fast navigation with App Router
- Dark mode support (planned)
- Loading states and error handling

### Data & API
- API integration with JANI backend services
- JWT authentication for protected routes
- Server and client components for optimal performance
- Environment-based configuration

---

## Quick Start

### Prerequisites
- Node.js 18+

### Installation
```bash
cd apps/web
npm install
```

### Development
```bash
npm run dev
```

### Build & Production
```bash
npm run build
npm start
```

### Environment Setup
Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_URL=http://localhost:4000
NEXT_PUBLIC_USER_URL=http://localhost:5000
NEXT_PUBLIC_TRACEABILITY_URL=http://localhost:3004
NEXT_PUBLIC_OPERATIONS_URL=http://localhost:5003
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

---

## Project Structure
```
apps/web/
├── src/
│   ├── app/            # App Router (admin, dashboard, exporter, trace, login)
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   └── middleware.ts   # Route middleware
├── public/             # Static assets
├── package.json
└── next.config.ts
```

---

## Main Sections & Flows

- **Dashboard:** Analytics, farm overview, quick actions
- **Admin:** User and system management
- **Exporter:** Orders, shipments, export documentation
- **Trace:** Product traceability, event timeline, certifications
- **Login:** Authentication and session management
- **Marketing:** Landing page, features, contact forms

---

## Architecture & Data Flow

### Routing
- **App Router:** File-based routing for all sections
- **API Routes:** Serverless functions for backend integration

### State & Data
- **React Context:** Global state for user/session
- **Server Components:** Data fetching and rendering
- **Client Components:** Interactivity and animations

### Authentication
- **JWT:** Secure authentication for protected routes
- **Middleware:** Route protection and redirects

### API Integration
- **REST API:** Calls to JANI backend services
- **Environment Variables:** Configurable endpoints

---

## Scripts
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run format     # Run Prettier
npm run typecheck  # TypeScript checks
```

---

## Building & Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
vercel --prod
```

### Docker
```bash
docker build -t jani-web .
docker run -p 3000:3000 jani-web
```

---

## Troubleshooting & Tips

### Build Fails
```bash
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
npm run typecheck
```

### Lint Errors
```bash
npm run lint -- --fix
```

### Hydration Issues
- Use 'use client' for client-only code
- Ensure consistent rendering between server and client

### API Connection Issues
- Verify backend services are running
- Check `.env.local` file for correct endpoints

---

## Performance Optimization

- Image optimization with Next.js `<Image />`
- Code splitting and dynamic imports
- Server components for fast initial load
- Caching strategies for API data

---

## Contributing

1. Use TypeScript strict mode
2. Prefer server components for data fetching
3. Write tests for new features
4. Document complex logic in code
5. Follow Next.js and React best practices

---

## License
Proprietary - JANI Platform
