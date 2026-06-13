/**
 * Main router configuration
 * Sets up all application routes with proper authentication
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, RedirectToSignIn } from '../components/common/MockAuth';
import ROUTES from './routes';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Layouts
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Public Pages
const HomePage = lazy(() => import('../pages/HomePage'));

// Auth Pages
const SignInPage = lazy(() => import('../pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));

// Protected Pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ExpensesPage = lazy(() => import('../pages/expenses/ExpensesPage'));
const ExpenseDetailPage = lazy(() => import('../pages/expenses/ExpenseDetailPage'));
const ExpenseFormPage = lazy(() => import('../pages/expenses/ExpenseFormPage'));
const BudgetsPage = lazy(() => import('../pages/budgets/BudgetsPage'));
const CategoriesPage = lazy(() => import('../pages/categories/CategoriesPage'));
const GmailPage = lazy(() => import('../pages/integrations/GmailPage'));
const EmailsPage = lazy(() => import('../pages/emails/EmailsPage'));
const InsightsPage = lazy(() => import('../pages/insights/InsightsPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * AppRouter component - Main routing configuration
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Expenses Routes */}
            <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
            <Route path={ROUTES.EXPENSES_NEW} element={<ExpenseFormPage />} />
            <Route path={ROUTES.EXPENSES_DETAIL} element={<ExpenseDetailPage />} />
            <Route path={ROUTES.EXPENSES_EDIT} element={<ExpenseFormPage />} />

            {/* Budgets Routes */}
            <Route path={ROUTES.BUDGETS} element={<BudgetsPage />} />

            {/* Categories Routes */}
            <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />

            {/* Gmail/Email Integration Routes */}
            <Route path={ROUTES.GMAIL} element={<GmailPage />} />

            {/* Emails Routes */}
            <Route path={ROUTES.EMAILS} element={<EmailsPage />} />

            {/* Insights Routes */}
            <Route path={ROUTES.INSIGHTS} element={<InsightsPage />} />

            {/* Profile/Settings Routes */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
