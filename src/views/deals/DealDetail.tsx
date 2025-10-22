import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';

import AttachmentUploader from 'ui-component/Attachments/AttachmentUploader';
import CommentsPanel from 'ui-component/Comments/CommentsPanel';
import MainCard from 'ui-component/cards/MainCard';
import ActivityTimeline from 'ui-component/ActivityTimeline/ActivityTimeline';
import { dealsApi } from 'services/deals';
import { useJourneyEvents } from 'hooks/useJourneyEvents';
import type { Deal } from 'types/api';
import ClosedWonModal from './ClosedWonModal';
import LostReasonModal, { type LostReasonData } from 'ui-component/deals/LostReasonModal';

type DealDetailTab = 'summary' | 'activity' | 'comments' | 'attachments';

type LoadError = { kind: 'not-found'; message: string } | { kind: 'network'; message: string };

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
}

function formatProbability(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  const display = value > 1 ? value : value * 100;
  return `${Math.round(display)}%`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

function isValidDealId(value: string | undefined): value is string {
  if (!value) return false;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const numericPattern = /^\d+$/;
  return uuidPattern.test(value) || numericPattern.test(value);
}

export default function DealDetail(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<LoadError | null>(null);
  const [tab, setTab] = useState<DealDetailTab>('summary');
  const [showClosedWonModal, setShowClosedWonModal] = useState(false);
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Journey events for activity timeline
  const journeyEvents = useJourneyEvents({
    entityType: 'deal',
    entityId: id || ''
  });

  const loadDeal = useCallback(async () => {
    if (!isValidDealId(id)) {
      setError({
        kind: 'not-found',
        message: 'The requested deal could not be found.'
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await dealsApi.getDeal(id);
      setDeal(result);
      setError(null);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError({
            kind: 'not-found',
            message: 'The requested deal could not be found.'
          });
        } else {
          setError({
            kind: 'network',
            message:
              err.response?.data?.message ??
              'We could not load this deal. Please try again in a moment.'
          });
        }
      } else {
        setError({
          kind: 'network',
          message: 'We could not load this deal. Please try again in a moment.'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDeal();
  }, [loadDeal]);

  const handleMarkClosedWon = () => {
    setShowClosedWonModal(true);
  };

  const handleClosedWonConfirm = async (values: { grossRevenue: number; directCost: number }) => {
    if (!deal?.id) return;
    
    setShowClosedWonModal(false);
    setUpdating(true);

    try {
      const oldStatus = deal.status;
      const updatedDeal = await dealsApi.updateDeal(deal.id, {
        status: 'Closed Won',
        grossRevenue: values.grossRevenue,
        directCost: values.directCost
      });
      
      setDeal(updatedDeal);

      // Create journey event
      await journeyEvents.addEvent({
        type: 'deal_won',
        payload: {
          from: oldStatus,
          to: 'Closed Won',
          grossRevenue: values.grossRevenue,
          directCost: values.directCost,
          netProfit: values.grossRevenue - values.directCost
        }
      });
    } catch (err) {
      console.error('Failed to update deal:', err);
      // In a real app, show an error toast/alert
    } finally {
      setUpdating(false);
    }
  };

  const handleClosedWonCancel = () => {
    setShowClosedWonModal(false);
  };

  const handleMarkLost = () => {
    setShowLostReasonModal(true);
  };

  const handleLostConfirm = async (data: LostReasonData) => {
    if (!deal?.id) return;
    
    setShowLostReasonModal(false);
    setUpdating(true);

    try {
      const oldStatus = deal.status;
      const updatedDeal = await dealsApi.updateDeal(deal.id, {
        status: 'Lost',
        lossReason: data.lossReason,
        lossNotes: data.lossNotes
      });
      
      setDeal(updatedDeal);

      // Create journey event
      await journeyEvents.addEvent({
        type: 'deal_lost',
        payload: {
          from: oldStatus,
          to: 'Lost',
          reason: data.lossReason,
          notes: data.lossNotes
        }
      });
    } catch (err) {
      console.error('Failed to update deal:', err);
      // In a real app, show an error toast/alert
    } finally {
      setUpdating(false);
    }
  };

  const handleLostCancel = () => {
    setShowLostReasonModal(false);
  };

  const summary = useMemo(() => {
    if (!deal) {
      return null;
    }

    return (
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h4">{deal.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Deal ID: {deal.id}
          </Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Amount
          </Typography>
          <Typography variant="body1">{formatCurrency(deal.amount)}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Stage
          </Typography>
          <Chip label={deal.stage ?? '—'} variant="outlined" size="small" />
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={deal.status ?? '—'} color="primary" size="small" variant="outlined" />
            {deal.status !== 'Closed Won' && deal.status !== 'Won' && deal.status !== 'Lost' && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleMarkClosedWon}
                  disabled={updating}
                >
                  Mark Won
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleMarkLost}
                  disabled={updating}
                >
                  Mark Lost
                </Button>
              </>
            )}
            {deal.status === 'Lost' && deal.lossReason && (
              <Chip 
                label={deal.lossReason.replace('L-', '')} 
                color="error" 
                size="small" 
                variant="filled"
              />
            )}
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Probability
          </Typography>
          <Typography variant="body1">{formatProbability(deal.probability)}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Close Date
          </Typography>
          <Typography variant="body1">{formatDate(deal.closeDate)}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Owner
          </Typography>
          <Typography variant="body1">{deal.ownerId}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Company
          </Typography>
          <Typography variant="body1">{deal.companyId ?? '—'}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Contact
          </Typography>
          <Typography variant="body1">{deal.contactId ?? '—'}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Updated At
          </Typography>
          <Typography variant="body1">{formatDate(deal.updatedAt)}</Typography>
        </Grid>

        <Grid xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Description
          </Typography>
          <Typography variant="body1">{deal.description ?? '—'}</Typography>
        </Grid>

        {(deal.grossRevenue !== null && deal.grossRevenue !== undefined) && (
          <>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Financial Details
              </Typography>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Gross Revenue
              </Typography>
              <Typography variant="body1">{formatCurrency(deal.grossRevenue)}</Typography>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Direct Cost
              </Typography>
              <Typography variant="body1">{formatCurrency(deal.directCost)}</Typography>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Net Profit
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: (deal.netProfit ?? 0) >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {formatCurrency(deal.netProfit)}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    );
  }, [deal, updating, handleMarkClosedWon, handleMarkLost]);

  const activityContent = (
    <Box sx={{ p: 3 }}>
      <ActivityTimeline
        events={journeyEvents.events}
        loading={journeyEvents.loading}
        error={journeyEvents.error}
        onRetry={journeyEvents.refresh}
      />
    </Box>
  );

  const isCommentsTabDisabled = !id;
  const isAttachmentsTabDisabled = !id;

  return (
    <MainCard
      title="Deal Details"
      secondary={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
          {id && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/deals/${id}/edit`)}
            >
              Edit Deal
            </Button>
          )}
        </Box>
      }
    >
      <Tabs
        value={tab}
        onChange={(_, value: DealDetailTab) => setTab(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, mb: 2 }}
      >
        <Tab label="Summary" value="summary" />
        <Tab label="Activity" value="activity" />
        <Tab label="Comments" value="comments" disabled={isCommentsTabDisabled} />
        <Tab label="Attachments" value="attachments" disabled={isAttachmentsTabDisabled} />
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity={error.kind === 'network' ? 'error' : 'warning'}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {error.message}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {error.kind === 'network' && (
              <Button size="small" onClick={() => void loadDeal()} variant="outlined">
                Retry
              </Button>
            )}
            <Button size="small" variant="contained" onClick={() => navigate('/deals')}>
              Back to Deals
            </Button>
          </Box>
        </Alert>
      )}

      {!loading && !error && deal && (
        <Box>
          {tab === 'summary' && summary}
          {tab === 'activity' && activityContent}
          {tab === 'comments' && id && (
            <CommentsPanel entityType="deal" entityId={id} title="Comments" />
          )}
          {tab === 'attachments' && id && (
            <AttachmentUploader entityType="deal" entityId={id} title="Attachments" />
          )}
        </Box>
      )}

      {!loading && !error && !deal && (
        <Box sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            We could not find details for this deal.
          </Typography>
        </Box>
      )}

      <ClosedWonModal
        open={showClosedWonModal}
        onClose={handleClosedWonCancel}
        onConfirm={handleClosedWonConfirm}
      />
      
      <LostReasonModal
        open={showLostReasonModal}
        onClose={handleLostCancel}
        onConfirm={handleLostConfirm}
      />
    </MainCard>
  );
}
