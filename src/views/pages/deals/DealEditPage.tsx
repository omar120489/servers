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
import { DEAL_STAGES, DEAL_STATUSES } from 'constants/deals';
import { dealsApi } from 'services/deals';
import type { Deal, DealUpdateDto } from 'types/api';
import { useSnackbar } from 'notistack';
import { isAxiosError } from 'axios';

interface DealFormValues {
  name: string;
  amount: number | '';
  stage: string;
  status: string;
  probability: number | '';
  ownerId: string;
  companyId: string;
  contactId: string;
  closeDate: string;
  description: string;
}

interface ApiErrorShape {
  message?: string;
  errors?: Record<string, string[]>;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .min(0, 'Amount must be positive')
    .required('Amount is required'),
  stage: Yup.string().required('Stage is required'),
  status: Yup.string().required('Status is required'),
  probability: Yup.number()
    .typeError('Probability must be a number')
    .min(0, 'Probability must be at least 0%')
    .max(100, 'Probability must be at most 100%')
    .nullable(),
  ownerId: Yup.string().required('Owner is required'),
  companyId: Yup.string().nullable(),
  contactId: Yup.string().nullable(),
  closeDate: Yup.string().nullable(),
  description: Yup.string().nullable()
});

function mapDealToFormValues(deal: Deal): DealFormValues {
  return {
    name: deal.name,
    amount: deal.amount ?? '',
    stage: deal.stage ?? '',
    status: deal.status ?? '',
    probability:
      deal.probability === null || deal.probability === undefined
        ? ''
        : deal.probability > 1
          ? deal.probability
          : deal.probability * 100,
    ownerId: deal.ownerId,
    companyId: deal.companyId ?? '',
    contactId: deal.contactId ?? '',
    closeDate: deal.closeDate ? deal.closeDate.slice(0, 10) : '',
    description: deal.description ?? ''
  };
}

function buildUpdatePayload(values: DealFormValues): DealUpdateDto {
  const probabilityValue = values.probability === '' ? null : Number(values.probability);

  return {
    name: values.name,
    amount: values.amount === '' ? undefined : Number(values.amount),
    stage: values.stage,
    status: values.status,
    probability:
      probabilityValue === null || Number.isNaN(probabilityValue)
        ? null
        : probabilityValue > 1
          ? probabilityValue / 100
          : probabilityValue,
    ownerId: values.ownerId,
    companyId: values.companyId.trim() === '' ? null : values.companyId.trim(),
    contactId: values.contactId.trim() === '' ? null : values.contactId.trim(),
    closeDate: values.closeDate ? new Date(values.closeDate).toISOString() : null,
    description: values.description.trim() === '' ? null : values.description.trim()
  };
}

type LoadError = { kind: 'not-found'; message: string } | { kind: 'network'; message: string };

function isValidDealId(value: string | undefined): value is string {
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
  return 'Failed to update deal.';
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

export default function DealEditPage(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
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

  const initialValues = useMemo<DealFormValues | null>(() => {
    if (!deal) return null;
    return mapDealToFormValues(deal);
  }, [deal]);

  const handleSubmit = useCallback(
    async (values: DealFormValues, actions: FormikHelpers<DealFormValues>) => {
      if (!id) {
        enqueueSnackbar('Unable to update deal: missing identifier.', { variant: 'error' });
        actions.setSubmitting(false);
        return;
      }
      try {
        const payload = buildUpdatePayload(values);
        await dealsApi.updateDeal(id, payload);
        enqueueSnackbar('Deal updated successfully.', { variant: 'success' });
        navigate(`/deals/${id}`);
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
      title="Edit Deal"
      secondary={
        <Button variant="outlined" onClick={() => navigate(id ? `/deals/${id}` : '/deals')}>
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
                <Button size="small" onClick={() => void loadDeal()} variant="outlined">
                  Retry
                </Button>
              )}
              <Button size="small" variant="contained" onClick={() => navigate('/deals')}>
                Back to Deals
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {!loading && !error && initialValues && (
        <Formik<DealFormValues>
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
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Amount"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      required
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Stage"
                      name="stage"
                      value={values.stage}
                      onChange={handleChange}
                      error={touched.stage && Boolean(errors.stage)}
                      helperText={touched.stage && errors.stage}
                      fullWidth
                      required
                      select
                    >
                      {DEAL_STAGES.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      {DEAL_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Probability (%)"
                      name="probability"
                      value={values.probability}
                      onChange={handleChange}
                      error={touched.probability && Boolean(errors.probability)}
                      helperText={
                        touched.probability && errors.probability
                          ? errors.probability
                          : 'Enter a probability between 0 and 100 percent.'
                      }
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Owner ID"
                      name="ownerId"
                      value={values.ownerId}
                      onChange={handleChange}
                      error={touched.ownerId && Boolean(errors.ownerId)}
                      helperText={touched.ownerId && errors.ownerId}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Company ID"
                      name="companyId"
                      value={values.companyId}
                      onChange={handleChange}
                      error={touched.companyId && Boolean(errors.companyId)}
                      helperText={touched.companyId && errors.companyId}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Contact ID"
                      name="contactId"
                      value={values.contactId}
                      onChange={handleChange}
                      error={touched.contactId && Boolean(errors.contactId)}
                      helperText={touched.contactId && errors.contactId}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Close Date"
                      name="closeDate"
                      value={values.closeDate}
                      onChange={handleChange}
                      error={touched.closeDate && Boolean(errors.closeDate)}
                      helperText={touched.closeDate && errors.closeDate}
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(id ? `/deals/${id}` : '/deals')}
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
