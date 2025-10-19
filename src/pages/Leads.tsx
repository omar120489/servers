import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getLeads } from '../store/leadsSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Avatar,
  Stack,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
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
  Slider,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import type { Lead } from '../types/crm';
import PriorityBadge from '../components/common/PriorityBadge';
import ScoreBreakdown from '../components/scoring/ScoreBreakdown';
import ExportDialog, { type ExportField } from '../components/export/ExportDialog';
import AssignmentIndicator from '../components/leads/AssignmentIndicator';
import EmailComposer from '../components/email/EmailComposer';
import { routeLead, shouldAutoConvert, autoConvertLead } from '../utils/assignment';

const mockLeads: Lead[] = [
  { id: 1, first_name: 'Alice', last_name: 'Williams', email: 'alice.w@startup.com', phone: '+1 (555) 111-2222', company: 'Startup Alpha', status: 'new', score: 85, scores: { overall: 85, health: 90, engagement: 82, urgency: 75, conversion: 88 } },
  { id: 2, first_name: 'Bob', last_name: 'Martinez', email: 'bob.m@techcorp.com', phone: '+1 (555) 222-3333', company: 'TechCorp', status: 'contacted', score: 72, scores: { overall: 72, health: 78, engagement: 70, urgency: 65, conversion: 75 } },
  { id: 3, first_name: 'Carol', last_name: 'Garcia', email: 'carol.g@innovate.io', phone: '+1 (555) 333-4444', company: 'Innovate Solutions', status: 'qualified', score: 90, scores: { overall: 90, health: 95, engagement: 88, urgency: 85, conversion: 92 } },
  { id: 4, first_name: 'David', last_name: 'Rodriguez', email: 'david.r@enterprise.com', phone: '+1 (555) 444-5555', company: 'Enterprise Co', status: 'contacted', score: 65, scores: { overall: 65, health: 70, engagement: 60, urgency: 68, conversion: 62 } },
  { id: 5, first_name: 'Emma', last_name: 'Lopez', email: 'emma.l@digital.com', phone: '+1 (555) 555-6666', company: 'Digital Agency', status: 'new', score: 78, scores: { overall: 78, health: 80, engagement: 75, urgency: 80, conversion: 77 } },
  { id: 6, first_name: 'Frank', last_name: 'Hernandez', email: 'frank.h@cloud.io', phone: '+1 (555) 666-7777', company: 'CloudTech', status: 'qualified', score: 88, scores: { overall: 88, health: 92, engagement: 85, urgency: 90, conversion: 85 } },
  { id: 7, first_name: 'Grace', last_name: 'Wilson', email: 'grace.w@saas.com', phone: '+1 (555) 777-8888', company: 'SaaS Platform', status: 'lost', score: 45, scores: { overall: 45, health: 50, engagement: 40, urgency: 42, conversion: 48 } },
  { id: 8, first_name: 'Henry', last_name: 'Anderson', email: 'henry.a@mobile.com', phone: '+1 (555) 888-9999', company: 'Mobile First', status: 'converted', score: 95, scores: { overall: 95, health: 98, engagement: 95, urgency: 92, conversion: 95 } },
];

type SortOption = 'score-desc' | 'score-asc' | 'name-asc' | 'name-desc' | 'company-asc' | 'date-desc';

// Saved views configuration
interface ViewDef {
  label: string;
  filter: (lead: Lead) => boolean;
  sort: SortOption;
}

