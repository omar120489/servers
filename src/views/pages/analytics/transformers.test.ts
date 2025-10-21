import { describe, expect, it } from 'vitest';

import type { CohortItem, FunnelStage, TimeSeriesPoint } from 'types/metrics';
import { toCohortRows, toFunnelChartData, toTrendSeries } from './transformers';

describe('analytics transformers', () => {
  it('creates trend series grouped by key with sorted dates', () => {
    const input: TimeSeriesPoint[] = [
      { date: '2024-01-02', value: 5, seriesKey: 'deals' },
      { date: '2024-01-01', value: 3 },
      { date: '2024-01-03', value: 8, seriesKey: 'deals' },
      { date: '2024-01-01', value: 2, seriesKey: 'deals' }
    ];

    const result = toTrendSeries(input);

    expect(result.xAxis.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03'
    ]);
    expect(result.series).toHaveLength(2);

    const defaultSeries = result.series.find((series) => series.id === 'default');
    expect(defaultSeries?.data).toEqual([3, null, null]);

    const dealsSeries = result.series.find((series) => series.id === 'deals');
    expect(dealsSeries?.data).toEqual([2, 5, 8]);
  });

  it('builds funnel chart data sorted by count', () => {
    const stages: FunnelStage[] = [
      { name: 'Discovery', count: 30, conversionRate: 50 },
      { name: 'Proposal', count: 20, conversionRate: 30 },
      { name: 'Qualification', count: 40, conversionRate: 60 }
    ];

    const result = toFunnelChartData(stages);
    expect(result.categories).toEqual(['Qualification', 'Discovery', 'Proposal']);
    expect(result.counts).toEqual([40, 30, 20]);
    expect(result.conversionRates).toEqual([60, 50, 30]);
  });

  it('creates cohort rows sorted by key', () => {
    const cohorts: CohortItem[] = [
      { cohortKey: '2023-12', total: 50, converted: 15, conversionRate: 30 },
      { cohortKey: '2024-01', total: 40, converted: 20, conversionRate: 50 }
    ];

    const result = toCohortRows(cohorts);
    expect(result).toEqual([
      { cohortKey: '2023-12', total: 50, converted: 15, conversionRate: 30 },
      { cohortKey: '2024-01', total: 40, converted: 20, conversionRate: 50 }
    ]);
  });
});
