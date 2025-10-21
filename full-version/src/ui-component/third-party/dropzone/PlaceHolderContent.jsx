import PropTypes from 'prop-types';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';

import { DropzopType } from 'config';

// assets
import UploadCover from 'assets/images/upload/upload.svg';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type }) {
  return (
    <>
      {type !== DropzopType.standard && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'center', justifyContent: 'center', width: 1, textAlign: { xs: 'center', md: 'left' }, gap: 2 }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
          <Stack sx={{ p: 3, gap: 1 }}>
            <Typography variant="h5">Drag & Drop or Select file</Typography>

            <Typography sx={{ color: 'secondary.main' }}>
              Drop files here or click&nbsp;
              <Typography component="span" sx={{ textDecoration: 'underline', color: 'primary.main' }}>
                browse
              </Typography>
              &nbsp;through your machine
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzopType.standard && (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
          <CameraAltOutlinedIcon style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}

PlaceholderContent.propTypes = { type: PropTypes.string };
