export interface AnalyticsFilters {
  dateFrom: string | null;
  dateTo: string | null;
  source?: string | null;
  ownerId?: string | null;
  stage?: string | null;
}

export interface KpiSummary {
  leadsCreated: number;
  dealsCreated: number;
  dealsWon: number;
  winRate: number;
  avgCycleDays: number;
  revenue?: number | null;
  roas?: number | null;
}

export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  seriesKey?: string;
}

export interface CohortItem {
  cohortKey: string;
  total: number;
  converted: number;
  conversionRate: number;
}
