# 🚀 Traffic CRM - Frontend

Full-featured CRM built with Create React App + TypeScript + Material-UI

![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![MUI](https://img.shields.io/badge/MUI-6-blue)

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Build for staging
npm run build:staging
```

**Open:** <http://localhost:3000>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Development Guide](#-development-guide)
- [Production Checklist](#-production-checklist)

---

## ✨ Features

### Core CRM Features

- ✅ **Dashboard** - Overview with key metrics and charts
- ✅ **Contacts Management** - Full CRUD with search and filters
- ✅ **Companies Management** - Company profiles and relationships
- ✅ **Deals Pipeline** - Kanban board with drag-and-drop
- ✅ **Activities Tracking** - Timeline of all CRM activities
- ✅ **Leads Management** - Lead capture and qualification
- ✅ **Reports & Analytics** - Charts and data visualization
- ✅ **Settings** - User preferences and configuration

### Advanced Features

- ✅ **Kanban Pipeline** - Drag-and-drop deals between stages with backend persistence
- ✅ **Berry Theme** - Professional Material-UI theme system
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **TypeScript** - Full type safety throughout
- ✅ **Redux Toolkit** - State management for auth and data
- ✅ **API Client** - Axios-based with interceptors and error handling

---

## 🛠 Tech Stack

### Core

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Create React App** - Build tooling
- **Material-UI 6** - Component library

### State & Data

- **Redux Toolkit** - State management
- **React Router 6** - Client-side routing
- **Axios** - HTTP client

### UI Components

- **@mui/x-data-grid** - Data tables
- **@mui/x-charts** - Charts and analytics
- **@hello-pangea/dnd** - Drag-and-drop for Kanban
- **React Hook Form** - Form handling

### Development

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 📁 Project Structure

```text
traffic-crm-frontend-ts/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Reusable components
│   │   ├── layout/            # Layout components (AppShell, Sidebar, Topbar)
│   │   ├── common/            # Common components (BerryButton, BerryCard)
│   │   └── calendar/          # Calendar components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Dashboard page
│   │   ├── Contacts.tsx       # Contacts management
│   │   ├── Companies.tsx      # Companies management
│   │   ├── Deals.tsx          # Kanban pipeline
│   │   ├── Activities.tsx     # Activities timeline
│   │   ├── Leads.tsx          # Leads management
│   │   ├── Reports.tsx        # Reports & analytics
│   │   ├── Settings.tsx       # Settings page
│   │   └── Login.tsx          # Login page
│   ├── services/              # API services
│   │   ├── api.ts            # Base API client
│   │   └── leads.ts          # Leads API
│   ├── store/                 # Redux store
│   │   ├── index.ts          # Store configuration
│   │   ├── hooks.ts          # Typed hooks
│   │   ├── authSlice.ts      # Auth state
│   │   └── leadsSlice.ts     # Leads state
│   ├── theme/                 # Theme configuration
│   │   ├── berryTheme.ts     # Main theme
│   │   ├── palette.ts        # Color palette
│   │   ├── typography.ts     # Typography
│   │   ├── shadows.ts        # Shadows
│   │   └── components.ts     # Component overrides
│   ├── types/                 # TypeScript types
│   │   └── crm.ts            # CRM domain types
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── .env.production           # Production environment
├── .env.staging              # Staging environment
├── vercel.json               # Vercel configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

---

## 🔐 Environment Setup

### Local Development

Create `.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### Staging

File: `.env.staging` (tracked in git)

```env
REACT_APP_API_URL=https://staging-api.example.com/api/v1
REACT_APP_WS_URL=wss://staging-api.example.com/ws
```

### Production

File: `.env.production` (tracked in git)

```env
REACT_APP_API_URL=https://api.example.com/api/v1
REACT_APP_WS_URL=wss://api.example.com/ws
```

**Note:** Update the URLs with your actual API endpoints before deploying.

---

## 📜 Available Scripts

```bash
# Development
npm start                  # Start dev server (http://localhost:3000)

# Building
npm run build             # Production build (uses .env.production)
npm run build:staging     # Staging build (uses .env.staging)
npm run build:production  # Explicit production build

# Testing
npm test                  # Run tests in watch mode
npm run test:e2e         # Run Playwright E2E tests
npm run e2e:ui           # Run E2E tests with UI

# Linting
npm run lint             # Run ESLint

# Other
npm run eject            # Eject from CRA (irreversible!)
```

---

## 🚀 Deployment

### Vercel (Recommended)

#### Prerequisites

1. Push code to GitHub/GitLab/Bitbucket
2. Ensure `vercel.json` is present (already included)
3. Confirm `.env.production` and `.env.staging` are committed

#### Deploy Steps

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

2. **Configure Build**
   - Framework Preset: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Node.js Version: **18.x**

3. **Set Environment Variables**

   In Vercel Dashboard → Project Settings → Environment Variables:

   **Production:**

   ```text
   REACT_APP_API_URL=https://api.example.com/api/v1
   REACT_APP_WS_URL=wss://api.example.com/ws
   ```

   **Preview (Staging):**

   ```text
   REACT_APP_API_URL=https://staging-api.example.com/api/v1
   REACT_APP_WS_URL=wss://staging-api.example.com/ws
   ```

4. **Deploy**

   - Push to `main` branch → Production deployment
   - Create PR → Preview deployment

#### Configuration

The included `vercel.json` provides:

- ✅ SPA routing (all routes serve `index.html`)
- ✅ Long-term caching for static assets
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

### Other Platforms

#### Netlify

```bash
# Build command
npm run build

# Publish directory
build

# Redirects (create _redirects file in public/)
/*    /index.html   200
```

#### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket --delete

# Configure CloudFront for SPA routing
```

#### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔌 API Integration

### Expected Backend Contract

All list endpoints follow this structure:

```http
GET /api/v1/{entity}?page=1&size=25&search=query
```

**Response:**

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 25,
  "pages": 4
}
```

### Entities

- `/contacts` - Contact management
- `/companies` or `/accounts` - Company management
- `/deals` or `/opportunities` - Deal pipeline
- `/activities` - Activity tracking
- `/leads` - Lead management

### Deal Stages

The Kanban pipeline expects these exact stage values:

```text
prospecting
qualification
proposal
negotiation
closed_won
closed_lost
```

### CORS Configuration

Your backend must allow the frontend domain:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Development
        "https://your-domain.vercel.app",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 💻 Development Guide

### Adding a New Page

1. Create page component in `src/pages/`:

```tsx
// src/pages/NewPage.tsx
import { Box, Typography } from '@mui/material';

export default function NewPage() {
  return (
    <Box>
      <Typography variant="h4">New Page</Typography>
    </Box>
  );
}
```

1. Add route in `src/App.tsx`:

```tsx
import NewPage from './pages/NewPage';

// In routes
<Route path="/new-page" element={<NewPage />} />
```

1. Add to sidebar navigation in `src/components/layout/Sidebar.tsx`

### Adding a New API Service

1. Create service file in `src/services/`:

```tsx
// src/services/newEntity.ts
import api from './api';

export interface NewEntity {
  id: number;
  name: string;
}

export const newEntityService = {
  getAll: (page = 1, size = 25) =>
    api.get<PaginatedResponse<NewEntity>>('/new-entities', {
      params: { page, size }
    }),

  getById: (id: number) =>
    api.get<NewEntity>(`/new-entities/${id}`),

  create: (data: Omit<NewEntity, 'id'>) =>
    api.post<NewEntity>('/new-entities', data),

  update: (id: number, data: Partial<NewEntity>) =>
    api.patch<NewEntity>(`/new-entities/${id}`, data),

  delete: (id: number) =>
    api.delete(`/new-entities/${id}`),
};
```

### Customizing Theme

Edit `src/theme/palette.ts`:

```tsx
export const palette = {
  primary: {
    main: '#5e35b1',  // Your brand color
    light: '#9162e4',
    dark: '#280680',
  },
  // ... other colors
};
```

---

## ✅ Production Checklist

### Pre-Deploy

- [ ] Update API URLs in `.env.production`
- [ ] Test production build locally: `npm run build && npx serve -s build`
- [ ] Verify all environment variables are set
- [ ] Check CORS configuration on backend
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Review security headers in `vercel.json`

### Post-Deploy

- [ ] Verify all routes load correctly
- [ ] Test CRUD operations on all entities
- [ ] Verify Kanban drag-and-drop works
- [ ] Check API calls hit correct endpoints
- [ ] Test on mobile devices
- [ ] Verify WebSocket connections (if used)
- [ ] Check browser console for errors
- [ ] Test authentication flow
- [ ] Verify theme and styling

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics, Mixpanel)
- [ ] Set up uptime monitoring
- [ ] Configure alerts for critical errors

---

## 🧪 Testing

### Manual Smoke Tests

```bash
# 1. Backend health
curl http://localhost:8000/health

# 2. API pagination
curl "http://localhost:8000/api/v1/contacts?page=1&size=1"
```

```bash
# 3. Frontend
npm start
# Navigate through all pages, verify no console errors
```

### E2E Tests (Playwright)

```bash
# Install Playwright (first time only)
npx playwright install

# Run tests
npm run test:e2e

# Run with UI
npm run e2e:ui
```

---

## 📚 Key Features Documentation

### Kanban Pipeline

The Deals page (`src/pages/Deals.tsx`) implements a full Kanban board with:

- ✅ Drag-and-drop between stages
- ✅ Backend persistence on drop
- ✅ Optimistic UI updates
- ✅ Error handling and rollback
- ✅ Loading states

**Usage:**

1. Navigate to Deals page
2. Drag deal cards between columns
3. Changes are automatically saved to backend
4. Deal stage updates in real-time

### Berry Theme System

Professional Material-UI theme with:

- ✅ Custom color palette (primary, secondary, success, error, warning, info)
- ✅ Typography scale (h1-h6, body1-2, button, caption)
- ✅ Elevation shadows (0-24)
- ✅ Component overrides (Button, Card, Paper, etc.)
- ✅ Dark mode support (optional)

**Customization:**

Edit files in `src/theme/` directory to customize colors, typography, and component styles.

---

## 🔧 Troubleshooting

### Build Errors

**Error:** `Module not found: Can't resolve '@mui/x-charts'`

**Solution:**

```bash
npm install @mui/x-charts@^7.18.0 @mui/x-data-grid@^7.18.0
```

**Error:** `Type error: AxiosHeaders is not assignable`

**Solution:** Already fixed in `src/api/client.ts` with type assertions.

### Runtime Errors

**Error:** CORS errors in browser console

**Solution:** Configure backend CORS to allow your frontend domain.

**Error:** API calls return 404

**Solution:** Verify `REACT_APP_API_URL` is set correctly and backend is running.

**Error:** Kanban drag-and-drop not working

**Solution:** Ensure `@hello-pangea/dnd` is installed and deal stages match backend.

---

## 🤝 Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use functional components with hooks
- Keep components small and focused
- Write meaningful commit messages

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 📞 Support

### Resources

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Create React App Documentation](https://create-react-app.dev)

### Project Status

- **Version:** 1.0.0
- **Status:** Production Ready
- **Last Updated:** October 18, 2025
- **Maintainer:** Your Team

---

## 📄 License

[Your License Here]

---

## 🎉 Ready to Deploy

Your Traffic CRM frontend is production-ready with:

- ✅ Full-featured CRM interface
- ✅ Kanban pipeline with drag-and-drop
- ✅ Professional Berry theme
- ✅ TypeScript type safety
- ✅ Vercel deployment configuration
- ✅ Environment-specific builds
- ✅ Security headers
- ✅ SPA routing
- ✅ Comprehensive documentation

**Next Step:** Deploy to Vercel following the [Deployment](#-deployment) section above.

---

Built with ❤️ using React, TypeScript, and Material-UI
