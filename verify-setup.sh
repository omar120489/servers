#!/bin/bash

# Verification script for Traffic CRM Micro-Frontend Architecture
# This script checks if all apps are running and accessible

echo "🔍 Verifying Traffic CRM Micro-Frontend Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is accessible
check_port() {
    local port=$1
    local name=$2
    local url="http://localhost:$port"
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ $name${NC} is running on port $port"
        return 0
    else
        echo -e "${RED}❌ $name${NC} is NOT running on port $port"
        return 1
    fi
}

# Check each application
echo "Checking individual applications..."
echo ""

check_port 3000 "Shell App       "
SHELL_STATUS=$?

check_port 3001 "Sales App       "
SALES_STATUS=$?

check_port 3002 "Marketing App   "
MARKETING_STATUS=$?

check_port 3003 "Service App     "
SERVICE_STATUS=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
if [ $SHELL_STATUS -eq 0 ] && [ $SALES_STATUS -eq 0 ] && [ $MARKETING_STATUS -eq 0 ] && [ $SERVICE_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS!${NC} All applications are running!"
    echo ""
    echo "Next steps:"
    echo "1. Open your browser to: http://localhost:3000"
    echo "2. You should be redirected to: http://localhost:3000/sales"
    echo "3. Try navigating to:"
    echo "   - http://localhost:3000/marketing"
    echo "   - http://localhost:3000/service"
    echo "4. Check browser console for any errors"
    echo ""
    echo "Expected: No Module Federation or React errors"
else
    echo -e "${RED}⚠️  INCOMPLETE SETUP${NC}"
    echo ""
    echo "Some applications are not running. Please start them:"
    echo ""
    [ $SHELL_STATUS -ne 0 ] && echo "  cd ../traffic-crm-shell && npm start"
    [ $SALES_STATUS -ne 0 ] && echo "  cd ../traffic-crm-frontend-ts && npm start"
    [ $MARKETING_STATUS -ne 0 ] && echo "  cd ../traffic-crm-marketing && npm start"
    [ $SERVICE_STATUS -ne 0 ] && echo "  cd ../traffic-crm-service && npm start"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

