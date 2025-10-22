# 🏗️ Page Architecture Plan - Berry Frame Migration

**Complete structural blueprint for all 14 pages**

---

## 📋 Table of Contents

1. [List Pages (4)](#list-pages)
   - Contacts List
   - Leads List
   - Deals List
   - Companies List
2. [Detail Pages (4)](#detail-pages)
   - Lead Detail
   - Deal Detail
   - Lead Detail Page
   - Deal Detail Page
3. [Edit Pages (2)](#edit-pages)
   - Lead Edit
   - Deal Edit
4. [Dashboard Pages (2)](#dashboard-pages)
   - Analytics Dashboard
   - Sample Page
5. [Completed Pages (2)](#completed-pages)
   - P&L Analytics ✅
   - Notifications ✅

---

## 🎯 Standard AppPage Structure

Every page follows this pattern:

```tsx
<AppPage
  title="Page Title"
  subtitle="Optional description"
  breadcrumbs={<Breadcrumbs>...</Breadcrumbs>}  // Optional
  actions={<ActionsComponent />}                 // Top-right buttons
  toolbar={<ToolbarComponent />}                 // Filters, search, etc.
  loading={loading}                              // Boolean
  error={error}                                  // String | Error | null
  empty={isEmpty}                                // Boolean
  emptySlot={<CustomEmpty />}                    // Optional custom empty
  loadingSlot={<CustomLoading />}                // Optional custom loading
  errorSlot={<CustomError />}                    // Optional custom error
  footer={<FooterComponent />}                   // Pagination, etc.
  onRetry={handleRetry}                          // Retry function
>
  {/* Main content - only renders when data is ready */}
</AppPage>
```

---

# 1. LIST PAGES

## 1.1 Contacts List Page

**Route**: `/contacts`  
**File**: `src/views/pages/contacts/ContactsListPage.tsx`  
**Complexity**: ⭐⭐ Medium  
**Estimated Time**: 45-60 minutes

### **Current Structure** (❌ Before)

```
ContactsListPage
└── MainCard (title="Contacts", content=false)
    └── Box (p: 3, gap: 2)
        ├── Box (Search + Actions)
        │   ├── TextField (search, fullWidth)
        │   └── Box (buttons)
        │       ├── Button (Refresh)
        │       └── Button (New Contact)
        │
        ├── Chip (Active filters, conditional)
        │
        ├── Alert (error, conditional)
        │
        └── div (width: 100%)
            └── DataGrid
                ├── columns: [name, email, phone, title, companyId, updatedAt, actions]
                ├── rows: contacts
                ├── pagination: server-side
                └── loading state
```

### **Future Structure** (✅ After)

```tsx
ContactsListPage
└── AppPage
    ├── Props:
    │   ├── title: "Contacts"
    │   ├── subtitle: "Manage your contact database"
    │   ├── actions: <ActionsComponent />
    │   ├── toolbar: <ToolbarComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {contacts.length === 0}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── Button (Export) → ExportMenu
    │   ├── Button (Refresh, icon, onClick: refetch)
    │   └── Button (New Contact, contained, Link to /contacts/new)
    │
    ├── ToolbarComponent:
    │   └── Paper (p: 2)
    │       └── Grid container (spacing: 2)
    │           ├── Grid item (xs: 12, md: 6) → TextField (Search)
    │           ├── Grid item (xs: 12, md: 3) → TextField (Date From)
    │           ├── Grid item (xs: 12, md: 3) → TextField (Date To)
    │           └── Grid item (xs: 12) → Stack (Apply/Clear buttons)
    │
    └── Children (Content):
        └── Box (width: 100%)
            └── DataGrid
                ├── autoHeight
                ├── disableColumnMenu
                ├── disableRowSelectionOnClick
                ├── rows: contacts
                ├── columns: 7 columns
                ├── paginationMode: "server"
                ├── paginationModel: {page, pageSize}
                ├── onPaginationModelChange
                ├── rowCount: total
                └── pageSizeOptions: [5, 10, 25, 50]
```

### **Props Breakdown**

```tsx
// Actions
const actions = (
  <>
    <ExportMenu
      onExportCSV={handleExportCSV}
      onExportXLSX={handleExportXLSX}
      onExportPDF={handleExportPDF}
      disabled={loading || contacts.length === 0}
    />
    <Button
      variant="outlined"
      startIcon={<RefreshIcon />}
      onClick={refetch}
      disabled={loading}
    >
      Refresh
    </Button>
    <Button
      variant="contained"
      startIcon={<PersonAddAltIcon />}
      component={RouterLink}
      to="/contacts/new"
    >
      New Contact
    </Button>
  </>
);

// Toolbar
const toolbar = (
  <Paper sx={{ p: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={query.search ?? ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          size="small"
          type="date"
          label="Date From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          size="small"
          type="date"
          label="Date To"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters} disabled={!hasActiveFilters}>
            Clear All
          </Button>
        </Stack>
      </Grid>
    </Grid>
  </Paper>
);
```

### **Key Changes**

| Before | After |
|--------|-------|
| `<MainCard title="Contacts">` | `<AppPage title="Contacts" subtitle="...">` |
| Search in main content area | Search in `toolbar` prop |
| Manual error/loading handling | Automatic via `loading` & `error` props |
| Active filters chip manually placed | Could move to toolbar badge |
| Buttons in content area | Buttons in `actions` prop |

---

## 1.2 Leads List Page

**Route**: `/leads`  
**File**: `src/views/pages/leads/LeadsListPage.tsx`  
**Complexity**: ⭐⭐⭐ Medium-High  
**Estimated Time**: 45-60 minutes

### **Current Structure** (❌ Before)

```
LeadsListPage
└── MainCard (title="Leads", content=false)
    └── Box (p: 3, gap: 2)
        ├── Box (Search + Actions)
        │   ├── TextField (search)
        │   └── Stack
        │       ├── ExportMenu
        │       ├── Button (Refresh)
        │       └── Button (New Lead)
        │
        ├── FilterPanel
        │   ├── filters: [status, source, dateRange, owner, stage]
        │   ├── values: filterValues
        │   ├── onChange: setFilterValues
        │   ├── onApply: handleApplyFilters
        │   ├── onClear: handleClearFilters
        │   ├── showPresets: true
        │   └── presets: savedPresets
        │
        ├── Alert (error, conditional)
        │
        └── Paper
            ├── LinearProgress (loading, conditional)
            ├── TableContainer
            │   └── Table
            │       ├── TableHead (8 columns)
            │       └── TableBody (lead rows)
            └── TablePagination
```

### **Future Structure** (✅ After)

```tsx
LeadsListPage
└── AppPage
    ├── Props:
    │   ├── title: "Leads"
    │   ├── subtitle: "Manage and track your sales leads"
    │   ├── actions: <ActionsComponent />
    │   ├── toolbar: <ToolbarComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {leads.length === 0}
    │   ├── footer: <TablePagination />
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── ExportMenu (CSV/XLSX/PDF)
    │   ├── Button (Refresh)
    │   └── Button (New Lead, contained)
    │
    ├── ToolbarComponent:
    │   ├── TextField (Search with icon)
    │   └── FilterPanel
    │       ├── filters: 5 filter configs
    │       ├── values: filterValues
    │       ├── onChange: setFilterValues
    │       ├── onApply: handleApplyFilters
    │       ├── onClear: handleClearFilters
    │       ├── showPresets: true
    │       └── presets: savedPresets
    │
    ├── Children (Content):
    │   └── TableContainer (component: Paper, overflowX: auto)
    │       └── Table
    │           ├── TableHead
    │           │   └── TableRow (8 columns)
    │           └── TableBody
    │               └── TableRow[] (lead data)
    │
    └── Footer:
        └── TablePagination
            ├── count: total
            ├── page: currentPage
            ├── onPageChange: handlePageChange
            ├── rowsPerPage: pageSize
            └── onRowsPerPageChange: handlePageSizeChange
```

### **Props Breakdown**

```tsx
// Actions
const actions = (
  <>
    <ExportMenu
      onExportCSV={() => handleExport('csv')}
      onExportXLSX={() => handleExport('xlsx')}
      onExportPDF={() => handleExport('pdf')}
      disabled={loading || leads.length === 0}
    />
    <Button
      variant="outlined"
      startIcon={<RefreshIcon />}
      onClick={refetch}
      disabled={loading}
    >
      Refresh
    </Button>
    <Button
      variant="contained"
      startIcon={<PersonAddIcon />}
      component={RouterLink}
      to="/leads/new"
    >
      New Lead
    </Button>
  </>
);

// Toolbar
const toolbar = (
  <Stack spacing={2}>
    <TextField
      fullWidth
      size="small"
      placeholder="Search leads..."
      value={searchQuery}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
    <FilterPanel
      filters={FILTER_CONFIG}
      values={filterValues}
      onChange={setFilterValues}
      onApply={handleApplyFilters}
      onClear={handleClearFilters}
      showPresets
      presets={savedPresets}
      onSavePreset={handleSavePreset}
      onLoadPreset={handleLoadPreset}
    />
  </Stack>
);

// Filter Config
const FILTER_CONFIG: FilterConfig[] = [
  {
    label: 'Status',
    type: 'single-select',
    field: 'status',
    options: [
      { value: 'new', label: 'New' },
      { value: 'contacted', label: 'Contacted' },
      { value: 'qualified', label: 'Qualified' },
      { value: 'working', label: 'Working' },
      { value: 'converted', label: 'Converted' },
      { value: 'unqualified', label: 'Unqualified' }
    ]
  },
  {
    label: 'Source',
    type: 'multi-select',
    field: 'source',
    options: [
      { value: 'website', label: 'Website' },
      { value: 'referral', label: 'Referral' },
      { value: 'social', label: 'Social Media' },
      { value: 'email', label: 'Email Campaign' }
    ]
  },
  {
    label: 'Created Date',
    type: 'date-range',
    field: 'createdDate'
  },
  {
    label: 'Owner',
    type: 'single-select',
    field: 'ownerId',
    options: ownerOptions  // Loaded dynamically
  },
  {
    label: 'Stage',
    type: 'single-select',
    field: 'stage',
    options: [
      { value: 'qualification', label: 'Qualification' },
      { value: 'meeting', label: 'Meeting' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'negotiation', label: 'Negotiation' }
    ]
  }
];

// Footer
const footer = (
  <TablePagination
    component="div"
    count={data?.total ?? 0}
    page={page}
    onPageChange={handlePageChange}
    rowsPerPage={pageSize}
    onRowsPerPageChange={handlePageSizeChange}
    rowsPerPageOptions={[10, 25, 50, 100]}
  />
);
```

### **Key Changes**

| Before | After |
|--------|-------|
| `<MainCard>` wrapper | `<AppPage>` wrapper |
| ExportMenu in content | ExportMenu in `actions` |
| FilterPanel in content | FilterPanel in `toolbar` |
| Search field separate | Search in `toolbar` above FilterPanel |
| TablePagination after table | TablePagination in `footer` prop |
| LinearProgress for loading | Handled by `loading` prop |

---

## 1.3 Deals List Page

**Route**: `/deals`  
**File**: `src/views/pages/deals/DealsListPage.tsx`  
**Complexity**: ⭐⭐⭐ Medium-High  
**Estimated Time**: 45-60 minutes

### **Current Structure** (❌ Before)

```
DealsListPage
└── MainCard (title="Deals", content=false)
    └── Box (p: 3, gap: 2)
        ├── Box (Search + Actions)
        │   ├── TextField (search)
        │   └── Stack
        │       ├── ExportMenu
        │       ├── Button (Refresh)
        │       └── Button (New Deal)
        │
        ├── FilterPanel (status, stage, value range, date, owner)
        │
        ├── Alert (error, conditional)
        │
        └── div (width: 100%)
            └── DataGrid
                ├── columns: 9 columns (name, company, value, stage, probability, close date, owner, status, actions)
                ├── rows: deals
                ├── pagination: server-side
                ├── getRowId: (row) => row.id
                └── custom cell renderers (currency, percentage, date, chip)
```

### **Future Structure** (✅ After)

```tsx
DealsListPage
└── AppPage
    ├── Props:
    │   ├── title: "Deals"
    │   ├── subtitle: "Track your sales pipeline and deals"
    │   ├── actions: <ActionsComponent />
    │   ├── toolbar: <ToolbarComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {deals.length === 0}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── ExportMenu (CSV/XLSX/PDF)
    │   ├── Button (Refresh)
    │   └── Button (New Deal, contained)
    │
    ├── ToolbarComponent:
    │   ├── TextField (Search)
    │   └── FilterPanel
    │       ├── filters: [stage, status, value_range, close_date, owner]
    │       ├── showPresets: true
    │       └── presets: savedPresets
    │
    └── Children (Content):
        └── Box (width: 100%)
            └── DataGrid
                ├── autoHeight
                ├── columns: 9 custom columns
                ├── rows: deals
                ├── paginationMode: "server"
                ├── rowCount: total
                └── custom renderCell for currency/percentage/chips
```

### **Props Breakdown**

```tsx
// Filter Config
const FILTER_CONFIG: FilterConfig[] = [
  {
    label: 'Stage',
    type: 'multi-select',
    field: 'stage',
    options: [
      { value: 'qualification', label: 'Qualification' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'closed_won', label: 'Closed Won' },
      { value: 'closed_lost', label: 'Closed Lost' }
    ]
  },
  {
    label: 'Status',
    type: 'single-select',
    field: 'status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'on_hold', label: 'On Hold' },
      { value: 'closed', label: 'Closed' }
    ]
  },
  {
    label: 'Deal Value',
    type: 'number-range',
    field: 'value'
  },
  {
    label: 'Close Date',
    type: 'date-range',
    field: 'closeDate'
  },
  {
    label: 'Owner',
    type: 'single-select',
    field: 'ownerId',
    options: ownerOptions
  }
];

// DataGrid Columns
const columns: GridColDef<Deal>[] = [
  {
    field: 'name',
    headerName: 'Deal Name',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Box>
        <Typography variant="subtitle2" noWrap>
          {params.row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {params.row.companyName}
        </Typography>
      </Box>
    )
  },
  {
    field: 'value',
    headerName: 'Value',
    width: 130,
    renderCell: (params) => (
      <Typography fontWeight={600}>
        {formatCurrency(params.row.value)}
      </Typography>
    )
  },
  {
    field: 'stage',
    headerName: 'Stage',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.row.stage}
        size="small"
        color={getStageColor(params.row.stage)}
      />
    )
  },
  {
    field: 'probability',
    headerName: 'Probability',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={params.row.probability || 0}
          sx={{ width: 60 }}
        />
        <Typography variant="body2">
          {params.row.probability}%
        </Typography>
      </Box>
    )
  },
  {
    field: 'closeDate',
    headerName: 'Close Date',
    width: 120,
    renderCell: (params) => formatDate(params.row.closeDate)
  },
  {
    field: 'ownerId',
    headerName: 'Owner',
    width: 130
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.row.status}
        size="small"
        variant="outlined"
        color={getStatusColor(params.row.status)}
      />
    )
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          component={RouterLink}
          to={`/deals/${params.row.id}`}
        >
          View
        </Button>
        <Button
          size="small"
          color="secondary"
          component={RouterLink}
          to={`/deals/${params.row.id}/edit`}
        >
          Edit
        </Button>
      </Stack>
    )
  }
];
```

### **Key Changes**

| Before | After |
|--------|-------|
| `<MainCard>` wrapper | `<AppPage>` wrapper |
| Complex manual layout | Clean `actions` + `toolbar` + `children` |
| FilterPanel in content | FilterPanel in `toolbar` |
| DataGrid in div | DataGrid in `children` with proper container |
| Export menu scattered | Export menu in `actions` |

---

## 1.4 Companies List Page

**Route**: `/companies`  
**File**: `src/views/pages/companies/CompaniesListPage.tsx`  
**Complexity**: ⭐⭐ Medium  
**Estimated Time**: 30-45 minutes

### **Future Structure** (✅ After)

```tsx
CompaniesListPage
└── AppPage
    ├── Props:
    │   ├── title: "Companies"
    │   ├── subtitle: "Manage company accounts"
    │   ├── actions: <ActionsComponent />
    │   ├── toolbar: <ToolbarComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {companies.length === 0}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── Button (Refresh)
    │   └── Button (New Company, contained)
    │
    ├── ToolbarComponent:
    │   └── Paper (p: 2)
    │       └── Grid container
    │           ├── TextField (Search)
    │           ├── Select (Industry)
    │           ├── Select (Size)
    │           └── Buttons (Apply/Clear)
    │
    └── Children (Content):
        ├── Grid container (spacing: 3)
        │   └── Grid items (xs: 12, sm: 6, md: 4, lg: 3)
        │       └── Card[] (Company cards)
        │           ├── CardContent
        │           │   ├── Avatar (company logo)
        │           │   ├── Typography (company name)
        │           │   ├── Chips (industry, size)
        │           │   └── Typography (contact count, deals count)
        │           └── CardActions
        │               ├── Button (View)
        │               └── Button (Edit)
        │
        └── Pagination (centered)
```

**Simpler** than Leads/Deals because:
- No FilterPanel (basic filters only)
- Card grid instead of table
- Fewer columns/fields

---

# 2. DETAIL PAGES

## 2.1 Lead Detail Page

**Route**: `/leads/:id`  
**File**: `src/views/leads/LeadDetail.tsx`  
**Complexity**: ⭐⭐⭐⭐ High  
**Estimated Time**: 90-120 minutes

### **Future Structure** (✅ After)

```tsx
LeadDetailPage
└── AppPage
    ├── Props:
    │   ├── title: {lead.firstName} {lead.lastName}
    │   ├── subtitle: Lead ID: {id} • Created: {formatDate(lead.createdAt)}
    │   ├── breadcrumbs: Home > Leads > {lead.name}
    │   ├── actions: <ActionsComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {!lead}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── Button (Convert to Deal)
    │   ├── Button (Edit, Link to /leads/:id/edit)
    │   ├── Button (Delete, color: error)
    │   └── IconButton (More options menu)
    │
    └── Children (Content):
        ├── Tabs (value: activeTab, onChange: handleTabChange)
        │   ├── Tab (label: "Details")
        │   ├── Tab (label: "Activity")
        │   ├── Tab (label: "Notes")
        │   ├── Tab (label: "Attachments")
        │   └── Tab (label: "History")
        │
        └── TabPanel (value: activeTab)
            │
            ├── [Tab 0] Details Tab:
            │   ├── Grid container (spacing: 3)
            │   │   ├── Grid item (xs: 12, md: 8)
            │   │   │   ├── Paper (Lead Information)
            │   │   │   │   ├── Stack (Contact Details)
            │   │   │   │   ├── Divider
            │   │   │   │   ├── Stack (Company Details)
            │   │   │   │   ├── Divider
            │   │   │   │   └── Stack (Lead Details: status, source, score)
            │   │   │   │
            │   │   │   └── Paper (Custom Fields)
            │   │   │       └── Grid (key-value pairs)
            │   │   │
            │   │   └── Grid item (xs: 12, md: 4)
            │   │       ├── Paper (Quick Stats)
            │   │       │   ├── Stat (Activities)
            │   │       │   ├── Stat (Notes)
            │   │       │   ├── Stat (Attachments)
            │   │       │   └── Stat (Age)
            │   │       │
            │   │       ├── Paper (Stage Progress)
            │   │       │   └── Stepper (vertical, active: currentStage)
            │   │       │
            │   │       └── Paper (Assigned To)
            │   │           ├── Avatar (owner)
            │   │           └── Typography (owner name, email)
            │   │
            │   └── Paper (Timeline Preview)
            │       └── List (recent 5 activities)
            │
            ├── [Tab 1] Activity Tab:
            │   └── Box
            │       ├── Button (Log Activity)
            │       └── Timeline
            │           └── TimelineItem[] (activities with icons, timestamps)
            │
            ├── [Tab 2] Notes Tab:
            │   └── Box
            │       ├── TextField (Add Note, multiline)
            │       ├── Button (Save Note)
            │       └── Stack (Note Cards)
            │           └── Card[] (notes with author, date, edit/delete)
            │
            ├── [Tab 3] Attachments Tab:
            │   └── Box
            │       ├── Button (Upload File)
            │       └── Grid (Attachment Cards)
            │           └── Card[] (file icon, name, size, download/delete)
            │
            └── [Tab 4] History Tab:
                └── TableContainer
                    └── Table
                        ├── TableHead (Date, User, Action, Details)
                        └── TableBody (Audit log entries)
```

### **Props Breakdown**

```tsx
// Actions
const actions = (
  <>
    <Button
      variant="contained"
      color="success"
      startIcon={<IconArrowRight />}
      onClick={handleConvertToDeal}
      disabled={lead.status === 'converted'}
    >
      Convert to Deal
    </Button>
    <Button
      variant="outlined"
      startIcon={<IconEdit />}
      component={RouterLink}
      to={`/leads/${id}/edit`}
    >
      Edit
    </Button>
    <Button
      variant="outlined"
      color="error"
      startIcon={<IconTrash />}
      onClick={handleDelete}
    >
      Delete
    </Button>
    <IconButton onClick={handleMenuOpen}>
      <IconDotsVertical />
    </IconButton>
    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
      <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
      <MenuItem onClick={handleAssignTo}>Assign To...</MenuItem>
      <MenuItem onClick={handleMerge}>Merge with...</MenuItem>
    </Menu>
  </>
);

// Breadcrumbs
const breadcrumbs = (
  <>
    <Link component={RouterLink} to="/" underline="hover" color="inherit">
      Home
    </Link>
    <Link component={RouterLink} to="/leads" underline="hover" color="inherit">
      Leads
    </Link>
    <Typography color="text.primary">
      {lead.firstName} {lead.lastName}
    </Typography>
  </>
);
```

### **Key Features**

- **Tabs** for different sections (keep in children, not toolbar)
- **Timeline** component for activity history
- **Stepper** for stage progression
- **CRUD operations** for notes/attachments
- **Audit log** in history tab
- **Quick stats** sidebar
- **Convert to Deal** workflow

---

## 2.2 Deal Detail Page

**Route**: `/deals/:id`  
**File**: `src/views/deals/DealDetail.tsx`  
**Complexity**: ⭐⭐⭐⭐ High  
**Estimated Time**: 90-120 minutes

### **Future Structure** (✅ After)

Similar to Lead Detail, but with deal-specific features:

```tsx
DealDetailPage
└── AppPage
    ├── Props:
    │   ├── title: {deal.name}
    │   ├── subtitle: Value: {formatCurrency(deal.value)} • Close Date: {formatDate(deal.closeDate)}
    │   ├── breadcrumbs: Home > Deals > {deal.name}
    │   ├── actions: <ActionsComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {!deal}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── Button (Mark as Won, color: success)
    │   ├── Button (Mark as Lost, color: error)
    │   ├── Button (Edit)
    │   └── Button (Delete)
    │
    └── Children (Content):
        ├── Tabs
        │   ├── Tab (Details)
        │   ├── Tab (Activity)
        │   ├── Tab (Products)  ← Deal-specific
        │   ├── Tab (Documents)
        │   └── Tab (History)
        │
        └── TabPanel
            │
            ├── [Tab 0] Details Tab:
            │   ├── Grid container
            │   │   ├── Grid item (xs: 12, md: 8)
            │   │   │   ├── Paper (Deal Information)
            │   │   │   │   ├── Stack (Basic Details: name, company, contact)
            │   │   │   │   ├── Divider
            │   │   │   │   ├── Stack (Financial: value, probability, expected revenue)
            │   │   │   │   ├── Divider
            │   │   │   │   └── Stack (Timeline: created, updated, close date)
            │   │   │   │
            │   │   │   └── Paper (Stage Pipeline)
            │   │   │       └── Stepper (horizontal)
            │   │   │           ├── Step (Qualification) [completed]
            │   │   │           ├── Step (Proposal) [completed]
            │   │   │           ├── Step (Negotiation) [active]
            │   │   │           └── Step (Closed) [pending]
            │   │   │
            │   │   └── Grid item (xs: 12, md: 4)
            │   │       ├── Paper (Deal Value Breakdown)
            │   │       │   ├── Typography (Total: $50,000)
            │   │       │   ├── Chip (Probability: 75%)
            │   │       │   └── Typography (Expected: $37,500)
            │   │       │
            │   │       ├── Paper (Next Steps)
            │   │       │   └── Checklist
            │   │       │       ├── CheckboxListItem (Send proposal)
            │   │       │       ├── CheckboxListItem (Schedule demo)
            │   │       │       └── CheckboxListItem (Follow up call)
            │   │       │
            │   │       └── Paper (Deal Team)
            │   │           ├── AvatarGroup (team members)
            │   │           └── Button (Add Member)
            │   │
            │   └── Paper (Related Contacts)
            │       └── DataGrid (contacts associated with deal)
            │
            ├── [Tab 1] Activity Tab:
            │   └── Similar to Lead Detail
            │
            ├── [Tab 2] Products Tab:  ← DEAL-SPECIFIC
            │   └── Box
            │       ├── Button (Add Product)
            │       ├── TableContainer
            │       │   └── Table
            │       │       ├── TableHead (Product, Quantity, Price, Discount, Total)
            │       │       └── TableBody (Product line items)
            │       └── Paper (Summary)
            │           ├── Subtotal: $45,000
            │           ├── Discount: -$5,000
            │           ├── Tax: $2,500
            │           └── Total: $42,500
            │
            ├── [Tab 3] Documents Tab:
            │   └── Similar to Attachments in Lead Detail
            │
            └── [Tab 4] History Tab:
                └── Similar to Lead Detail
```

### **Deal-Specific Features**

- **Value calculation** with probability
- **Stage pipeline** visualization (Stepper)
- **Products tab** with line items
- **Win/Loss** buttons in actions
- **Next steps checklist**
- **Deal team** management
- **Related contacts** grid

---

## 2.3 & 2.4 Lead/Deal Detail Page (Wrappers)

**Files**: 
- `src/views/pages/leads/LeadDetailPage.tsx`
- `src/views/pages/deals/DealDetailPage.tsx`

**Complexity**: ⭐ Low  
**Estimated Time**: 30-45 minutes each

These might be **wrappers** or **duplicates** of the main detail pages. Need to check if they:
1. Are identical → Remove duplicates
2. Serve different purposes → Migrate both

**Likely Structure** (if they're simplified versions):

```tsx
SimplifiedDetailPage
└── AppPage
    ├── Props:
    │   ├── title: {item.name}
    │   ├── actions: <Button>Edit</Button><Button>Delete</Button>
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   └── empty: {!item}
    │
    └── Children:
        └── Grid container
            └── Paper (Basic info only, no tabs)
```

---

# 3. EDIT PAGES

## 3.1 Lead Edit Page

**Route**: `/leads/:id/edit`  
**File**: `src/views/pages/leads/LeadEditPage.tsx`  
**Complexity**: ⭐⭐⭐ Medium-High  
**Estimated Time**: 60-90 minutes

### **Future Structure** (✅ After)

```tsx
LeadEditPage
└── AppPage
    ├── Props:
    │   ├── title: `Edit Lead: ${lead.firstName} ${lead.lastName}`
    │   ├── subtitle: Lead ID: {id}
    │   ├── breadcrumbs: Home > Leads > {lead.name} > Edit
    │   ├── actions: <ActionsComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {!lead}
    │   └── onRetry: {refetch}
    │
    ├── ActionsComponent:
    │   ├── Button (Cancel, variant: outlined, Link to /leads/:id)
    │   ├── Button (Save Draft, variant: outlined, onClick: handleSaveDraft)
    │   └── Button (Save Changes, variant: contained, onClick: handleSave, loading: saving)
    │
    └── Children (Content):
        └── Paper (p: 3)
            └── form (onSubmit: handleSubmit)
                ├── Typography (variant: h6, mb: 2) "Lead Information"
                ├── Grid container (spacing: 3)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (First Name, required, error, helperText)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Last Name, required)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Email, type: email, required)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Phone, type: tel)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Company)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Title/Position)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── Select (Status, required, options: statusOptions)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── Select (Source, options: sourceOptions)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── Autocomplete (Owner, options: users)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (Lead Score, type: number, min: 0, max: 100)
                │   └── Grid item (xs: 12)
                │       └── TextField (Notes, multiline, rows: 4)
                │
                ├── Divider (my: 3)
                │
                ├── Typography (variant: h6, mb: 2) "Address"
                ├── Grid container (spacing: 3)
                │   ├── Grid item (xs: 12)
                │   │   └── TextField (Street Address)
                │   ├── Grid item (xs: 12, md: 6)
                │   │   └── TextField (City)
                │   ├── Grid item (xs: 12, md: 3)
                │   │   └── TextField (State/Province)
                │   ├── Grid item (xs: 12, md: 3)
                │   │   └── TextField (Postal Code)
                │   └── Grid item (xs: 12)
                │       └── Select (Country, options: countries)
                │
                ├── Divider (my: 3)
                │
                ├── Typography (variant: h6, mb: 2) "Custom Fields"
                └── Grid container (spacing: 3)
                    └── Grid items[] (dynamically rendered custom fields)
```

### **Props Breakdown**

```tsx
// Actions
const actions = (
  <>
    <Button
      variant="outlined"
      component={RouterLink}
      to={`/leads/${id}`}
      disabled={saving}
    >
      Cancel
    </Button>
    <Button
      variant="outlined"
      onClick={handleSaveDraft}
      disabled={saving}
    >
      Save Draft
    </Button>
    <Button
      variant="contained"
      onClick={handleSave}
      disabled={!isFormValid || saving}
      startIcon={saving ? <CircularProgress size={20} /> : <IconDeviceFloppy />}
    >
      {saving ? 'Saving...' : 'Save Changes'}
    </Button>
  </>
);

// Form validation
const validationErrors = useMemo(() => {
  const errors: { [key: string]: string } = {};
  if (!formData.firstName) errors.firstName = 'First name is required';
  if (!formData.lastName) errors.lastName = 'Last name is required';
  if (!formData.email) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
  if (!formData.status) errors.status = 'Status is required';
  return errors;
}, [formData]);

const isFormValid = Object.keys(validationErrors).length === 0;
```

### **Key Features**

- **Form validation** with error messages
- **Save/Cancel/Draft** actions
- **Grouped sections** (Info, Address, Custom Fields)
- **Dynamic custom fields** rendering
- **Unsaved changes** warning (beforeunload)
- **Autocomplete** for owner selection
- **Loading state** on save button

---

## 3.2 Deal Edit Page

**Route**: `/deals/:id/edit`  
**File**: `src/views/pages/deals/DealEditPage.tsx`  
**Complexity**: ⭐⭐⭐ Medium-High  
**Estimated Time**: 60-90 minutes

### **Future Structure** (✅ After)

Similar to Lead Edit, but with deal-specific fields:

```tsx
DealEditPage
└── AppPage
    ├── Props: (same as Lead Edit)
    │
    └── Children (Content):
        └── Paper (p: 3)
            └── form
                ├── Section: "Deal Information"
                │   ├── TextField (Deal Name, required)
                │   ├── Autocomplete (Company, required)
                │   ├── Autocomplete (Contact, required)
                │   ├── Select (Stage, required)
                │   ├── Select (Status)
                │   └── Autocomplete (Owner)
                │
                ├── Section: "Financial Details"
                │   ├── TextField (Deal Value, type: number, required, prefix: $)
                │   ├── Slider (Probability, 0-100%, marks)
                │   ├── TextField (Expected Revenue, disabled, calculated)
                │   └── TextField (Expected Close Date, type: date)
                │
                ├── Section: "Products" (optional)
                │   └── DataGrid (editable, product line items)
                │       ├── Add/Remove rows
                │       └── Auto-calculate totals
                │
                └── Section: "Additional Details"
                    ├── Select (Deal Source)
                    ├── TextField (Competitor)
                    └── TextField (Description, multiline, rows: 4)
```

### **Deal-Specific Features**

- **Company/Contact** autocomplete (linked data)
- **Value + Probability** = Expected Revenue (auto-calculated)
- **Products section** with inline editing
- **Probability slider** with visual feedback
- **Stage selection** with validation (can't skip stages)
- **Close date** with date picker

---

# 4. DASHBOARD PAGES

## 4.1 Analytics Dashboard

**Route**: `/analytics`  
**File**: `src/views/pages/analytics/AnalyticsDashboard.tsx`  
**Complexity**: ⭐⭐⭐ Medium-High  
**Estimated Time**: 60-90 minutes

### **Future Structure** (✅ After)

```tsx
AnalyticsDashboardPage
└── AppPage
    ├── Props:
    │   ├── title: "Analytics Dashboard"
    │   ├── subtitle: "Business performance overview"
    │   ├── actions: <ActionsComponent />
    │   ├── toolbar: <ToolbarComponent />
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   └── empty: {!data}
    │
    ├── ActionsComponent:
    │   ├── Button (Export Report, icon: IconDownload)
    │   ├── Button (Schedule Report, icon: IconClock)
    │   └── Button (Refresh, icon: IconRefresh)
    │
    ├── ToolbarComponent:
    │   └── Paper (p: 2)
    │       └── Stack (direction: row, spacing: 2)
    │           ├── ButtonGroup (Quick filters: Today, This Week, This Month, This Quarter)
    │           ├── TextField (Date From, type: date)
    │           ├── TextField (Date To, type: date)
    │           └── Select (Metric Type: Revenue, Deals, Leads, Activities)
    │
    └── Children (Content):
        ├── Grid container (spacing: 3)
        │   │
        │   ├── Grid item (xs: 12)
        │   │   └── Typography (variant: h5) "Key Metrics"
        │   │
        │   ├── Grid item (xs: 12, sm: 6, md: 3)
        │   │   └── Card (KPI: Total Revenue)
        │   │       ├── CardContent
        │   │       │   ├── Typography (caption: "Total Revenue")
        │   │       │   ├── Typography (h4: "$125,450")
        │   │       │   └── Chip (label: "+12.5%", color: success, size: small)
        │   │       └── CardActions
        │   │           └── TrendChart (mini sparkline)
        │   │
        │   ├── Grid item (xs: 12, sm: 6, md: 3)
        │   │   └── Card (KPI: New Leads)
        │   │       └── Similar structure
        │   │
        │   ├── Grid item (xs: 12, sm: 6, md: 3)
        │   │   └── Card (KPI: Conversion Rate)
        │   │
        │   └── Grid item (xs: 12, sm: 6, md: 3)
        │       └── Card (KPI: Active Deals)
        │   │
        │   ├── Grid item (xs: 12, md: 8)
        │   │   └── Paper (p: 3)
        │   │       ├── Typography (variant: h6, mb: 2) "Revenue Trend"
        │   │       └── ResponsiveContainer (width: 100%, height: 400)
        │   │           └── LineChart (data: revenueData)
        │   │               ├── XAxis (dataKey: date)
        │   │               ├── YAxis
        │   │               ├── Tooltip
        │   │               ├── Legend
        │   │               ├── Line (dataKey: revenue, stroke: primary)
        │   │               └── Line (dataKey: forecast, stroke: secondary, strokeDasharray: 5 5)
        │   │
        │   ├── Grid item (xs: 12, md: 4)
        │   │   └── Paper (p: 3)
        │   │       ├── Typography (variant: h6, mb: 2) "Pipeline by Stage"
        │   │       └── ResponsiveContainer (width: 100%, height: 400)
        │   │           └── PieChart
        │   │               ├── Pie (data: pipelineData, label)
        │   │               ├── Tooltip
        │   │               └── Legend
        │   │
        │   ├── Grid item (xs: 12, md: 6)
        │   │   └── Paper (p: 3)
        │   │       ├── Typography (variant: h6, mb: 2) "Top Performers"
        │   │       └── List
        │   │           └── ListItem[] (sales reps with avatar, name, stats)
        │   │
        │   ├── Grid item (xs: 12, md: 6)
        │   │   └── Paper (p: 3)
        │   │       ├── Typography (variant: h6, mb: 2) "Recent Activities"
        │   │       └── Timeline
        │   │           └── TimelineItem[] (recent CRM activities)
        │   │
        │   └── Grid item (xs: 12)
        │       └── Paper (p: 3)
        │           ├── Typography (variant: h6, mb: 2) "Forecast vs Actual"
        │           └── ResponsiveContainer (width: 100%, height: 300)
        │               └── BarChart (data: forecastData)
        │                   ├── XAxis (dataKey: month)
        │                   ├── YAxis
        │                   ├── Tooltip
        │                   ├── Legend
        │                   ├── Bar (dataKey: forecast, fill: secondary)
        │                   └── Bar (dataKey: actual, fill: primary)
```

### **Key Features**

- **KPI cards** with trend indicators
- **Multiple charts** (Line, Pie, Bar)
- **Responsive charts** (ResponsiveContainer)
- **Date range selector** in toolbar
- **Quick filters** (Today, Week, Month, Quarter)
- **Top performers** list
- **Recent activities** timeline
- **Forecast comparison**

### **Chart Library**

Assuming Recharts (common in React apps):
- `LineChart` for revenue trends
- `PieChart` for pipeline distribution
- `BarChart` for forecast comparison
- `Sparklines` for KPI mini-charts

---

## 4.2 Sample Page

**Route**: `/sample-page`  
**File**: `src/views/sample-page/index.jsx`  
**Complexity**: ⭐ Low  
**Estimated Time**: 15-30 minutes

### **Future Structure** (✅ After)

```tsx
SamplePage
└── AppPage
    ├── Props:
    │   ├── title: "Sample Page"
    │   ├── subtitle: "This is a demo page showcasing Berry UI components"
    │   ├── actions: <Button>Action Button</Button>
    │   └── empty: false
    │
    └── Children (Content):
        └── Grid container (spacing: 3)
            ├── Grid item (xs: 12, md: 6)
            │   └── Paper (p: 3)
            │       ├── Typography (variant: h5) "Card Title"
            │       └── Typography "Sample content..."
            │
            ├── Grid item (xs: 12, md: 6)
            │   └── Paper (p: 3)
            │       ├── Typography (variant: h5) "Another Card"
            │       └── Typography "More sample content..."
            │
            └── Grid item (xs: 12)
                └── Paper (p: 3)
                    ├── Typography (variant: h5) "Table Example"
                    └── TableContainer
                        └── Table (Simple demo table)
```

**Simple demo page** showing UI components. Easy migration.

---

# 5. COMPLETED PAGES ✅

## 5.1 P&L Analytics ✅

**Route**: `/analytics/pnl`  
**File**: `src/views/analytics/PnLAnalytics.tsx`  
**Status**: ✅ **Completed 2025-10-22**

### **Structure**

```tsx
PnLAnalytics
└── AppPage
    ├── Props:
    │   ├── title: "P&L Analytics"
    │   ├── subtitle: "Profit & Loss analysis by traffic source"
    │   ├── actions: Export menu + Refresh
    │   ├── toolbar: 5-column filter layout (Date, Source, Medium, Campaign, Ads)
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {!data || data.rows.length === 0}
    │   └── onRetry: {handleRefresh}
    │
    └── Children:
        ├── Grid container (KPI Cards)
        │   ├── Total Revenue
        │   ├── Total Cost
        │   └── Net Profit
        │
        └── TableContainer (overflowX: auto)
            └── Table (P&L data with calculated columns)
```

**Reference implementation** - use this as template!

---

## 5.2 Notifications ✅

**Route**: `/notifications`  
**File**: `src/views/notifications/Notifications.tsx`  
**Status**: ✅ **Completed 2025-10-22**

### **Structure**

```tsx
Notifications
└── AppPage
    ├── Props:
    │   ├── title: "Notifications"
    │   ├── actions: Mark all as read button
    │   ├── toolbar: NotificationPreferences + Filter dropdown
    │   ├── loading: {loading}
    │   ├── error: {error}
    │   ├── empty: {!hasNotifications}
    │   ├── emptySlot: Custom empty with CTA
    │   ├── footer: Pagination
    │   └── onRetry: {retry}
    │
    └── Children:
        └── List
            └── NotificationItem[] (with mark read/unread, delete, navigation)
```

**Good example** for list pages with inline actions!

---

# 📊 SUMMARY TABLE

| # | Page | Type | Complexity | Time | Priority |
|---|------|------|------------|------|----------|
| ✅ 1 | **P&L Analytics** | Analytics | ⭐⭐⭐ | — | Done |
| ✅ 2 | **Notifications** | List | ⭐⭐ | — | Done |
| 3 | **Contacts List** | List | ⭐⭐ | 45-60m | 🔴 High |
| 4 | **Leads List** | List | ⭐⭐⭐ | 45-60m | 🔴 High |
| 5 | **Deals List** | List | ⭐⭐⭐ | 45-60m | 🔴 High |
| 6 | **Companies List** | List | ⭐⭐ | 30-45m | 🟡 Medium |
| 7 | **Lead Detail** | Detail | ⭐⭐⭐⭐ | 90-120m | 🔴 High |
| 8 | **Deal Detail** | Detail | ⭐⭐⭐⭐ | 90-120m | 🔴 High |
| 9 | **Lead Detail Page** | Detail | ⭐ | 30-45m | 🟡 Medium |
| 10 | **Deal Detail Page** | Detail | ⭐ | 30-45m | 🟡 Medium |
| 11 | **Lead Edit** | Form | ⭐⭐⭐ | 60-90m | 🟡 Medium |
| 12 | **Deal Edit** | Form | ⭐⭐⭐ | 60-90m | 🟡 Medium |
| 13 | **Analytics Dashboard** | Dashboard | ⭐⭐⭐ | 60-90m | 🟢 Low |
| 14 | **Sample Page** | Demo | ⭐ | 15-30m | 🟢 Low |

---

# 🎯 ARCHITECTURAL PRINCIPLES

## 1. **Slot-Based Architecture**

Every page follows the **slot pattern**:

```
AppPage
├── title (string)
├── subtitle (string)
├── breadcrumbs (ReactNode)
├── actions (ReactNode)      ← Top-right buttons
├── toolbar (ReactNode)       ← Filters, search, controls
├── children (ReactNode)      ← Main content
└── footer (ReactNode)        ← Pagination, actions
```

## 2. **State Management**

- `loading` → Shows skeletons
- `error` → Shows alert with retry
- `empty` → Shows empty state message
- `onRetry` → Provides retry function

## 3. **Responsive Design**

- Use Grid with breakpoints: `xs`, `sm`, `md`, `lg`
- Common patterns:
  - Cards: `xs={12} sm={6} md={4} lg={3}`
  - Forms: `xs={12} md={6}` (2 columns on desktop)
  - KPIs: `xs={12} sm={6} md={3}` (4 columns on desktop)

## 4. **Overflow Handling**

- Tables: **Always** wrap in `<TableContainer sx={{ overflowX: 'auto' }}>`
- Papers: **Never** use `width: '100%'`
- Charts: Use `<ResponsiveContainer width="100%">`

## 5. **Action Patterns**

Common action buttons:
- **List pages**: Export, Refresh, Create New
- **Detail pages**: Edit, Delete, More Options
- **Edit pages**: Cancel, Save Draft, Save Changes

## 6. **Filter Patterns**

- **Simple**: TextField + Date range in toolbar Paper
- **Complex**: Use `<FilterPanel>` component with presets
- **Layout**: 5 columns (`md={2.4}`) for dense filters, 4 columns (`md={3}`) for balance

## 7. **Empty States**

- Generic: "Nothing here yet" + "Try adjusting filters"
- Actionable: Include CTA button (e.g., "Create Lead")
- Use icons for visual interest

---

# 🚀 NEXT STEPS

1. **Start with Contacts List** (easiest list page)
2. **Use P&L Analytics as reference** (already migrated)
3. **Follow the props breakdown** for each page type
4. **Test at all breakpoints** (375px, 768px, 1200px+)
5. **Update BERRY_FRAME_PROGRESS.md** after each page

---

**Status**: Architecture plan complete ✅  
**Created**: 2025-10-22  
**Maintainer**: Dev Team

