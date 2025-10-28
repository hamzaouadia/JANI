# 🚀 JANI - Quick Start Guide

## Critical Fixes Applied

### ✅ What Was Fixed

1. **Authentication Flow** - Removed Edge Runtime incompatible code
   - Fixed middleware to use API routes instead of direct service calls
   - Implemented proper cookie-based authentication
   - Added token verification endpoint

2. **API Routes** - Created proper BFF (Backend for Frontend) pattern
   - `/api/auth/login` - Login with httpOnly cookies
   - `/api/auth/verify` - Token verification
   
3. **Login Page** - Updated to use cookies instead of localStorage
   - Proper error handling
   - Loading states
   - Guest login support

4. **CustomCursor** - Fixed React Hook warnings
   - Used `useRef` instead of local variables
   - Proper cleanup on unmount

5. **Docker Compose** - Added health checks and proper service dependencies

6. **Environment Variables** - Created templates for all services

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- MongoDB (or use Docker)

### Quick Setup

```bash
# 1. Clone and install dependencies
cd ~/Desktop/JANI
pnpm install

# 2. Setup environment files
make setup

# 3. Edit environment variables
# Update JWT_SECRET in all .env files with a strong secret
vim apps/web/.env
vim services/auth/.env

# 4. Start with Docker (recommended)
make docker-up

# OR start services individually for development
make dev
```

### 📋 Environment Configuration

**apps/web/.env**
```env
AUTH_SERVICE_URL=http://localhost:4000
USER_SERVICE_URL=http://localhost:4001
TRACEABILITY_SERVICE_URL=http://localhost:4002
AI_SERVICE_URL=http://localhost:4003
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
```

**services/auth/.env**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jani-auth
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### 🧪 Testing the Fixes

```bash
# 1. Start all services
make docker-up

# 2. Check service health
curl http://localhost:4000/health
# Should return: {"status":"ok","service":"auth","timestamp":"..."}

# 3. Open browser and test login
open http://localhost:3000/login

# 4. View logs
make logs
```

### 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client Browser                      │
│                   http://localhost:3000                  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Next.js Web App (BFF)                   │
│                                                           │
│  • Middleware (checks cookie)                            │
│  • API Routes:                                           │
│    - /api/auth/verify → Auth Service                     │
│    - /api/auth/login → Auth Service                      │
│  • Sets httpOnly cookies                                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Microservices Layer                     │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth Service │  │ User Service │  │  AI Service  │  │
│  │  Port 4000   │  │  Port 4001   │  │  Port 4002   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ↓
                    ┌────────────────┐
                    │    MongoDB     │
                    │  Port 27017    │
                    └────────────────┘
```

### 🔧 Common Commands

```bash
# Development
make dev              # Start all services locally
make dev-web          # Start only web app
make dev-mobile       # Start only mobile app

# Docker
make docker-up        # Start all with Docker
make docker-down      # Stop all containers
make docker-rebuild   # Rebuild and restart

# Logs
make logs             # All services
make logs-web         # Web app only
make logs-auth        # Auth service only

# Database
make db-shell         # Open MongoDB shell
make db-backup        # Backup database
make db-restore       # Restore from backup

# Maintenance
make clean            # Clean everything
make setup            # Re-setup project
make status           # Show service status
```

### 🐛 Troubleshooting

**Issue: Middleware not working**
- Check that `.env` files exist with correct `JWT_SECRET`
- Verify auth service is running: `curl http://localhost:4000/health`
- Check logs: `make logs-auth`

**Issue: Login fails**
- Ensure MongoDB is running: `docker ps | grep mongo`
- Check auth service logs: `make logs-auth`
- Verify environment variables are set

**Issue: Cookie not being set**
- Check browser dev tools → Application → Cookies
- Ensure you're on `http://localhost:3000` (not 127.0.0.1)
- Clear browser cookies and try again

**Issue: Build fails**
- Clean everything: `make clean`
- Remove node_modules: `rm -rf node_modules apps/*/node_modules services/*/node_modules`
- Reinstall: `pnpm install`
- Rebuild: `make build`

### 📚 Next Steps

1. **Test Authentication**
   - Create a user account at `/signup`
   - Login at `/login`
   - Access protected route at `/dashboard`

2. **Review Changes**
   - Check `apps/web/src/middleware.ts`
   - Review `apps/web/src/app/api/auth/` routes
   - Inspect `apps/web/src/app/login/page.tsx`

3. **Add More Features**
   - Implement signup API route
   - Add logout functionality
   - Create user profile page
   - Add role-based access control

### 🔐 Security Checklist

- [ ] Change default JWT_SECRET in all .env files
- [ ] Use strong, unique secrets (32+ characters)
- [ ] Never commit .env files to git
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags in production
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Implement refresh token rotation

### 📖 Additional Resources

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

**Status**: ✅ Critical authentication issues fixed and tested
**Last Updated**: October 22, 2025
