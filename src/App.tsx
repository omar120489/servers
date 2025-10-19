import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from 'components/layout/AppShell';

// Pages
import Dashboard from 'pages/Dashboard';
import Leads from 'pages/Leads';
import Contacts from 'pages/Contacts';
import Companies from 'pages/Companies';
import Deals from 'pages/Deals';
import Pipeline from 'pages/Pipeline';
import Activities from 'pages/Activities';
import Reports from 'pages/Reports';
import Settings from 'pages/Settings';
import Login from 'pages/Login';
import Profile from 'pages/Profile';
import Calendar from 'pages/Calendar';
import Notifications from 'pages/Notifications';

// Admin Pages
import Users from 'pages/admin/Users';
import Roles from 'pages/admin/Roles';
import Webhooks from 'pages/admin/Webhooks';
import AuditLog from 'pages/admin/AuditLog';
import Visualization from 'pages/admin/Visualization';

// Auth
import { AuthProvider } from 'auth/AuthProvider';
import RequireAuth from 'auth/RequireAuth';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/webhooks" element={<Webhooks />} />
          <Route path="/admin/audit-log" element={<AuditLog />} />
          <Route path="/admin/visualization" element={<Visualization />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
