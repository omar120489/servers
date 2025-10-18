# 🔄 Next.js Migration Guide - CRA to Next.js Berry

**From:** Create React App (CRA)  
**To:** Next.js Berry (SSR/SSG-ready)  
**Status:** Optional migration path

---

## 📋 Overview

This guide provides a clean migration path from your current CRA project to a Next.js Berry setup. The migration is **optional** - your CRA app is fully functional. Migrate only if you need:

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ File-based routing
- ✅ API routes (backend in same repo)
- ✅ Better SEO and performance

---

## 🎯 Migration Strategy

### Option 1: Incremental (Recommended)

Keep both projects running and migrate page-by-page:

1. **Week 1:** Setup Next.js project, copy shared services
2. **Week 2:** Migrate Dashboard + Login
3. **Week 3:** Migrate Contacts, Companies, Deals
4. **Week 4:** Migrate Reports, Pipeline, Settings
5. **Week 5:** Testing, cutover

### Option 2: Big Bang

Full migration in one go (2-4 days of work).

---

## 🚀 Step-by-Step Migration

### 1. Create Next.js Project

```bash
cd /Users/kguermene/Desktop
npx create-next-app@latest crm-berry-next --ts --eslint --app
cd crm-berry-next

# Install dependencies
npm i @mui/material @emotion/react @emotion/styled
npm i @mui/icons-material @mui/x-data-grid @mui/x-charts
npm i @hello-pangea/dnd axios jwt-decode dayjs
npm i -D @playwright/test
```

### 2. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Key difference:** `NEXT_PUBLIC_*` instead of `REACT_APP_*`

### 3. File Structure Mapping

| CRA Location | Next.js Location | Notes |
|--------------|------------------|-------|
| `src/pages/*.tsx` | `app/*.tsx` or `pages/*.tsx` | Use App Router or Pages Router |
| `src/components/**` | `src/components/**` | Same structure |
| `src/services/**` | `src/services/**` | Same structure |
| `src/api/client.ts` | `src/api/client.ts` | Already supports both env vars |
| `src/auth/**` | `src/auth/**` | Same structure |
| `src/hooks/**` | `src/hooks/**` | Same structure |
| `src/theme/**` | `src/theme/**` | Same structure |
| `src/store/**` | `src/store/**` | Same structure (if using Redux) |
| `public/**` | `public/**` | Same structure |

### 4. Copy Shared Code (No Changes Needed)

These files work in both CRA and Next.js:

```bash
# From CRA project root
cp -r src/api crm-berry-next/src/
cp -r src/auth crm-berry-next/src/
cp -r src/components crm-berry-next/src/
cp -r src/hooks crm-berry-next/src/
cp -r src/services crm-berry-next/src/
cp -r src/theme crm-berry-next/src/
cp -r src/types crm-berry-next/src/
```

### 5. Routing Conversion

#### CRA (react-router-dom)

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/contacts" element={<Contacts />} />
  </Routes>
</BrowserRouter>
```

#### Next.js (App Router)

```text
app/
  layout.tsx         # Root layout
  page.tsx           # Home (/)
  login/
    page.tsx         # /login
  dashboard/
    page.tsx         # /dashboard
  contacts/
    page.tsx         # /contacts
```

#### Next.js (Pages Router - simpler)

```text
pages/
  _app.tsx           # Root wrapper
  index.tsx          # Home (/)
  login.tsx          # /login
  dashboard.tsx      # /dashboard
  contacts.tsx       # /contacts
```

### 6. Convert Pages

#### CRA Page Example

```tsx
// src/pages/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const nav = useNavigate();
  return <div onClick={() => nav('/contacts')}>Dashboard</div>;
}
```

#### Next.js Page (App Router)

```tsx
// app/dashboard/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  return <div onClick={() => router.push('/contacts')}>Dashboard</div>;
}
```

#### Next.js Page (Pages Router)

```tsx
// pages/dashboard.tsx
import React from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  return <div onClick={() => router.push('/contacts')}>Dashboard</div>;
}
```

### 7. Auth Guards

#### CRA

```tsx
// src/auth/RequireAuth.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}
```

#### Next.js (HOC Pattern)

```tsx
// src/auth/withAuth.tsx
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';

export function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) router.push('/login');
    }, [user, router]);

    if (!user) return null;
    return <Component {...props} />;
  };
}

// Usage:
export default withAuth(Dashboard);
```

### 8. Root Layout

#### CRA

```tsx
// src/App.tsx
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from '@mui/material';
import { createBerryTheme } from './theme/berryTheme';

function App() {
  return (
    <ThemeProvider theme={createBerryTheme('light')}>
      <AuthProvider>
        {/* routes */}
      </AuthProvider>
    </ThemeProvider>
  );
}
```

#### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '../src/auth/AuthProvider';
import { ThemeProvider } from '@mui/material';
import { createBerryTheme } from '../src/theme/berryTheme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={createBerryTheme('light')}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
```

