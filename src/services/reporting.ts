import { apiGet } from 'utils/axios';
import type {
  AnalyticsFilters,
  CohortItem,
  FunnelStage,
  KpiSummary,
  TimeSeriesPoint
} from 'types/metrics';

export type TrendInterval = 'day' | 'week' | 'month';
export type CohortInterval = 'month' | 'quarter';

function sanitizeFilters(filters: AnalyticsFilters): Record<string, string> {
  const params: Record<string, string> = {};

  (Object.entries(filters) as [keyof AnalyticsFilters, string | null | undefined][]).forEach(
    ([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value;
      }
    }
  );

  return params;
}

export async function getKpis(filters: AnalyticsFilters): Promise<KpiSummary> {
  return apiGet<KpiSummary>('/api/reporting/kpis', {
    params: sanitizeFilters(filters)
  });
}

export async function getFunnel(filters: AnalyticsFilters): Promise<FunnelStage[]> {
  return apiGet<FunnelStage[]>('/api/reporting/funnel', {
    params: sanitizeFilters(filters)
  });
}

export async function getTrends(
  filters: AnalyticsFilters,
  interval: TrendInterval = 'day'
): Promise<TimeSeriesPoint[]> {
  return apiGet<TimeSeriesPoint[]>('/api/reporting/trends', {
    params: {
      ...sanitizeFilters(filters),
      interval
    }
  });
}

export async function getCohorts(
  filters: AnalyticsFilters,
  interval: CohortInterval = 'month'
): Promise<CohortItem[]> {
  return apiGet<CohortItem[]>('/api/reporting/cohorts', {
    params: {
      ...sanitizeFilters(filters),
      interval
    }
  });
}
