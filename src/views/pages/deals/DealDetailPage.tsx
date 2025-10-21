import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { dealsApi } from 'services/deals';
import type { Deal } from 'types/api';
import { isAxiosError } from 'axios';

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

type LoadError = { kind: 'not-found'; message: string } | { kind: 'network'; message: string };

function isValidDealId(value: string | undefined): value is string {
  if (!value) return false;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const numericPattern = /^\d+$/;
  return uuidPattern.test(value) || numericPattern.test(value);
}

export default function DealDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<LoadError | null>(null);

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
        <Grid container spacing={2}>
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
            <Chip label={deal.status ?? '—'} color="primary" size="small" variant="outlined" />
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
        </Grid>
      )}
    </MainCard>
  );
}
