import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/app-layout'
import { ProtectedRoute } from '../features/auth/protected-route'
import { CompetitorAnalysisPage } from '../pages/competitor-analysis-page'
import { DashboardPage } from '../pages/dashboard-page'
import { LandingPage } from '../pages/landing-page'
import { ReportsPage } from '../pages/reports-page'
import { SettingsPage } from '../pages/settings-page'
import { SocialMonitoringPage } from '../pages/social-monitoring-page'
import { TrendAnalysisPage } from '../pages/trend-analysis-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'monitoring',
        element: <SocialMonitoringPage />,
      },
      {
        path: 'competitors',
        element: <CompetitorAnalysisPage />,
      },
      {
        path: 'trends',
        element: <TrendAnalysisPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
