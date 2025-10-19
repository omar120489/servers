import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import ExportDialog, { ExportField } from '../components/export/ExportDialog';
import RichTextEditor from '../components/notes/RichTextEditor';
import ActivityTimeline from '../components/timeline/ActivityTimeline';
import LogActivityDialog from '../components/activities/LogActivityDialog';
import type { Activity } from '../components/timeline/TimelineItem';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

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

const STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: '#90caf9' },
  { id: 'qualification', label: 'Qualification', color: '#ce93d8' },
  { id: 'proposal', label: 'Proposal', color: '#fff59d' },
  { id: 'negotiation', label: 'Negotiation', color: '#ffcc80' },
  { id: 'closed_won', label: 'Closed Won', color: '#a5d6a7' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef9a9a' },
];

const MOCK_DEALS: Deal[] = [
  { id: '1', title: 'Enterprise Software License', value: 50000, stage: 'prospecting', company: 'Acme Corp', contact: 'John Smith', owner: 'John Doe', probability: 30, expectedCloseDate: '2024-11-15', tags: ['enterprise', 'high-value'], notes: 'Large enterprise client' },
  { id: '2', title: 'Cloud Migration Project', value: 75000, stage: 'prospecting', company: 'TechStart Inc', contact: 'Sarah Johnson', owner: 'Jane Smith', probability: 25, expectedCloseDate: '2024-12-01', tags: ['cloud', 'migration'] },
  { id: '3', title: 'Annual Support Contract', value: 25000, stage: 'qualification', company: 'Global Systems', contact: 'Mike Chen', owner: 'John Doe', probability: 45, expectedCloseDate: '2024-10-30', tags: ['renewal', 'support'] },
  { id: '4', title: 'Custom Development', value: 100000, stage: 'qualification', company: 'Innovate LLC', contact: 'Emily Davis', owner: 'Bob Wilson', probability: 50, expectedCloseDate: '2024-11-20', tags: ['custom', 'development', 'high-value'] },
  { id: '5', title: 'Consulting Services', value: 35000, stage: 'proposal', company: 'StartupXYZ', contact: 'David Wilson', owner: 'Jane Smith', probability: 60, expectedCloseDate: '2024-10-25', tags: ['consulting'] },
  { id: '6', title: 'Training Package', value: 15000, stage: 'proposal', company: 'EduTech', contact: 'Lisa Anderson', owner: 'John Doe', probability: 65, expectedCloseDate: '2024-10-28', tags: ['training'] },
  { id: '7', title: 'API Integration', value: 45000, stage: 'negotiation', company: 'DataFlow Inc', contact: 'Robert Taylor', owner: 'Bob Wilson', probability: 75, expectedCloseDate: '2024-10-22', tags: ['api', 'integration'] },
  { id: '8', title: 'Mobile App Development', value: 80000, stage: 'negotiation', company: 'AppMakers', contact: 'Jennifer Lee', owner: 'Jane Smith', probability: 80, expectedCloseDate: '2024-10-20', tags: ['mobile', 'development'] },
  { id: '9', title: 'SaaS Subscription', value: 60000, stage: 'closed_won', company: 'CloudFirst', contact: 'Michael Brown', owner: 'John Doe', probability: 100, expectedCloseDate: '2024-10-15', tags: ['saas'] },
  { id: '10', title: 'Security Audit', value: 30000, stage: 'closed_won', company: 'SecureTech', contact: 'Amanda White', owner: 'Bob Wilson', probability: 100, expectedCloseDate: '2024-10-12', tags: ['security'] },
  { id: '11', title: 'Legacy System Upgrade', value: 40000, stage: 'closed_lost', company: 'OldSchool Inc', contact: 'James Martin', owner: 'Jane Smith', probability: 0, expectedCloseDate: '2024-10-10', tags: ['legacy'] },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'email', description: 'Sent proposal document', timestamp: '2024-10-18T10:30:00', user: 'John Doe' },
  { id: '2', type: 'call', description: 'Discovery call - 45 minutes', timestamp: '2024-10-17T14:00:00', user: 'Jane Smith' },
  { id: '3', type: 'meeting', description: 'Demo presentation', timestamp: '2024-10-16T11:00:00', user: 'John Doe' },
  { id: '4', type: 'note', description: 'Client interested in enterprise plan', timestamp: '2024-10-15T16:30:00', user: 'Jane Smith' },
];

