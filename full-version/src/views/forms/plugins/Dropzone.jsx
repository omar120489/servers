import { useState } from 'react';

// mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import { Formik } from 'formik';
import * as yup from 'yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import UploadAvatar from 'ui-component/third-party/dropzone/Avatar';
import UploadSingleFile from 'ui-component/third-party/dropzone/SingleFile';
import UploadMultiFile from 'ui-component/third-party/dropzone/MultiFile';
import { gridSpacing } from 'store/constant';

// assets
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';

export default function Dropzone() {
  const [list, setList] = useState(false);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard
          title="Upload Multiple File"
          secondary={
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
              <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                <FormatListBulletedIcon style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                <GridViewIcon style={{ fontSize: '1.15rem' }} />
              </IconButton>
            </Stack>
          }
        >
          <Formik
            initialValues={{ files: null }}
            onSubmit={(values) => {
              // submit form
            }}
            validationSchema={yup.object().shape({
              files: yup.mixed().required('Avatar is a required.')
            })}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack sx={{ alignItems: 'center', gap: 1.5 }}>
                      <UploadMultiFile
                        showList={list}
                        setFieldValue={setFieldValue}
                        files={values.files}
                        error={touched.files && !!errors.files}
                      />
                    </Stack>
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
      {/* theme.vars.palette.grey[300] */}
      <Grid size={12}>
        <MainCard title="Upload Single File">
          <Formik
            initialValues={{ files: null }}
            onSubmit={(values) => {
              // submit form
            }}
            validationSchema={yup.object().shape({
              files: yup.mixed().required('Avatar is a required.')
            })}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack sx={{ alignItems: 'center', gap: 1.5 }}>
                      <UploadSingleFile setFieldValue={setFieldValue} file={values.files} error={touched.files && !!errors.files} />
                    </Stack>
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Upload Avatar">
          <Formik
            initialValues={{ files: null }}
            onSubmit={(values) => {
              // submit form
            }}
            validationSchema={yup.object().shape({
              files: yup.mixed().required('Avatar is a required.')
            })}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Stack sx={{ alignItems: 'center' }}>
                      <Stack sx={{ alignItems: 'center', gap: 1.5 }}>
                        <UploadAvatar setFieldValue={setFieldValue} file={values.files} error={touched.files && !!errors.files} />
                        <Stack sx={{ gap: 0 }}>
                          <Typography align="center" variant="caption">
                            Allowed 'image/*'
                          </Typography>
                          <Typography align="center" variant="caption">
                            *.png, *.jpeg, *.jpg, *.gif
                          </Typography>
                        </Stack>
                      </Stack>
                      {touched.files && errors.files && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.files}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={12}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                      <Button color="error" onClick={() => setFieldValue('files', null)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}
