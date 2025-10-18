#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

mkpage() {
  local path="$1" title="$2" subtitle="$3"
  [ -f "$root/$path" ] && echo "skip: $path (exists)" && return 0
  mkdir -p "$(dirname "$root/$path")"
  cat > "$root/$path" <<TSX
import Head from 'next/head';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material';

export default function ${title//[^a-zA-Z0-9]/}Page() {
  return (
    <>
      <Head><title>${title} — Traffic CRM</title></Head>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4">${title}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained">Primary</Button>
            <Button variant="outlined">Secondary</Button>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ${subtitle}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="subtitle1">Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Replace with real content.
              </Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="subtitle1">Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Replace with real content.
              </Typography>
            </CardContent></Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
TSX
  echo "created: $path"
}

# Core / Sales
mkpage "pages/dashboard.tsx" "Dashboard" "At-a-glance KPIs, quick links, and pipeline status."
mkpage "pages/activities.tsx" "Activities" "Calls, emails, meetings, tasks."
mkpage "pages/companies.tsx" "Companies" "Accounts/Organizations you work with."
mkpage "pages/pipeline.tsx" "Pipeline" "Kanban view of deals by stage."
mkpage "pages/calendar.tsx" "Calendar" "Your activities as a calendar (plus ICS)."

# Reports
mkpage "pages/reports/index.tsx" "Reports" "Funnel, time-to-close, deals by stage, revenue by month."

# Notifications
mkpage "pages/notifications.tsx" "Notifications" "In-app notifications history."

# Admin / Settings
mkpage "pages/settings.tsx" "Settings" "Personal and workspace settings."
mkpage "pages/admin/users.tsx" "Users" "Manage users and access."
mkpage "pages/admin/roles.tsx" "Roles" "Roles and permissions."
mkpage "pages/admin/webhooks.tsx" "Webhooks" "Outbound event subscriptions."
mkpage "pages/admin/audit-log.tsx" "Audit Log" "Who did what, and when."

# Billing / Reference (optional placeholders)
mkpage "pages/pricing.tsx" "Pricing" "Plan comparison and upgrade flow."
mkpage "pages/invoice/[id].tsx" "Invoice" "Invoice details and download."

# Auth
mkpage "pages/auth/login.tsx" "Login" "Welcome back. Enter your credentials."
mkpage "pages/auth/register.tsx" "Register" "Create your workspace."
mkpage "pages/auth/forgot-password.tsx" "Forgot Password" "We will email you a reset link."

# Errors
mkpage "pages/404.tsx" "Not Found" "This page does not exist."
mkpage "pages/500.tsx" "Server Error" "Something went wrong. Please try again later."

# Profile / Utilities
mkpage "pages/profile.tsx" "Profile" "Your personal details."
mkpage "pages/wizard.tsx" "Wizard" "Multistep flows (import, onboarding)."
mkpage "pages/chat.tsx" "Chat" "Internal notes or conversations (optional)."
mkpage "pages/tickets.tsx" "Tickets" "Simple support tickets (optional)."

# Calendar helper component (shows ICS URL)
cal_helper="src/components/calendar/IcsHint.tsx"
if [ ! -f "$root/$cal_helper" ]; then
  mkdir -p "$(dirname "$root/$cal_helper")"
  cat > "$root/$cal_helper" <<'TSX'
import { Alert, Stack, TextField, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function IcsHint() {
  const url = \`\${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/,'')}/calendar/feed.ics\`;
  const copy = async () => { 
    await navigator.clipboard.writeText(url);
  };
  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField value={url} size="small" fullWidth InputProps={{ readOnly: true }}/>
        <Tooltip title="Copy ICS URL">
          <IconButton onClick={copy}><ContentCopyIcon/></IconButton>
        </Tooltip>
      </Stack>
    </Alert>
  );
}
TSX
  echo "created: $cal_helper"
fi

echo "Done. All Berry pages scaffolded."