const SAVED_VIEWS: Record<string, ViewDef> = {
  all: {
    label: 'All leads',
    filter: () => true,
    sort: 'score-desc'
  },
  'new-this-week': {
    label: 'New this week',
    filter: (lead) => {
      if (!lead.created_at) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(lead.created_at) > weekAgo;
    },
    sort: 'date-desc' as SortOption
  },
  'no-reply-3d': {
    label: 'No reply 3+ days',
    filter: (lead) => {
      if (!lead.updated_at) return lead.status === 'contacted';
      const daysSince = Math.floor((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 3 && lead.status !== 'converted';
    },
    sort: 'date-asc' as SortOption
  },
  'high-score-uncontacted': {
    label: 'Score ≥80 & uncontacted',
    filter: (lead) => (lead.score ?? 0) >= 80 && lead.status === 'new',
    sort: 'score-desc' as SortOption
  },
  'trial-started': {
    label: 'Trial started (7 days)',
    filter: (lead) => {
      if (!lead.created_at) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lead.status === 'qualified' && new Date(lead.created_at) > weekAgo;
    },
    sort: 'date-desc' as SortOption
  }
};

// LocalStorage keys
const VIEW_KEY = 'leads:view';
const CUSTOM_VIEWS_KEY = 'leads:customViews';

export default function Leads() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(s => s.leads);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [emailTo, setEmailTo] = useState<{ email: string; leadId: string } | null>(null);
  
  // Advanced filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  
  // Saved views with persistence
  const [currentView, setCurrentView] = useState<string>(() => {
    return localStorage.getItem(VIEW_KEY) || 'all';
  });
  const [customViews, setCustomViews] = useState<Record<string, ViewDef>>(() => {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_VIEWS_KEY) || '{}');
    } catch {
      return {};
    }
  });

  // Persist view selection
  useEffect(() => {
    localStorage.setItem(VIEW_KEY, currentView);
  }, [currentView]);

  // Persist custom views
  useEffect(() => {
    localStorage.setItem(CUSTOM_VIEWS_KEY, JSON.stringify(customViews));
  }, [customViews]);
  
  // Use mock data if API fails
  const displayLeads = items.length > 0 ? items : mockLeads;

  useEffect(() => { 
    dispatch(getLeads({ page: 1, size: 25 })); 
  }, [dispatch]);

  // Get all views (built-in + custom)
  const allViews = useMemo(() => ({ ...SAVED_VIEWS, ...customViews }), [customViews]);

  // Filter leads with saved view support
  const filteredLeads = useMemo(() => {
    const viewConfig = allViews[currentView] || SAVED_VIEWS.all;
    
    return displayLeads.filter(lead => {
      // Apply saved view filter first
      if (!viewConfig.filter(lead)) return false;
      
      // Search filter
      const searchMatch = search === '' || 
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(search.toLowerCase());
      
      // Status filter
      const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
      
      // Score range filter
      const score = lead.score ?? 0;
      const scoreMatch = score >= scoreRange[0] && score <= scoreRange[1];
      
      return searchMatch && statusMatch && scoreMatch;
    });
  }, [displayLeads, search, statusFilter, scoreRange, currentView, allViews]);

  // Sort leads
  const sortedLeads = useMemo(() => {
    const sorted = [...filteredLeads];
    switch (sortBy) {
      case 'score-desc':
        return sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      case 'score-asc':
        return sorted.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
      case 'name-asc':
        return sorted.sort((a, b) => 
          `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
        );
      case 'company-asc':
        return sorted.sort((a, b) => (a.company ?? '').localeCompare(b.company ?? ''));
      case 'date-desc':
        return sorted.sort((a, b) => {
          const aId = typeof a.id === 'number' ? a.id : 0;
          const bId = typeof b.id === 'number' ? b.id : 0;
          return bId - aId;
        }); // Mock: use ID as proxy for date
      default:
        return sorted;
    }
  }, [filteredLeads, sortBy]);

  // Calculate summary stats
  const totalValue = useMemo(() => {
    // Mock: estimate value based on score (in reality, this would come from deal value)
    return sortedLeads.reduce((sum, lead) => sum + ((lead.score ?? 0) * 1000), 0);
  }, [sortedLeads]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'info';
      case 'contacted': return 'warning';
      case 'qualified': return 'success';
      case 'converted': return 'primary';
      case 'lost': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score?: number): 'success' | 'warning' | 'error' | 'primary' => {
    if (!score) return 'primary';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedLeads.length === sortedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(sortedLeads.map(lead => lead.id as number));
    }
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleBulkDelete = () => {
    // Mock: In real app, this would call an API
    setSelectedLeads([]);
    setBulkMenuAnchor(null);
  };

  const handleBulkStatusChange = (status: string) => {
    // Mock: In real app, this would call an API
    setSelectedLeads([]);
    setBulkMenuAnchor(null);
  };

  // Sort handlers
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setSortMenuAnchor(null);
  };

  // Filter handlers
  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setScoreRange([0, 100]);
  };

  // Email handler
  const handleSendEmail = (lead: Lead) => {
    if (lead.email) {
      setEmailTo({ email: lead.email, leadId: String(lead.id) });
      setEmailComposerOpen(true);
    }
    setAnchorEl(null);
  };

  // Assignment handler (called on lead creation/update)
  const handleAssignLead = (lead: Lead) => {
    const ownerId = routeLead(lead);
    
    // In production: update lead with owner_id
    // await updateLead(lead.id, { owner_id: ownerId });
    
    return ownerId;
  };

  // Auto-convert handler (called when lead is qualified)
  const handleQualifyLead = async (lead: Lead) => {
    if (shouldAutoConvert(lead)) {
      try {
        await autoConvertLead(lead);
      } catch (error) {
        console.error(`[AutoConvert] Failed to convert lead ${lead.id}:`, error);
      }
    }
  };

  // Export fields configuration
  const exportFields: ExportField[] = [
    { id: 'id', label: 'ID' },
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company', label: 'Company' },
    { id: 'status', label: 'Status' },
    { id: 'score', label: 'Score' },
  ];

  const formatLeadForExport = (lead: Lead) => ({
    id: lead.id,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    status: lead.status,
    score: lead.score,
  });

  if (loading && items.length === 0) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      {/* Header with Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Leads
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and qualify your sales leads
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
            Add Lead
          </Button>
        </Stack>
      </Stack>

      {error && items.length === 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
          <Typography variant="body2">
            Using demo data (API unavailable)
          </Typography>
        </Paper>
      )}

      {/* Search and Summary */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* View Selector */}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={currentView}
              label="View"
              onChange={(e) => {
                const view = e.target.value;
                setCurrentView(view);
                // Auto-apply the view's default sort
                const viewConfig = allViews[view];
                if (viewConfig) {
                  setSortBy(viewConfig.sort);
                }
              }}
            >
              {Object.entries(allViews).map(([key, view]) => (
                <MenuItem key={key} value={key}>
                  {view.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            placeholder="Search leads by name, email, or company..."
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
          {selectedLeads.length > 0 ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 200 }}>
              <Chip
                label={`${selectedLeads.length} selected`}
                color="primary"
                onDelete={() => setSelectedLeads([])}
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
              label={`${sortedLeads.length} leads • $${(totalValue / 1000).toFixed(0)}K`}
              color="default"
              variant="outlined"
              sx={{ minWidth: 150 }}
            />
          )}
        </Stack>
      </Paper>

      {/* Leads Table Section */}
      <Box mb={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          All Leads
        </Typography>
      </Box>

      {/* Table with Bulk Selection */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={sortedLeads.length > 0 && selectedLeads.length === sortedLeads.length}
                  indeterminate={selectedLeads.length > 0 && selectedLeads.length < sortedLeads.length}
                  onChange={handleSelectAll}
                  aria-label="Select all leads"
                />
              </TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLeads.map((lead) => {
              const isSelected = selectedLeads.includes(lead.id as number);
              return (
                <TableRow key={String(lead.id)} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectLead(lead.id as number)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(lead.first_name, lead.last_name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '-'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{lead.email || '-'}</TableCell>
                  <TableCell>{lead.phone || '-'}</TableCell>
                  <TableCell>{lead.company || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status || 'new'}
                      color={getStatusColor(lead.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="bold" color={`${getScoreColor(lead.score)}.main`}>
                        {lead.score ?? '-'}
                      </Typography>
                      {lead.score && (
                        <LinearProgress
                          variant="determinate"
                          value={lead.score}
                          color={getScoreColor(lead.score)}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {lead.score && <PriorityBadge score={lead.score} size="small" />}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, lead)}>
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
            Pipeline Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedLeads.length} of {displayLeads.length} leads
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Total estimated value: ${(totalValue / 1000).toFixed(0)}K
          </Typography>
        </Stack>
      </Box>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Convert to Contact</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AttachMoneyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Deal</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedLead && handleSendEmail(selectedLead)}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Lead</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Lead</ListItemText>
        </MenuItem>
      </Menu>

      {/* Email Composer Dialog */}
      <EmailComposer
        open={emailComposerOpen}
        onClose={() => {
          setEmailComposerOpen(false);
          setEmailTo(null);
        }}
        to={emailTo?.email || ''}
        recordType="lead"
        recordId={emailTo?.leadId}
        onSent={(_messageId) => {
          // noop
        }}
      />

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleSortChange('score-desc')}>
          Score (High to Low)
          {sortBy === 'score-desc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('score-asc')}>
          Score (Low to High)
          {sortBy === 'score-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleSortChange('name-asc')}>
          Name (A-Z)
          {sortBy === 'name-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('name-desc')}>
          Name (Z-A)
          {sortBy === 'name-desc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleSortChange('company-asc')}>
          Company (A-Z)
          {sortBy === 'company-asc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('date-desc')}>
          Date (Newest First)
          {sortBy === 'date-desc' && <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} color="primary" />}
        </MenuItem>
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkStatusChange('contacted')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Contacted</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusChange('qualified')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Qualified</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Advanced Filters Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">Advanced filters</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Filter options
              </Typography>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All statuses</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Score range
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {scoreRange[0]} - {scoreRange[1]}
              </Typography>
              <Slider
                value={scoreRange}
                onChange={(_, newValue) => setScoreRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                ]}
                getAriaLabel={() => 'Score range'}
              />
            </Box>

            <Typography variant="caption" color="text.secondary">
              Filtering {sortedLeads.length} of {displayLeads.length} leads
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        data={sortedLeads.map(formatLeadForExport)}
        fields={exportFields}
        filename="leads"
        title="Export leads"
      />
    </Box>
  );
}
