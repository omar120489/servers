import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Grid,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  FormHelperText,
  Slider,
  Autocomplete,
  SelectChangeEvent,
} from '@mui/material';
// cspell:ignore pangea
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TimelineIcon from '@mui/icons-material/Timeline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import SortIcon from '@mui/icons-material/Sort';
import { useNavigate } from 'react-router-dom';
import ExportDialog, { ExportField } from '../components/export/ExportDialog';
import RichTextEditor from '../components/notes/RichTextEditor';
import ActivityTimeline from '../components/timeline/ActivityTimeline';
import LogActivityDialog from '../components/activities/LogActivityDialog';
import type { Activity } from '../components/timeline/TimelineItem';
import { listDeals, createDeal, updateDeal, deleteDeal } from '../services/deals';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  company?: string;
  contact?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
}

interface DealFormData extends Partial<Deal> {
  title: string;
  value: number;
  stage: string;
}

interface FormErrors {
  title?: string;
  value?: string;
  stage?: string;
  probability?: string;
}

const STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: '#90caf9' },
  { id: 'qualification', label: 'Qualification', color: '#ce93d8' },
  { id: 'proposal', label: 'Proposal', color: '#fff59d' },
  { id: 'negotiation', label: 'Negotiation', color: '#ffcc80' },
  { id: 'closed_won', label: 'Closed Won', color: '#a5d6a7' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef9a9a' },
];

type SortField = 'value' | 'probability' | 'expectedCloseDate' | 'title';
type SortDirection = 'asc' | 'desc';

