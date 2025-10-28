#!/bin/bash
# Health check test script for all JANI services

set -e

echo "🏥 Testing JANI Services Health Checks"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test a health endpoint
test_health() {
    local service=$1
    local url=$2
    local timeout=${3:-5}
    
    echo -n "Testing $service... "
    
    if response=$(curl -s -f --max-time "$timeout" "$url" 2>/dev/null); then
        status=$(echo "$response" | jq -r '.status // "unknown"' 2>/dev/null || echo "unknown")
        echo -e "${GREEN}✓ HEALTHY${NC} (status: $status)"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        echo ""
        return 0
    else
        echo -e "${RED}✗ UNREACHABLE${NC}"
        echo ""
        return 1
    fi
}

# Test each service
total=0
healthy=0

# Auth Service (Port 4000)
total=$((total + 1))
if test_health "Auth Service" "http://localhost:4000/health"; then
    healthy=$((healthy + 1))
fi

# User Service (Port 5000)
total=$((total + 1))
if test_health "User Service" "http://localhost:5000/health"; then
    healthy=$((healthy + 1))
fi

# AI Service (Port 5001)
total=$((total + 1))
if test_health "AI Service" "http://localhost:5001/health"; then
    healthy=$((healthy + 1))
fi

# Mobile Metro Bundler (Port 8081)
total=$((total + 1))
echo -n "Testing Mobile Metro Bundler... "
if response=$(curl -s -f --max-time 5 "http://localhost:8081/status" 2>/dev/null); then
    if echo "$response" | grep -q "packager-status:running"; then
        echo -e "${GREEN}✓ RUNNING${NC}"
        echo "$response"
        echo ""
        healthy=$((healthy + 1))
    else
        echo -e "${YELLOW}⚠ UNEXPECTED RESPONSE${NC}"
        echo "$response"
        echo ""
    fi
else
    echo -e "${RED}✗ UNREACHABLE${NC}"
    echo ""
fi

# Traceability Service (Port 5002)
total=$((total + 1))
if test_health "Traceability Service" "http://localhost:5002/health"; then
    healthy=$((healthy + 1))
fi

# Web App (Port 3000)
total=$((total + 1))
if test_health "Web Application" "http://localhost:3000/api/health"; then
    healthy=$((healthy + 1))
fi

# Summary
echo "======================================"
echo "Summary:"
echo "  Total Services: $total"
echo -e "  Healthy: ${GREEN}$healthy${NC}"
echo -e "  Unhealthy: ${RED}$((total - healthy))${NC}"
echo ""

if [ "$healthy" -eq "$total" ]; then
    echo -e "${GREEN}✓ All services are healthy!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some services are not responding${NC}"
    echo "Make sure all services are running with: make docker-up"
    exit 1
fi
