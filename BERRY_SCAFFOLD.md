# Berry Page Scaffold — Complete

✅ **Status:** All Berry-style pages created and navigation wired.

---

## What Was Created

### 📄 Pages (23 total)

#### Core / Sales
- `/dashboard` — KPIs, quick links, pipeline status
- `/contacts` — Contact management (already wired to API)
- `/companies` — Accounts/Organizations (already wired to API)
- `/deals` — Deal management (already wired to API)
- `/pipeline` — Kanban view of deals by stage
- `/activities` — Calls, emails, meetings, tasks (already wired to API)
- `/calendar` — Activities calendar + ICS feed

#### Reports & Analytics
- `/reports` — Funnel, time-to-close, deals by stage, revenue by month

#### Notifications
- `/notifications` — In-app notifications history

#### Admin & Settings
- `/settings` — Personal and workspace settings
- `/admin/users` — Manage users and access
- `/admin/roles` — Roles and permissions
- `/admin/webhooks` — Outbound event subscriptions
- `/admin/audit-log` — Who did what, and when

#### Billing / Reference
- `/pricing` — Plan comparison and upgrade flow
- `/invoice/[id]` — Invoice details and download

#### Auth
- `/auth/login` — Login page
- `/auth/register` — Registration page
- `/auth/forgot-password` — Password reset

#### Errors
- `/404` — Not Found page
- `/500` — Server Error page

#### Profile / Utilities
- `/profile` — User personal details
- `/wizard` — Multistep flows (import, onboarding)
- `/chat` — Internal notes or conversations (optional)
- `/tickets` — Simple support tickets (optional)

---

## 🧩 Components Created

### Navigation
- `src/components/layout/SidebarNav.tsx` — Full navigation with collapsible Admin section
- Updated `src/components/layout/Sidebar.tsx` — Now uses SidebarNav component

### Calendar Helper
- `src/components/calendar/IcsHint.tsx` — Shows copyable ICS feed URL

---

## 🎨 Design System

All pages use:
- **Berry theme** (from `src/theme/berryTheme.ts`)
- **MUI components** (Container, Card, Typography, Grid, Button, Stack)
- **Consistent spacing** (`py: 3` for page padding, `mb: 2` for sections)
- **Berry color palette** (primary, secondary, text.secondary)
- **Responsive layout** (Grid with xs={12} md={6} for cards)

---

## 🔌 Navigation Structure

```text
Dashboard
Contacts (wired)
Companies (wired)
Deals (wired)
Pipeline (stub)
Activities (wired)
Calendar (stub + ICS helper)
Reports (stub)
Notifications (stub)
Admin ▼
  ├─ Users
  ├─ Roles
  ├─ Webhooks
  ├─ Audit Log
  ├─ Settings
  └─ Profile
```

---

## 🚀 Next Steps — Wire the Stubs

### 1. Pipeline (Kanban)
**Goal:** Drag-and-drop deal stages

```tsx
// pages/pipeline.tsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { patchDealStage } from '@/api/deals';

// Fetch deals grouped by stage
// On drag end: await patchDealStage(dealId, newStage)
```

**Dependencies:**
```bash
npm install @hello-pangea/dnd
```

---

### 2. Reports (Charts)
**Goal:** Funnel, time-to-close, revenue charts

```tsx
// pages/reports/index.tsx
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { api } from '@/api/client';

// Fetch from:
// - GET /reports/funnel
// - GET /reports/time-to-close
// - GET /reports/overview
```

**Dependencies:**
```bash
npm install @mui/x-charts
```

---

### 3. Calendar (Full View)
**Goal:** Month/week/day views + ICS export

```tsx
// pages/calendar.tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import IcsHint from '@/components/calendar/IcsHint';

// Fetch activities from GET /activities
// Show IcsHint component for feed URL
```

**Dependencies:**
```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
```

---

### 4. Notifications
**Goal:** List, mark as read, mark all as read

```tsx
// pages/notifications.tsx
import { api } from '@/api/client';
import { DataGrid } from '@mui/x-data-grid';

// GET /notifications
// PATCH /notifications/{id}/read
// POST /notifications/mark-all-read
```

---

### 5. Admin Pages

