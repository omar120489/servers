/**
 * Mock data for Reports
 * Deterministic data for analytics and reporting
 */

export const mockReportsOverview = {
  contacts: 156,
  companies: 42,
  deals: 23,
  revenue: 845000,
};

export const mockDealsByStage = [
  { stage: 'Prospecting', count: 8 },
  { stage: 'Qualification', count: 5 },
  { stage: 'Proposal', count: 4 },
  { stage: 'Negotiation', count: 3 },
  { stage: 'Closed Won', count: 2 },
  { stage: 'Closed Lost', count: 1 },
];

export const mockRevenueByMonth = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 72000 },
  { month: 'Mar', revenue: 68000 },
  { month: 'Apr', revenue: 85000 },
  { month: 'May', revenue: 92000 },
  { month: 'Jun', revenue: 105000 },
];

export const mockActivitiesByType = [
  { type: 'Calls', count: 45 },
  { type: 'Emails', count: 78 },
  { type: 'Meetings', count: 32 },
  { type: 'Tasks', count: 56 },
];

export const getMockReportsOverview = () => mockReportsOverview;
export const getMockDealsByStage = () => mockDealsByStage;
export const getMockRevenueByMonth = () => mockRevenueByMonth;
export const getMockActivitiesByType = () => mockActivitiesByType;

