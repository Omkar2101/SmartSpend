# SmartSpend Frontend - React + TypeScript

A complete React + TypeScript frontend for the SmartSpend AI-powered expense management platform.

## 📋 Project Overview

This frontend application provides:

- **Authentication**: Clerk-based user authentication with sign in/sign up
- **Dashboard**: Overview of expenses, statistics, and quick actions
- **Expense Management**: Create, read, update, and delete expenses
- **Gmail Integration**: Connect Gmail account and extract expenses from emails
- **Email Management**: View and process email messages
- **AI Insights**: AI-powered spending recommendations (extensible)
- **User Profile**: View user information and account details
- **Settings**: Application preferences and configuration
- **Responsive Design**: Mobile-friendly UI with excellent UX

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/                    # API clients and HTTP configuration
│   │   ├── config.ts          # Axios client configuration
│   │   ├── factory.ts         # API client factory
│   │   ├── auth.api.ts        # Auth API client
│   │   ├── user.api.ts        # User API client
│   │   ├── gmail.api.ts       # Gmail API client
│   │   ├── email.api.ts       # Email API client
│   │   └── invoice.api.ts     # Invoice/Expense API client
│   │
│   ├── components/             # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx      # Button component
│   │   │   ├── Alert.tsx       # Alert/notification component
│   │   │   └── LoadingSpinner.tsx
│   │   └── layout/
│   │       ├── Navigation.tsx  # Top navigation
│   │       └── Sidebar.tsx     # Sidebar navigation
│   │
│   ├── hooks/
│   │   └── useApi.ts          # Custom hooks for data fetching
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx      # Main app layout
│   │   └── AuthLayout.tsx      # Auth pages layout
│   │
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx
│   │   ├── auth/
│   │   │   ├── SignInPage.tsx
│   │   │   └── SignUpPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── expenses/
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── ExpenseDetailPage.tsx
│   │   │   └── ExpenseFormPage.tsx
│   │   ├── budgets/
│   │   │   └── BudgetsPage.tsx
│   │   ├── categories/
│   │   │   └── CategoriesPage.tsx
│   │   ├── integrations/
│   │   │   └── GmailPage.tsx
│   │   ├── emails/
│   │   │   └── EmailsPage.tsx
│   │   ├── insights/
│   │   │   └── InsightsPage.tsx
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── routes.ts           # Route definitions
│   │   ├── ProtectedRoute.tsx  # Route guard component
│   │   └── AppRouter.tsx       # Main router configuration
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   │
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── main.tsx               # Entry point
│
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend running on `http://localhost:5000`
- Clerk account with publishable key

