// AppWrapper.tsx - Wraps App with all necessary providers for Module Federation
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import store from './store';
import { ColorModeProvider, useColorModeTheme } from './theme/ColorModeProvider';

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function ThemedApp() {
  const { theme } = useColorModeTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

// Determine if loaded via shell (port 3000) or standalone (port 3001)
const isLoadedViaShell = window.location.port === '3000';
const basename = isLoadedViaShell ? '/sales' : '/';


// This component wraps App with all providers for Module Federation
export default function AppWrapper() {
  // When loaded via Shell, don't render BrowserRouter (Shell already has one)
  // When standalone, render with BrowserRouter
  if (isLoadedViaShell) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ColorModeProvider>
            <ThemedApp />
          </ColorModeProvider>
        </Provider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ColorModeProvider>
          <BrowserRouter 
            basename={basename}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ThemedApp />
          </BrowserRouter>
        </ColorModeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

