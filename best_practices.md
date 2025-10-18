# 📘 Project Best Practices

## 1. Project Purpose

Traffic CRM Frontend is a React + TypeScript single-page application that provides a CRM interface for managing leads, contacts, companies, deals, activities, reports, and attachments. It targets a FastAPI backend (exposing /api/v1), uses Material UI (Berry-inspired theme), Redux Toolkit for state, axios for HTTP, and Playwright for end-to-end tests.

## 2. Project Structure

- Root
  - package.json: CRA scripts (react-scripts), Playwright scripts, TypeScript config
  - .env.example: API/WS URLs
  - playwright.config.ts, e2e/: Playwright E2E setup and specs
  - public/: CRA index.html
  - scripts/: utilities (e.g., scaffold-berry-pages.sh)
  - pages/: Next.js-style pages (not used by CRA runtime) — do not add new code here
- src/
  - api/
    - client.ts: Central axios client with token injection, refresh flow, and global abort
  - auth/
    - AuthProvider.tsx: Auth context; manages tokens, mirrors access token to localStorage for router gate
    - RequireAuth.tsx: Route guard component (recommended for protected routes)
  - components/
    - layout/: AppShell, Sidebar, Topbar, nav
    - common/, calendar/, attachments/: Reusable UI and hooks (e.g., useInlineUpload)
  - hooks/
    - useServerDataGrid.ts: Server-side pagination/sort/filter helpers for MUI DataGrid
  - pages/
    - Dashboard, Leads, Contacts, Companies, Deals, Activities, Reports, Settings, Login
  - services/
    - api.ts: Legacy/simple axios instance (Authorization via localStorage, 401 -> redirect)
    - leads.ts, deals.ts, attachments.ts, notifications.ts, reports.ts: API wrappers
  - store/
    - index.ts: Redux store
    - hooks.ts: Typed hooks (useAppDispatch/useAppSelector)
    - leadsSlice.ts, authSlice.ts: RTK slices with async thunks
  - theme/
    - ColorModeProvider.tsx, berryTheme.ts, palette.ts, components.ts, shadows.ts, typography.ts
  - types/
    - crm.ts: Domain types (Lead, Contact, Account, Opportunity, Activity)
  - App.tsx, main.tsx: Entry, routing, providers (Redux, Router, Theme)

### Notes

- CRA routing is defined in src/App.tsx. The root-level pages/ directory is not used at runtime; avoid placing app code there.
- Two axios clients exist (src/api/client.ts and src/services/api.ts). Prefer src/api/client.ts (see Do’s and Don’ts).

## 3. Test Strategy

- Framework: Playwright (@playwright/test)
  - Location: e2e/*.spec.ts
  - Config: playwright.config.ts starts the dev server (npm start) and points baseURL to <http://localhost:3000>
  - Reporter: HTML; traces on first retry
- Current coverage: E2E smoke tests that verify login flow and basic navigation
- Conventions
  - Prefer role- and label-based queries (getByRole, getByLabel) as in existing tests
  - Keep test seed data stable; where possible, decouple tests from live backends (mocks, fixtures) for determinism
  - Consider a dedicated “test user” and/or a login shortcut (API-based session setup) to speed up authenticated flows
- Unit/Integration tests (recommended to add)
  - Use React Testing Library + Jest (react-scripts test) for component-level behavior
  - Place tests alongside components (ComponentName.test.tsx) or under src/__tests__
  - Mock HTTP with MSW for reliable component/integration tests

## 4. Code Style

- TypeScript
  - Prefer explicit types on public function signatures; rely on inference for local variables
  - Use domain types from src/types/crm.ts; extend as needed instead of using any
  - Keep union and enum-like string literal types for domain states (e.g., LeadStatus)
- React
  - Functional components with hooks; avoid class components
  - Co-locate small hooks with features (e.g., useInlineUpload); share general hooks in src/hooks
  - Use React Router v6 elements (Routes/Route/Navigate) and lazy routes for larger sections if needed
- State Management
  - Use Redux Toolkit slices with createAsyncThunk for async flows
  - Use typed hooks (useAppDispatch, useAppSelector)
  - Keep slices focused on a single domain concern; derive UI state in components when possible
- Styling/UI
  - Use MUI v5 with Emotion; prefer sx props for one-off styles and theme overrides in theme/components.ts
  - Use ColorModeProvider and theme’s palette/typography/shadows consistently
- Error Handling
  - Centralize API error handling in the axios client; surface user-friendly messages in UI
  - Avoid throwing raw axios errors from components; map to domain errors where helpful

## 5. Common Patterns

- API Client
  - src/api/client.ts provides: baseURL resolution, Authorization header injection, 401 refresh retry, global abort on logout
- Services
  - Thin wrappers around the API client (e.g., leads.ts) returning typed responses
- Auth
  - AuthProvider holds user and tokens; RequireAuth protects routes
  - LocalStorage is mirrored only to align with existing App.tsx gate; prefer in-memory tokens
- Data Grids
  - useServerDataGrid converts MUI DataGrid pagination/sort/filter models to query params
- Attachments
  - useInlineUpload hook: hidden input + service call, resets input after upload

## 6. Do’s and Don’ts

- ✅ Do
  - Use src/api/client.ts for all HTTP calls; export/import its api in services
  - Handle authentication via AuthProvider and RequireAuth instead of reading localStorage in components
  - Keep services stateless and side-effect free (no navigation logic, no window.location)
  - Use typed Redux hooks; keep async logic in thunks or services
  - Name files in PascalCase for components (Component.tsx) and camelCase for utilities (useThing.ts, api.ts)
  - Use MUI’s sx and theme overrides; avoid inline styles except for trivial cases
  - Add accessible labels/roles for E2E stability (labels on inputs and semantic roles on buttons/links)
- ❌ Don’t
  - Don’t mix both axios clients (src/services/api.ts and src/api/client.ts). Avoid services/api.ts for new code
  - Don’t redirect inside axios interceptors in shared libraries; signal auth failure via callbacks/context
  - Don’t read/write localStorage directly from deep components; centralize in AuthProvider when needed
  - Don’t place runtime code in the root-level pages/ directory (it is unused by CRA)

## 7. Tools & Dependencies

- Libraries
  - React 18, React Router v6, Redux Toolkit, React-Redux
  - MUI v5, Emotion, MUI X DataGrid/Charts
  - axios, dayjs, jwt-decode, @hello-pangea/dnd
  - Playwright for E2E
- Scripts
  - npm start: CRA dev server (react-scripts)
  - npm build: Production build
  - npm test: Jest/RTL runner (add tests under src)
  - npm run test:e2e: Playwright E2E tests
  - npm run e2e:ui: Playwright UI mode
- Configuration
  - .env (copy from .env.example):
    - REACT_APP_API_URL=<http://localhost:8000/api/v1>
    - REACT_APP_WS_URL=<ws://localhost:8000/ws>

## 8. Other Notes

- Inconsistencies to be aware of
  - Two axios clients exist; standardize on src/api/client.ts and migrate services to import { api } from 'src/api/client'
  - App.tsx currently gates routes via localStorage; prefer wrapping protected routes in RequireAuth and sourcing state from AuthProvider
- LLM guidance for new code
  - Create new pages under src/pages and register them in src/App.tsx routes
  - Add new domain types to src/types/crm.ts and reuse across services/components
  - For API calls, add functions in src/services/[domain].ts that call the shared api client and return typed data
  - Expose component labels and roles for E2E stability, and consider data-testid only as a last resort
  - Keep styling consistent with the theme; prefer theme spacing/typography tokens over hardcoded values
