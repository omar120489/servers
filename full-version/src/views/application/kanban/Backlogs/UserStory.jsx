import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// third party
import { format } from 'date-fns';
import { Droppable, Draggable } from '@hello-pangea/dnd';

// project imports
import AddItem from './AddItem';
import EditStory from './EditStory';
import AlertStoryDelete from './AlertStoryDelete';
import Items from './Items';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';
import { deleteStory } from 'store/slices/kanban';
import { withAlpha } from 'utils/colorUtils';

// assets
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

// ==============================|| KANBAN BACKLOGS - USER STORY ||============================== //

export default function UserStory({ story, index }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const kanban = useSelector((state) => state.kanban);
  const { columns, profiles, userStory, userStoryOrder } = kanban;
  const [open, setOpen] = React.useState(false);

  const storyColumn = columns.filter((column) => column.id === story.columnId)[0];
  const storyProfile = profiles.filter((profile) => profile.id === story.assign)[0];

  // drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleDrawerOpen = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const addItem = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const [openStoryDrawer, setOpenStoryDrawer] = useState(false);
  const handleStoryDrawerOpen = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };

  const editStory = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = (status) => {
    setOpenModal(false);
    if (status) {
      dispatch(deleteStory(story.id, userStory, userStoryOrder));
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
    <>
      <Draggable draggableId={story.id} index={index}>
        {(provided, snapshot) => (
          <>
            <TableRow
              hover
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              sx={{
                backgroundColor: 'transparent',
                userSelect: 'none',
                ...(snapshot.isDragging || open
                  ? {
                      backgroundColor: 'primary.light',
                      ...theme.applyStyles('dark', { backgroundColor: 'background.default' })
                    }
                  : {})
              }}
            >
              <TableCell sx={{ pl: 3, minWidth: 120, width: 120, height: 46 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 0.25 }}>
                  <Tooltip title="Add Task">
                    <IconButton aria-label="expand row" size="small" onClick={addItem}>
                      <AddCircleTwoToneIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell sx={{ width: 110, minWidth: 110 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                  <MenuBookTwoToneIcon color="secondary" sx={{ fontSize: '0.875rem' }} />
                  <Typography variant="body2">{story.id}</Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140 }} component="th" scope="row">
                <Link
                  underline="hover"
                  color="default"
                  onClick={editStory}
                  sx={{
                    overflow: 'hidden',
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ':hover': { color: 'primary.main' },
                    cursor: 'pointer'
                  }}
                >
                  {story.title}
                </Link>
              </TableCell>
              <TableCell sx={{ width: 60, minWidth: 60 }}>
                <ButtonBase
                  className="more-button"
                  sx={{ borderRadius: '12px' }}
                  onClick={handleClick}
                  aria-controls="menu-comment"
                  aria-haspopup="true"
                >
                  <IconButton component="span" size="small" disableRipple>
                    <MoreVertTwoToneIcon fontSize="inherit" />
                  </IconButton>
                </ButtonBase>
                <Menu
                  id="menu-comment"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  variant="selectedMenu"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      editStory();
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setOpenModal(true);
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
                {openModal && <AlertStoryDelete title={story.title} open={openModal} handleClose={handleModalClose} />}
              </TableCell>
              <TableCell sx={{ width: 90, minWidth: 90 }}>{storyColumn ? storyColumn.title : ''}</TableCell>
              <TableCell sx={{ width: 140, minWidth: 140 }}>{storyProfile ? storyProfile.name : ''}</TableCell>
              <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{story.priority}</TableCell>
              <TableCell sx={{ width: 120, minWidth: 120 }}>{story.dueDate ? format(new Date(story.dueDate), 'd MMM yyyy') : ''}</TableCell>
            </TableRow>

            <Droppable droppableId={story.id} type="item">
              {(providedDrop, snapshotDrop) => (
                <TableRow
                  ref={providedDrop.innerRef}
                  {...providedDrop.droppableProps}
                  sx={{
                    background: 'transparent',
                    ...(snapshotDrop.isDraggingOver && {
                      ...theme.applyStyles('dark', { background: theme.vars.palette.background.default }),
                      ...theme.applyStyles('light', { background: withAlpha(theme.vars.palette.grey[100], 0.8) })
                    })
                  }}
                >
                  <TableCell sx={{ padding: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      {open && (
                        <Box sx={{ margin: 0 }}>
                          <TableContainer>
                            <Table size="small" aria-label="purchases">
                              <TableBody>
                                {story.itemIds?.map((itemId, i) => (
                                  <Items key={itemId} itemId={itemId} index={i} />
                                ))}
                                {providedDrop.placeholder}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </Droppable>
          </>
        )}
      </Draggable>
      <EditStory story={story} open={openStoryDrawer} handleDrawerOpen={handleStoryDrawerOpen} />
      <AddItem open={openDrawer} handleDrawerOpen={handleDrawerOpen} storyId={story.id} />
    </>
  );
}

UserStory.propTypes = { story: PropTypes.any, index: PropTypes.number };
