import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const DealsListPage = Loadable(lazy(() => import('views/pages/deals/DealsListPage')));
const DealDetailPage = Loadable(lazy(() => import('views/pages/deals/DealDetailPage')));
const DealEditPage = Loadable(lazy(() => import('views/pages/deals/DealEditPage')));
const LeadsListPage = Loadable(lazy(() => import('views/pages/leads/LeadsListPage')));
const LeadDetailPage = Loadable(lazy(() => import('views/pages/leads/LeadDetailPage')));
const LeadEditPage = Loadable(lazy(() => import('views/pages/leads/LeadEditPage')));
const ContactsListPage = Loadable(lazy(() => import('views/pages/contacts/ContactsListPage')));
const CompaniesListPage = Loadable(lazy(() => import('views/pages/companies/CompaniesListPage')));
const AnalyticsDashboard = Loadable(lazy(() => import('views/pages/analytics/AnalyticsDashboard')));

const MainRoutes: RouteObject = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: '/deals',
      element: <DealsListPage />
    },
    {
      path: '/deals/:id',
      element: <DealDetailPage />
    },
    {
      path: '/deals/:id/edit',
      element: <DealEditPage />
    },
    {
      path: '/leads',
      element: <LeadsListPage />
    },
    {
      path: '/leads/:id',
      element: <LeadDetailPage />
    },
    {
      path: '/leads/:id/edit',
      element: <LeadEditPage />
    },
    {
      path: '/contacts',
      element: <ContactsListPage />
    },
    {
      path: '/companies',
      element: <CompaniesListPage />
    },
    {
      path: '/analytics',
      element: <AnalyticsDashboard />
    }
  ]
};

export default MainRoutes;
