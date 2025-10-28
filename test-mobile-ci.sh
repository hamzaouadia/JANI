#!/bin/bash
# Test Mobile CI job locally
# This exactly replicates what GitHub Actions does for the mobile app

set -e  # Exit on error

echo "============================================"
echo "🧪 Testing Mobile CI Job Locally"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📌 Environment Info:${NC}"
echo "   Node version: $(node --version)"
echo "   npm version: $(npm --version)"
echo "   Working directory: $(pwd)"
echo ""

echo -e "${YELLOW}⚠️  Note: Your local Node version is $(node --version)${NC}"
echo -e "${YELLOW}⚠️  CI uses Node 20.19 - this may cause different results${NC}"
echo ""

cd apps/mobile

echo "============================================"
echo "Step 1: Clean Install Dependencies"
echo "============================================"
echo "➡️  Removing node_modules..."
rm -rf node_modules

echo "➡️  Installing with CI flags..."
export CI=true
npm install --legacy-peer-deps --engine-strict=false

echo ""
echo "============================================"
echo "Step 2: Run Lint"
echo "============================================"
if npm run lint; then
    echo ""
    echo -e "${GREEN}✓ Lint PASSED${NC}"
else
    echo ""
    echo -e "${RED}✗ Lint FAILED${NC}"
    exit 1
fi

echo ""
echo "============================================"
echo "Step 3: Run Type Check"
echo "============================================"
if npm run typecheck; then
    echo ""
    echo -e "${GREEN}✓ Type Check PASSED${NC}"
else
    echo ""
    echo -e "${RED}✗ Type Check FAILED${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tip: Type errors are often due to React version incompatibility${NC}"
    echo -e "${YELLOW}   React 19 with React Native 0.81.5 can cause issues locally${NC}"
    echo -e "${YELLOW}   But CI with Node 20.19 may handle it differently${NC}"
    exit 1
fi

cd ../..

echo ""
echo "============================================"
echo -e "${GREEN}✅ Mobile CI Job Completed Successfully!${NC}"
echo "============================================"
echo ""
