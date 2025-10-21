import type { CohortItem, FunnelStage, TimeSeriesPoint } from 'types/metrics';

export type TrendInterval = 'day' | 'week' | 'month';

export interface TrendSeries {
  xAxis: Date[];
  series: Array<{
    id: string;
    label: string;
    data: (number | null)[];
    connectNulls?: boolean;
  }>;
}

export interface FunnelChartData {
  categories: string[];
  counts: number[];
  conversionRates: number[];
}

export interface CohortRow {
  cohortKey: string;
  total: number;
  converted: number;
  conversionRate: number;
}

export function toTrendSeries(points: TimeSeriesPoint[]): TrendSeries {
  if (points.length === 0) {
    return {
      xAxis: [],
      series: []
    };
  }

  const dates = Array.from(new Set(points.map((point) => point.date))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const xAxis = dates.map((date) => new Date(date));

  const seriesMap = new Map<string, (number | null)[]>();
  dates.forEach(() => {
    seriesMap.forEach((values, key) => {
      values.push(null);
      seriesMap.set(key, values);
    });
  });

  points.forEach((point) => {
    const seriesKey = point.seriesKey ?? 'default';
    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, Array(dates.length).fill(null));
    }
    const array = seriesMap.get(seriesKey)!;
    const dateIndex = dates.indexOf(point.date);
    if (dateIndex >= 0) {
      array[dateIndex] = point.value;
    }
  });

  const series = Array.from(seriesMap.entries()).map(([key, data]) => ({
    id: key,
    label: key === 'default' ? 'Value' : key,
    data,
    connectNulls: true
  }));

  return {
    xAxis,
    series
  };
}

export function toFunnelChartData(stages: FunnelStage[]): FunnelChartData {
  if (stages.length === 0) {
    return {
      categories: [],
      counts: [],
      conversionRates: []
    };
  }

  const sorted = [...stages].sort((a, b) => b.count - a.count);

  return {
    categories: sorted.map((stage) => stage.name),
    counts: sorted.map((stage) => stage.count),
    conversionRates: sorted.map((stage) => stage.conversionRate)
  };
}

export function toCohortRows(items: CohortItem[]): CohortRow[] {
  if (items.length === 0) {
    return [];
  }

  return [...items]
    .sort((a, b) => a.cohortKey.localeCompare(b.cohortKey))
    .map((item) => ({
      cohortKey: item.cohortKey,
      total: item.total,
      converted: item.converted,
      conversionRate: item.conversionRate
    }));
}
