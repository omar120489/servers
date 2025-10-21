import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { leadsApi } from 'services/leads';
import type { Lead } from 'types/api';
import { isAxiosError } from 'axios';

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

function formatScore(score?: number | null) {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return '—';
  }

  return `${Math.round(score)}%`;
}

type LoadError = { kind: 'not-found'; message: string } | { kind: 'network'; message: string };

function isValidLeadId(value: string | undefined): value is string {
  if (!value) return false;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const numericPattern = /^\d+$/;
  return uuidPattern.test(value) || numericPattern.test(value);
}

export default function LeadDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<LoadError | null>(null);

  const loadLead = useCallback(async () => {
    if (!isValidLeadId(id)) {
      setError({
        kind: 'not-found',
        message: 'The requested lead could not be found.'
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await leadsApi.getLead(id);
      setLead(result);
      setError(null);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError({
            kind: 'not-found',
            message: 'The requested lead could not be found.'
          });
        } else {
          setError({
            kind: 'network',
            message:
              err.response?.data?.message ??
              'We could not load this lead. Please try again in a moment.'
          });
        }
      } else {
        setError({
          kind: 'network',
          message: 'We could not load this lead. Please try again in a moment.'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadLead();
  }, [loadLead]);

  const statusColor = useMemo<'default' | 'success' | 'error' | 'info'>(() => {
    const status = lead?.status?.toLowerCase();
    switch (status) {
      case 'converted':
      case 'qualified':
        return 'success';
      case 'unqualified':
        return 'error';
      case 'working':
      case 'contacted':
        return 'info';
      default:
        return 'default';
    }
  }, [lead?.status]);

  return (
    <MainCard
      title="Lead Details"
      secondary={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
          {id && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/leads/${id}/edit`)}
            >
              Edit Lead
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
              <Button size="small" onClick={() => void loadLead()} variant="outlined">
                Retry
              </Button>
            )}
            <Button size="small" onClick={() => navigate('/leads')} variant="contained">
              Back to Leads
            </Button>
          </Box>
        </Alert>
      )}

      {!loading && !error && lead && (
        <Grid container spacing={2}>
          <Grid xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h4">
              {lead.firstName} {lead.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lead ID: {lead.id}
            </Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{lead.email}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{lead.phone ?? '—'}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Company
            </Typography>
            <Typography variant="body1">{lead.company ?? '—'}</Typography>
          </Grid>

          <Grid xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip label={lead.status ?? '—'} color={statusColor} size="small" />
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Source
            </Typography>
            <Typography variant="body1">{lead.source ?? '—'}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Score
            </Typography>
            <Typography variant="body1">{formatScore(lead.score)}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Owner
            </Typography>
            <Typography variant="body1">{lead.ownerId}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">{formatDate(lead.createdAt)}</Typography>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body1">{formatDate(lead.updatedAt)}</Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Notes
            </Typography>
            <Typography variant="body1">{lead.notes ?? '—'}</Typography>
          </Grid>
        </Grid>
      )}
    </MainCard>
  );
}
