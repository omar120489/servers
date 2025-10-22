# Vite Berry Standardization Guide

This document outlines the standardization process for our Vite + React + Berry Material CRM application.

## 🎯 Goal

Maintain a working Vite/React application while:
- Removing unused legacy Berry components
- Standardizing on modern patterns (AppPage, URL filters, exports, RBAC)
- Keeping the app running without breaking changes
- Ensuring team consistency through enforced standards

---

## 📋 Current Architecture

**Framework:** Vite 7 + React 19 + TypeScript  
**UI Library:** Material-UI v7 (Berry Theme)  
**Routing:** React Router v7  
**State:** Redux Toolkit 2.9

**Keep These:**
- ✅ `index.html` - Vite entry point
- ✅ `vite.config.mjs` - Build configuration
- ✅ `src/main.tsx` - Application entry
- ✅ `src/views/` - Page components
- ✅ `src/layout/` - MainLayout shell
- ✅ `src/themes/` - MUI theme configuration
- ✅ `src/routes/` - React Router configuration

---

## 🧹 Cleanup Process

### Step 1: Run the Safe Cleanup Script

```bash
# From project root
./scripts/vite_berry_cleanup.sh
```

**What it does:**
- Creates a new branch with timestamp
- Backs up `src/` directory
- Removes legacy/demo/unused files
- Cleans duplicate layouts and themes
- Clears caches
- Reinstalls dependencies

**What it DOES NOT touch:**
- Vite configuration files
- Working page components
- Essential Berry theme files
- Your custom feature code

### Step 2: Find Remaining Leftovers

```bash
./scripts/find_berry_leftovers.sh
```

Review the output and migrate any remaining old patterns.

---

## 🏗️ Standard Project Structure

```
src/
├── core/                           # Shared core modules
│   ├── app-page/
│   │   └── AppPage.tsx            # Standard page shell
│   ├── filters/
│   │   └── useUrlQuery.ts         # URL-driven filters (React Router)
│   ├── export/
│   │   ├── csv.ts
│   │   ├── xlsx.ts
│   │   └── pdf.ts
│   └── rbac/
│       └── permissions.ts
├── data/                           # Data layer
│   ├── clients/
│   │   └── axios.ts
│   └── hooks/
│       ├── useContactsList.ts
│       ├── useLeadsList.ts
│       └── useDealsList.ts
├── features/                       # Feature modules
│   ├── contacts/
│   │   ├── model.ts
│   │   ├── ContactsList.tsx
│   │   └── ContactDetail.tsx
│   ├── leads/
│   └── deals/
├── views/pages/                    # Page routes (keep existing)
├── layout/                         # App shell (keep MainLayout)
├── themes/                         # MUI theme (keep current)
├── contexts/                       # React contexts
└── utils/                          # Utilities
```

---

## 📄 AppPage Standard

**Every page must use `AppPage` wrapper:**

```tsx
import AppPage from '@/core/app-page/AppPage';

export default function ContactsListPage() {
  const { data, loading, error } = useContactsList();
  
  return (
    <AppPage
      title="Contacts"
      loading={loading}
      error={error}
      empty={data.length === 0}
      emptyMessage="No contacts found"
      actions={
        <Button variant="contained">
          New Contact
        </Button>
      }
      toolbar={
        <Stack direction="row" spacing={2}>
          <SearchField />
          <FilterButton />
          <ExportMenu />
        </Stack>
      }
    >
      {/* Page content */}
      <DataGrid rows={data} columns={columns} />
    </AppPage>
  );
}
```

**Benefits:**
- ✅ Consistent loading/error/empty states
- ✅ Standard toolbar positioning
- ✅ Enforces no horizontal scroll
- ✅ Container width management
- ✅ Accessibility built-in

---

## 🔍 URL-Driven Filters

**Use `useUrlQuery` for all filters/pagination/sort:**

```tsx
import { useUrlQuery } from '@/core/filters/useUrlQuery';

export default function ContactsListPage() {
  const { query, setQuery } = useUrlQuery({
    page: 1,
    size: 10,
    search: '',
    sort: 'name',
    order: 'asc'
  });

  const handleSearch = (value: string) => {
    setQuery({ search: value, page: 1 }); // Reset to page 1
  };

  return (
    <AppPage title="Contacts">
      {/* Search syncs with URL */}
      <SearchField value={query.search} onChange={handleSearch} />
      <DataGrid 
        page={query.page}
        pageSize={query.size}
        onPaginationChange={setQuery}
      />
    </AppPage>
  );
}
```

