# 📘 Project Best Practices

## 1. Project Purpose
Traffic CRM Frontend is a React + TypeScript single-page application that provides a full-featured CRM UI. It runs entirely in demo mode with deterministic mock data and can optionally connect to a development backend to enable real-time features, email, file storage, and webhooks.

## 2. Project Structure
- Tooling and Entry
  - Create React App (react-scripts) with React 18
  - TypeScript strict mode with path aliases (baseUrl=src)
  - Entry: src/index.tsx (ReactDOM.createRoot). A similar src/main.tsx exists but index.tsx is the effective entry for CRA.
- Key directories
  - src/api/client.ts: Centralized Axios client, token injection, 401 refresh, global abort, onAuthFailure
  - src/config/index.ts: Environment variables and feature flags (isDemoMode, isAIEnabled)
  - src/services/: Service layer with demo-mode fallback to mocks (src/services/mocks)
  - src/store/: Redux Toolkit store, slices (auth, leads) and typed hooks (useAppSelector/useAppDispatch)
  - src/theme/: MUI theme, color mode provider, component tokens
  - src/pages/: Route-level pages (e.g., Deals, Leads, Dashboard, Admin/*)
  - src/components/: Feature- and domain-oriented components
  - src/types/crm.ts: Domain types (Lead, Deal, Contact, etc.)
  - src/utils/: Cross-cutting utilities (rbac, whatsapp, assignment, emailGraph)
  - src/hooks/useServerDataGrid.ts: Server-driven DataGrid helpers
  - tests: Jest unit/integration under src/**/__tests__ and co-located; Playwright E2E in e2e/
- Ancillary
  - dev-backend/: Local backend shim for development
  - docker-compose.yml: MailHog + MinIO for dev
  - playwright.config.ts: E2E configuration with auto webServer (npm start)
  - jest.config.js: transformIgnore patterns (allow axios)
  - .env.*: Environment configs; vercel.json for SPA rewrites

Path aliases (tsconfig):
- @components/*, @pages/*, @services/*, @store/*, @theme/*, @types/*

## 3. Test Strategy
- Frameworks
  - Unit/Integration: Jest + React Testing Library (RTL) with @testing-library/jest-dom
  - E2E: Playwright (testDir=e2e, chromium project, baseURL=http://localhost:3000)
- Organization
  - Unit tests live under src/**/__tests__ and co-located (e.g., src/hooks/useServerDataGrid.test.tsx)
  - Component tests can be placed under src/pages/__tests__ and src/components/**/__tests__
  - E2E specs under e2e/ (smoke.spec.ts, deals.spec.ts)
- Setup
  - src/setupTests.ts sets IS_REACT_ACT_ENVIRONMENT for concurrent React 18 tests
  - jest.config.js: transformIgnorePatterns allows transforming axios
- Mocking guidelines
  - Prefer mocking the centralized API client: mock 'src/api/client' and stub the named export api methods (api.get/post/patch/delete)
  - Avoid mocking axios directly in most tests; keep HTTP concerns behind api
  - For demo mode behaviors, set REACT_APP_DEMO=1 to exercise mock paths
- Testing philosophy
  - Unit tests for utilities, services, hooks (pure logic and data shaping)
  - Integration tests for pages/components with Router/Redux providers
  - E2E tests for critical flows only (login, navigation, core pages); keep selectors stable (roles/labels/aria)
  - Prefer getByRole/getByLabelText over query by testid unless necessary
  - Keep mock data deterministic and stable; avoid time-sensitive flaky assertions
- Coverage expectations
  - Focus on RBAC, assignment rules, WhatsApp policy logic, and service fallbacks
  - Ensure critical routes and auth flows are covered by smoke E2E

## 4. Code Style
- TypeScript
  - Strict mode enabled; avoid any (use unknown or refined types)
  - Keep domain types in src/types/crm.ts and reuse across services/components
  - Export types alongside modules when needed for reuse
- React
  - Functional components with hooks; keep components presentational where possible
  - Co-locate small components with features; push side-effects into hooks/services
  - Use React.memo/useMemo/useCallback for expensive or stable props
- State
  - Global state: Redux Toolkit slices; use typed hooks from src/store/hooks
  - UI-only state: useState/useReducer locally
  - Server state: managed via services; consider SWR/React Query as a future enhancement
- Naming conventions
  - Files: PascalCase for components (ComponentName.tsx), camelCase for utilities (emailGraph.ts)
  - Exports: Named exports for utilities and hooks; default exports for major components/pages acceptable
  - Selectors/IDs: Prefer role/label-based selectors; add aria-label where appropriate
- Styling
  - Material UI + Emotion; theme customizations in src/theme
  - Use MUI system props and sx for minor styling; centralize tokens in theme where reusable
- Error handling
  - Centralize HTTP concerns in src/api/client.ts
  - Let the interceptor handle 401 with single refresh attempt; on failure, clear tokens and trigger onAuthFailure
  - In services, catch network errors and fall back to mocks in demo mode
- Comments & Docs
  - Use JSDoc for utilities/helpers to document intent and constraints
  - Brief inline comments for non-obvious logic; avoid redundant comments

## 5. Common Patterns
- Central API client (src/api/client.ts)
  - BaseURL from env (REACT_APP_API_URL), Authorization header injection, single-flight refresh on 401, global AbortController for cancellation
  - onAuthFailure callback to decouple navigation logic
- Service layer with demo fallback (src/services/*)
  - if (config.isDemoMode) return mocks; otherwise call api and gracefully degrade to mocks when appropriate
  - Keep request/response types aligned with src/types/crm.ts
- RBAC utilities (src/utils/rbac.ts)
  - Permission strings, Role→Permission mapping, helpers: can, canAny, canAll, canViewTimeline, canLogActivity
- DataGrid server-driver hook (src/hooks/useServerDataGrid.ts)
  - Pagination: UI page is zero-based; query page is one-based
  - Sorting: only the first sort entry is considered ('field:dir')
  - Filters: build search query from filter model; treat undefined/empty values as empty strings
  - Exposes gridProps with server modes (pagination/sorting/filter)
- Auth & Routing
  - AuthProvider: stores tokens via setTokens; demo login path; mirrors access_token to localStorage for bootstrapping
  - RequireAuth: simple route guard that redirects to /login
- Theming
  - ColorModeProvider + berryTheme/theme components; wrap App with ThemeProvider + CssBaseline
- Redux toolkit
  - configureStore in src/store/index.ts; export RootState/AppDispatch types and typed hooks

## 6. Do's and Don'ts
- Do
  - Use src/api/client.ts for all HTTP calls; never create ad-hoc axios instances
  - Reuse domain types from src/types/crm.ts across services/components
  - Honor config.isDemoMode in services; maintain mock fallbacks for resilience
  - Use typed Redux hooks (useAppSelector/useAppDispatch) and slice-based reducers
  - Prefer role/label queries in tests; keep selectors resilient
  - Keep components small and compose from domain components in src/components/*
  - Document new utilities with JSDoc and add unit tests under __tests__
  - Use path aliases defined in tsconfig.json for clean imports
  - Add aria-labels for interactive elements to improve accessibility and testability
- Don't
  - Don’t import axios directly in features; go through the centralized api client
  - Don’t persist secrets in localStorage; tokens are kept in memory by default (demo token mirroring is an exception for bootstrapping)
  - Don’t bypass RequireAuth for protected routes
  - Don’t rely on brittle text selectors in E2E; prefer roles/labels/aria attributes
  - Don’t reintroduce deprecated src/services/api.ts usage; import { api } from 'src/api/client'

## 7. Tools & Dependencies
- Core libraries
  - react, react-dom, react-router-dom (v6), @reduxjs/toolkit, axios
  - @mui/material, @emotion/*, @mui/x-data-grid, @mui/x-charts
  - dayjs, react-quill, xlsx
- Dev/Test
  - Jest + RTL + jest-dom for unit/integration; Playwright for E2E
  - TypeScript 4.9 with strict mode
- Scripts
  - npm start – CRA dev server
  - npm run build – Production build; npm run build:staging – env-cmd with .env.staging
  - npm test – Jest in jsdom
  - npm run test:e2e – Playwright; npm run e2e:ui – Playwright UI mode
  - npm run smoke – Shell-based quick smoke
- Setup
  - npm install; npm start
  - For full-stack dev: docker-compose up -d (MailHog, MinIO), run dev-backend, set .env.local with REACT_APP_* and set REACT_APP_DEMO=0

## 8. Other Notes
- Environment & Flags
  - REACT_APP_API_URL, REACT_APP_WS_URL, REACT_APP_DEMO (1=demo, 0=backend), REACT_APP_AI
  - vercel.json configures SPA rewrites and headers for deployments
- Interceptors & Auth
  - Token refresh is single-flight; on failure, tokens are cleared and global requests are canceled; ensure UI handles onAuthFailure (e.g., redirect to login)
- DataGrid Query Consistency
  - Keep one-based pagination on server, zero-based in UI; only first sort entry used; normalize filter values
- Testing
  - src/pages/__tests__/Deals.simple.test.ts uses RTL structural assertions; prefer mocking 'src/api/client' and stubbing api methods, not 'apiClient'
  - E2E webServer auto-starts with npm start; ensure app boots before assertions and use robust selectors
- LLM Guidance
  - Respect path aliases and TypeScript strictness
  - Extend services with demo-mode fallbacks and robust error handling via centralized api client
  - Keep new components aligned with existing domain folders and naming conventions
  - Avoid adding new global singletons; integrate with existing providers (AuthProvider, Theme, Redux)
