import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AddContactDialogContent from './AddContactDialogContent';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

// ==============================|| ADD CONTACT ||============================== //

export default function AddContactDialog({ open, handleToggleAddDialog, row }) {
  return (
    <Dialog open={open} onClose={handleToggleAddDialog}>
      {open && (
        <>
          <DialogTitle sx={{ px: 3, py: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              {!row ? (
                <Typography variant="h4">Add Contact</Typography>
              ) : (
                <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                  <Typography variant="h4">Edit Contact</Typography>
                  <Typography variant="h4" sx={{ color: 'grey.400' }}>
                    #{row.id}
                  </Typography>
                </Stack>
              )}
              <IconButton sx={{ p: 0 }} size="medium" onClick={handleToggleAddDialog}>
                <CancelTwoToneIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <AddContactDialogContent {...{ row }} />
          <DialogActions sx={{ p: 3 }}>
            <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'flex-end' }}>
              <AnimateButton>
                <Button onClick={handleToggleAddDialog} variant="outlined">
                  Cancel
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button variant="contained" onClick={handleToggleAddDialog}>
                  Add
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

AddContactDialog.propTypes = { open: PropTypes.bool, handleToggleAddDialog: PropTypes.func, row: PropTypes.any };
