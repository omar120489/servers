import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import ItemComment from './ItemComment';
import EditItem from './EditItem';
import AddItemComment from './AddItemComment';
import AlertItemDelete from './AlertItemDelete';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';
import { selectItem, deleteItem } from 'store/slices/kanban';
import SimpleBar from 'ui-component/third-party/SimpleBar';

// assets
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// ==============================|| KANBAN BOARD - ITEM DETAILS ||============================== //

export default function ItemDetails() {
  let selectedData;
  let commentList = <></>;

  const dispatch = useDispatch();
  const kanban = useSelector((state) => state.kanban);
  const { columns, comments, profiles, items, selectedItem, userStory } = kanban;

  // drawer
  const [open, setOpen] = useState(selectedItem !== false);
  const handleDrawerOpen = () => {
    setOpen((prevState) => !prevState);
    dispatch(selectItem(false));
  };

  useEffect(() => {
    selectedItem !== false && setOpen(true);
  }, [selectedItem]);

  if (selectedItem !== false) {
    selectedData = items.filter((item) => item.id === selectedItem)[0];
    if (selectedData?.commentIds) {
      commentList = [...selectedData.commentIds].reverse().map((commentId, index) => {
        const commentData = comments.filter((comment) => comment.id === commentId)[0];
        const profile = profiles.filter((item) => item.id === commentData.profileId)[0];
        return <ItemComment key={index} comment={commentData} profile={profile} />;
      });
    }
  }

  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = (status) => {
    setOpenModal(false);
    if (status) {
      handleDrawerOpen();
      dispatch(deleteItem(selectedData.id, items, columns, userStory));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Task Deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  };

  return (
    <Drawer
      slotProps={{
        paper: { sx: { height: '100vh', width: { xs: 320, md: 450 }, position: 'fixed', border: 'none', borderRadius: '0px' } }
      }}
      sx={{ ml: open ? 3 : 0, flexShrink: 0, zIndex: 1200, overflowX: 'hidden', width: { xs: 320, md: 450 } }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {open && (
        <>
          {selectedData && (
            <>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Grid sx={{ width: 'calc(100% - 50px)' }}>
                    <Stack direction="row" sx={{ alignItems: 'center', ml: 0.5 }}>
                      <Button
                        variant="text"
                        color="error"
                        sx={{ p: 0.5, minWidth: 32, display: { xs: 'block', md: 'none' } }}
                        onClick={handleDrawerOpen}
                      >
                        <HighlightOffIcon />
                      </Button>
                      <Typography
                        variant="h4"
                        sx={{
                          display: 'inline-block',
                          width: 'calc(100% - 34px)',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          verticalAlign: 'middle'
                        }}
                      >
                        {selectedData.title}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid>
                    <Button variant="text" color="error" sx={{ p: 0.5, minWidth: 32 }} onClick={() => setOpenModal(true)}>
                      <DeleteTwoToneIcon />
                    </Button>
                    <AlertItemDelete title={selectedData.title} open={openModal} handleClose={handleModalClose} />
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <SimpleBar>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <EditItem
                        item={selectedData}
                        profiles={profiles}
                        userStory={userStory}
                        columns={columns}
                        handleDrawerOpen={handleDrawerOpen}
                      />
                    </Grid>
                    <Grid size={12}>{commentList}</Grid>
                    <Grid size={12}>
                      <AddItemComment itemId={selectedItem} />
                    </Grid>
                  </Grid>
                </Box>
              </SimpleBar>
            </>
          )}
          {!selectedData && (
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography variant="h5" sx={{ color: 'error.main' }}>
                No item found
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Drawer>
  );
}
