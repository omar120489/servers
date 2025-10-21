import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import AuthenticationRoutes from './AuthenticationRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

const basename = import.meta.env.VITE_APP_BASE_NAME || '/';

const routes: RouteObject[] = [LoginRoutes, MainRoutes, AuthenticationRoutes];

const router = createBrowserRouter(routes, { basename });

export default router;
