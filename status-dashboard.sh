#!/bin/zsh

# JANI Platform - Complete Status Dashboard
# Displays comprehensive system status with visual indicators

# Colors
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

clear

echo -e "${BOLD}${CYAN}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║      ██╗ █████╗ ███╗   ██╗██╗    ██████╗ ██╗      █████╗ ████████╗    ║
║      ██║██╔══██╗████╗  ██║██║    ██╔══██╗██║     ██╔══██╗╚══██╔══╝    ║
║      ██║███████║██╔██╗ ██║██║    ██████╔╝██║     ███████║   ██║       ║
║ ██   ██║██╔══██║██║╚██╗██║██║    ██╔═══╝ ██║     ██╔══██║   ██║       ║
║ ╚█████╔╝██║  ██║██║ ╚████║██║    ██║     ███████╗██║  ██║   ██║       ║
║  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝       ║
║                                                                          ║
║           Agricultural Traceability Platform - Status Dashboard          ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BOLD}📅 Date:${NC} $(date '+%B %d, %Y at %H:%M:%S')"
echo -e "${BOLD}🖥️  System:${NC} $(uname -s) $(uname -r)"
echo ""

# Function to check service health
check_service() {
    local name=$1
    local url=$2
    local port=$3
    
    response=$(curl -s "$url" 2>&1)
    
    if echo "$response" | grep -q "healthy\|running"; then
        echo -e "${GREEN}✓${NC} ${BOLD}${name}${NC} (Port ${port})"
        return 0
    else
        echo -e "${RED}✗${NC} ${BOLD}${name}${NC} (Port ${port})"
        return 1
    fi
}

# Services Status
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}🏥 SERVICES STATUS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

healthy=0
total=6

echo -e "${BOLD}Backend Services:${NC}"
check_service "Auth Service        " "http://localhost:4000/health" "4000" && ((healthy++))
check_service "User Service        " "http://localhost:5000/health" "5000" && ((healthy++))
check_service "AI Service          " "http://localhost:5001/health" "5001" && ((healthy++))
check_service "Traceability Service" "http://localhost:5002/health" "5002" && ((healthy++))

echo ""
echo -e "${BOLD}Frontend Services:${NC}"
check_service "Web Application     " "http://localhost:3000/api/health" "3000" && ((healthy++))
check_service "Mobile Metro Bundler" "http://localhost:8081/status" "8081" && ((healthy++))

echo ""
echo -e "${BOLD}Database:${NC}"
MONGO_STATUS=$(docker ps --filter "name=jani-mongo" --format "{{.Status}}" 2>&1)
if echo "$MONGO_STATUS" | grep -q "Up"; then
    echo -e "${GREEN}✓${NC} ${BOLD}MongoDB${NC} (Port 27017) - $MONGO_STATUS"
else
    echo -e "${RED}✗${NC} ${BOLD}MongoDB${NC} (Port 27017) - Not running"
fi

echo ""
echo -e "${BOLD}Health Score:${NC} ${BOLD}${GREEN}${healthy}/${total}${NC} services operational"

# Progress bar
percentage=$((healthy * 100 / total))
filled=$((percentage / 5))
empty=$((20 - filled))

echo -n "["
for ((i=0; i<filled; i++)); do echo -n "█"; done
for ((i=0; i<empty; i++)); do echo -n "░"; done
echo "] ${percentage}%"

echo ""

# Docker Containers
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}🐳 DOCKER CONTAINERS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

docker ps --filter "name=jani-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | while IFS= read -r line; do
    if echo "$line" | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $line"
    else
        echo "$line"
    fi
done

echo ""

# Mobile App Status
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}📱 MOBILE APP STATUS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "MOBILE_APP_WORK_SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} ${BOLD}Enhancements Completed${NC}"
    echo "  ├─ Expo dependencies updated (13 packages)"
    echo "  ├─ Traceability service integrated"
    echo "  ├─ Farm state navigation completed"
    echo "  ├─ UI/UX improvements added"
    echo "  └─ Documentation created"
else
    echo -e "${YELLOW}⚠${NC} ${BOLD}No recent updates${NC}"
