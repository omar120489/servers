# Traffic CRM - TypeScript Edition

Enterprise-grade CRM platform with advanced marketing attribution, ROI tracking, and real-time analytics.

## 🌟 Key Features

- **🎯 Advanced Attribution Reporting**: Multi-touch attribution modeling with CPL, CPA, ROAS, and Net Profit tracking
- **⚡ TypeScript-First**: 90%+ type coverage for reliability and exceptional developer experience
- **🚀 Modern Tech Stack**: React 19, Vite 7, Material-UI 7, Redux Toolkit 2.9
- **🔐 Multi-Auth Support**: JWT, Firebase, Auth0, AWS Cognito, Supabase
- **🏗️ Microservices Architecture**: Separated reporting service for scalability
- **📊 Real-time Analytics**: WebSocket infrastructure for live updates
- **🎨 Themeable**: 6 color presets, dark mode, RTL support
- **🌍 Multi-language**: English, French, Chinese, Romanian
- **📋 Entity Management**: Full CRUD for Leads, Deals, Companies, and Contacts with server-side pagination
- **✅ Form Validation**: Formik + Yup with field-level validation and pristine detection
- **🔄 Error Handling**: Graceful 404 and network failure handling with retry/back CTAs

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **Docker** (optional): For MailHog and MinIO services

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Default ports: Frontend=3002, Backend=8787, Reporting=8006
```

### 3. Check Port Availability

```bash
npm run check:ports
```

If conflicts exist, edit `.env` to use different ports.

### 4. Start Development Environment

**Option A: All Services (Recommended)**
```bash
npm run dev:all
# Starts Docker services, backend APIs, and frontend with pre-flight port check
```

**Option B: Individual Services**
```bash
npm run dev:services   # Start MailHog + MinIO (Docker)
npm run dev:backend    # Start Express mock API (port 8787)
npm run dev:reporting  # Start NestJS reporting service (port 8006)
npm start             # Start Vite frontend (port 3002)
```

### 5. Access the Application

- **Frontend**: http://localhost:3002
- **MailHog UI**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

Default login: `demo@example.com` / `demo`

## 🏗️ Architecture

### Frontend
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.1.9 (HMR, code splitting)
- **UI Library**: Material-UI 7.3.4
- **State Management**: Redux Toolkit 2.9.0
- **Routing**: React Router 7.9.3
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios with typed interceptors

### Backend Services
- **Dev Backend**: Express.js (port 8787)
  - Mock CRM API endpoints
  - MailHog email integration
  - MinIO S3-compatible storage
  - WebSocket support (Socket.IO)
  - RBAC middleware

- **Reporting Service**: NestJS microservice (port 8006)
  - Attribution reporting engine
  - Multi-touch attribution calculations
  - ROI metrics (CPL, CPA, ROAS)
  - TCP-based microservice communication

### Infrastructure
- **Docker Compose**: MailHog (email), MinIO (storage)
- **Nginx**: Production web server with security headers
- **Vercel**: Serverless deployment option

## 🗺️ Application Routes

### Core Entity Management
- **`/leads`** - Leads list with search and server-side pagination
- **`/leads/:id`** - Lead detail view with formatted data
- **`/leads/:id/edit`** - Lead edit form (Formik + Yup validation)
- **`/deals`** - Deals list with search and server-side pagination
- **`/deals/:id`** - Deal detail view with currency/percentage formatting
- **`/deals/:id/edit`** - Deal edit form with probability normalization
- **`/companies`** - Companies list with industry/size filters
- **`/contacts`** - Contacts list with company associations
- **`/analytics`** - Analytics dashboard with URL-synced filters, charts, cohorts, and drill-down

### Features
- **ID Guard**: Invalid entity IDs show friendly 404 with "Back to list" button
- **Network Retry**: Failed requests show retry/back CTAs
- **Pristine Detection**: Save button disabled until form has changes
- **Percentage Normalization**: Automatic conversion (0-100 UI ↔ 0-1 API)
- **Server-side Pagination**: Efficient handling of large datasets
- **Real-time Search**: Debounced search with instant feedback
- **Analytics Drill-Downs**: KPI, trend, and funnel widgets hop directly into filtered entity lists

### Analytics Dashboard Highlights
- **URL-Synced Filters**: Date range, source, owner, stage, and interval hydrate from the URL and persist via localStorage between sessions.
- **Lazy-Loaded Charts**: Line and bar charts load on demand with Suspense fallbacks to keep the main bundle lean.
- **Consistent Drill-Down**: KPIs, trend points, and funnel bars navigate to `/leads` or `/deals` while preserving selected filters.
- **Localized Tooltips**: Dates respect the current locale, and metric values use compact number formatting for readability.
- **Cohort Insights**: Conversion cohorts surface alongside funnel data for quick pipeline diagnostics.

## 📂 Project Structure

```
traffic-crm-frontend-ts/
├── src/
│   ├── config.ts              # App configuration + enums
│   ├── types/                 # TypeScript type definitions
│   │   ├── api.ts            # API entities and DTOs
│   │   ├── auth.ts           # Authentication types
│   │   ├── config.ts         # Configuration types
│   │   └── menu.ts           # Navigation types
│   ├── store/                 # Redux store
│   │   ├── index.ts          # Typed store configuration
│   │   ├── reducer.ts        # Root reducer
│   │   └── slices/           # Redux slices
│   │       ├── account.ts    # Auth state
│   │       └── snackbar.ts   # Notifications
│   ├── contexts/              # React contexts
│   │   ├── auth-utils.ts     # Shared auth utilities
│   │   ├── JWTContext.tsx    # JWT authentication
│   │   ├── FirebaseContext.tsx
│   │   ├── Auth0Context.tsx
│   │   ├── AWSCognitoContext.tsx
│   │   ├── SupabaseContext.tsx
│   │   └── ConfigContext.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDeals.ts       # Deals data fetching
│   │   ├── useLeads.ts       # Leads data fetching
│   │   ├── useCompanies.ts   # Companies data fetching
│   │   └── useContacts.ts    # Contacts data fetching
│   ├── routes/                # Routing configuration
│   ├── services/              # API service layer
│   │   ├── deals.ts          # Deals API
│   │   ├── leads.ts          # Leads API
│   │   ├── companies.ts      # Companies API
│   │   └── contacts.ts       # Contacts API
│   ├── themes/                # Material-UI theming
│   ├── layout/                # Layout components
│   ├── views/                 # Page components
│   │   └── pages/            # Entity modules
│   │       ├── deals/        # Deals list/detail/edit
│   │       ├── leads/        # Leads list/detail/edit
│   │       ├── companies/    # Companies list
│   │       └── contacts/     # Contacts list
│   └── utils/                 # Utility functions
├── dev-backend/               # Express mock server
├── traffic-crm-backend-reporting/  # NestJS reporting service
├── e2e/                       # Playwright tests
│   └── leads-deals-detail.spec.ts  # Smoke tests
├── scripts/                   # Automation scripts
└── docs/                      # Documentation
```

## 🧪 Testing

### End-to-End Tests (Playwright)
```bash
npm run test:smoke     # Run smoke tests (leads/deals detail & edit flows)
npm run test:e2e       # Run all E2E tests
npm run test:e2e:ui    # Interactive test UI
npm run test:e2e:debug # Debug mode with step-through
```

### API Smoke Tests
```bash
npm run smoke         # Test all API endpoints
```

### CI/CD Pipeline
Every PR and push to `main` runs:
1. **Type Check** - `tsc --noEmit`
2. **Lint** - ESLint with TypeScript parser
3. **Build** - Production bundle
4. **E2E Smoke** - Playwright critical flows

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full CI guidelines.

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Vite dev server (port 3002) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm run lint` | Run ESLint on all files |
| `npm run lint:ts` | Run ESLint on TypeScript files only |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run prettier` | Format code with Prettier |
| `npm run dev:backend` | Start Express mock API |
| `npm run dev:reporting` | Start NestJS reporting service |
| `npm run dev:services` | Start Docker services |
| `npm run dev:all` | Start everything with port check |
| `npm run check:ports` | Check for port conflicts |
| `npm run test:smoke` | Run Playwright smoke tests |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Interactive Playwright UI |
| `npm run test:e2e:debug` | Debug Playwright tests |

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t traffic-crm-frontend .

# Run container
docker run -p 8080:80 traffic-crm-frontend

# Access at http://localhost:8080
```

