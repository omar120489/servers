import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/GridLegacy';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { BarChartProps } from '@mui/x-charts/BarChart';
import type { LineChartProps } from '@mui/x-charts/LineChart';

import MainCard from 'ui-component/cards/MainCard';
import { DEAL_STAGES } from 'constants/deals';
import type {
  AnalyticsFilters,
  CohortItem,
  FunnelStage,
  KpiSummary,
  TimeSeriesPoint
} from 'types/metrics';
import { getCohorts, getFunnel, getKpis, getTrends, type TrendInterval } from 'services/reporting';
import { toCohortRows, toFunnelChartData, toTrendSeries } from './transformers';

const DEFAULT_FILTERS: AnalyticsFilters = {
  dateFrom: null,
  dateTo: null,
  source: null,
  ownerId: null,
  stage: null
};

const DEFAULT_INTERVAL: TrendInterval = 'day';

const ANALYTICS_FILTERS_STORAGE_KEY = 'analytics.filters';

interface AsyncState {
  kpis: KpiSummary | null;
  funnel: FunnelStage[];
  trends: TimeSeriesPoint[];
  cohorts: CohortItem[];
}

function sanitizeValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseFilters(params: URLSearchParams): AnalyticsFilters {
  const getValue = (key: string): string | null => sanitizeValue(params.get(key));

  return {
    dateFrom: getValue('dateFrom'),
    dateTo: getValue('dateTo'),
    source: getValue('source'),
    ownerId: getValue('ownerId'),
    stage: getValue('stage')
  };
}

function parseInterval(params: URLSearchParams): TrendInterval {
  const interval = params.get('interval');
  if (interval === 'week' || interval === 'month') {
    return interval;
  }
  return DEFAULT_INTERVAL;
}

function readStoredFilters(): AnalyticsFilters | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ANALYTICS_FILTERS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<Record<keyof AnalyticsFilters, unknown>>;
    return {
      dateFrom: sanitizeValue(parsed.dateFrom),
      dateTo: sanitizeValue(parsed.dateTo),
      source: sanitizeValue(parsed.source),
      ownerId: sanitizeValue(parsed.ownerId),
      stage: sanitizeValue(parsed.stage)
    };
  } catch {
    return null;
  }
}

function mergeFilters(
  urlFilters: AnalyticsFilters,
  storedFilters: AnalyticsFilters | null
): AnalyticsFilters {
  if (!storedFilters) {
    return urlFilters;
  }

  return {
    dateFrom: urlFilters.dateFrom ?? storedFilters.dateFrom ?? null,
    dateTo: urlFilters.dateTo ?? storedFilters.dateTo ?? null,
    source: urlFilters.source ?? storedFilters.source ?? null,
    ownerId: urlFilters.ownerId ?? storedFilters.ownerId ?? null,
    stage: urlFilters.stage ?? storedFilters.stage ?? null
  };
}

function buildAnalyticsSearchParams(filters: AnalyticsFilters, interval: TrendInterval) {
  const search = new URLSearchParams();
  (Object.entries(filters) as [keyof AnalyticsFilters, string | null][]).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  search.set('interval', interval);
  return search;
}

function buildListSearchParams(
  filters: AnalyticsFilters,
  overrides: Partial<AnalyticsFilters> = {}
) {
  const merged: AnalyticsFilters = {
    ...filters,
    ...overrides
  };

  const search = new URLSearchParams();

  if (merged.dateFrom) {
    search.set('dateFrom', merged.dateFrom);
  }

  if (merged.dateTo) {
    search.set('dateTo', merged.dateTo);
  }

  if (merged.stage) {
    search.set('stage', merged.stage);
  }

  if (merged.ownerId) {
    search.set('ownerId', merged.ownerId);
  }

  if (merged.source) {
    search.set('search', merged.source);
  }

  return search;
}

function formatDateParam(date: Date): string {
  return date.toISOString().slice(0, 10);
}

type ChartItemEvent = (
  event: unknown,
  item: { dataIndex?: number; seriesId?: string | number }
) => void;

type LineChartWithEventsProps = LineChartProps & {
  onItemClick?: ChartItemEvent;
};

type BarChartWithEventsProps = BarChartProps & {
  onItemClick?: ChartItemEvent;
};

