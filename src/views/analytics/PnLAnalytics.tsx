import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
  Menu,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  IconRefresh, 
  IconTrendingUp, 
  IconCash, 
  IconReceipt, 
  IconDownload, 
  IconFileTypeCsv, 
  IconFileTypeXls, 
  IconFileTypePdf 
} from '@tabler/icons-react';

import AppPage from 'layouts/AppPage';
import { pnlService } from 'services';
import type { PnLQuery, PnLResponse } from 'types/api';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export default function PnLAnalytics() {
  const [data, setData] = useState<PnLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  
  // Filters
  const [filters, setFilters] = useState<PnLQuery>({});
  const [utmSource, setUtmSource] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [adId, setAdId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(exportAnchorEl);

  const loadPnLData = useCallback(async (queryFilters?: PnLQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await pnlService.getPnL(queryFilters);
      setData(response);
    } catch (err) {
      setError(err);
      console.error('[PnLAnalytics] Failed to load P&L data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPnLData(filters);
  }, [loadPnLData, filters]);

  const handleApplyFilters = () => {
    const newFilters: PnLQuery = {};
    if (utmSource) newFilters.utm_source = utmSource;
    if (utmCampaign) newFilters.utm_campaign = utmCampaign;
    if (adId) newFilters.ad_id = adId;
    if (dateFrom) newFilters.date_from = dateFrom;
    if (dateTo) newFilters.date_to = dateTo;
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setUtmSource('');
    setUtmCampaign('');
    setAdId('');
    setDateFrom('');
    setDateTo('');
    setFilters({});
  };

  const handleRefresh = () => {
    void loadPnLData(filters);
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportCSV = () => {
    if (!data || data.rows.length === 0) return;

    const headers = [
      'UTM Source', 'UTM Campaign', 'Ad ID', 'Leads', 'Deals',
      'Gross Revenue', 'Direct Cost', 'Net Profit', 'ROAS', 'CPA'
    ];

    const csvRows = data.rows.map(row => [
      row.utm_source || '', row.utm_campaign || '', row.ad_id || '',
      row.leads_count, row.deals_count, row.gross_revenue, row.direct_cost,
      row.net_profit, row.roas.toFixed(2), row.cpa.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pnl-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    if (!data || data.rows.length === 0) return;

    const excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #4472C4; color: white; font-weight: bold; padding: 10px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .number { mso-number-format: "\\#\\,\\#\\#0\\.00"; text-align: right; }
          .currency { mso-number-format: "\\$\\#\\,\\#\\#0\\.00"; text-align: right; }
        </style>
      </head>
      <body>
        <h2>P&L Analytics Report</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr><th>UTM Source</th><th>UTM Campaign</th><th>Ad ID</th><th>Leads</th><th>Deals</th><th>Gross Revenue</th><th>Direct Cost</th><th>Net Profit</th><th>ROAS</th><th>CPA</th></tr></thead>
          <tbody>
            ${data.rows.map(row => `
              <tr>
                <td>${row.utm_source || '—'}</td><td>${row.utm_campaign || '—'}</td><td>${row.ad_id || '—'}</td>
                <td class="number">${row.leads_count}</td><td class="number">${row.deals_count}</td>
                <td class="currency">${row.gross_revenue}</td><td class="currency">${row.direct_cost}</td>
                <td class="currency">${row.net_profit}</td>
                <td class="number">${row.roas.toFixed(2)}</td><td class="currency">${row.cpa.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pnl-analytics-${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    if (!data || data.rows.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>P&L Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .positive { color: green; }
            .negative { color: red; }
          </style>
        </head>
        <body>
          <h1>P&L Analytics Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>UTM Source</th><th>UTM Campaign</th><th>Ad ID</th><th>Leads</th><th>Deals</th><th>Gross Revenue</th><th>Direct Cost</th><th>Net Profit</th><th>ROAS</th><th>CPA</th></tr></thead>
            <tbody>
              ${data.rows.map(row => `
                <tr>
                  <td>${row.utm_source || '—'}</td><td>${row.utm_campaign || '—'}</td><td>${row.ad_id || '—'}</td>
                  <td>${row.leads_count}</td><td>${row.deals_count}</td>
                  <td>${formatCurrency(row.gross_revenue)}</td><td>${formatCurrency(row.direct_cost)}</td>
                  <td class="${row.net_profit >= 0 ? 'positive' : 'negative'}"><strong>${formatCurrency(row.net_profit)}</strong></td>
                  <td>${formatNumber(row.roas, 2)}x</td><td>${formatCurrency(row.cpa)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
    handleExportMenuClose();
  };

  const availableSources = data?.rows
    ? Array.from(new Set(data.rows.map(r => r.utm_source).filter(Boolean)))
    : [];
  
  const availableCampaigns = data?.rows
    ? Array.from(new Set(data.rows.map(r => r.utm_campaign).filter(Boolean)))
    : [];
  
  const availableAdIds = data?.rows
    ? Array.from(new Set(data.rows.map(r => r.ad_id).filter(Boolean)))
    : [];

  const actions = (
    <>
      <Button
        variant="outlined"
        startIcon={<IconDownload />}
        onClick={handleExportMenuOpen}
        disabled={loading || !data || data.rows.length === 0}
        size="small"
      >
        Export
      </Button>
      <Menu anchorEl={exportAnchorEl} open={exportMenuOpen} onClose={handleExportMenuClose}>
        <MenuItemComponent onClick={handleExportCSV}>
          <ListItemIcon><IconFileTypeCsv size={20} /></ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={handleExportExcel}>
          <ListItemIcon><IconFileTypeXls size={20} /></ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={handleExportPDF}>
          <ListItemIcon><IconFileTypePdf size={20} /></ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItemComponent>
      </Menu>
      <Button
        variant="outlined"
        startIcon={<IconRefresh />}
        onClick={handleRefresh}
        disabled={loading}
        size="small"
      >
        Refresh
      </Button>
    </>
  );

  const toolbar = (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel>UTM Source</InputLabel>
            <Select value={utmSource} onChange={(e: SelectChangeEvent) => setUtmSource(e.target.value)} label="UTM Source">
              <MenuItem value="">All Sources</MenuItem>
              {availableSources.map((source) => (
                <MenuItem key={source} value={source}>{source}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel>UTM Campaign</InputLabel>
            <Select value={utmCampaign} onChange={(e: SelectChangeEvent) => setUtmCampaign(e.target.value)} label="UTM Campaign">
              <MenuItem value="">All Campaigns</MenuItem>
              {availableCampaigns.map((campaign) => (
                <MenuItem key={campaign} value={campaign}>{campaign}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel>Ad ID</InputLabel>
            <Select value={adId} onChange={(e: SelectChangeEvent) => setAdId(e.target.value)} label="Ad ID">
              <MenuItem value="">All Ads</MenuItem>
              {availableAdIds.map((id) => (
                <MenuItem key={id} value={id}>{id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" onClick={handleApplyFilters} size="small">Apply Filters</Button>
            <Button variant="outlined" onClick={handleClearFilters} size="small">Clear All</Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <AppPage
      title="P&L Analytics"
      subtitle="Profit & Loss analysis by traffic source"
      actions={actions}
      toolbar={toolbar}
      loading={loading}
      error={error}
      empty={!data || data.rows.length === 0}
      onRetry={handleRefresh}
    >
      {/* KPI Cards */}
      {data && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.light', display: 'flex' }}>
                      <IconCash size={32} color="green" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Total Net Profit</Typography>
                      <Typography variant="h4" sx={{ color: 'success.main' }}>
                        {formatCurrency(data.summary.total_net_profit)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {data.summary.total_deals} deals closed
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', display: 'flex' }}>
                      <IconTrendingUp size={32} color="blue" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Average ROAS</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {formatNumber(data.summary.average_roas, 2)}x
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Return on Ad Spend</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.light', display: 'flex' }}>
                      <IconReceipt size={32} color="orange" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Average CPA</Typography>
                      <Typography variant="h4" sx={{ color: 'warning.main' }}>
                        {formatCurrency(data.summary.average_cpa)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Cost Per Acquisition</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Data Table */}
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>UTM Source</TableCell>
                  <TableCell>UTM Campaign</TableCell>
                  <TableCell>Ad ID</TableCell>
                  <TableCell align="right">Leads</TableCell>
                  <TableCell align="right">Deals</TableCell>
                  <TableCell align="right">Gross Revenue</TableCell>
                  <TableCell align="right">Direct Cost</TableCell>
                  <TableCell align="right">Net Profit</TableCell>
                  <TableCell align="right">ROAS</TableCell>
                  <TableCell align="right">CPA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.rows.map((row, index) => (
                  <TableRow key={`${row.utm_source}-${row.utm_campaign}-${row.ad_id}-${index}`} hover>
                    <TableCell>{row.utm_source || '—'}</TableCell>
                    <TableCell>{row.utm_campaign || '—'}</TableCell>
                    <TableCell>{row.ad_id || '—'}</TableCell>
                    <TableCell align="right">{row.leads_count}</TableCell>
                    <TableCell align="right">{row.deals_count}</TableCell>
                    <TableCell align="right">{formatCurrency(row.gross_revenue)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.direct_cost)}</TableCell>
                    <TableCell align="right" sx={{ color: row.net_profit >= 0 ? 'success.main' : 'error.main' }}>
                      <strong>{formatCurrency(row.net_profit)}</strong>
                    </TableCell>
                    <TableCell align="right">{formatNumber(row.roas, 2)}x</TableCell>
                    <TableCell align="right">{formatCurrency(row.cpa)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </AppPage>
  );
}

