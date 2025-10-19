/**
 * Prefetch utilities for lazy-loaded routes
 * 
 * These functions use webpack's magic comments to prefetch chunks during idle time,
 * reducing first-hit latency when users navigate to these pages.
 * 
 * Respects user preferences (Save-Data) and network conditions (2G/slow-2g).
 */

// Re-export the network-aware prefetch guard
export { canPrefetch, getNetworkInfo } from './prefetch.guard';

export const prefetchMap: { [key: string]: () => Promise<any> } = {
  '/leads': () => import(/* webpackPrefetch: true */ 'pages/Leads'),
  '/deals': () => import(/* webpackPrefetch: true */ 'pages/Deals'),
  '/contacts': () => import(/* webpackPrefetch: true */ 'pages/Contacts'),
  '/companies': () => import(/* webpackPrefetch: true */ 'pages/Companies'),
  '/pipeline': () => import(/* webpackPrefetch: true */ 'pages/Pipeline'),
  '/activities': () => import(/* webpackPrefetch: true */ 'pages/Activities'),
  '/reports': () => import(/* webpackPrefetch: true */ 'pages/Reports'),
  '/settings': () => import(/* webpackPrefetch: true */ 'pages/Settings'),
  '/profile': () => import(/* webpackPrefetch: true */ 'pages/Profile'),
  '/calendar': () => import(/* webpackPrefetch: true */ 'pages/Calendar'),
  '/notifications': () => import(/* webpackPrefetch: true */ 'pages/Notifications'),
  '/admin/users': () => import(/* webpackPrefetch: true */ 'pages/admin/Users'),
  '/admin/roles': () => import(/* webpackPrefetch: true */ 'pages/admin/Roles'),
  '/admin/webhooks': () => import(/* webpackPrefetch: true */ 'pages/admin/Webhooks'),
  '/admin/audit-log': () => import(/* webpackPrefetch: true */ 'pages/admin/AuditLog'),
  '/admin/visualization': () => import(/* webpackPrefetch: true */ 'pages/admin/Visualization'),
};