const LineChartLazy = lazy(async () => {
  const module = await import('@mui/x-charts/LineChart');
  return { default: module.LineChart };
});

const BarChartLazy = lazy(async () => {
  const module = await import('@mui/x-charts/BarChart');
  return { default: module.BarChart };
});

const LineChartWithEvents = LineChartLazy as unknown as ComponentType<LineChartWithEventsProps>;
const BarChartWithEvents = BarChartLazy as unknown as ComponentType<BarChartWithEventsProps>;

const KPI_CARD_TEST_IDS = {
  leadsCreated: 'kpi-leads-created',
  dealsCreated: 'kpi-deals-created',
  dealsWon: 'kpi-deals-won'
} as const;

export default function AnalyticsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const storedFiltersRef = useRef<AnalyticsFilters | null | undefined>(undefined);
  if (storedFiltersRef.current === undefined) {
    storedFiltersRef.current = readStoredFilters();
  }

  const initialFiltersRef = useRef<AnalyticsFilters | null>(null);
  if (initialFiltersRef.current === null) {
    initialFiltersRef.current = mergeFilters(
      parseFilters(searchParams),
      storedFiltersRef.current ?? null
    );
  }

  const initialIntervalRef = useRef<TrendInterval>(parseInterval(searchParams));
  const initialFilters = initialFiltersRef.current ?? DEFAULT_FILTERS;

  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<AnalyticsFilters>(initialFilters);
  const [trendInterval, setTrendInterval] = useState<TrendInterval>(initialIntervalRef.current);

  const [state, setState] = useState<AsyncState>({
    kpis: null,
    funnel: [],
    trends: [],
    cohorts: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(filters) !== JSON.stringify(appliedFilters),
    [filters, appliedFilters]
  );

  const trendSeries = useMemo(() => toTrendSeries(state.trends), [state.trends]);
  const funnelChart = useMemo(() => toFunnelChartData(state.funnel), [state.funnel]);
  const cohortRows = useMemo(() => toCohortRows(state.cohorts), [state.cohorts]);

  const fetchAnalytics = useCallback(
    async (activeFilters: AnalyticsFilters, interval: TrendInterval) => {
      setLoading(true);
      setError(null);
      try {
        const [kpis, funnel, trends, cohorts] = await Promise.all([
          getKpis(activeFilters),
          getFunnel(activeFilters),
          getTrends(activeFilters, interval),
          getCohorts(activeFilters)
        ]);
        setState({
          kpis,
          funnel,
          trends,
          cohorts
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load analytics data.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchAnalytics(appliedFilters, trendInterval);
  }, [appliedFilters, trendInterval, fetchAnalytics]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const { dateFrom, dateTo, source, ownerId, stage } = appliedFilters;
    if (!dateFrom && !dateTo && !source && !ownerId && !stage) {
      window.localStorage.removeItem(ANALYTICS_FILTERS_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(ANALYTICS_FILTERS_STORAGE_KEY, JSON.stringify(appliedFilters));
  }, [appliedFilters]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    []
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        notation: 'compact',
        maximumFractionDigits: 1
      }),
    []
  );

  const formatTooltipLabel = useCallback(
    (value: unknown) => {
      if (value instanceof Date) {
        return dateFormatter.format(value);
      }
      if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return dateFormatter.format(parsed);
        }
      }
      return '';
    },
    [dateFormatter]
  );

  const formatTooltipValue = useCallback(
    (value: number | null) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return numberFormatter.format(value);
      }
      return '';
    },
    [numberFormatter]
  );

  const lineChartSlotProps = useMemo(
    () =>
      ({
        tooltip: {
          labelFormatter: (params: { value: unknown }) => formatTooltipLabel(params.value),
          valueFormatter: (value: number | null) => formatTooltipValue(value)
        }
      }) as LineChartWithEventsProps['slotProps'],
    [formatTooltipLabel, formatTooltipValue]
  );

  const barChartSlotProps = useMemo(
    () =>
      ({
        tooltip: {
          valueFormatter: (value: number | null) => formatTooltipValue(value)
        }
      }) as BarChartWithEventsProps['slotProps'],
    [formatTooltipValue]
  );

  const chartFallback = useMemo(() => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 320
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }, []);

  const handleInputChange = useCallback((key: keyof AnalyticsFilters, value: string) => {
    const normalized = value.trim();
    setFilters((prev) => ({
      ...prev,
      [key]: normalized === '' ? null : normalized
    }));
  }, []);

  const handleApply = useCallback(() => {
    setAppliedFilters(filters);
    setSearchParams(buildAnalyticsSearchParams(filters, trendInterval));
  }, [filters, trendInterval, setSearchParams]);

  const handleReset = useCallback(() => {
    const nextFilters = { ...DEFAULT_FILTERS };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setTrendInterval(DEFAULT_INTERVAL);
    setSearchParams(buildAnalyticsSearchParams(DEFAULT_FILTERS, DEFAULT_INTERVAL));
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ANALYTICS_FILTERS_STORAGE_KEY);
    }
  }, [setSearchParams]);

  const handleIntervalChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextInterval = event.target.value as TrendInterval;
      setTrendInterval(nextInterval);
      setSearchParams(buildAnalyticsSearchParams(appliedFilters, nextInterval));
    },
    [appliedFilters, setSearchParams]
  );

  const buildListParams = useCallback(
    (patch: Partial<AnalyticsFilters> = {}) => buildListSearchParams(appliedFilters, patch),
    [appliedFilters]
  );

  const navigateToList = useCallback(
    (target: 'leads' | 'deals', patch: Partial<AnalyticsFilters> = {}) => {
      const params = buildListParams(patch);
      const query = params.toString();
      navigate(query ? `/${target}?${query}` : `/${target}`);
    },
    [buildListParams, navigate]
  );

  const determineTargetFromSeriesId = useCallback(
    (seriesId?: string | number): 'leads' | 'deals' => {
      if (!seriesId) {
        return 'deals';
      }
      const normalized = String(seriesId).toLowerCase();
      if (normalized.includes('lead')) {
        return 'leads';
      }
      return 'deals';
    },
    []
  );

  const handleTrendPointClick = useCallback(
    (seriesId: string | number | undefined, dataIndex: number) => {
      const date = trendSeries.xAxis[dataIndex];
      if (!date) {
        return;
      }
      const target = determineTargetFromSeriesId(seriesId);
      const day = formatDateParam(date);
      navigateToList(target, { dateFrom: day, dateTo: day });
    },
    [determineTargetFromSeriesId, navigateToList, trendSeries]
  );

  const handleLeadsCreatedClick = useCallback(() => {
    navigateToList('leads');
  }, [navigateToList]);

  const handleDealsCreatedClick = useCallback(() => {
    navigateToList('deals');
  }, [navigateToList]);

  const renderKpiValue = (value: number, formatter?: (value: number) => string) =>
    formatter ? formatter(value) : value.toLocaleString();

  return (
    <MainCard title="Analytics">
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
        >
          <TextField
            type="date"
            label="Date From"
            value={filters.dateFrom ?? ''}
            onChange={(event) => handleInputChange('dateFrom', event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            type="date"
            label="Date To"
            value={filters.dateTo ?? ''}
            onChange={(event) => handleInputChange('dateTo', event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Source"
            placeholder="All sources"
            value={filters.source ?? ''}
            onChange={(event) => handleInputChange('source', event.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Stage"
            value={filters.stage ?? ''}
            onChange={(event) => handleInputChange('stage', event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All stages</MenuItem>
            {DEAL_STAGES.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {stage}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Owner ID"
            placeholder="Owner UUID"
            value={filters.ownerId ?? ''}
            onChange={(event) => handleInputChange('ownerId', event.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Trend Interval"
            value={trendInterval}
            onChange={handleIntervalChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="day">Daily</MenuItem>
            <MenuItem value="week">Weekly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleApply} disabled={!isDirty}>
              Apply
            </Button>
            <Button variant="outlined" onClick={handleReset} disabled={!isDirty}>
              Reset
            </Button>
          </Box>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {state.kpis ? (
                <>
                  <Grid xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardActionArea
                        data-testid={KPI_CARD_TEST_IDS.leadsCreated}
                        onClick={handleLeadsCreatedClick}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Leads Created
                          </Typography>
                          <Typography variant="h4">
                            {renderKpiValue(state.kpis.leadsCreated)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardActionArea
                        data-testid={KPI_CARD_TEST_IDS.dealsCreated}
                        onClick={handleDealsCreatedClick}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Deals Created
                          </Typography>
                          <Typography variant="h4">
                            {renderKpiValue(state.kpis.dealsCreated)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardActionArea
                        data-testid={KPI_CARD_TEST_IDS.dealsWon}
                        onClick={() => navigateToList('deals', { stage: 'Closed Won' })}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Deals Won
                          </Typography>
                          <Typography variant="h4">
                            {renderKpiValue(state.kpis.dealsWon)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Win Rate
                        </Typography>
                        <Typography variant="h4">
                          {renderKpiValue(state.kpis.winRate, (value) => `${value.toFixed(1)}%`)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Avg. Cycle (days)
                        </Typography>
                        <Typography variant="h4">
                          {renderKpiValue(state.kpis.avgCycleDays, (value) => value.toFixed(1))}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {typeof state.kpis.revenue === 'number' && (
                    <Grid xs={12} sm={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Revenue
                          </Typography>
                          <Typography variant="h4">
                            ${state.kpis.revenue.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {typeof state.kpis.roas === 'number' && (
                    <Grid xs={12} sm={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            ROAS
                          </Typography>
                          <Typography variant="h4">
                            {renderKpiValue(state.kpis.roas, (value) => `${value.toFixed(2)}x`)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              ) : (
                <Grid xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">No KPI data available.</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Trends</Typography>
                <Typography variant="body2" color="text.secondary">
                  Performance across the selected date range.
                </Typography>
                <Divider sx={{ my: 2 }} />
                {trendSeries.series.length === 0 ? (
                  <Typography color="text.secondary">
                    No trend data for the selected filters.
                  </Typography>
                ) : (
                  <Suspense fallback={chartFallback}>
                    <LineChartWithEvents
                      height={320}
                      xAxis={[
                        {
                          data: trendSeries.xAxis,
                          scaleType: 'time',
                          valueFormatter: (value: unknown) => formatTooltipLabel(value)
                        }
                      ]}
                      series={trendSeries.series.map((series) => ({
                        ...series,
                        valueFormatter: (value: number | null) => formatTooltipValue(value)
                      }))}
                      onItemClick={(_event, item) => {
                        const { seriesId, dataIndex } = item ?? {};
                        if (typeof dataIndex !== 'number') {
                          return;
                        }
                        handleTrendPointClick(seriesId, dataIndex);
                      }}
                      slotProps={lineChartSlotProps}
                    />
                  </Suspense>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Funnel</Typography>
                <Typography variant="body2" color="text.secondary">
                  Conversion through each stage.
                </Typography>
                <Divider sx={{ my: 2 }} />
                {funnelChart.categories.length === 0 ? (
                  <Typography color="text.secondary">
                    No funnel data for the selected filters.
                  </Typography>
                ) : (
                  <Suspense fallback={chartFallback}>
                    <BarChartWithEvents
                      height={320}
                      xAxis={[
                        {
                          scaleType: 'band',
                          data: funnelChart.categories
                        }
                      ]}
                      series={[
                        {
                          data: funnelChart.counts,
                          label: 'Deals',
                          valueFormatter: (value: number | null) => formatTooltipValue(value)
                        }
                      ]}
                      onItemClick={(_event, item) => {
                        const { seriesId, dataIndex } = item ?? {};
                        if (typeof dataIndex !== 'number') {
                          return;
                        }
                        const stage = funnelChart.categories[dataIndex];
                        if (!stage) {
                          return;
                        }
                        const target = determineTargetFromSeriesId(seriesId);
                        navigateToList(target, { stage });
                      }}
                      slotProps={barChartSlotProps}
                    />
                  </Suspense>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Cohorts</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cohort performance over time.
                </Typography>
                <Divider sx={{ my: 2 }} />
                {cohortRows.length === 0 ? (
                  <Typography color="text.secondary">
                    No cohort data for the selected filters.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Cohort</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Converted</TableCell>
                          <TableCell align="right">Conversion</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cohortRows.map((row) => (
                          <TableRow key={row.cohortKey} hover>
                            <TableCell>{row.cohortKey}</TableCell>
                            <TableCell align="right">{row.total.toLocaleString()}</TableCell>
                            <TableCell align="right">{row.converted.toLocaleString()}</TableCell>
                            <TableCell align="right">{row.conversionRate.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
    </MainCard>
  );
}
