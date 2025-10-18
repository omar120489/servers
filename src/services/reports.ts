import { api } from '../api/client';

export const getOverview = () => api.get('/reports/overview').then(r => r.data);
export const dealsByStage = () => api.get('/reports/deals-by-stage').then(r => r.data);
export const revenueByMonth = (year?: number) =>
  api.get('/reports/revenue-by-month', { params: { year } }).then(r => r.data);
export const activitiesByType = () => api.get('/reports/activities-by-type').then(r => r.data);

