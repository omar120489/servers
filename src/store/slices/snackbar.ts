import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types for snackbar configuration
interface AnchorOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

interface AlertConfig {
  variant: 'filled' | 'outlined' | 'standard';
}

export interface SnackbarState {
  action: boolean;
  open: boolean;
  message: string;
  anchorOrigin: AnchorOrigin;
  severity: 'success' | 'error' | 'warning' | 'info';
  variant: 'default' | 'filled' | 'outlined';
  alert: AlertConfig;
  transition: 'Fade' | 'Grow' | 'Slide' | 'Zoom';
  close: boolean;
  maxStack: number;
  dense: boolean;
  iconVariant: string;
  actionButton: boolean;
  hideIconVariant: boolean;
}

const initialState: SnackbarState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  severity: 'success',
  variant: 'default',
  alert: {
    variant: 'filled'
  },
  transition: 'Fade',
  close: true,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault',
  actionButton: false,
  hideIconVariant: false
};

// Payload types for actions
interface OpenSnackbarPayload {
  open?: boolean;
  message?: string;
  anchorOrigin?: AnchorOrigin;
  variant?: SnackbarState['variant'];
  alert?: AlertConfig;
  transition?: SnackbarState['transition'];
  close?: boolean;
  actionButton?: boolean;
  severity?: SnackbarState['severity'];
  hideIconVariant?: boolean;
}

interface DensePayload {
  dense: boolean;
}

interface IncreasePayload {
  maxStack: number;
}

interface IconVariantsPayload {
  iconVariant?: string;
  hideIconVariant?: boolean;
}

// ==============================|| SLICE - SNACKBAR ||============================== //

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar(state, action: PayloadAction<OpenSnackbarPayload>) {
      const {
        open,
        message,
        anchorOrigin,
        variant,
        alert,
        transition,
        close,
        actionButton,
        severity,
        hideIconVariant
      } = action.payload;

      state.action = !state.action;
      state.open = open ?? initialState.open;
      state.message = message ?? initialState.message;
      state.anchorOrigin = anchorOrigin ?? initialState.anchorOrigin;
      state.variant = variant ?? initialState.variant;
      state.alert = { variant: alert?.variant ?? initialState.alert.variant };
      state.severity = severity ?? initialState.severity;
      state.transition = transition ?? initialState.transition;
      state.close = close ?? initialState.close;
      state.actionButton = actionButton ?? initialState.actionButton;
      state.hideIconVariant = hideIconVariant ?? initialState.hideIconVariant;
    },

    closeSnackbar(state) {
      state.open = false;
    },

    handlerDense(state, action: PayloadAction<DensePayload>) {
      const { dense } = action.payload;
      state.dense = dense;
    },

    handlerIncrease(state, action: PayloadAction<IncreasePayload>) {
      const { maxStack } = action.payload;
      state.maxStack = maxStack;
    },

    handlerIconVariants(state, action: PayloadAction<IconVariantsPayload>) {
      const { iconVariant, hideIconVariant } = action.payload;
      state.iconVariant = iconVariant ?? initialState.iconVariant;
      state.hideIconVariant = hideIconVariant ?? initialState.hideIconVariant;
    }
  }
});

export default snackbar.reducer;

export const { closeSnackbar, openSnackbar, handlerDense, handlerIconVariants, handlerIncrease } =
  snackbar.actions;