**Benefits:**
- ✅ Shareable links with filters
- ✅ Browser back/forward works
- ✅ Bookmark-friendly URLs
- ✅ Consistent state management

---

## 📤 Export Standard

**Use `core/export` for all exports:**

```tsx
import { exportToCSV, exportToXLSX, exportToPDF } from '@/core/export';

const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
  const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' }
  ];
  
  switch (format) {
    case 'csv':
      exportToCSV(data, columns, 'contacts.csv');
      break;
    case 'xlsx':
      exportToXLSX(data, columns, 'contacts.xlsx');
      break;
    case 'pdf':
      exportToPDF(data, columns, 'contacts.pdf', 'Contacts Report');
      break;
  }
};
```

---

## 🔐 RBAC Standard

**Gate actions based on permissions:**

```tsx
import { usePermissions } from '@/core/rbac/permissions';

export default function ContactsListPage() {
  const { can } = usePermissions();
  
  return (
    <AppPage
      title="Contacts"
      actions={
        can('contacts:create') && (
          <Button variant="contained">New Contact</Button>
        )
      }
    >
      <DataGrid
        rows={data}
        columns={[
          // ...
          {
            field: 'actions',
            renderCell: (params) => (
              <>
                {can('contacts:edit') && <EditButton />}
                {can('contacts:delete') && <DeleteButton />}
              </>
            )
          }
        ]}
      />
    </AppPage>
  );
}
```

---

## 🚨 ESLint Rules

Add to `.eslintrc.js` or `eslint.config.mjs`:

```js
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "ui-component/cards/MainCard",
            "message": "Use AppPage for page chrome instead."
          }
        ]
      }
    ]
  }
}
```

---

## ✅ PR Checklist

Before submitting a PR, ensure:

- [ ] Uses `AppPage` (no `MainCard` in page files)
- [ ] URL-driven filters/pagination (`useUrlQuery`)
- [ ] Loading/Error/Empty via `AppPage` props
- [ ] Exports via `core/export`
- [ ] RBAC on gated actions (if applicable)
- [ ] No horizontal scroll @ 1440/1024/768/375px
- [ ] TypeScript: No `any` types
- [ ] ESLint: No warnings
- [ ] Tests pass

---

## 🎨 Theme Alignment

Keep your current Berry theme but ensure:

1. **CSS Variables** (MUI v7):
   ```tsx
   // src/themes/index.tsx
   <ThemeProvider theme={theme}>
     <CssVarsProvider theme={theme}>
       {children}
     </CssVarsProvider>
   </ThemeProvider>
   ```

2. **Container Width**:
   ```tsx
   // MainLayout should enforce max width
   sx={{
     maxWidth: { xl: 1200 },
     margin: '0 auto'
   }}
   ```

3. **No Horizontal Scroll**:
   ```tsx
   // MainLayout content area
   sx={{
     overflowX: 'hidden',
     width: '100%'
   }}
   ```

---

## 🔄 Migration Path

### Phase 1: Foundation (Week 1)
- [x] Run cleanup scripts
- [ ] Set up `core/` modules (AppPage, filters, export, RBAC)
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Add ESLint rules

### Phase 2: Migrate Pages (Week 2-3)
- [ ] Contacts page → AppPage
- [ ] Leads page → AppPage
- [ ] Deals page → AppPage
- [ ] Companies page → AppPage
- [ ] Analytics page → AppPage

### Phase 3: Polish (Week 4)
- [ ] Remove old `ui-component/cards/MainCard`
- [ ] Audit all imports
- [ ] Document custom patterns
- [ ] Team training session

---

## 📚 Resources

- **Berry Admin Pro**: [Live Demo](https://berrydashboard.io)
- **Material-UI v7**: [Documentation](https://mui.com)
- **React Router v7**: [Documentation](https://reactrouter.com)
- **Vite**: [Documentation](https://vitejs.dev)

---

## 🆘 Help

If you encounter issues:
1. Check the backup created by cleanup script
2. Review git diff to see what changed
3. Revert with: `git checkout <previous-branch>`
4. Contact the team lead for guidance

---

**Last Updated:** October 22, 2025  
**Version:** 1.0.0

