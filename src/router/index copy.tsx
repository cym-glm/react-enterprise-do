import { lazy } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import LayoutComponent from '@/layouts/Layout';
import useAuthStore from '@/store';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const User = lazy(() => import('@/pages/User'));
const Order = lazy(() => import('@/pages/Order'));
const Topic = lazy(() => import('@/pages/Topic'));

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <LayoutComponent>
          <Dashboard />
        </LayoutComponent>
      </PrivateRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <LayoutComponent>
          <Dashboard />
        </LayoutComponent>
      </PrivateRoute>
    ),
  },
  {
    path: '/user',
    element: (
      <PrivateRoute>
        <LayoutComponent>
          <User />
        </LayoutComponent>
      </PrivateRoute>
    ),
  },
  {
    path: '/order',
    element: (
      <PrivateRoute>
        <LayoutComponent>
          <Order />
        </LayoutComponent>
      </PrivateRoute>
    ),
  },
  {
    path: '/topic',
    element: (
      <PrivateRoute>
        <LayoutComponent>
          <Topic />
        </LayoutComponent>
      </PrivateRoute>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
