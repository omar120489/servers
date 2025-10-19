import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Stack,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExportDialog, { type ExportField } from '../components/export/ExportDialog';

// Mock data
const mockDeals = [
  { id: 1, title: 'Enterprise software license', value: 50000, stage: 'Prospecting', company: 'Acme Corp', contact: 'John Smith', probability: 30, expectedCloseDate: '2024-11-15' },
  { id: 2, title: 'Cloud migration project', value: 75000, stage: 'Qualification', company: 'TechCorp', contact: 'Jane Doe', probability: 50, expectedCloseDate: '2024-11-20' },
  { id: 3, title: 'Annual support contract', value: 25000, stage: 'Proposal', company: 'Innovate Inc', contact: 'Bob Wilson', probability: 70, expectedCloseDate: '2024-11-10' },
  { id: 4, title: 'Custom development', value: 120000, stage: 'Negotiation', company: 'Digital Solutions', contact: 'Alice Brown', probability: 80, expectedCloseDate: '2024-12-01' },
  { id: 5, title: 'Training package', value: 15000, stage: 'Closed Won', company: 'StartupXYZ', contact: 'Charlie Green', probability: 100, expectedCloseDate: '2024-10-15' },
  { id: 6, title: 'Consulting services', value: 45000, stage: 'Prospecting', company: 'Enterprise Co', contact: 'Diana White', probability: 25, expectedCloseDate: '2024-12-15' },
  { id: 7, title: 'Integration project', value: 90000, stage: 'Qualification', company: 'Global Tech', contact: 'Eve Black', probability: 45, expectedCloseDate: '2024-11-25' },
  { id: 8, title: 'Security audit', value: 35000, stage: 'Closed Lost', company: 'SecureNet', contact: 'Frank Gray', probability: 0, expectedCloseDate: '2024-10-20' },
];

type SortOption = 'value-desc' | 'value-asc' | 'title-asc' | 'probability-desc' | 'date-asc';