### Installation

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Configure environment variables** (create `.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📚 Architecture Overview

### API Client Pattern

The application uses a factory pattern for API clients with automatic token management:

```typescript
// In components
const { data: invoices } = useInvoices(filters);
const createInvoice = useCreateInvoice();
```

All API calls automatically:
- Add authentication tokens from Clerk
- Handle errors with appropriate feedback
- Manage loading states
- Cache responses with React Query

### Type Safety

All backend DTOs are defined in `src/types/index.ts`:
- Derived directly from backend Prisma schema
- Used throughout the application
- Ensures type-safe API integration

### State Management

Uses React Query for server state management:
- Automatic caching and invalidation
- Built-in loading and error states
- Optimistic updates
- Automatic refetching

## 🔗 API Integration

The frontend is fully integrated with the backend APIs:

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `GET /auth/users` - Get all users

### User (`/users`)
- `GET /users/me` - Get current user

### Gmail Integration (`/gmail`)
- `GET /gmail/authorize` - Initiate Gmail OAuth
- `GET /gmail/oauth/callback` - Handle OAuth callback
- `GET /gmail/connection` - Get connection status
- `POST /gmail/disconnect` - Disconnect Gmail
- `POST /gmail/sync` - Sync Gmail emails

### Email Messages (`/email`)
- `GET /email/messages` - Get email messages
- `GET /email/unread` - Get unread messages
- `PUT /email/messages/:id/read` - Mark as read
- `POST /email/messages/:id/process` - Process message

### Invoices/Expenses (`/invoices`)
- `GET /invoices` - List invoices with filters
- `GET /invoices/:id` - Get single invoice
- `POST /invoices` - Create invoice
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice
- `GET /invoices/stats` - Get expense statistics

## 🎨 UI Components

### Button
```typescript
<Button 
  variant="primary" | "secondary" | "danger" | "success"
  size="sm" | "md" | "lg"
  isLoading={boolean}
>
  Click me
</Button>
```

### Alert
```typescript
<Alert 
  type="error" | "success" | "info" | "warning"
  message="Message text"
  onClose={() => {}}
/>
```

### LoadingSpinner
```typescript
<LoadingSpinner text="Loading..." />
```

## 🔐 Authentication Flow

1. **Sign In/Up**: User uses Clerk's sign-in component
2. **Token Generation**: Clerk provides JWT token
3. **API Requests**: Token automatically added to all API requests
4. **Protected Routes**: Routes wrapped with `<ProtectedRoute>` component
5. **Logout**: Clerk handles logout and clears session

## 🪝 Custom Hooks

The `useApi.ts` file provides hooks for all API operations:

```typescript
// User
const { data: user } = useCurrentUser();

// Invoices
const { data: invoices } = useInvoices(filters, pagination);
const { data: invoice } = useInvoice(id);
const createInvoice = useCreateInvoice();
const updateInvoice = useUpdateInvoice();
const deleteInvoice = useDeleteInvoice();
const { data: stats } = useExpenseStats();

// Gmail
const { data: connection } = useGmailConnection();
const connectGmail = useConnectGmail();
const disconnectGmail = useDisconnectGmail();
const syncGmailEmails = useSyncGmailEmails();

// Email
const { data: messages } = useEmailMessages(page, limit);
const { data: unread } = useUnreadMessages();
const markAsRead = useMarkAsRead();
const processEmailMessage = useProcessEmailMessage();
```

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar, optimized layout
- **Tablet**: Collapsible sidebar, adjusted spacing
- **Mobile**: Hamburger menu, single column layout

CSS media queries at `768px` and `480px` breakpoints ensure optimal display on all devices.

## 🎯 Key Features

### Dashboard
- Real-time expense statistics
- Category breakdown
- Recent expenses list
- Quick access to main features

### Expense Management
- Create, read, update, delete expenses
- Filter by vendor and category
- Invoice number and date tracking
- Raw text field for OCR integration

### Gmail Integration
- One-click Gmail connection via OAuth
- Automatic email message fetching
- Email snippet preview
- Process emails to extract expenses

### Extensibility

The structure supports easy addition of:
- **New Pages**: Add new route in `routes.ts` and page component
- **New API Clients**: Extend `api/` folder following existing patterns
- **New Components**: Add reusable components in `components/`
- **New Hooks**: Add custom hooks in `hooks/useApi.ts`

## 🔧 Environment Configuration

Create `.env` file:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 📦 Dependencies

- **React 19**: UI library
- **React Router 7**: Client-side routing
- **React Query 5**: Server state management
- **Axios**: HTTP client
- **Clerk React**: Authentication
- **TypeScript**: Type safety
- **Vite**: Build tool

## 🏃 Running the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚢 Deployment

Build the application and deploy the `dist/` folder to your hosting:

```bash
npm run build
```

## 📝 Notes

- All components use CSS modules for scoping
- API clients handle all HTTP concerns
- Type definitions are the source of truth
- Custom hooks abstract React Query complexity
- All pages are lazy-loaded for better performance

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running on correct port
- Check `.env` file has correct `VITE_API_BASE_URL`
- Ensure CORS is configured on backend

### Authentication Issues
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct
- Check Clerk dashboard settings
- Ensure callback URLs are configured in Clerk

### Component Not Rendering
- Check React Query provider is in root component
- Verify route is correctly configured
- Check browser console for errors

## 📞 Support

For issues or questions:
1. Check the component's corresponding CSS file
2. Review the API client implementation
3. Check React Query documentation
4. Review Clerk documentation for auth issues
