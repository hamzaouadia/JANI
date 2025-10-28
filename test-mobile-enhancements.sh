#!/bin/bash

# Mobile App - Integration Test Script
# Tests all mobile app enhancements

echo "🧪 Testing Mobile App Enhancements"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Metro Bundler
echo "1️⃣ Testing Metro Bundler..."
METRO_STATUS=$(curl -s http://localhost:8081/status)
if [[ "$METRO_STATUS" == "packager-status:running" ]]; then
    echo -e "${GREEN}✓${NC} Metro Bundler: Running"
else
    echo -e "${RED}✗${NC} Metro Bundler: Not running"
fi
echo ""

# Test 2: Traceability Service
echo "2️⃣ Testing Traceability Service Connection..."
TRACE_HEALTH=$(curl -s http://localhost:5002/health 2>&1)
if echo "$TRACE_HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✓${NC} Traceability Service: Healthy"
    echo "   $(echo "$TRACE_HEALTH" | jq -r '.service')"
else
    echo -e "${RED}✗${NC} Traceability Service: Unreachable"
fi
echo ""

# Test 3: Check mobile container
echo "3️⃣ Checking Mobile Container..."
CONTAINER_STATUS=$(docker ps --filter "name=jani-mobile" --format "{{.Status}}" 2>&1)
if echo "$CONTAINER_STATUS" | grep -q "Up"; then
    echo -e "${GREEN}✓${NC} Mobile Container: $CONTAINER_STATUS"
else
    echo -e "${RED}✗${NC} Mobile Container: Not running"
fi
echo ""

# Test 4: Verify mobile app files exist
echo "4️⃣ Verifying New Files..."
FILES=(
    "apps/mobile/src/features/traceability/api/traceabilityApi.ts"
    "apps/mobile/src/features/traceability/hooks/useTraceability.ts"
    "apps/mobile/src/features/farms/screens/FarmStateDetailScreen.tsx"
    "apps/mobile/src/components/ui/LoadingSkeleton.tsx"
    "apps/mobile/src/components/ui/SyncStatus.tsx"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        ALL_FILES_EXIST=false
    fi
done
echo ""

# Test 5: Check environment variables
echo "5️⃣ Checking Environment Configuration..."
if grep -q "TRACEABILITY_BASE_URL" apps/mobile/.env; then
    echo -e "${GREEN}✓${NC} TRACEABILITY_BASE_URL configured in .env"
else
    echo -e "${RED}✗${NC} TRACEABILITY_BASE_URL missing in .env"
fi

if grep -q "traceabilityBaseUrl" apps/mobile/app.config.js; then
    echo -e "${GREEN}✓${NC} traceabilityBaseUrl configured in app.config.js"
else
    echo -e "${RED}✗${NC} traceabilityBaseUrl missing in app.config.js"
fi
echo ""

# Test 6: Test creating a traceability event (simulation)
echo "6️⃣ Testing Traceability Event Creation..."
EVENT_RESPONSE=$(curl -s -X POST http://localhost:5002/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PLANTING",
    "farmId": "test-farm-123",
    "plotId": "plot-1",
    "cropType": "Tomatoes",
    "quantity": 100,
    "unit": "plants",
    "location": {
      "latitude": 6.5244,
      "longitude": 3.3792
    },
    "metadata": {
      "source": "mobile-app-test"
    }
  }' 2>&1)

if echo "$EVENT_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓${NC} Event Creation: Success"
    EVENT_ID=$(echo "$EVENT_RESPONSE" | jq -r '.event.id' 2>/dev/null)
    if [ -n "$EVENT_ID" ] && [ "$EVENT_ID" != "null" ]; then
        echo "   Event ID: $EVENT_ID"
        
        # Test event retrieval
        echo ""
        echo "7️⃣ Testing Event Retrieval..."
        GET_RESPONSE=$(curl -s http://localhost:5002/api/events/$EVENT_ID 2>&1)
        if echo "$GET_RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✓${NC} Event Retrieval: Success"
            echo "   Type: $(echo "$GET_RESPONSE" | jq -r '.event.type')"
            echo "   Farm: $(echo "$GET_RESPONSE" | jq -r '.event.farmId')"
        else
            echo -e "${RED}✗${NC} Event Retrieval: Failed"
        fi
    fi
else
    echo -e "${RED}✗${NC} Event Creation: Failed"
    echo "   Response: $EVENT_RESPONSE"
fi
echo ""

# Summary
echo "====================================="
echo "📊 Test Summary"
echo "====================================="
echo ""

if [[ "$METRO_STATUS" == "packager-status:running" ]] && \
   echo "$TRACE_HEALTH" | grep -q "healthy" && \
   echo "$CONTAINER_STATUS" | grep -q "Up" && \
   [ "$ALL_FILES_EXIST" = true ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    echo "🎉 Mobile App Enhancements: VERIFIED"
    echo ""
    echo "Next Steps:"
    echo "  1. Open Expo Go app on your device"
    echo "  2. Scan QR code from Metro bundler"
    echo "  3. Test farm state navigation"
    echo "  4. Test traceability event creation"
    echo "  5. Test offline sync functionality"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed${NC}"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Ensure all services are running"
    echo "  2. Check container logs: docker logs jani-mobile"
    echo "  3. Verify .env configuration"
    exit 1
fi