fi

echo ""
echo -e "${BOLD}New Features:${NC}"
echo "  ├─ TraceabilityApi: API client for events"
echo "  ├─ useTraceability: React Query hooks (6 hooks)"
echo "  ├─ FarmStateDetailScreen: State-by-state guides"
echo "  ├─ LoadingSkeleton: Animated loading states"
echo "  └─ SyncStatus: Offline sync indicators"

echo ""

# Recent Changes
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}📝 RECENT CHANGES${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BOLD}New Files (5):${NC}"
echo "  ${GREEN}+${NC} apps/mobile/src/features/traceability/api/traceabilityApi.ts"
echo "  ${GREEN}+${NC} apps/mobile/src/features/traceability/hooks/useTraceability.ts"
echo "  ${GREEN}+${NC} apps/mobile/src/features/farms/screens/FarmStateDetailScreen.tsx"
echo "  ${GREEN}+${NC} apps/mobile/src/components/ui/LoadingSkeleton.tsx"
echo "  ${GREEN}+${NC} apps/mobile/src/components/ui/SyncStatus.tsx"

echo ""
echo -e "${BOLD}Modified Files (5):${NC}"
echo "  ${YELLOW}~${NC} apps/mobile/package.json (dependencies)"
echo "  ${YELLOW}~${NC} apps/mobile/.env (TRACEABILITY_BASE_URL)"
echo "  ${YELLOW}~${NC} apps/mobile/app.config.js (config)"
echo "  ${YELLOW}~${NC} apps/mobile/src/config/env.ts (fallbacks)"
echo "  ${YELLOW}~${NC} apps/mobile/src/features/farms/screens/FarmStatesScreen.tsx"

echo ""

# Documentation
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}📚 DOCUMENTATION${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

docs=(
    "MOBILE_APP_COMPLETE_ENHANCEMENTS.md:Full enhancement details"
    "MOBILE_DEV_QUICKREF.md:Developer quick reference"
    "MOBILE_APP_WORK_SUMMARY.md:Complete work summary"
    "test-mobile-enhancements.sh:Integration test script"
)

for doc in "${docs[@]}"; do
    filename="${doc%%:*}"
    description="${doc##*:}"
    if [ -f "$filename" ]; then
        echo -e "  ${GREEN}✓${NC} ${BOLD}${filename}${NC}"
        echo "    └─ $description"
    fi
done

echo ""

# Quick Actions
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}⚡ QUICK ACTIONS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BOLD}Available Commands:${NC}"
echo "  ${CYAN}make health${NC}                    → Check all services health"
echo "  ${CYAN}make logs service=mobile${NC}       → View mobile app logs"
echo "  ${CYAN}make restart service=mobile${NC}    → Restart mobile container"
echo "  ${CYAN}./test-mobile-enhancements.sh${NC} → Run mobile integration tests"
echo "  ${CYAN}docker compose up -d${NC}           → Start all services"
echo "  ${CYAN}docker compose down${NC}            → Stop all services"

echo ""

# URLs
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}🔗 ACCESS URLS${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

urls=(
    "Web Application:http://localhost:3000"
    "Mobile Bundler:http://localhost:8081"
    "Auth API:http://localhost:4000"
    "User API:http://localhost:5000"
    "AI API:http://localhost:5001"
    "Traceability API:http://localhost:5002"
)

for url_pair in "${urls[@]}"; do
    name="${url_pair%%:*}"
    url="${url_pair#*:}"
    echo -e "  ${BOLD}${name}:${NC}"
    echo -e "    ${CYAN}${url}${NC}"
done

echo ""

# Footer
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $healthy -eq $total ]; then
    echo -e "${BOLD}${GREEN}✨ ALL SYSTEMS OPERATIONAL ✨${NC}"
    echo -e "The JANI platform is running smoothly. Ready for development!"
else
    echo -e "${BOLD}${YELLOW}⚠️  SOME SERVICES NEED ATTENTION ⚠️${NC}"
    echo -e "Please check the services marked with ${RED}✗${NC} above."
fi

echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BOLD}Last updated:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
