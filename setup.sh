#!/bin/bash
# JANI Project Setup Script
# This script applies all critical fixes and sets up the project

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║         JANI Supply Chain Management                   ║"
echo "║         Post-Fix Setup Script                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Generate a secure JWT secret
generate_secret() {
    openssl rand -hex 32
}

echo -e "${GREEN}✅ All critical code fixes have been applied!${NC}"
echo ""
echo -e "${YELLOW}📋 Summary of fixes:${NC}"
echo "  • Fixed middleware authentication flow"
echo "  • Created API routes for auth verification"
echo "  • Updated login page to use httpOnly cookies"
echo "  • Fixed CustomCursor React Hook warnings"
echo "  • Added health checks to Docker Compose"
echo "  • Created environment variable templates"
echo ""

# Check if .env files exist
echo -e "${BLUE}🔍 Checking environment files...${NC}"

if [ ! -f "apps/web/.env" ]; then
    if [ -f "apps/web/.env.example" ]; then
        echo -e "${YELLOW}Creating apps/web/.env from template...${NC}"
        cp apps/web/.env.example apps/web/.env
        
        # Generate and set JWT secret
        JWT_SECRET=$(generate_secret)
        sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" apps/web/.env
        echo -e "${GREEN}✅ Created apps/web/.env with generated JWT secret${NC}"
    else
        echo -e "${RED}⚠️  apps/web/.env.example not found${NC}"
    fi
else
    echo -e "${GREEN}✅ apps/web/.env already exists${NC}"
fi

if [ ! -f "services/auth/.env" ]; then
    if [ -f "services/auth/.env.example" ]; then
        echo -e "${YELLOW}Creating services/auth/.env from template...${NC}"
        cp services/auth/.env.example services/auth/.env
        
        # Use the same JWT secret
        if [ -n "$JWT_SECRET" ]; then
            sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" services/auth/.env
        else
            JWT_SECRET=$(generate_secret)
            sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" services/auth/.env
        fi
        echo -e "${GREEN}✅ Created services/auth/.env with generated JWT secret${NC}"
    else
        echo -e "${RED}⚠️  services/auth/.env.example not found${NC}"
    fi
else
    echo -e "${GREEN}✅ services/auth/.env already exists${NC}"
fi

# Create root .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating root .env file...${NC}"
    cat > .env << EOF
# JANI Root Environment Configuration
# Generated: $(date)

# Service Ports
AUTH_PORT=4000
USER_PORT=4001
AI_PORT=4002
WEB_PORT=3000

# Security
JWT_SECRET=${JWT_SECRET:-$(generate_secret)}

# MongoDB
MONGO_URI=mongodb://mongo:27017/jani-ai

# Redis
REDIS_URL=redis://redis:6379

# MinIO/S3
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
S3_BUCKET=jani-media

# CORS
CORS_ORIGIN=http://localhost:3000

# Next.js
NEXT_PUBLIC_AUTH_URL=http://localhost:4000
EOF
    echo -e "${GREEN}✅ Created root .env file${NC}"
else
    echo -e "${GREEN}✅ Root .env already exists${NC}"
fi

echo ""
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✅ pnpm is installed${NC}"
else
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo -e "${YELLOW}Install pnpm with: npm install -g pnpm${NC}"
    exit 1
fi

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
else
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${YELLOW}Please install Docker: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose is installed${NC}"
else
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo -e "${YELLOW}Please install Docker Compose: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo ""
echo -e "${YELLOW}1. Review your environment variables:${NC}"
echo "   vim apps/web/.env"
echo "   vim services/auth/.env"
echo ""
echo -e "${YELLOW}2. Install dependencies:${NC}"
echo "   pnpm install"
echo ""
echo -e "${YELLOW}3. Start the project:${NC}"
echo ""
echo -e "   ${GREEN}Option A - Docker (Recommended):${NC}"
echo "   make docker-up"
echo ""
echo -e "   ${GREEN}Option B - Local Development:${NC}"
echo "   make dev"
echo ""
echo -e "${YELLOW}4. Test authentication:${NC}"
echo "   • Open: http://localhost:3000/login"
echo "   • Create account at: http://localhost:3000/signup"
echo ""
echo -e "${YELLOW}5. Check service health:${NC}"
echo "   curl http://localhost:4000/health"
echo ""
echo -e "${YELLOW}6. View logs:${NC}"
echo "   make logs"
echo ""
echo -e "${GREEN}✨ Setup complete! Read SETUP.md for more details.${NC}"
echo ""
