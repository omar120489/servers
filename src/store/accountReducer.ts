import type { AccountState } from './slices/account';
import { LOGIN, LOGOUT, REGISTER, type AccountAction } from './actions';

const initialState: AccountState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

export default function accountReducer(
  state: AccountState = initialState,
  action: AccountAction
): AccountState {
  switch (action.type) {
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        isInitialized: true,
        user: null
      };
    }
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    default:
      return state;
  }
}

export { initialState };