### Vercel Deployment

```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build
npm run build

# Serve the dist/ directory with any static file server
# Ensure SPA routing is configured (all routes → index.html)
```

## 📚 Documentation

- **[Port Management Guide](./docs/port-management.md)** - Complete port configuration and troubleshooting
- **[API Collection](./Traffic_CRM_API.postman_collection.json)** - Postman API documentation
- **[Project Status](./PROJECT_STATUS.md)** - Current state, metrics, and achievements
- **[Validation Checklist](./VALIDATION_CHECKLIST.md)** - Runtime testing guide (12 tests)
- **[Next Milestones](./NEXT_MILESTONES.md)** - Roadmap and prioritized enhancements

## 🔧 Configuration

### Environment Variables

See `.env.example` for complete list. Key variables:

```bash
# Ports
PORT=3002                              # Frontend dev server
DEV_BACKEND_PORT=8787                  # Express API
REPORTING_SERVICE_PORT=8006            # NestJS reporting

# API URLs
VITE_APP_API_URL=http://localhost:8787
VITE_APP_REPORTING_API_URL=http://localhost:8006

# Testing
PLAYWRIGHT_BASE_URL=http://localhost:3002
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:
- Development setup and workflow
- Code quality checks (typecheck, lint, build)
- Testing requirements (E2E smoke tests)
- PR checklist and commit conventions
- Architecture and code style guidelines

Quick start:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure all CI gates pass locally:
   ```bash
   npm run typecheck  # ✅ 0 errors
   npm run lint       # ✅ 0 warnings
   npm run build      # ✅ successful
   npm run test:smoke # ✅ all passing
   ```
4. Commit with conventional format (`feat:`, `fix:`, `docs:`, etc.)
5. Push to branch and open a Pull Request

## 🐛 Troubleshooting

### Port Conflicts

```bash
# Check for conflicts
npm run check:ports

# If conflicts exist, update .env with available ports
```

### Build Issues

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors

```bash
# Type check
npx tsc --noEmit
```

## 📚 Documentation

### Active Documentation
- [README](./README.md) - Main project documentation
- [CONTRIBUTING](./CONTRIBUTING.md) - Contribution guidelines  
- [PROJECT_STATUS](./PROJECT_STATUS.md) - Current project status & metrics
- [NEXT_MILESTONES](./NEXT_MILESTONES.md) - Development roadmap
- [VALIDATION_CHECKLIST](./VALIDATION_CHECKLIST.md) - Runtime testing guide
- [Port Management](./docs/port-management.md) - Port configuration guide

### Historical Archive
Migration documentation and step-by-step verification reports are preserved in [`docs/archive/migration/`](./docs/archive/migration/) for reference.

---

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built with [Berry Material](https://github.com/codedthemes/berry-free-react-admin-template) as the base UI framework.

---

**Traffic CRM** - Modern CRM for performance marketers
