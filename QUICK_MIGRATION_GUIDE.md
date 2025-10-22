# ⚡ Quick Migration Guide - Berry Frame

**Time per page**: 30-90 minutes  
**Reference**: `src/views/analytics/PnLAnalytics.tsx`

---

## 🚀 5-Step Migration Process

### **Step 1: Import AppPage** (30 sec)
```tsx
import AppPage from 'layouts/AppPage';
```

### **Step 2: Extract Actions** (5 min)
```tsx
// Move all header buttons here
const actions = (
  <>
    <Button variant="outlined" startIcon={<IconRefresh />} onClick={handleRefresh}>
      Refresh
    </Button>
    <Button variant="contained" startIcon={<IconPlus />} onClick={handleCreate}>
      Create New
    </Button>
  </>
);
```

### **Step 3: Extract Toolbar** (10 min)
```tsx
// Move filters, search, etc. here
const toolbar = (
  <Paper sx={{ p: 2 }}>  {/* NO width! */}
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Search"
          value={search}
          onChange={handleSearch}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Date From"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </Grid>
      {/* More filters... */}
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear All
          </Button>
        </Stack>
      </Grid>
    </Grid>
  </Paper>
);
```

### **Step 4: Wrap with AppPage** (10 min)
```tsx
return (
  <AppPage
    title="Page Title"
    subtitle="Brief description of this page"
    actions={actions}
    toolbar={toolbar}
    loading={loading}
    error={error}
    empty={!data || data.length === 0}
    onRetry={refetch}
  >
    {/* Only content when data is ready */}
    {data && (
      <>
        {/* KPI Cards, Charts, etc. */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>{/* KPI */}</Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>{/* ... */}</TableHead>
            <TableBody>{/* ... */}</TableBody>
          </Table>
        </TableContainer>
      </>
    )}
  </AppPage>
);
```

### **Step 5: Remove Old Code** (5 min)
```tsx
// ❌ DELETE these:
// - <MainCard> wrapper
// - Manual {loading && <Skeleton />}
// - Manual {error && <Alert />}
// - Manual {!data && <Typography>No data</Typography>}
// - width: '100%' from Papers/Boxes
```

---

## ✅ Pre-Migration Checklist

- [ ] Have reference open: `src/views/analytics/PnLAnalytics.tsx`
- [ ] Note current page structure (header, filters, content)
- [ ] Identify all action buttons
- [ ] Identify all filters/search fields
- [ ] Check for any special layout needs

---

## 🎯 Post-Migration Checklist

### **Functionality**
- [ ] Loading state shows skeletons
- [ ] Error state shows alert with retry button
- [ ] Empty state shows helpful message
- [ ] All buttons work
- [ ] All filters work
- [ ] Navigation works
- [ ] Data loads correctly

### **Layout**
- [ ] No horizontal scroll on desktop
- [ ] No horizontal scroll on tablet
- [ ] No horizontal scroll on mobile
- [ ] Content stays within 1200px frame
- [ ] Responsive at all breakpoints
- [ ] Filters wrap properly on mobile

### **Code Quality**
- [ ] No `width: '100%'` on Papers/Boxes
- [ ] TableContainer has `overflowX: 'auto'`
- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] Proper ARIA attributes
- [ ] Clean code (removed old comments)

---

## 🔧 Common Patterns

### **Pattern 1: List Page with Filters**
```tsx
export default function MyListPage() {
  const { data, loading, error, refetch } = useMyData();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');

  const actions = (
    <>
      <Button startIcon={<IconRefresh />} onClick={refetch}>Refresh</Button>
      <Button variant="contained" startIcon={<IconPlus />}>New Item</Button>
    </>
  );

  const toolbar = (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="date" label="Date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <AppPage
      title="My List"
      actions={actions}
      toolbar={toolbar}
      loading={loading}
      error={error}
      empty={!data || data.length === 0}
      onRetry={refetch}
    >
      <DataGrid rows={data} columns={columns} />
    </AppPage>
  );
}
```

### **Pattern 2: Detail Page with Tabs**
```tsx
export default function MyDetailPage() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useMyDetail(id);
  const [tab, setTab] = useState(0);

  const actions = (
    <>
      <Button startIcon={<IconEdit />} component={Link} to={`/items/${id}/edit`}>Edit</Button>
      <Button startIcon={<IconTrash />} color="error" onClick={handleDelete}>Delete</Button>
    </>
  );

  return (
    <AppPage
      title={data?.name || 'Loading...'}
      subtitle={`ID: ${id}`}
      actions={actions}
      loading={loading}
      error={error}
      empty={!data}
      onRetry={refetch}
    >
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Details" />
        <Tab label="Activity" />
        <Tab label="History" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <DetailsTab data={data} />}
        {tab === 1 && <ActivityTab data={data} />}
        {tab === 2 && <HistoryTab data={data} />}
      </Box>
    </AppPage>
  );
}
```