---

## 🔧 Key Differences

| Feature | CRA | Next.js |
|---------|-----|---------|
| **Env vars** | `REACT_APP_*` | `NEXT_PUBLIC_*` |
| **Routing** | `react-router-dom` | File-based |
| **Navigation** | `useNavigate()` | `useRouter()` |
| **Dev command** | `npm start` | `npm run dev` |
| **Build output** | `build/` | `.next/` |
| **SSR** | ❌ Client-only | ✅ SSR/SSG |
| **API routes** | ❌ Separate backend | ✅ Built-in |
| **Image optimization** | Manual | `<Image />` component |

---

## ✅ Compatibility Checklist

Your CRA code is already Next.js-ready if:

- ✅ `src/api/client.ts` checks both `REACT_APP_API_URL` and `NEXT_PUBLIC_API_URL`
- ✅ Services use relative imports (`../api/client` not absolute paths)
- ✅ No direct DOM manipulation (use refs)
- ✅ No `window` access outside `useEffect`
- ✅ Components are functional (not class-based)

---

## 🧪 Testing After Migration

```bash
# 1. Backend health
./smoke_test.sh

# 2. Start Next.js
npm run dev

# 3. E2E tests
npm run test:e2e

# 4. Build check
npm run build
npm start
```

---

## 📦 Deployment

### CRA Deployment

```bash
npm run build
# Deploy build/ folder to:
# - Vercel, Netlify, AWS S3 + CloudFront
```

### Next.js Deployment

```bash
npm run build
# Deploy to:
# - Vercel (zero config)
# - Netlify, AWS Amplify, Docker
```

**Dockerfile for Next.js:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎯 Migration Checklist

### Phase 1: Setup (1 day)

- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Copy shared code (services, components, theme)
- [ ] Setup environment variables
- [ ] Test API client connection

### Phase 2: Core Pages (2 days)

- [ ] Migrate Login page
- [ ] Migrate Dashboard
- [ ] Setup auth guards (HOC or middleware)
- [ ] Test authentication flow

### Phase 3: Entity Pages (2 days)

- [ ] Migrate Contacts page
- [ ] Migrate Companies page
- [ ] Migrate Deals page
- [ ] Test CRUD operations

### Phase 4: Advanced Features (2 days)

- [ ] Migrate Pipeline (Kanban)
- [ ] Migrate Reports (charts)
- [ ] Add Notifications drawer
- [ ] Test attachments upload

### Phase 5: Testing & Cutover (1 day)

- [ ] Run smoke tests
- [ ] Run E2E tests
- [ ] Performance audit
- [ ] Deploy to staging
- [ ] Cutover to production

---

## 🚨 Common Pitfalls

### 1. Window is not defined

**Problem:**
```tsx
const url = window.location.href; // ❌ SSR error
```

**Solution:**
```tsx
const url = typeof window !== 'undefined' ? window.location.href : '';
```

### 2. useRouter hook mismatch

**Problem:**
```tsx
import { useRouter } from 'next/router'; // ❌ Wrong for App Router
```

**Solution:**
```tsx
// Pages Router:
import { useRouter } from 'next/router';

// App Router:
import { useRouter } from 'next/navigation';
```

### 3. CSS imports

**Problem:**
```tsx
import './styles.css'; // ❌ May not work in Next.js
```

**Solution:**
```tsx
// Use CSS Modules:
import styles from './styles.module.css';

// Or MUI sx prop:
<Box sx={{ color: 'red' }} />
```

---

## 📚 Resources

- **Next.js Docs:** <https://nextjs.org/docs>
- **Migration Guide:** <https://nextjs.org/docs/migrating/from-create-react-app>
- **App Router:** <https://nextjs.org/docs/app>
- **Pages Router:** <https://nextjs.org/docs/pages>

---

## 🎉 Benefits After Migration

- ✅ **Faster initial load** (SSR)
- ✅ **Better SEO** (pre-rendered HTML)
- ✅ **Automatic code splitting** (per route)
- ✅ **Image optimization** (built-in)
- ✅ **API routes** (optional backend)
- ✅ **Zero-config deployment** (Vercel)

---

## 🤔 Should You Migrate?

### Stick with CRA if:

- ✅ You need a simple SPA
- ✅ No SEO requirements
- ✅ Backend is separate (FastAPI)
- ✅ Team is familiar with CRA

### Migrate to Next.js if:

- ✅ You need SSR/SSG
- ✅ SEO is critical
- ✅ Want faster initial loads
- ✅ Want built-in optimizations
- ✅ Team is ready to learn Next.js

---

**Created:** October 18, 2025  
**Status:** ✅ Migration guide ready  
**Next:** Choose to migrate or stay with CRA

---

**Questions?** Reference the Next.js Berry project at:  
`/Users/kguermene/Desktop/crm-berry-next`



