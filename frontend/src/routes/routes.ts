/**
 * Route definitions for the application
 * Centralized routing configuration
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGNIN: '/sign-in',
  SIGNUP: '/sign-up',

  // Protected routes
  DASHBOARD: '/dashboard',
  
  // Expenses/Invoices
  EXPENSES: '/expenses',
  EXPENSES_NEW: '/expenses/new',
  EXPENSES_DETAIL: '/expenses/:id',
  EXPENSES_EDIT: '/expenses/:id/edit',

  // Budgets
  BUDGETS: '/budgets',
  BUDGETS_NEW: '/budgets/new',
  BUDGETS_DETAIL: '/budgets/:id',

  // Categories
  CATEGORIES: '/categories',
  CATEGORIES_NEW: '/categories/new',

  // Gmail/Email Integration
  GMAIL: '/integrations/gmail',
  GMAIL_CONNECT: '/integrations/gmail/connect',
  GMAIL_CALLBACK: '/integrations/gmail/callback',

  // Email Messages
  EMAILS: '/emails',
  EMAILS_DETAIL: '/emails/:id',

  // AI Insights
  INSIGHTS: '/insights',

  // User Profile
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // 404
  NOT_FOUND: '*',
};

export default ROUTES;