export default function DealsEnhanced() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<DealFormData>({
    title: '',
    value: 0,
    stage: 'prospecting',
    company: '',
    contact: '',
    probability: 50,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [logActivityOpen, setLogActivityOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'call',
      description: 'Discussed pricing and timeline for Q4 implementation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe',
      metadata: {
        duration: '30 mins',
        status: 'completed',
        priority: 'high',
      },
    },
    {
      id: '2',
      type: 'email',
      description: 'Sent proposal document with pricing breakdown',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: 'Jane Smith',
      metadata: {
        subject: 'Proposal: Enterprise Software License',
        status: 'completed',
      },
    },
    {
      id: '3',
      type: 'meeting',
      description: 'Product demo with technical team',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe',
      metadata: {
        subject: 'Product Demo',
        duration: '1 hour',
        status: 'completed',
      },
    },
    {
      id: '4',
      type: 'note',
      description: 'Client interested in enterprise plan',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'Jane Smith',
      metadata: {
        status: 'completed',
      },
    },
  ]);

  // Advanced filtering state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [valueRange, setValueRange] = useState<[number, number]>([0, 100000]);
  const [probabilityRange, setProbabilityRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  // Bulk operations state
  const [selectedDealIds, setSelectedDealIds] = useState<Set<string>>(new Set());
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);

  // Fetch deals using service layer
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await listDeals({});
        const dealsData = response.items.map((deal: any) => ({
          id: deal.id,
          title: deal.title,
          value: deal.value,
          stage: deal.stage,
          company: deal.company,
          contact: deal.contact,
          owner: 'John Doe', // Mock owner
          probability: Math.floor(Math.random() * 100),
          expectedCloseDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tags: ['enterprise', 'high-value'].slice(0, Math.floor(Math.random() * 3)),
          notes: 'Sample notes',
        }));
        setDeals(dealsData);
        setSnackbar({ open: true, message: 'Deals loaded successfully', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Error loading deals', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Form validation
  const validateDealForm = useCallback((data: DealFormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!data.value || data.value <= 0) {
      errors.value = 'Value must be greater than 0';
    }
    
    if (!data.stage) {
      errors.stage = 'Stage is required';
    }
    
    if (data.probability !== undefined && (data.probability < 0 || data.probability > 100)) {
      errors.probability = 'Probability must be between 0 and 100';
    }
    
    return errors;
  }, []);

  // Drag and drop handler
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId;
    
    // Optimistic update
    setDeals(prev => prev.map(deal => 
      deal.id === draggableId ? { ...deal, stage: newStage } : deal
    ));

    try {
      await updateDeal(parseInt(draggableId), { stage: newStage });
      setSnackbar({ 
        open: true, 
        message: `Deal moved to ${STAGES.find(s => s.id === newStage)?.label}`, 
        severity: 'success' 
      });
    } catch (error) {
      // Revert on error
      setDeals(prev => prev.map(deal => 
        deal.id === draggableId ? { ...deal, stage: source.droppableId } : deal
      ));
      setSnackbar({ open: true, message: 'Failed to update deal', severity: 'error' });
    }
  }, []);

  // Add deal handler
  const handleAddDeal = useCallback(async () => {
    const errors = validateDealForm(newDeal);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const createdDeal = await createDeal({
        name: newDeal.title,
        amount: newDeal.value,
        stage: newDeal.stage,
      });

      const deal: Deal = {
        id: createdDeal.id,
        title: newDeal.title,
        value: newDeal.value,
        stage: newDeal.stage,
        company: newDeal.company,
        contact: newDeal.contact,
        owner: 'John Doe',
        probability: newDeal.probability || 50,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: [],
        notes: newDeal.notes,
      };

      setDeals(prev => [...prev, deal]);
      setAddDialogOpen(false);
      setNewDeal({ title: '', value: 0, stage: 'prospecting', company: '', contact: '', probability: 50 });
      setFormErrors({});
      setSnackbar({ open: true, message: 'Deal created successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create deal', severity: 'error' });
    }
  }, [newDeal, validateDealForm]);

  // Edit deal handler
  const handleEditDeal = useCallback(async () => {
    if (!selectedDeal) return;

    const errors = validateDealForm(newDeal);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await updateDeal(parseInt(selectedDeal.id), {
        name: newDeal.title,
        amount: newDeal.value,
        stage: newDeal.stage,
      });

      setDeals(prev => prev.map(d => 
        d.id === selectedDeal.id 
          ? { ...d, ...newDeal }
          : d
      ));

      setEditDialogOpen(false);
      setSelectedDeal(null);
      setFormErrors({});
      setSnackbar({ open: true, message: 'Deal updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update deal', severity: 'error' });
    }
  }, [selectedDeal, newDeal, validateDealForm]);

  // Delete deal handler
  const handleDeleteDeal = useCallback(async (dealId: string) => {
    try {
      await deleteDeal(parseInt(dealId));
      setDeals(prev => prev.filter(d => d.id !== dealId));
      setMenuAnchor(null);
      setSnackbar({ open: true, message: 'Deal deleted', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete deal', severity: 'error' });
    }
  }, []);

  // Bulk delete handler
  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(
        Array.from(selectedDealIds).map(id => deleteDeal(parseInt(id)))
      );
      setDeals(prev => prev.filter(d => !selectedDealIds.has(d.id)));
      setSelectedDealIds(new Set());
      setBulkMenuAnchor(null);
      setSnackbar({ 
        open: true, 
        message: `${selectedDealIds.size} deals deleted`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete deals', severity: 'error' });
    }
  }, [selectedDealIds]);

  // Bulk stage change handler
  const handleBulkStageChange = useCallback(async (newStage: string) => {
    try {
      await Promise.all(
        Array.from(selectedDealIds).map(id => 
          updateDeal(parseInt(id), { stage: newStage })
        )
      );
      setDeals(prev => prev.map(d => 
        selectedDealIds.has(d.id) ? { ...d, stage: newStage } : d
      ));
      setSelectedDealIds(new Set());
      setBulkMenuAnchor(null);
      setSnackbar({ 
        open: true, 
        message: `${selectedDealIds.size} deals moved to ${STAGES.find(s => s.id === newStage)?.label}`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update deals', severity: 'error' });
    }
  }, [selectedDealIds]);

  // Open edit dialog
  const handleOpenEditDialog = useCallback((deal: Deal) => {
    setSelectedDeal(deal);
    setNewDeal({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      company: deal.company,
      contact: deal.contact,
      probability: deal.probability,
      notes: deal.notes,
      tags: deal.tags,
    });
    setEditDialogOpen(true);
    setMenuAnchor(null);
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    deals.forEach(deal => {
      deal.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [deals]);

  // Filtered and sorted deals
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = deals.filter(deal => {
      // Search filter
      const matchesSearch = !searchQuery || 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Owner filter
      const matchesOwner = !selectedOwner || deal.owner === selectedOwner;
      
      // Value range filter
      const matchesValue = deal.value >= valueRange[0] && deal.value <= valueRange[1];
      
      // Probability range filter
      const matchesProbability = !deal.probability || 
        (deal.probability >= probabilityRange[0] && deal.probability <= probabilityRange[1]);
      
      // Date range filter
      const matchesDate = !dateRange.start || !dateRange.end || !deal.expectedCloseDate ||
        (deal.expectedCloseDate >= dateRange.start && deal.expectedCloseDate <= dateRange.end);
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => deal.tags?.includes(tag));
      
      // Stages filter
      const matchesStages = selectedStages.length === 0 || 
        selectedStages.includes(deal.stage);
      
      return matchesSearch && matchesOwner && matchesValue && matchesProbability && 
             matchesDate && matchesTags && matchesStages;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'probability':
          comparison = (a.probability || 0) - (b.probability || 0);
          break;
        case 'expectedCloseDate':
          comparison = (a.expectedCloseDate || '').localeCompare(b.expectedCloseDate || '');
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [deals, searchQuery, selectedOwner, valueRange, probabilityRange, dateRange, selectedTags, selectedStages, sortField, sortDirection]);

  const getDealsForStage = useCallback((stageId: string) => 
    filteredAndSortedDeals.filter(d => d.stage === stageId), 
    [filteredAndSortedDeals]
  );

  const getStageTotalValue = useCallback((stageId: string) => 
    getDealsForStage(stageId).reduce((sum, d) => sum + d.value, 0),
    [getDealsForStage]
  );

  const formatCurrency = useCallback((value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value),
    []
  );

  const getHealthIndicator = useCallback((deal: Deal) => {
    if (!deal.probability) return null;
    if (deal.probability >= 70) return <CheckCircleIcon fontSize="small" color="success" />;
    if (deal.probability >= 40) return <TrendingUpIcon fontSize="small" color="warning" />;
    return <WarningIcon fontSize="small" color="error" />;
  }, []);

  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'email': return <EmailIcon fontSize="small" />;
      case 'call': return <PhoneIcon fontSize="small" />;
      case 'meeting': return <EventIcon fontSize="small" />;
      default: return <TimelineIcon fontSize="small" />;
    }
  }, []);

  const allOwners = useMemo(() => 
    Array.from(new Set(deals.map(d => d.owner).filter(Boolean))) as string[],
    [deals]
  );

  const exportFields: ExportField[] = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'value', label: 'Value' },
    { id: 'stage', label: 'Stage' },
    { id: 'company', label: 'Company' },
    { id: 'contact', label: 'Contact' },
    { id: 'owner', label: 'Owner' },
    { id: 'probability', label: 'Probability (%)' },
    { id: 'expectedCloseDate', label: 'Expected Close Date' },
    { id: 'tags', label: 'Tags' },
    { id: 'notes', label: 'Notes' },
  ];

  const handleExportClose = () => {
    setExportDialogOpen(false);
    setSnackbar({ open: true, message: 'Deals exported successfully', severity: 'success' });
  };

  // Toggle deal selection
  const toggleDealSelection = useCallback((dealId: string) => {
    setSelectedDealIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  }, []);

  // Select all deals in current view
  const handleSelectAll = useCallback(() => {
    if (selectedDealIds.size === filteredAndSortedDeals.length) {
      setSelectedDealIds(new Set());
    } else {
      setSelectedDealIds(new Set(filteredAndSortedDeals.map(d => d.id)));
    }
  }, [filteredAndSortedDeals, selectedDealIds.size]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="h4" fontWeight="bold">Deals Pipeline</Typography>
          <Stack direction="row" spacing={1}>
            {selectedDealIds.size > 0 && (
              <Button 
                size="small" 
                variant="outlined" 
                color="secondary"
                onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
              >
                {selectedDealIds.size} Selected
              </Button>
            )}
            <Button size="small" variant="outlined" startIcon={<SortIcon />} onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
              Sort
            </Button>
            <Button size="small" variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterDialogOpen(true)}>
              Filters
            </Button>
            <Button size="small" variant="outlined" startIcon={<TimelineIcon />} onClick={() => navigate('/pipeline')}>
              Analytics
            </Button>
            <Button size="small" variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => setExportDialogOpen(true)}>
              Export
            </Button>
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
              New Deal
            </Button>
          </Stack>
        </Stack>

        {/* Filters */}
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search deals, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Owner</InputLabel>
              <Select value={selectedOwner} label="Owner" onChange={(e) => setSelectedOwner(e.target.value)}>
                <MenuItem value="">All Owners</MenuItem>
                {allOwners.map(owner => <MenuItem key={owner} value={owner}>{owner}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
              <Tooltip title="Select All">
                <Checkbox
                  checked={selectedDealIds.size === filteredAndSortedDeals.length && filteredAndSortedDeals.length > 0}
                  indeterminate={selectedDealIds.size > 0 && selectedDealIds.size < filteredAndSortedDeals.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </Tooltip>
              <Chip
                icon={<AttachMoneyIcon />}
                label={`${filteredAndSortedDeals.length} deals • ${formatCurrency(filteredAndSortedDeals.reduce((sum, d) => sum + d.value, 0))}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 2 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              height: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-track': { bgcolor: 'action.hover', borderRadius: 1 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'action.selected', borderRadius: 1 },
            }}
          >
            {STAGES.map(stage => {
              const stageDeals = getDealsForStage(stage.id);
              const totalValue = getStageTotalValue(stage.id);

              return (
                <Box key={stage.id} sx={{ minWidth: 280, maxWidth: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Column Header */}
                  <Card sx={{ mb: 1, bgcolor: stage.color, color: '#000', flexShrink: 0 }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight="bold">{stage.label}</Typography>
                        <Chip label={stageDeals.length} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.1)', height: 20 }} />
                      </Stack>
                      <Typography variant="caption" fontWeight="bold">{formatCurrency(totalValue)}</Typography>
                    </CardContent>
                  </Card>

                  {/* Droppable Column */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          flex: 1,
                          overflowY: 'auto',
                          bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                          borderRadius: 1,
                          p: 0.5,
                          '&::-webkit-scrollbar': { width: 6 },
                          '&::-webkit-scrollbar-thumb': { bgcolor: 'action.selected', borderRadius: 1 },
                        }}
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 0.75,
                                  cursor: 'grab',
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                  boxShadow: snapshot.isDragging ? 4 : 1,
                                  '&:hover': { boxShadow: 2 },
                                  bgcolor: selectedDealIds.has(deal.id) ? 'action.selected' : 'background.paper',
                                }}
                              >
                                <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                                    <Stack direction="row" spacing={0.5} alignItems="center" flex={1}>
                                      <Checkbox
                                        size="small"
                                        checked={selectedDealIds.has(deal.id)}
                                        onChange={() => toggleDealSelection(deal.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{ p: 0 }}
                                      />
                                      <Typography variant="body2" fontWeight="bold" sx={{ flex: 1, fontSize: '0.875rem' }}>
                                        {deal.title}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.25} alignItems="center">
                                      {getHealthIndicator(deal)}
                                      <IconButton
                                        size="small"
                                        sx={{ p: 0.25 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDeal(deal);
                                          setMenuAnchor(e.currentTarget);
                                        }}
                                      >
                                        <MoreVertIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Stack>
                                  </Stack>

                                  <Typography variant="h6" color="primary" sx={{ fontSize: '1rem', mb: 0.5 }}>
                                    {formatCurrency(deal.value)}
                                  </Typography>

                                  {deal.probability && (
                                    <Box sx={{ mb: 0.75 }}>
                                      <Stack direction="row" justifyContent="space-between" mb={0.25}>
                                        <Typography variant="caption" color="textSecondary" fontSize="0.7rem">Probability</Typography>
                                        <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">{deal.probability}%</Typography>
                                      </Stack>
                                      <LinearProgress
                                        variant="determinate"
                                        value={deal.probability}
                                        sx={{ height: 3, borderRadius: 1 }}
                                        color={deal.probability >= 70 ? 'success' : deal.probability >= 40 ? 'warning' : 'error'}
                                      />
                                    </Box>
                                  )}

                                  {deal.company && (
                                    <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
                                      🏢 {deal.company}
                                    </Typography>
                                  )}
                                  {deal.owner && (
                                    <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
                                      👨‍💼 {deal.owner}
                                    </Typography>
                                  )}
                                  {deal.expectedCloseDate && (
                                    <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
                                      📅 {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Typography>
                                  )}

                                  {deal.tags && deal.tags.length > 0 && (
                                    <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" gap={0.5}>
                                      {deal.tags.slice(0, 2).map(tag => (
                                        <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                                      ))}
                                      {deal.tags.length > 2 && (
                                        <Chip label={`+${deal.tags.length - 2}`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                                      )}
                                    </Stack>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Box>
              );
            })}
          </Box>
        </DragDropContext>
      </Box>

      {/* Deal Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { setDetailsOpen(true); setMenuAnchor(null); }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => selectedDeal && handleOpenEditDialog(selectedDeal)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => selectedDeal && handleDeleteDeal(selectedDeal.id)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Bulk Operations Menu */}
      <Menu anchorEl={bulkMenuAnchor} open={Boolean(bulkMenuAnchor)} onClose={() => setBulkMenuAnchor(null)}>
        <MenuItem disabled sx={{ fontWeight: 'bold' }}>Move to Stage:</MenuItem>
        {STAGES.map(stage => (
          <MenuItem key={stage.id} onClick={() => handleBulkStageChange(stage.id)}>
            {stage.label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Selected
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu anchorEl={sortMenuAnchor} open={Boolean(sortMenuAnchor)} onClose={() => setSortMenuAnchor(null)}>
        <MenuItem onClick={() => { setSortField('value'); setSortDirection('desc'); setSortMenuAnchor(null); }}>
          Value (High to Low)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('value'); setSortDirection('asc'); setSortMenuAnchor(null); }}>
          Value (Low to High)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('probability'); setSortDirection('desc'); setSortMenuAnchor(null); }}>
          Probability (High to Low)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('probability'); setSortDirection('asc'); setSortMenuAnchor(null); }}>
          Probability (Low to High)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('expectedCloseDate'); setSortDirection('asc'); setSortMenuAnchor(null); }}>
          Close Date (Nearest First)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('expectedCloseDate'); setSortDirection('desc'); setSortMenuAnchor(null); }}>
          Close Date (Furthest First)
        </MenuItem>
        <MenuItem onClick={() => { setSortField('title'); setSortDirection('asc'); setSortMenuAnchor(null); }}>
          Title (A-Z)
        </MenuItem>
      </Menu>

      {/* Advanced Filters Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography gutterBottom>Value Range</Typography>
              <Slider
                value={valueRange}
                onChange={(_, newValue) => setValueRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                valueLabelFormat={(value) => formatCurrency(value)}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">{formatCurrency(valueRange[0])}</Typography>
                <Typography variant="caption">{formatCurrency(valueRange[1])}</Typography>
              </Stack>
            </Box>

            <Box>
              <Typography gutterBottom>Probability Range (%)</Typography>
              <Slider
                value={probabilityRange}
                onChange={(_, newValue) => setProbabilityRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">{probabilityRange[0]}%</Typography>
                <Typography variant="caption">{probabilityRange[1]}%</Typography>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>

            <Autocomplete
              multiple
              options={allTags}
              value={selectedTags}
              onChange={(_, newValue) => setSelectedTags(newValue)}
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />

            <Autocomplete
              multiple
              options={STAGES.map(s => s.id)}
              getOptionLabel={(option) => STAGES.find(s => s.id === option)?.label || option}
              value={selectedStages}
              onChange={(_, newValue) => setSelectedStages(newValue)}
              renderInput={(params) => <TextField {...params} label="Stages" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setValueRange([0, 100000]);
            setProbabilityRange([0, 100]);
            setDateRange({ start: '', end: '' });
            setSelectedTags([]);
            setSelectedStages([]);
          }}>
            Clear All
          </Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Deal Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        {selectedDeal && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{selectedDeal.title}</Typography>
                <Chip label={STAGES.find(s => s.id === selectedDeal.stage)?.label} sx={{ bgcolor: STAGES.find(s => s.id === selectedDeal.stage)?.color }} />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Deal Information</Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Value</Typography>
                      <Typography variant="h5" color="primary">{formatCurrency(selectedDeal.value)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Company</Typography>
                      <Typography variant="body1">{selectedDeal.company || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Contact</Typography>
                      <Typography variant="body1">{selectedDeal.contact || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Owner</Typography>
                      <Typography variant="body1">{selectedDeal.owner || 'N/A'}</Typography>
                    </Box>
                    {selectedDeal.probability && (
                      <Box>
                        <Typography variant="caption" color="textSecondary">Probability</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={selectedDeal.probability}
                            sx={{ flex: 1, height: 8, borderRadius: 1 }}
                            color={selectedDeal.probability >= 70 ? 'success' : selectedDeal.probability >= 40 ? 'warning' : 'error'}
                          />
                          <Typography variant="body2" fontWeight="bold">{selectedDeal.probability}%</Typography>
                        </Stack>
                      </Box>
                    )}
                    {selectedDeal.expectedCloseDate && (
                      <Box>
                        <Typography variant="caption" color="textSecondary">Expected Close Date</Typography>
                        <Typography variant="body1">{new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}</Typography>
                      </Box>
                    )}
                    {selectedDeal.tags && selectedDeal.tags.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="textSecondary">Tags</Typography>
                        <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                          {selectedDeal.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Recent Activity</Typography>
                  <List dense>
                    {activities.slice(0, 4).map(activity => (
                      <ListItem key={activity.id}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.description}
                          secondary={`${activity.user} • ${new Date(activity.timestamp).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {selectedDeal.notes && (
                  <Grid item xs={12}>
                    <RichTextEditor
                      label="Notes"
                      value={selectedDeal.notes}
                      onChange={() => {}}
                      readOnly
                      minHeight={150}
                    />
                  </Grid>
                )}

                {/* Activity Timeline */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Activity Timeline
                  </Typography>
                  <ActivityTimeline activities={activities} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setLogActivityOpen(true)}>
                Log Activity
              </Button>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleOpenEditDialog(selectedDeal)}>
                Edit Deal
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Deal Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Deal</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Deal Title"
              fullWidth
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            <TextField
              label="Value"
              type="number"
              fullWidth
              value={newDeal.value}
              onChange={(e) => setNewDeal({ ...newDeal, value: parseFloat(e.target.value) })}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              error={!!formErrors.value}
              helperText={formErrors.value}
              required
            />
            <FormControl fullWidth error={!!formErrors.stage} required>
              <InputLabel>Stage</InputLabel>
              <Select value={newDeal.stage} label="Stage" onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}>
                {STAGES.map(stage => <MenuItem key={stage.id} value={stage.id}>{stage.label}</MenuItem>)}
              </Select>
              {formErrors.stage && <FormHelperText>{formErrors.stage}</FormHelperText>}
            </FormControl>
            <TextField
              label="Company"
              fullWidth
              value={newDeal.company}
              onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
            />
            <TextField
              label="Contact"
              fullWidth
              value={newDeal.contact}
              onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
            />
            <TextField
              label="Probability (%)"
              type="number"
              fullWidth
              value={newDeal.probability}
              onChange={(e) => setNewDeal({ ...newDeal, probability: parseInt(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
              error={!!formErrors.probability}
              helperText={formErrors.probability}
            />
            <RichTextEditor
              label="Notes"
              value={newDeal.notes || ''}
              onChange={(value) => setNewDeal({ ...newDeal, notes: value })}
              placeholder="Add notes about this deal..."
              minHeight={150}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddDialogOpen(false);
            setFormErrors({});
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddDeal} startIcon={<AddIcon />}>
            Create Deal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Deal</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Deal Title"
              fullWidth
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            <TextField
              label="Value"
              type="number"
              fullWidth
              value={newDeal.value}
              onChange={(e) => setNewDeal({ ...newDeal, value: parseFloat(e.target.value) })}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              error={!!formErrors.value}
              helperText={formErrors.value}
              required
            />
            <FormControl fullWidth error={!!formErrors.stage} required>
              <InputLabel>Stage</InputLabel>
              <Select value={newDeal.stage} label="Stage" onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}>
                {STAGES.map(stage => <MenuItem key={stage.id} value={stage.id}>{stage.label}</MenuItem>)}
              </Select>
              {formErrors.stage && <FormHelperText>{formErrors.stage}</FormHelperText>}
            </FormControl>
            <TextField
              label="Company"
              fullWidth
              value={newDeal.company}
              onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
            />
            <TextField
              label="Contact"
              fullWidth
              value={newDeal.contact}
              onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
            />
            <TextField
              label="Probability (%)"
              type="number"
              fullWidth
              value={newDeal.probability}
              onChange={(e) => setNewDeal({ ...newDeal, probability: parseInt(e.target.value) })}
              inputProps={{ min: 0, max: 100 }}
              error={!!formErrors.probability}
              helperText={formErrors.probability}
            />
            <RichTextEditor
              label="Notes"
              value={newDeal.notes || ''}
              onChange={(value) => setNewDeal({ ...newDeal, notes: value })}
              placeholder="Add notes about this deal..."
              minHeight={150}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setFormErrors({});
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditDeal} startIcon={<EditIcon />}>
            Update Deal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={handleExportClose}
        data={filteredAndSortedDeals}
        fields={exportFields}
        filename="deals"
        title="Export Deals"
      />

      {/* Log Activity Dialog */}
      <LogActivityDialog
        open={logActivityOpen}
        onClose={() => setLogActivityOpen(false)}
        onSave={(activity) => {
          const newActivity: Activity = {
            ...activity,
            id: String(Date.now()),
            timestamp: new Date().toISOString(),
          };
          setActivities([newActivity, ...activities]);
          setSnackbar({ open: true, message: 'Activity logged successfully', severity: 'success' });
        }}
        prefilledData={{
          contact: selectedDeal?.contact,
          company: selectedDeal?.company,
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

