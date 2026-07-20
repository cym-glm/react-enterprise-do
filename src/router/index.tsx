import { lazy } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import LayoutComponent from '@/layouts/Layout';
import useAuthStore from '@/store';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const User = lazy(() => import('@/pages/User'));
const Order = lazy(() => import('@/pages/Order'));
const Topic = lazy(() => import('@/pages/Topic'));

// const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isLoggedIn } = useAuthStore();
//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }
//   return <>{children}</>;
// };

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
        <LayoutComponent>
          <Dashboard />
        </LayoutComponent>
    ),
  },
  {
    path: '/dashboard',
    element: (
        <LayoutComponent>
          <Dashboard />
        </LayoutComponent>
    ),
  },
  {
    path: '/user',
    element: (
        <LayoutComponent>
          <User />
        </LayoutComponent>
    ),
  },
  {
    path: '/order',
    element: (
        <LayoutComponent>
          <Order />
        </LayoutComponent>
    ),
  },
  {
    path: '/topic',
    element: (
        <LayoutComponent>
          <Topic />
        </LayoutComponent>
    ),
  },
];

const router = createBrowserRouter(routes, {
    basename: import.meta.env.VITE_BASE_BASENAME,
});

export default router;
