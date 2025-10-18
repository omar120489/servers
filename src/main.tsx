import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
import { ColorModeProvider, useColorModeTheme } from './theme/ColorModeProvider';

function ThemedApp() {
  const { theme } = useColorModeTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeProvider>
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </ColorModeProvider>
    </Provider>
  </React.StrictMode>
);