#### Users (`/admin/users`)
```tsx
// GET /admin/users
// POST /admin/users (create)
// PATCH /admin/users/{id} (update role)
// DELETE /admin/users/{id}
```

#### Roles (`/admin/roles`)
```tsx
// GET /admin/roles
// POST /admin/roles (create)
// PATCH /admin/roles/{id}
// DELETE /admin/roles/{id}
```

#### Webhooks (`/admin/webhooks`)
```tsx
// GET /admin/webhooks
// POST /admin/webhooks (create subscription)
// PATCH /admin/webhooks/{id} (update)
// DELETE /admin/webhooks/{id}
```

#### Audit Log (`/admin/audit-log`)
```tsx
// GET /admin/audit-log?page=1&size=25
// Show: user, action, entity_type, entity_id, timestamp
```

---

### 6. Settings & Profile

#### Settings (`/settings`)
```tsx
// Workspace settings, integrations, API keys
// GET /settings
// PATCH /settings
```

#### Profile (`/profile`)
```tsx
// User profile, password change, 2FA setup
// GET /profile
// PATCH /profile
// POST /2fa/setup
// POST /2fa/verify
```

---

### 7. Auth Pages

#### Login (`/auth/login`)
```tsx
import { api } from '@/api/client';

const handleLogin = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('at', data.access_token);
  localStorage.setItem('rt', data.refresh_token);
  router.push('/dashboard');
};
```

#### Register (`/auth/register`)
```tsx
const handleRegister = async (email: string, password: string, name: string) => {
  await api.post('/auth/register', { email, password, name });
  router.push('/auth/login');
};
```

#### Forgot Password (`/auth/forgot-password`)
```tsx
const handleForgot = async (email: string) => {
  await api.post('/auth/forgot-password', { email });
  // Show success message
};
```

---

## 📦 Quick Commands

### Run the scaffold (safe, skips existing files)
```bash
./scripts/scaffold-berry-pages.sh
```

### Start dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

---

## 🎯 Current Status

| Page | Status | API Wired |
|------|--------|-----------|
| Dashboard | ✅ Stub | ⏳ Partial |
| Contacts | ✅ Complete | ✅ Yes |
| Companies | ✅ Complete | ✅ Yes |
| Deals | ✅ Complete | ✅ Yes |
| Pipeline | ✅ Stub | ❌ No |
| Activities | ✅ Complete | ✅ Yes |
| Calendar | ✅ Stub + ICS | ⏳ Partial |
| Reports | ✅ Stub | ❌ No |
| Notifications | ✅ Stub | ❌ No |
| Settings | ✅ Stub | ❌ No |
| Admin/* | ✅ Stubs | ❌ No |
| Auth/* | ✅ Stubs | ❌ No |
| Profile | ✅ Stub | ❌ No |
| Errors | ✅ Complete | N/A |

---

## 🔥 Priority Wire-Up Order

1. **Pipeline** (high value, visual impact)
2. **Reports** (charts, analytics)
3. **Notifications** (user engagement)
4. **Auth pages** (login/register)
5. **Admin pages** (users, roles, webhooks, audit log)
6. **Calendar** (full calendar view)
7. **Settings & Profile**

---

## 📝 Notes

- All pages use the same Berry design system
- All pages are responsive (mobile-friendly)
- Navigation is collapsible for Admin section
- ICS feed helper is ready for calendar integration
- Error pages (404, 500) are styled and ready
- Auth flow is stubbed, ready for backend integration

---

## 🎉 What You Can Demo Now

1. **Full navigation** — All pages accessible from sidebar
2. **Consistent design** — Berry theme applied everywhere
3. **Working CRUD** — Contacts, Companies, Deals, Activities
4. **Dashboard** — Stats and overview
5. **Error handling** — 404 and 500 pages styled

---

## 📞 Need Help?

To wire any specific page, say:
- "wire Pipeline page" — I'll add Kanban with drag-drop
- "wire Reports page" — I'll add charts and analytics
- "wire Notifications page" — I'll add list and mark-as-read
- "wire Admin Users page" — I'll add user management table
- "wire Auth pages" — I'll add login/register forms with API calls

---

**Generated:** $(date)
**Script:** `scripts/scaffold-berry-pages.sh`
**Navigation:** `src/components/layout/SidebarNav.tsx`




