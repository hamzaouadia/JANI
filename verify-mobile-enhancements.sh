#!/bin/bash

# Mobile App - Quick Verification Script
# Verifies all enhancements are properly integrated

echo "🔍 Mobile App Enhancement Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
total=0
passed=0
failed=0

# Test function
test_item() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    total=$((total + 1))
    printf "  Testing: %-50s " "$name"
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✓${NC}"
        passed=$((passed + 1))
    else
        echo -e "${RED}✗${NC}"
        failed=$((failed + 1))
    fi
}

# 1. Check Docker Services
echo -e "${BLUE}1. Docker Services${NC}"
test_item "Mobile container running" "docker ps | grep -q jani-mobile"
test_item "Traceability service running" "docker ps | grep -q jani-traceability"
test_item "Auth service running" "docker ps | grep -q jani-auth"
echo ""

# 2. Check New Files Created
echo -e "${BLUE}2. New Component Files${NC}"
test_item "FloatingActionButton.tsx" "test -f apps/mobile/src/components/ui/FloatingActionButton.tsx"
test_item "Toast.tsx" "test -f apps/mobile/src/components/ui/Toast.tsx"
test_item "PullToRefresh.tsx" "test -f apps/mobile/src/components/ui/PullToRefresh.tsx"
test_item "Avatar.tsx" "test -f apps/mobile/src/components/ui/Avatar.tsx"
test_item "SwipeableItem.tsx" "test -f apps/mobile/src/components/ui/SwipeableItem.tsx"
test_item "BottomSheet.tsx" "test -f apps/mobile/src/components/ui/BottomSheet.tsx"
test_item "Shimmer.tsx" "test -f apps/mobile/src/components/ui/Shimmer.tsx"
test_item "EnhancedInput.tsx" "test -f apps/mobile/src/components/ui/EnhancedInput.tsx"
echo ""

# 3. Check Utility Files
echo -e "${BLUE}3. Utility Files${NC}"
test_item "animations.ts" "test -f apps/mobile/src/utils/animations.ts"
test_item "haptics.ts" "test -f apps/mobile/src/utils/haptics.ts"
echo ""

# 4. Check Traceability Integration
echo -e "${BLUE}4. Traceability Integration${NC}"
test_item "traceabilityApi.ts" "test -f apps/mobile/src/features/traceability/api/traceabilityApi.ts"
test_item "useTraceability.ts" "test -f apps/mobile/src/features/traceability/hooks/useTraceability.ts"
test_item "Traceability service healthy" "curl -s http://localhost:5002/health | grep -q 'JANI'"
echo ""

# 5. Check Demo Screen
echo -e "${BLUE}5. Demo & Navigation${NC}"
test_item "UIComponentsScreen.tsx" "test -f apps/mobile/src/features/demo/screens/UIComponentsScreen.tsx"
test_item "FarmStateDetailScreen.tsx" "test -f apps/mobile/src/features/farms/screens/FarmStateDetailScreen.tsx"
test_item "Navigation types updated" "grep -q 'UIComponents' apps/mobile/src/navigation/types.ts"
test_item "JourneyNavigator updated" "grep -q 'UIComponents' apps/mobile/src/navigation/JourneyNavigator.tsx"
echo ""

# 6. Check Dependencies
echo -e "${BLUE}6. Dependencies${NC}"
test_item "expo-haptics installed" "docker exec jani-mobile npm list expo-haptics 2>/dev/null | grep -q expo-haptics"
test_item "expo package updated" "grep -q '\"expo\": \"~54.0.17\"' apps/mobile/package.json || grep -q '\"expo\": \"54.0.17\"' apps/mobile/package.json"
echo ""

# 7. Check Documentation
echo -e "${BLUE}7. Documentation${NC}"
test_item "UI/UX Guide" "test -f MOBILE_UI_UX_GUIDE.md"
test_item "Complete Enhancements Doc" "test -f MOBILE_ENHANCEMENTS_COMPLETE.md"
test_item "Dev Quick Reference" "test -f MOBILE_DEV_QUICKREF.md"
echo ""

# 8. Code Quality Checks
echo -e "${BLUE}8. Code Quality${NC}"
test_item "ToastProvider in AppProviders" "grep -q 'ToastProvider' apps/mobile/src/providers/AppProviders.tsx"
test_item "Correct expo-sqlite import" "grep -q \"from 'expo-sqlite'\" apps/mobile/src/providers/AppProviders.tsx"
test_item "haptic export exists" "grep -q 'export const haptic' apps/mobile/src/utils/haptics.ts"
echo ""

# Summary
echo "========================================"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "========================================"
echo -e "Total Tests:  ${total}"
echo -e "Passed:       ${GREEN}${passed}${NC}"
echo -e "Failed:       ${RED}${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ All verifications passed!${NC}"
    echo ""
    echo "🎉 Mobile app enhancements are fully integrated!"
    echo ""
    echo "Next steps:"
    echo "  1. Start Metro bundler: docker exec -it jani-mobile npm start"
    echo "  2. Scan QR code with Expo Go app"
    echo "  3. Navigate to Journey → UI Components Demo"
    echo "  4. Test all interactive components"
    exit 0
else
    echo -e "${RED}❌ Some verifications failed${NC}"
    echo ""
    echo "Please check the failed items above."
    exit 1
fi
