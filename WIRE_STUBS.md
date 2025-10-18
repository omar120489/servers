# Wire Stub Pages — Quick Reference

This guide shows you exactly how to wire each stub page to your FastAPI backend.

---

## 🎯 Pipeline (Kanban Board)

### Install Pipeline dependency

```bash
npm install @hello-pangea/dnd
```

### Replace `pages/pipeline.tsx`

```tsx
import Head from 'next/head';
import { Container, Typography, Stack, Box, Card, CardContent, Chip } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { api } from '@/api/client';

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

interface Deal {
  id: number;
  name: string;
  amount: number;
  stage: string;
  company_id?: number;
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Record<string, Deal[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data } = await api.get('/deals?page=1&size=1000');
      const grouped = STAGES.reduce((acc, stage) => {
        acc[stage] = data.items.filter((d: Deal) => d.stage === stage);
        return acc;
      }, {} as Record<string, Deal[]>);
      setDeals(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Optimistic update
    const sourceLane = [...deals[source.droppableId]];
    const destLane = [...deals[destination.droppableId]];
    const [moved] = sourceLane.splice(source.index, 1);
    moved.stage = newStage;
    destLane.splice(destination.index, 0, moved);

    setDeals({
      ...deals,
      [source.droppableId]: sourceLane,
      [destination.droppableId]: destLane,
    });

    // Persist
    try {
      await api.patch(`/deals/${dealId}/stage`, { stage: newStage });
    } catch (err) {
      console.error(err);
      fetchDeals(); // Revert on error
    }
  };

  if (loading) return <Container><Typography>Loading...</Typography></Container>;

  return (
    <>
      <Head><title>Pipeline — Traffic CRM</title></Head>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Pipeline</Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
            {STAGES.map((stage) => (
              <Box key={stage} sx={{ minWidth: 280, flex: '0 0 280px' }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  {stage} ({deals[stage]?.length || 0})
                </Typography>
                <Droppable droppableId={stage}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: 400, bgcolor: 'background.default', borderRadius: 1, p: 1 }}
                    >
                      {deals[stage]?.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={String(deal.id)} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 1 }}
                            >
                              <CardContent>
                                <Typography variant="subtitle2">{deal.name}</Typography>
                                <Chip
                                  label={`$${deal.amount?.toLocaleString() || 0}`}
                                  size="small"
                                  color="primary"
                                  sx={{ mt: 1 }}
                                />
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            ))}
          </Stack>
        </DragDropContext>
      </Container>
    </>
  );
}
```

**Backend requirement:** `PATCH /deals/{id}/stage` with `{ stage: string }`

---

## 📊 Reports (Charts)

### Install Charts dependency

```bash
npm install @mui/x-charts
```

### Replace `pages/reports/index.tsx`

```tsx
import Head from 'next/head';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import { api } from '@/api/client';

export default function ReportsPage() {
  const [funnel, setFunnel] = useState<any>(null);
  const [timeToClose, setTimeToClose] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [funnelRes, ttcRes] = await Promise.all([
        api.get('/reports/funnel'),
        api.get('/reports/time-to-close'),
      ]);
      setFunnel(funnelRes.data);
      setTimeToClose(ttcRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const funnelData = funnel
    ? Object.entries(funnel.by_stage).map(([stage, count]) => ({ stage, count }))
    : [];

  return (
    <>
      <Head><title>Reports — Traffic CRM</title></Head>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Reports</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Funnel by Stage</Typography>
                {funnelData.length > 0 && (
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: funnelData.map((d) => d.stage) }]}
                    series={[{ data: funnelData.map((d) => d.count) }]}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Time to Close (Days)</Typography>
                {timeToClose.length > 0 && (
                  <LineChart
                    xAxis={[{ scaleType: 'band', data: timeToClose.map((d) => d.month) }]}
                    series={[{ data: timeToClose.map((d) => d.avg_days), label: 'Avg Days' }]}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Win Rate</Typography>
                <Typography variant="h3" color="primary.main">
                  {funnel?.win_rate_pct || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {funnel?.won || 0} won out of {funnel?.total || 0} total deals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
```

**Backend requirements:**

- `GET /reports/funnel` → `{ by_stage: { [stage]: count }, total, won, win_rate_pct }`
- `GET /reports/time-to-close` → `[{ month, avg_days }]`

---

## 🔔 Notifications

### Replace `pages/notifications.tsx`

```tsx
import Head from 'next/head';
import { Container, Typography, Button, Stack, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { api } from '@/api/client';

interface Notification {
  id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications?page=1&size=100');
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head><title>Notifications — Traffic CRM</title></Head>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Notifications</Typography>
          <Button variant="outlined" onClick={markAllRead}>
            Mark All Read
          </Button>
        </Stack>
        <List>
          {items.map((n) => (
            <ListItem
              key={n.id}
              sx={{
                bgcolor: n.is_read ? 'transparent' : 'action.hover',
                borderRadius: 1,
                mb: 1,
              }}
              secondaryAction={
                !n.is_read && (
                  <Button size="small" onClick={() => markRead(n.id)}>
                    Mark Read
                  </Button>
                )
              }
            >
              <ListItemText
                primary={n.message}
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={n.type} size="small" />
                    <Typography variant="caption">{new Date(n.created_at).toLocaleString()}</Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
```

**Backend requirements:**

- `GET /notifications?page=1&size=100` → `{ items: Notification[] }`
- `POST /notifications/mark-all-read`
- `PATCH /notifications/{id}/read`

---

## 🔐 Auth Pages

### Login (`pages/auth/login.tsx`)

```tsx
import Head from 'next/head';
import { Container, Card, CardContent, TextField, Button, Typography, Stack, Box } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('at', data.access_token);
      localStorage.setItem('rt', data.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <>
      <Head><title>Login — Traffic CRM</title></Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                Welcome Back
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  fullWidth
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" size="large" onClick={handleLogin} fullWidth>
                  Login
                </Button>
                <Button onClick={() => router.push('/auth/forgot-password')}>
                  Forgot Password?
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
```

---

## 👥 Admin Pages

### Users (`pages/admin/users.tsx`)

```tsx
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { api } from '@/api/client';
import AddIcon from '@mui/icons-material/Add';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'role', headerName: 'Role', width: 120 },
  { field: 'is_active', headerName: 'Active', type: 'boolean', width: 100 },
];

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setRows(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Users — Traffic CRM</title></Head>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4">Users</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add User
          </Button>
        </Stack>
        <DataGrid rows={rows} columns={columns} loading={loading} autoHeight />
      </Container>
    </>
  );
}
```

---

## 🎯 Summary

| Page | Dependency | Backend Endpoints |
|------|-----------|-------------------|
| Pipeline | `@hello-pangea/dnd` | `PATCH /deals/{id}/stage` |
| Reports | `@mui/x-charts` | `GET /reports/funnel`, `GET /reports/time-to-close` |
| Notifications | — | `GET /notifications`, `POST /notifications/mark-all-read`, `PATCH /notifications/{id}/read` |
| Auth/Login | — | `POST /auth/login` |
| Admin/Users | — | `GET /admin/users` |

---

## 🚀 Quick Start

1. Pick a page to wire (e.g., Pipeline)
2. Install dependencies if needed
3. Copy the code above
4. Replace the stub file
5. Test with your backend

---

**Need help with a specific page?** Say "wire [page name]" and I'll provide the complete implementation.