export default function Deals() {
  const [deals] = useState(mockDeals);
  const [search, setSearch] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('value-desc');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<typeof mockDeals[0] | null>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const searchMatch = search === '' || 
        deal.title.toLowerCase().includes(search.toLowerCase()) ||
        deal.company.toLowerCase().includes(search.toLowerCase()) ||
        deal.contact.toLowerCase().includes(search.toLowerCase());
      
      const stageMatch = stageFilter === 'all' || deal.stage === stageFilter;
      
      return searchMatch && stageMatch;
    });
  }, [deals, search, stageFilter]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    const sorted = [...filteredDeals];
    switch (sortBy) {
      case 'value-desc':
        return sorted.sort((a, b) => b.value - a.value);
      case 'value-asc':
        return sorted.sort((a, b) => a.value - b.value);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'probability-desc':
        return sorted.sort((a, b) => b.probability - a.probability);
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime());
      default:
        return sorted;
    }
  }, [filteredDeals, sortBy]);

  // Calculate summary
  const totalValue = useMemo(() => {
    return sortedDeals.reduce((sum, deal) => sum + deal.value, 0);
  }, [sortedDeals]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting': return 'info';
      case 'Qualification': return 'primary';
      case 'Proposal': return 'warning';
      case 'Negotiation': return 'secondary';
      case 'Closed Won': return 'success';
      case 'Closed Lost': return 'error';
      default: return 'default';
    }
  };

  const getProbabilityColor = (probability: number): 'success' | 'warning' | 'error' => {
    if (probability >= 70) return 'success';
    if (probability >= 40) return 'warning';
    return 'error';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handlers
  const handleSelectAll = () => {
    if (selectedDeals.length === sortedDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(sortedDeals.map(deal => deal.id));
    }
  };

  const handleSelectDeal = (dealId: number) => {
    setSelectedDeals(prev =>
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, deal: typeof mockDeals[0]) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeal(deal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeal(null);
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setSortMenuAnchor(null);
  };

  const handleBulkDelete = () => {
    setSelectedDeals([]);
    setBulkMenuAnchor(null);
  };

  const handleBulkStageChange = (stage: string) => {
    setSelectedDeals([]);
    setBulkMenuAnchor(null);
  };

  // Export configuration
  const exportFields: ExportField[] = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'value', label: 'Value' },
    { id: 'stage', label: 'Stage' },
    { id: 'company', label: 'Company' },
    { id: 'contact', label: 'Contact' },
    { id: 'probability', label: 'Probability' },
    { id: 'expectedCloseDate', label: 'Expected Close Date' },
  ];

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Deals pipeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your sales opportunities
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={(e) => setSortMenuAnchor(e.currentTarget)}
          >
            Sort
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
          >
            Export
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add deal
          </Button>
        </Stack>
      </Stack>

      {/* Search and Summary */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search deals by title, company, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {selectedDeals.length > 0 ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 200 }}>
              <Chip
                label={`${selectedDeals.length} selected`}
                color="primary"
                onDelete={() => setSelectedDeals([])}
              />
              <IconButton
                size="small"
                onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                color="primary"
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
          ) : (
            <Chip
              label={`${sortedDeals.length} deals • ${formatCurrency(totalValue)}`}
              color="default"
              variant="outlined"
              sx={{ minWidth: 200 }}
            />
          )}
        </Stack>
      </Paper>

      {/* Deals Table Section */}
      <Box mb={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          All deals
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={sortedDeals.length > 0 && selectedDeals.length === sortedDeals.length}
                  indeterminate={selectedDeals.length > 0 && selectedDeals.length < sortedDeals.length}
                  onChange={handleSelectAll}
                  aria-label="Select all deals"
                />
              </TableCell>
              <TableCell>Deal</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Probability</TableCell>
              <TableCell>Expected close</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDeals.map((deal) => {
              const isSelected = selectedDeals.includes(deal.id);
              return (
                <TableRow key={deal.id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectDeal(deal.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{deal.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="primary">
                      {formatCurrency(deal.value)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={deal.stage}
                      color={getStageColor(deal.stage) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{deal.company}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{deal.contact}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color={`${getProbabilityColor(deal.probability)}.main`}>
                        {deal.probability}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={deal.probability}
                        color={getProbabilityColor(deal.probability)}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(deal.expectedCloseDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, deal)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box mt={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">
            Pipeline summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedDeals.length} of {deals.length} deals
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Total value: {formatCurrency(totalValue)}
          </Typography>
        </Stack>
      </Box>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit deal</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete deal</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleSortChange('value-desc')}>
          Value (high to low)
          {sortBy === 'value-desc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('value-asc')}>
          Value (low to high)
          {sortBy === 'value-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleSortChange('title-asc')}>
          Title (A-Z)
          {sortBy === 'title-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('probability-desc')}>
          Probability (high to low)
          {sortBy === 'probability-desc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('date-asc')}>
          Close date (earliest first)
          {sortBy === 'date-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkStageChange('Qualification')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to qualification</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkStageChange('Proposal')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to proposal</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">Filter deals</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Stage</InputLabel>
              <Select
                value={stageFilter}
                label="Stage"
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <MenuItem value="all">All stages</MenuItem>
                <MenuItem value="Prospecting">Prospecting</MenuItem>
                <MenuItem value="Qualification">Qualification</MenuItem>
                <MenuItem value="Proposal">Proposal</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Closed Won">Closed won</MenuItem>
                <MenuItem value="Closed Lost">Closed lost</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
              Filtering {sortedDeals.length} of {deals.length} deals
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageFilter('all')}>Reset</Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained">
            Apply filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Deal details</DialogTitle>
        <DialogContent>
          {selectedDeal && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {selectedDeal.title}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {formatCurrency(selectedDeal.value)}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="body1">{selectedDeal.company}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body1">{selectedDeal.contact}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Stage
                  </Typography>
                  <Chip
                    label={selectedDeal.stage}
                    color={getStageColor(selectedDeal.stage) as any}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Probability
                  </Typography>
                  <Typography variant="subtitle1">{selectedDeal.probability}%</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Expected close date
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedDeal.expectedCloseDate)}</Typography>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          <Button variant="contained">Edit deal</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        data={sortedDeals}
        fields={exportFields}
        filename="deals"
        title="Export deals"
      />
    </Box>
  );
}
