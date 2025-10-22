import { apiGet } from 'utils/axios';
import type { PnLQuery, PnLResponse } from 'types/api';

const API_BASE_URL = '/api/v1/pnl';

/**
 * Get P&L (Profit & Loss) data with optional filters
 * 
 * @param query - Filter parameters (utm_source, utm_campaign, ad_id, date range, group_by)
 * @returns P&L summary and rows grouped by specified dimension
 */
export async function getPnL(query?: PnLQuery): Promise<PnLResponse> {
  return apiGet<PnLResponse>(API_BASE_URL, { params: query });
}

export const pnlApi = {
  getPnL
};