### **Pattern 3: Form/Edit Page**
```tsx
export default function MyEditPage() {
  const { id } = useParams();
  const { data, loading, error } = useMyItem(id);
  const [formData, setFormData] = useState({});

  const actions = (
    <>
      <Button variant="outlined" component={Link} to={`/items/${id}`}>Cancel</Button>
      <Button variant="contained" onClick={handleSave}>Save Changes</Button>
    </>
  );

  return (
    <AppPage
      title="Edit Item"
      subtitle={data?.name}
      actions={actions}
      loading={loading}
      error={error}
      empty={!data}
    >
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Name" value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" value={formData.email} onChange={handleChange} />
          </Grid>
          {/* More fields... */}
        </Grid>
      </Paper>
    </AppPage>
  );
}
```

---

## 🚨 Common Mistakes

### ❌ **Mistake 1: Adding width to toolbar**
```tsx
// WRONG
const toolbar = (
  <Paper sx={{ p: 2, width: '100%' }}>  // ❌
    <Grid container spacing={2}>...</Grid>
  </Paper>
);

// RIGHT
const toolbar = (
  <Paper sx={{ p: 2 }}>  // ✅
    <Grid container spacing={2}>...</Grid>
  </Paper>
);
```

### ❌ **Mistake 2: Not wrapping tables**
```tsx
// WRONG
<Table>...</Table>  // ❌ Can overflow

// RIGHT
<TableContainer component={Paper} sx={{ overflowX: 'auto' }}>  // ✅
  <Table>...</Table>
</TableContainer>
```

### ❌ **Mistake 3: Manual loading/error handling**
```tsx
// WRONG
return (
  <AppPage title="My Page">
    {loading && <Skeleton />}  // ❌ Redundant
    {error && <Alert>{error}</Alert>}  // ❌ Redundant
    {data && <Content />}
  </AppPage>
);

// RIGHT
return (
  <AppPage
    title="My Page"
    loading={loading}  // ✅ AppPage handles it
    error={error}      // ✅ AppPage handles it
    empty={!data}      // ✅ AppPage handles it
  >
    <Content />  {/* Only renders when ready */}
  </AppPage>
);
```

### ❌ **Mistake 4: Forgetting onRetry**
```tsx
// WRONG
<AppPage error={error}>  // ❌ No retry button

// RIGHT
<AppPage error={error} onRetry={refetch}>  // ✅ Retry button appears
```

### ❌ **Mistake 5: Too many columns in Grid**
```tsx
// WRONG - 3 columns at 1200px is tight
<Grid item xs={12} md={4}>  // ❌ 400px per column

// BETTER - 5 columns gives more room
<Grid item xs={12} md={2.4}>  // ✅ 240px per column

// OR - 4 columns for balance
<Grid item xs={12} md={3}>  // ✅ 300px per column
```

---

## 📊 Testing Checklist

### **Desktop (>1200px)**
- [ ] Content centered with gutters
- [ ] Max width 1200px enforced
- [ ] No horizontal scroll
- [ ] All filters visible
- [ ] Tables display correctly

### **Tablet (768px-1200px)**
- [ ] Content uses full width with gutters
- [ ] Filters stack appropriately
- [ ] No horizontal scroll
- [ ] Buttons wrap to new line if needed

### **Mobile (<768px)**
- [ ] Content uses full width
- [ ] Filters stack vertically
- [ ] Tables scroll horizontally (internally)
- [ ] No page-level horizontal scroll
- [ ] Touch targets are large enough

### **States**
- [ ] Loading: Skeletons appear
- [ ] Error: Alert with message + retry button
- [ ] Empty: Helpful message appears
- [ ] Success: Data displays correctly

---

## ⏱️ Time Estimates

| Page Type | Complexity | Time Estimate |
|-----------|------------|---------------|
| **Simple List** | Few filters, basic table | 30-45 min |
| **Complex List** | Many filters, DataGrid | 45-60 min |
| **Detail Page** | Tabs, multiple sections | 60-90 min |
| **Edit/Form Page** | Forms, validation | 60-90 min |
| **Dashboard** | Charts, widgets | 60-90 min |

---

## 🎯 Priority Order

1. **Start with Lists** - They're easiest and most common
2. **Then Detail Pages** - More complex but follow same pattern
3. **Then Edit Pages** - Similar to detail pages
4. **Finally Dashboards** - Most flexible, least urgent

---

## 📚 Reference Links

- **AppPage Component**: `src/layouts/AppPage.tsx`
- **Working Examples**:
  - ✅ P&L Analytics: `src/views/analytics/PnLAnalytics.tsx`
  - ✅ Notifications: `src/views/notifications/Notifications.tsx`
- **Master Plan**: `BERRY_FRAME_MASTER_PLAN.md`

---

**Ready to migrate?** Pick a page and follow the 5 steps! ⚡

