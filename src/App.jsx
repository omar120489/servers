// cspell:ignore Notistack Locales
import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// notifications provider
import { NotificationsProvider } from 'contexts/NotificationsContext';

// WebSocket toast integration
import { useWebSocketToasts } from 'hooks/useWebSocketToasts';

// Attribution tracking
import { useAttribution } from 'hooks/useAttribution';

function AppContent() {
  // Initialize WebSocket toasts (subscribes to events and displays toasts)
  useWebSocketToasts();

  // Capture attribution data from URL on app mount
  useAttribution();

  return (
    <Notistack>
      <RouterProvider router={router} />
      <Snackbar />
    </Notistack>
  );
}

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <NavigationScroll>
          <AuthProvider>
            <NotificationsProvider>
              <AppContent />
            </NotificationsProvider>
          </AuthProvider>
        </NavigationScroll>
      </Locales>
    </ThemeCustomization>
  );
}
