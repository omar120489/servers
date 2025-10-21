// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.vars.palette.grey[100],
  ...theme.applyStyles('dark', { backgroundColor: theme.vars.palette.background.default }),
  minHeight: '100vh'
}));

export default AuthWrapper1;
