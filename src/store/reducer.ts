// third party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import accountReducer from './slices/account';

// ==============================|| COMBINE REDUCER ||============================== //

const rootReducer = combineReducers({
  snackbar: snackbarReducer,
  account: accountReducer
});

export default rootReducer;
