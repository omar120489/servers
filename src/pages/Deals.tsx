import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  company?: string;
  contact?: string;
}

const STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: '#90caf9' },
  { id: 'qualification', label: 'Qualification', color: '#ce93d8' },
  { id: 'proposal', label: 'Proposal', color: '#fff59d' },
  { id: 'negotiation', label: 'Negotiation', color: '#ffcc80' },
  { id: 'closed_won', label: 'Closed Won', color: '#a5d6a7' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef9a9a' },
];

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/deals?page=1&size=1000`);
      const data = response.data.items || response.data;
      setDeals(Array.isArray(data) ? data : []);
      setSnackbar({ open: true, message: 'Deals loaded successfully', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to load deals', severity: 'error' });
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // No movement
    if (source.droppableId === destination.droppableId) return;

    const dealId = draggableId;
    const newStage = destination.droppableId;

    // Optimistic UI update
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );

    // Persist to backend
    try {
      await axios.patch(`${API_URL}/deals/${dealId}`, { stage: newStage });
      setSnackbar({ open: true, message: `Deal moved to ${STAGES.find(s => s.id === newStage)?.label}`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update deal stage', severity: 'error' });
      // Revert optimistic update
      fetchDeals();
    }
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  const getStageTotalValue = (stageId: string) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Pipeline
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDeals}
        >
          Reload
        </Button>
      </Stack>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
          }}
        >
          {STAGES.map((stage) => {
            const stageDeals = getDealsForStage(stage.id);
            const totalValue = getStageTotalValue(stage.id);

            return (
              <Box
                key={stage.id}
                sx={{
                  minWidth: 280,
                  maxWidth: 320,
                  flex: '0 0 auto',
                }}
              >
                {/* Column Header */}
                <Card
                  sx={{
                    mb: 1,
                    bgcolor: stage.color,
                    color: '#000',
                  }}
                >
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {stage.label}
                      </Typography>
                      <Chip
                        label={stageDeals.length}
                        size="small"
                        sx={{ bgcolor: 'rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                    </Stack>
                    <Typography variant="caption" fontWeight="bold">
                      {formatCurrency(totalValue)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Droppable Column */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 400,
                        bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        p: 1,
                        transition: 'background-color 0.2s',
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
                                mb: 1,
                                cursor: 'grab',
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
                                boxShadow: snapshot.isDragging ? 4 : 1,
                                '&:hover': {
                                  boxShadow: 3,
                                },
                              }}
                            >
                              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                  {deal.title}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                  {formatCurrency(deal.value)}
                                </Typography>
                                {deal.company && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    🏢 {deal.company}
                                  </Typography>
                                )}
                                {deal.contact && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    👤 {deal.contact}
                                  </Typography>
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
