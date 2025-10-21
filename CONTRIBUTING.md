# Contributing to Traffic CRM

## Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Docker (for local services)

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Key variables:
- `PORT=3002` - Frontend dev server port
- `VITE_APP_API_URL=http://localhost:8787` - Backend API URL
- `VITE_APP_REPORTING_API_URL=http://localhost:8006` - Reporting service URL
- `PLAYWRIGHT_BASE_URL=http://localhost:3002` - E2E test base URL

## Development Workflow

### Running the App
```bash
# Start dev server (port 3002)
npm start

# Start backend services
npm run dev:backend    # Express mock API (port 8787)
npm run dev:reporting  # NestJS reporting (port 8006)
npm run dev:services   # Docker: MailHog, MinIO

# Start everything at once
npm run dev:all
```

### Code Quality Checks

#### Type Checking
```bash
npm run typecheck      # Run TypeScript compiler without emitting files
```

#### Linting
```bash
npm run lint           # All files (JS/JSX/TS/TSX)
npm run lint:ts        # TypeScript files only
npm run lint:fix       # Auto-fix issues
```

#### Formatting
```bash
npm run prettier       # Format all files
```

### Testing

#### E2E Tests (Playwright)
```bash
npm run test:smoke     # Smoke tests only (leads/deals detail & edit)
npm run test:e2e       # All E2E tests
npm run test:e2e:ui    # Interactive UI mode
npm run test:e2e:debug # Debug mode with step-through
```

#### Unit Tests (Jest)
```bash
npm test               # Run all unit tests
npm test -- --watch    # Watch mode
```

## CI/CD Pipeline

### Pre-commit Checks
Before committing, ensure all gates pass:
```bash
npm run typecheck      # ✅ 0 errors
npm run lint           # ✅ 0 errors, 0 warnings
npm run build          # ✅ successful
npm run test:smoke     # ✅ all passing
```

### CI Gates (GitHub Actions)
On every PR and push to `main`:
1. **Type Check** - `tsc --noEmit`
2. **Lint** - ESLint with TypeScript parser
3. **Build** - Production bundle (`vite build`)
4. **E2E Smoke** - Playwright critical flows

**All gates must pass before merge.**

## Pull Request Guidelines

### PR Checklist
- [ ] Code compiles without TypeScript errors
- [ ] ESLint passes with no warnings
- [ ] Production build succeeds
- [ ] E2E smoke tests pass locally
- [ ] New features include tests
- [ ] Documentation updated (if applicable)
- [ ] No console warnings in browser
- [ ] Accessibility considerations addressed

### Commit Messages
Follow conventional commits:
```
feat: add lead detail page
fix: resolve pagination bug in deals table
docs: update API integration guide
test: add E2E test for edit flow
refactor: extract common form validation logic
style: format files with prettier
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Redux Toolkit
- **UI**: Material-UI v5 (Berry theme)
- **Forms**: Formik + Yup
- **Data Grid**: MUI X DataGrid
- **Routing**: React Router v6
- **Testing**: Playwright (E2E), Jest (unit)
- **Build**: Vite 6 with Module Federation

### Port Map
| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3002 | Vite dev server |
| Backend | 8787 | Express mock API |
| Reporting | 8006 | NestJS reporting service |
| MailHog | 8025 | Email testing UI |
| MinIO | 9000/9001 | Object storage (API/Console) |

### Key Routes
- `/leads` - Leads list with search and pagination
- `/leads/:id` - Lead detail view
- `/leads/:id/edit` - Lead edit form
- `/deals` - Deals list with search and pagination
- `/deals/:id` - Deal detail view
- `/deals/:id/edit` - Deal edit form
- `/companies` - Companies list
- `/contacts` - Contacts list

### Project Structure
```
src/
├── api/              # API integration layer
├── components/       # Reusable React components
├── contexts/         # React contexts (auth, config)
├── hooks/            # Custom React hooks
├── layout/           # Layout components (MainLayout, etc.)
├── routes/           # Route definitions
├── services/         # API service modules
├── store/            # Redux store and slices
├── themes/           # MUI theme configuration
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── views/            # Page components
```

## Code Style

### TypeScript
- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes
- Use `readonly` for immutable props
- Enable strict mode flags incrementally
- Avoid `any`; use `unknown` when type is truly unknown

### React
- Functional components with hooks
- Use `useMemo`/`useCallback` for expensive computations
- Prefer `sx` prop over inline styles
- Extract reusable logic into custom hooks
- Use `React.FC` sparingly; prefer explicit prop types

### Forms
- Use Formik for complex forms
- Yup for validation schemas
- Disable submit button when form is pristine
- Show field-level errors on blur
- Percentage fields: normalize to 0-1 for API, display as 0-100

### Testing
- E2E tests for critical user flows (list → detail → edit → save)
- Unit tests for complex business logic
- Mock API responses in E2E tests
- Keep tests idempotent and isolated
- Test error states (404, network failure)

## Troubleshooting

### Port Conflicts
```bash
# Check for port conflicts
npm run check:ports

# Kill process on specific port (macOS)
lsof -ti:3002 | xargs kill -9

# Or use the built-in script
./scripts/check-ports.sh
```

### TypeScript Server Issues
In VS Code/Cursor:
1. `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: "TypeScript: Restart TS Server"
3. Wait for re-indexing

### Playwright Issues
```bash
# Reinstall browsers
npx playwright install --with-deps

# Clear cache and reports
rm -rf playwright-report/ test-results/

# Run with headed browser for debugging
npx playwright test --headed

# Run specific test
npx playwright test e2e/leads-deals-detail.spec.ts
```

### Build Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist
rm -rf dist/ build/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Feature Development Guidelines

### Adding a New Entity (e.g., Tasks)

1. **Define types** (`src/types/api.ts`):
```typescript
export interface Task extends BaseEntity {
  title: string;
  status: TaskStatus;
  // ... other fields
}

export interface TaskQuery extends PaginationQuery {
  status?: TaskStatus;
}
```

2. **Create service** (`src/services/tasks.ts`):
```typescript
export const tasksApi = {
  listTasks: (query: TaskQuery) => apiGet<PaginatedResponse<Task>>('/api/tasks', { params: query }),
  getTask: (id: UUID) => apiGet<Task>(`/api/tasks/${id}`),
  // ... other methods
};
```

3. **Create custom hook** (`src/hooks/useTasks.ts`):
```typescript
export function useTasks(options?: UseTasksOptions): UseTasksResult {
  // Similar pattern to useDeals/useLeads
}
```

4. **Create list page** (`src/views/pages/tasks/TasksListPage.tsx`):
- Use MUI X DataGrid with server-side pagination
- Add search field
- Add refresh button
- Link to detail/edit pages

5. **Add routes** (`src/routes/MainRoutes.tsx`):
```typescript
{
  path: 'tasks',
  children: [
    { path: '', element: <TasksListPage /> },
    { path: ':id', element: <TaskDetailPage /> },
    { path: ':id/edit', element: <TaskEditPage /> }
  ]
}
```

6. **Add E2E tests** (`e2e/tasks-detail.spec.ts`):
- Test list → detail → edit → save flow
- Test 404 handling
- Test network failure retry

## Getting Help
- Check existing issues and PRs on GitHub
- Review documentation in `/docs`
- Ask in team chat for quick questions
- For bugs, provide:
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser console errors
  - Network tab screenshots (if API-related)

## License
This project is proprietary. See LICENSE file for details.