export default function Deals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    title: '',
    value: 0,
    stage: 'prospecting',
    company: '',
    contact: '',
    probability: 50,
  });
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
  ]);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeals(MOCK_DEALS);
        setSnackbar({ open: true, message: 'Deals loaded successfully', severity: 'success' });
      } catch {
        setDeals(MOCK_DEALS);
        setSnackbar({ open: true, message: 'Loaded demo data', severity: 'info' });
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId;
    setDeals(prev => prev.map(deal => deal.id === draggableId ? { ...deal, stage: newStage } : deal));
    setSnackbar({ open: true, message: `Deal moved to ${STAGES.find(s => s.id === newStage)?.label}`, severity: 'success' });
  };

  const handleAddDeal = () => {
    const deal: Deal = {
      id: Date.now().toString(),
      title: newDeal.title || 'Untitled Deal',
      value: newDeal.value || 0,
      stage: newDeal.stage || 'prospecting',
      company: newDeal.company,
      contact: newDeal.contact,
      owner: 'John Doe',
      probability: newDeal.probability || 50,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: [],
    };
    setDeals([...deals, deal]);
    setAddDialogOpen(false);
    setNewDeal({ title: '', value: 0, stage: 'prospecting', company: '', contact: '', probability: 50 });
    setSnackbar({ open: true, message: 'Deal created successfully', severity: 'success' });
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(deals.filter(d => d.id !== dealId));
    setMenuAnchor(null);
    setSnackbar({ open: true, message: 'Deal deleted', severity: 'success' });
  };

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

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = !searchQuery || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = !selectedOwner || deal.owner === selectedOwner;
    return matchesSearch && matchesOwner;
  });

  const getDealsForStage = (stageId: string) => filteredDeals.filter(d => d.stage === stageId);
  const getStageTotalValue = (stageId: string) => getDealsForStage(stageId).reduce((sum, d) => sum + d.value, 0);
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  const getHealthIndicator = (deal: Deal) => {
    if (!deal.probability) return null;
    if (deal.probability >= 70) return <CheckCircleIcon fontSize="small" color="success" />;
    if (deal.probability >= 40) return <TrendingUpIcon fontSize="small" color="warning" />;
    return <WarningIcon fontSize="small" color="error" />;
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon fontSize="small" />;
      case 'call': return <PhoneIcon fontSize="small" />;
      case 'meeting': return <EventIcon fontSize="small" />;
      default: return <TimelineIcon fontSize="small" />;
    }
  };

  const allOwners = Array.from(new Set(deals.map(d => d.owner).filter(Boolean))) as string[];

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
          <Grid item xs={12} md={5}>
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
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
              <Chip
                icon={<AttachMoneyIcon />}
                label={`${filteredDeals.length} deals • ${formatCurrency(filteredDeals.reduce((sum, d) => sum + d.value, 0))}`}
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
                                }}
                              >
                                <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                                    <Typography variant="body2" fontWeight="bold" sx={{ flex: 1, fontSize: '0.875rem' }}>
                                      {deal.title}
                                    </Typography>
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
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => selectedDeal && handleDeleteDeal(selectedDeal.id)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

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
                    {MOCK_ACTIVITIES.map(activity => (
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
              <Button variant="contained" startIcon={<EditIcon />}>Edit Deal</Button>
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
            />
            <TextField
              label="Value"
              type="number"
              fullWidth
              value={newDeal.value}
              onChange={(e) => setNewDeal({ ...newDeal, value: parseFloat(e.target.value) })}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
            <FormControl fullWidth>
              <InputLabel>Stage</InputLabel>
              <Select value={newDeal.stage} label="Stage" onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}>
                {STAGES.map(stage => <MenuItem key={stage.id} value={stage.id}>{stage.label}</MenuItem>)}
              </Select>
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
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDeal} startIcon={<AddIcon />}>
            Create Deal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={handleExportClose}
        data={filteredDeals}
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

