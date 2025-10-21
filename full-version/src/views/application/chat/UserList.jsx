import PropTypes from 'prop-types';
import { useEffect, useState, Fragment } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import UserAvatar from './UserAvatar';
import { dispatch, useSelector } from 'store';
import { getUsers } from 'store/slices/chat';

export default function UserList({ setUser }) {
  const [data, setData] = useState([]);
  const { users } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <List component="nav">
      {data.map((user) => (
        <Fragment key={user.id}>
          <ListItemButton onClick={() => setUser(user)}>
            <ListItemAvatar>
              <UserAvatar user={user} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Grid container spacing={1} component="span" sx={{ alignItems: 'center' }}>
                  <Grid component="span" size="grow">
                    <Typography
                      variant="h5"
                      component="span"
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', color: 'inherit' }}
                    >
                      {user.name}
                    </Typography>
                  </Grid>
                  <Grid component="span">
                    <Typography component="span" variant="subtitle2">
                      {user.lastMessage}
                    </Typography>
                  </Grid>
                </Grid>
              }
              secondary={
                <Grid container spacing={1} component="span" sx={{ alignItems: 'center' }}>
                  <Grid component="span" size="grow">
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    >
                      {user.status}
                    </Typography>
                  </Grid>
                  <Grid component="span">
                    {user.unReadChatCount !== 0 && (
                      <Chip
                        slotProps={{ label: { sx: { px: 0.5 } } }}
                        label={user.unReadChatCount}
                        component="span"
                        color="secondary"
                        variant="filled"
                        sx={{ width: 20, height: 20 }}
                      />
                    )}
                  </Grid>
                </Grid>
              }
            />
          </ListItemButton>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

UserList.propTypes = { setUser: PropTypes.func };
