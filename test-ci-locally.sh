#!/bin/bash
# Test CI workflow locally
# This script simulates the GitHub Actions CI workflow

set -e  # Exit on error

echo "============================================"
echo "🧪 Testing CI Workflow Locally"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📌 Node version: $(node --version)"
echo "📌 npm version: $(npm --version)"
echo ""

# Function to run a job
run_job() {
    local job_name=$1
    echo ""
    echo "============================================"
    echo "🔄 Running: $job_name"
    echo "============================================"
}

run_step() {
    local step_name=$1
    echo ""
    echo "➡️  $step_name"
}

# ====================
# Mobile Job
# ====================
run_job "Mobile - Lint & Types"

cd apps/mobile

run_step "Clean install"
rm -rf node_modules
export CI=true
npm install --legacy-peer-deps --engine-strict=false

run_step "Lint"
if npm run lint; then
    echo -e "${GREEN}✓ Lint passed${NC}"
else
    echo -e "${RED}✗ Lint failed${NC}"
    exit 1
fi

run_step "Type check"
if npm run typecheck; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${RED}✗ Type check failed${NC}"
    exit 1
fi

cd ../..

# ====================
# Web Job
# ====================
run_job "Web - Lint & Build"

run_step "Install web dependencies"
npm install --workspace apps/web

run_step "Lint web"
if npm run lint --workspace apps/web; then
    echo -e "${GREEN}✓ Web lint passed${NC}"
else
    echo -e "${RED}✗ Web lint failed${NC}"
    exit 1
fi

run_step "Type check web"
if npm run typecheck --workspace apps/web; then
    echo -e "${GREEN}✓ Web type check passed${NC}"
else
    echo -e "${RED}✗ Web type check failed${NC}"
    exit 1
fi

run_step "Build web"
if npm run build --workspace apps/web; then
    echo -e "${GREEN}✓ Web build passed${NC}"
else
    echo -e "${RED}✗ Web build failed${NC}"
    exit 1
fi

# ====================
# Services Job
# ====================
run_job "Services - Build & Sanity Checks"

cd services

run_step "Enable pnpm"
corepack prepare pnpm@10 --activate || echo "⚠️  Corepack/pnpm setup - may need manual setup"

run_step "Install Auth service dependencies"
cd auth
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
else
    pnpm install
fi
cd ..

run_step "Build Auth service"
cd auth
if pnpm run build; then
    echo -e "${GREEN}✓ Auth service build passed${NC}"
else
    echo -e "${RED}✗ Auth service build failed${NC}"
    exit 1
fi
cd ..

run_step "Install Operations service dependencies"
cd operations
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
else
    pnpm install
fi
cd ..

run_step "Build Operations service"
cd operations
if pnpm run build; then
    echo -e "${GREEN}✓ Operations service build passed${NC}"
else
    echo -e "${RED}✗ Operations service build failed${NC}"
    exit 1
fi
cd ..

run_step "Install Traceability service dependencies"
cd traceability
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
else
    pnpm install
fi
cd ..

run_step "Build Traceability service"
cd traceability
if pnpm run build; then
    echo -e "${GREEN}✓ Traceability service build passed${NC}"
else
    echo -e "${RED}✗ Traceability service build failed${NC}"
    exit 1
fi
cd ..

run_step "Install AI service dependencies"
cd ai
npm install
cd ..

run_step "Install User service dependencies"
cd user
npm install
cd ..

cd ..

# ====================
# Summary
# ====================
echo ""
echo "============================================"
echo -e "${GREEN}✅ All CI jobs passed locally!${NC}"
echo "============================================"
echo ""
