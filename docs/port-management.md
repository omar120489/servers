# Traffic CRM - Port Management & Development Environment

## 🎯 Overview

This document outlines the comprehensive port management system implemented for Traffic CRM, ensuring conflict-free development and consistent configuration across all services.

## 📊 Port Allocation

| Service | Default Port | Environment Variable | Configuration File |
|---------|--------------|---------------------|-------------------|
| **Frontend (Vite)** | 3002 | `PORT` | `vite.config.mjs` |
| **Dev Backend (Express)** | 8787 | `DEV_BACKEND_PORT` | `dev-backend/server.js` |
| **Reporting Service (NestJS)** | 8006 | `REPORTING_SERVICE_PORT` | `traffic-crm-backend-reporting/src/main.ts` |
| **MailHog SMTP** | 1025 | Docker Compose | `docker-compose.yml` |
| **MailHog Web UI** | 8025 | Docker Compose | `docker-compose.yml` |
| **MinIO API** | 9000 | Docker Compose | `docker-compose.yml` |
| **MinIO Console** | 9001 | Docker Compose | `docker-compose.yml` |

## 🔧 Configuration Files

### Environment Variables

#### `.env.example` (Template)
```bash
# Frontend (Vite dev server)
PORT=3002
VITE_PORT=3002

# Backend Services
DEV_BACKEND_PORT=8787
REPORTING_SERVICE_PORT=8006

# API URLs (for frontend)
VITE_APP_API_URL=http://localhost:8787
VITE_APP_REPORTING_API_URL=http://localhost:8005

# Testing Configuration
PLAYWRIGHT_BASE_URL=http://localhost:3002
CI=false

# Base path
VITE_APP_BASE_NAME=/

# Environment
NODE_ENV=development
```

#### `.env` (Local Development)
Copy from `.env.example` and customize for your local environment.

### Service Configurations

#### Frontend API Configuration
- **File**: `src/utils/axios.ts`
- **Configuration**: Uses `VITE_APP_API_URL` with fallback to `http://localhost:8787/`

#### Playwright Testing
- **File**: `playwright.config.ts`
- **Configuration**: Uses `PLAYWRIGHT_BASE_URL` with fallback to `http://localhost:3002`

#### Dev Backend
- **File**: `dev-backend/server.js`
- **Configuration**: Uses `DEV_BACKEND_PORT` with fallback to `8787`

#### Reporting Service
- **File**: `traffic-crm-backend-reporting/src/main.ts`
- **Configuration**: Uses `PORT` with fallback to `8005`

## 🛠️ Development Scripts

### Available Commands

```bash
# Individual Services
npm run dev:backend      # Start Express mock API
npm run dev:reporting    # Start NestJS reporting service
npm run dev:services     # Start Docker services (MailHog, MinIO)
npm start               # Start Vite frontend

# Combined
npm run dev:all         # Pre-flight check + start all services

# Utilities
npm run check:ports     # Check for port conflicts
npm run test:e2e        # Run Playwright E2E tests
```

### Service Startup Order

1. **Docker Services** (`npm run dev:services`)
   - MailHog (ports 1025, 8025)
   - MinIO (ports 9000, 9001)

2. **Backend Services**
   - Dev Backend (`npm run dev:backend`) - port 8787
   - Reporting Service (`npm run dev:reporting`) - port 8006

3. **Frontend** (`npm start`) - port 3002

## 🔍 Port Conflict Detection

### Automated Checking

The `scripts/check-ports.sh` script automatically detects conflicts on all required ports:

```bash
# Manual check
npm run check:ports

# Automatic check (part of dev:all)
npm run dev:all
```

### Conflict Resolution

#### Option 1: Change Ports (Recommended)
Edit `.env` file:
```bash
PORT=3002                    # Frontend
DEV_BACKEND_PORT=8788       # Dev backend
REPORTING_SERVICE_PORT=8006  # Reporting service
```

#### Option 2: Kill Conflicting Processes
```bash
# Find process using port
sudo lsof -nP -iTCP:3001 -sTCP:LISTEN

# Kill process (replace <PID> with actual process ID)
kill -9 <PID>
```

## ✅ Validation Checklist

### Pre-Development Checklist

1. **Port Conflicts**: `npm run check:ports` returns no conflicts
2. **Environment**: `.env` file exists with correct values
3. **Docker Services**: `npm run dev:services` starts MailHog/MinIO
4. **Backend Services**: Services respect environment port variables
5. **Frontend**: Vite starts on configured PORT
6. **E2E Tests**: Playwright connects to correct baseURL

### Development Workflow

```bash
# 1. Check for conflicts
npm run check:ports

# 2. Start all services (includes pre-flight check)
npm run dev:all

# 3. Verify services are running
curl http://localhost:3002    # Frontend
curl http://localhost:8787    # Dev Backend
curl http://localhost:8006    # Reporting Service
curl http://localhost:8025    # MailHog UI

# 4. Run tests
npm run test:e2e
```

## 🔒 Production Considerations

### Environment Variables for Production

```bash
# Production API URLs
VITE_APP_API_URL=https://api.yourdomain.com
VITE_APP_REPORTING_API_URL=https://reporting.yourdomain.com

# Production ports (behind reverse proxy)
PORT=3000
REPORTING_SERVICE_PORT=3001

# CI/CD
PLAYWRIGHT_BASE_URL=https://staging.yourdomain.com
CI=true
```

### Docker Production Deployment

Update `docker-compose.yml` for production with different host ports:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Nginx serves frontend on port 80 internally
  
  api:
    ports:
      - "8081:3000"  # API service
  
  reporting:
    ports:
      - "8082:3001"  # Reporting service
```

## 🚨 Troubleshooting

### Common Issues

#### 1. E2E Tests Fail to Connect
- **Cause**: Playwright baseURL doesn't match Vite port
- **Solution**: Ensure `PLAYWRIGHT_BASE_URL` matches `PORT` in `.env`

#### 2. Frontend Can't Connect to Backend
- **Cause**: `VITE_APP_API_URL` points to wrong port
- **Solution**: Update `.env` with correct `DEV_BACKEND_PORT`

#### 3. Port Already in Use
- **Cause**: Another service is using the same port
- **Solution**: Run `npm run check:ports` and resolve conflicts

#### 4. Docker Services Won't Start
- **Cause**: Host ports are already bound
- **Solution**: Change Docker port mappings in `docker-compose.yml`

### Debug Commands

```bash
# Check what's running on specific ports
lsof -nP -iTCP:3002 -sTCP:LISTEN
lsof -nP -iTCP:8787 -sTCP:LISTEN
lsof -nP -iTCP:8006 -sTCP:LISTEN

# Check all Node processes
ps aux | grep node

# Check Docker containers
docker ps
docker-compose ps
```

## 📝 Maintenance

### Keeping Port Lists Synchronized

When adding new services:

1. Update `.env.example` with new port variables
2. Update `scripts/check-ports.sh` PORTS array
3. Update this documentation
4. Update Docker Compose if applicable

### Regular Checks

- Monthly: Verify all environment variables are documented
- Before releases: Run full validation checklist
- After adding services: Update port conflict detection

---

**Last Updated**: October 2024  
**Maintainer**: Development Team  
**Status**: Production Ready ✅
