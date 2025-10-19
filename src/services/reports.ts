import { api } from '../api/client';
import config from '../config';
import {
  getMockReportsOverview,
  getMockDealsByStage,
  getMockRevenueByMonth,
  getMockActivitiesByType,
} from './mocks';

export const getOverview = async () => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockReportsOverview());
  }

  // Real API call with fallback
  try {
    const response = await api.get('/reports/overview');
    return response.data;
  } catch (error) {
    return getMockReportsOverview();
  }
};

export const dealsByStage = async () => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockDealsByStage());
  }

  // Real API call with fallback
  try {
    const response = await api.get('/reports/deals-by-stage');
    return response.data;
  } catch (error) {
    return getMockDealsByStage();
  }
};

export const revenueByMonth = async (year?: number) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockRevenueByMonth());
  }

  // Real API call with fallback
  try {
    const response = await api.get('/reports/revenue-by-month', { params: { year } });
    return response.data;
  } catch (error) {
    return getMockRevenueByMonth();
  }
};

export const activitiesByType = async () => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockActivitiesByType());
  }

  // Real API call with fallback
  try {
    const response = await api.get('/reports/activities-by-type');
    return response.data;
  } catch (error) {
    return getMockActivitiesByType();
  }
};

