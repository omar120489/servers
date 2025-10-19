import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import AppShell from 'components/layout/AppShell';
import { useWebVitals } from 'hooks/useWebVitals';

// Auth
import { AuthProvider } from 'auth/AuthProvider';
import RequireAuth from 'auth/RequireAuth';

// Common Components
import ScrollToTop from 'components/common/ScrollToTop';
import FocusOnNavigate from 'components/common/FocusOnNavigate';
import ErrorBoundary from 'components/common/ErrorBoundary';

// Eager-loaded pages (critical path - for optimal LCP)
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';

// Lazy-loaded pages (code splitting for performance)
const Leads = lazy(() => import('pages/Leads'));
const Contacts = lazy(() => import('pages/Contacts'));
const Companies = lazy(() => import('pages/Companies'));
const Deals = lazy(() => import('pages/Deals'));
const Pipeline = lazy(() => import('pages/Pipeline'));
const Activities = lazy(() => import('pages/Activities'));
const Reports = lazy(() => import('pages/Reports'));
const Settings = lazy(() => import('pages/Settings'));
const Profile = lazy(() => import('pages/Profile'));
const Calendar = lazy(() => import('pages/Calendar'));
const Notifications = lazy(() => import('pages/Notifications'));
const NotFound = lazy(() => import('pages/NotFound'));

// Admin Pages (lazy-loaded)
const Users = lazy(() => import('pages/admin/Users'));
const Roles = lazy(() => import('pages/admin/Roles'));
const Webhooks = lazy(() => import('pages/admin/Webhooks'));
const AuditLog = lazy(() => import('pages/admin/AuditLog'));
const Visualization = lazy(() => import('pages/admin/Visualization'));

// Loading fallback component
function LoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <CircularProgress size={60} />
      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
}

export default function App() {
  // Track Web Vitals for performance monitoring
  useWebVitals();
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <FocusOnNavigate />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth><AppShell /></RequireAuth>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="companies" element={<Companies />} />
              <Route path="deals" element={<Deals />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="activities" element={<Activities />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Admin Routes (RBAC-protected) */}
              <Route 
                path="admin/users" 
                element={
                  <RequireAuth roles={['Admin', 'Manager']}>
                    <Users />
                  </RequireAuth>
                } 
              />
              <Route 
                path="admin/roles" 
                element={
                  <RequireAuth roles={['Admin']}>
                    <Roles />
                  </RequireAuth>
                } 
              />
              <Route 
                path="admin/webhooks" 
                element={
                  <RequireAuth roles={['Admin']}>
                    <Webhooks />
                  </RequireAuth>
                } 
              />
              <Route 
                path="admin/audit-log" 
                element={
                  <RequireAuth roles={['Admin', 'Manager']}>
                    <AuditLog />
                  </RequireAuth>
                } 
              />
              <Route 
                path="admin/visualization" 
                element={
                  <RequireAuth roles={['Admin']}>
                    <Visualization />
                  </RequireAuth>
                } 
              />
            </Route>

            {/* NotFound Route */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}
