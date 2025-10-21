#!/bin/bash

# Traffic CRM Port Conflict Checker
echo "🔍 Checking for port conflicts..."

# Read ports from environment with fallbacks
FRONTEND_PORT=${PORT:-3002}
BACKEND_PORT=${DEV_BACKEND_PORT:-8787}
REPORTING_PORT=${REPORTING_SERVICE_PORT:-8006}

# Static Docker service ports
DOCKER_PORTS="8025 9000 9001 1025"

# Combine all ports to check
PORTS="$FRONTEND_PORT $BACKEND_PORT $REPORTING_PORT $DOCKER_PORTS"

echo "📋 Checking ports: $PORTS"
echo "   Frontend: $FRONTEND_PORT"
echo "   Backend: $BACKEND_PORT" 
echo "   Reporting: $REPORTING_PORT"
echo "   Docker services: $DOCKER_PORTS"
echo ""

CONFLICTS=0

for port in $PORTS; do
    if lsof -nP -iTCP:$port -sTCP:LISTEN > /dev/null 2>&1; then
        echo "❌ Port $port is in use:"
        lsof -nP -iTCP:$port -sTCP:LISTEN | head -1
        CONFLICTS=$((CONFLICTS + 1))
    else
        echo "✅ Port $port is available"
    fi
done

echo ""
if [ $CONFLICTS -gt 0 ]; then
    echo "🚨 $CONFLICTS port conflicts detected!"
    echo ""
    echo "💡 Solutions:"
    echo "   • Kill conflicting processes: kill -9 <PID>"
    echo "   • Change ports in .env file:"
    echo "     PORT=$((FRONTEND_PORT + 1)) (for frontend)"
    echo "     DEV_BACKEND_PORT=$((BACKEND_PORT + 1)) (for dev backend)"
    echo "     REPORTING_SERVICE_PORT=$((REPORTING_PORT + 1)) (for reporting service)"
    echo "   • Stop Docker services: docker-compose down"
    echo ""
    echo "📋 Current port assignments:"
    echo "   $FRONTEND_PORT - Frontend (Vite)"
    echo "   $BACKEND_PORT - Dev Backend (Express)"
    echo "   $REPORTING_PORT - Reporting Service (NestJS)"
    echo "   8025 - MailHog Web UI"
    echo "   9000 - MinIO API"
    echo "   9001 - MinIO Console"
    echo "   1025 - MailHog SMTP"
    exit 1
else
    echo "🎉 No port conflicts detected!"
    echo "✅ All services can start safely on configured ports"
    exit 0
fi
