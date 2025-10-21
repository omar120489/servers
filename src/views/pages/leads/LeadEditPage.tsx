import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { leadsApi } from 'services/leads';
import type { Lead, LeadUpdateDto } from 'types/api';
import { useSnackbar } from 'notistack';
import { isAxiosError } from 'axios';

interface LeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  company: string;
  score: number | '';
  notes: string;
}

interface ApiErrorShape {
  message?: string;
  errors?: Record<string, string[]>;
}

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Working', 'Unqualified', 'Converted'];
const LEAD_SOURCES = ['Web', 'Referral', 'Email', 'Phone', 'Event', 'Social'];

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().nullable(),
  status: Yup.string().required('Status is required'),
  source: Yup.string().nullable(),
  company: Yup.string().nullable(),
  score: Yup.number()
    .typeError('Score must be a number')
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must be at most 100')
    .nullable(),
  notes: Yup.string().nullable()
});

function mapLeadToFormValues(lead: Lead): LeadFormValues {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone ?? '',
    status: lead.status ?? '',
    source: lead.source ?? '',
    company: lead.company ?? '',
    score:
      lead.score === null || lead.score === undefined
        ? ''
        : lead.score > 1
          ? lead.score
          : lead.score * 100,
    notes: lead.notes ?? ''
  };
}

function buildUpdatePayload(values: LeadFormValues): LeadUpdateDto {
  const scoreValue = values.score === '' ? null : Number(values.score);

  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone.trim() === '' ? null : values.phone.trim(),
    status: values.status || undefined,
    source: values.source.trim() === '' ? null : values.source.trim(),
    company: values.company.trim() === '' ? null : values.company.trim(),
    score:
      scoreValue === null || Number.isNaN(scoreValue)
        ? null
        : scoreValue > 1
          ? scoreValue / 100
          : scoreValue,
    notes: values.notes.trim() === '' ? null : values.notes.trim()
  };
}

type LoadError = { kind: 'not-found'; message: string } | { kind: 'network'; message: string };

function isValidLeadId(value: string | undefined): value is string {
  if (!value) return false;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const numericPattern = /^\d+$/;
  return uuidPattern.test(value) || numericPattern.test(value);
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as ApiErrorShape).message;
    if (message) return message;
  }
  return 'Failed to update lead.';
}

function extractFieldErrors(error: unknown): Record<string, string> | null {
  if (error && typeof error === 'object' && 'errors' in error) {
    const errors = (error as ApiErrorShape).errors;
    if (errors && typeof errors === 'object') {
      const result: Record<string, string> = {};
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          result[field] = messages[0] as string;
        }
      });
      return result;
    }
  }
  return null;
}

export default function LeadEditPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
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

  const initialValues = useMemo<LeadFormValues | null>(() => {
    if (!lead) return null;
    return mapLeadToFormValues(lead);
  }, [lead]);

  const handleSubmit = useCallback(
    async (values: LeadFormValues, actions: FormikHelpers<LeadFormValues>) => {
      if (!id) {
        enqueueSnackbar('Unable to update lead: missing identifier.', { variant: 'error' });
        actions.setSubmitting(false);
        return;
      }
      try {
        const payload = buildUpdatePayload(values);
        await leadsApi.updateLead(id, payload);
        enqueueSnackbar('Lead updated successfully.', { variant: 'success' });
        navigate(`/leads/${id}`);
      } catch (err) {
        const fieldErrors = extractFieldErrors(err);
        if (fieldErrors) {
          actions.setErrors(fieldErrors);
        }
        enqueueSnackbar(extractErrorMessage(err), { variant: 'error' });
      } finally {
        actions.setSubmitting(false);
      }
    },
    [enqueueSnackbar, id, navigate]
  );

  return (
    <MainCard
      title="Edit Lead"
      secondary={
        <Button variant="outlined" onClick={() => navigate(id ? `/leads/${id}` : '/leads')}>
          Cancel
        </Button>
      }
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity={error.kind === 'network' ? 'error' : 'warning'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">{error.message}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {error.kind === 'network' && (
                <Button size="small" onClick={() => void loadLead()} variant="outlined">
                  Retry
                </Button>
              )}
              <Button size="small" variant="contained" onClick={() => navigate('/leads')}>
                Back to Leads
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {!loading && !error && initialValues && (
        <Formik<LeadFormValues>
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit: submitForm,
            values,
            handleChange,
            touched,
            errors,
            isSubmitting,
            dirty
          }) => (
            <form noValidate onSubmit={submitForm}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                      fullWidth
                      required
                      select
                    >
                      {LEAD_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Source"
                      name="source"
                      value={values.source}
                      onChange={handleChange}
                      error={touched.source && Boolean(errors.source)}
                      helperText={touched.source && errors.source}
                      fullWidth
                      select
                    >
                      <MenuItem value="">None</MenuItem>
                      {LEAD_SOURCES.map((source) => (
                        <MenuItem key={source} value={source}>
                          {source}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Company"
                      name="company"
                      value={values.company}
                      onChange={handleChange}
                      error={touched.company && Boolean(errors.company)}
                      helperText={touched.company && errors.company}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Score (%)"
                      name="score"
                      value={values.score}
                      onChange={handleChange}
                      error={touched.score && Boolean(errors.score)}
                      helperText={
                        touched.score && errors.score
                          ? errors.score
                          : 'Enter a value from 0 to 100 to represent the lead score.'
                      }
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      label="Notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      error={touched.notes && Boolean(errors.notes)}
                      helperText={touched.notes && errors.notes}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(id ? `/leads/${id}` : '/leads')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSubmitting || !dirty}>
                    Save Changes
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </Formik>
      )}
    </MainCard>
  );
}
