import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Grid, Card, CardContent, Typography, Stack, Box, IconButton, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { listDeals, updateDeal, Deal } from '../services/deals';

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function Pipeline() {
  const [cols, setCols] = useState<Record<string, Deal[]>>({});
  const [loading, setLoading] = useState(false);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const { items } = await listDeals({ size: 1000 });
      const next: Record<string, Deal[]> = {};
      STAGES.forEach(s => (next[s] = []));
      items.forEach((d: Deal) => {
        const stage = d.stage || 'Prospecting';
        if (!next[stage]) next[stage] = [];
        next[stage].push(d);
      });
      setCols(next);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const srcStage = source.droppableId;
    const dstStage = destination.droppableId;
    const copy = { ...cols };
    const srcList = Array.from(copy[srcStage]);
    const [moved] = srcList.splice(source.index, 1);
    const dstList = Array.from(copy[dstStage] || []);
    dstList.splice(destination.index, 0, { ...moved, stage: dstStage });
    copy[srcStage] = srcList;
    copy[dstStage] = dstList;
    setCols(copy); // optimistic

    try {
      await updateDeal(moved.id, { stage: dstStage });
    } catch {
      setCols(cols); // rollback on error
    }
  };

  const getStageTotal = (stage: string) => {
    return (cols[stage] || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Pipeline</Typography>
        <IconButton onClick={loadDeals} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {STAGES.map((stage) => (
            <Grid item xs={12} md={2} key={stage}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {stage}
                  </Typography>
                  <Chip
                    label={`$${getStageTotal(stage).toLocaleString()}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                <Droppable droppableId={stage}>
                  {(prov, snapshot) => (
                    <Stack
                      {...prov.droppableProps}
                      ref={prov.innerRef}
                      spacing={1}
                      sx={{
                        minHeight: 200,
                        bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      {(cols[stage] || []).map((d, idx) => (
                        <Draggable draggableId={String(d.id)} index={idx} key={d.id}>
                          {(dp, dragSnapshot) => (
                            <Card
                              ref={dp.innerRef}
                              {...dp.draggableProps}
                              {...dp.dragHandleProps}
                              sx={{
                                opacity: dragSnapshot.isDragging ? 0.8 : 1,
                                transform: dragSnapshot.isDragging ? 'rotate(2deg)' : 'none',
                              }}
                            >
                              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {d.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ${(d.amount || 0).toLocaleString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
}

