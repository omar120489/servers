import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './leadsSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    leads: leadsReducer,
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
