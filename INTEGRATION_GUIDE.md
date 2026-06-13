# Backend-Frontend Integration Guide

## 📋 Overview

This document outlines how the frontend is integrated with the backend APIs.

## 🔄 Request/Response Contract

### Authentication Flow

**Backend Definition** (`backend/src/middleware/auth.middleware.ts`):
```typescript
// Token format: Bearer <token>
// Verified via Clerk's verifyToken
// Returns: { clerkId, email }
```

**Frontend Integration** (`frontend/src/api/config.ts`):
```typescript
// Automatically adds: Authorization: Bearer {token}
// Interceptors handle 401 errors
```

### API Response Format

**Backend Pattern**:
```json
{
  "success": true/false,
  "data": {...},
  "message": "error message if any"
}
```

**Frontend Implementation** (`frontend/src/types/index.ts`):
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

## 📊 Data Models Mapping

### User Model

**Backend** (Prisma):
```prisma
model User {
  id String @id @default(uuid())
  clerkId String @unique
  email String @unique
  name String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Frontend** (`frontend/src/types/index.ts`):
```typescript
interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Invoice Model

**Backend**:
```prisma
model Invoice {
  id String @id @default(uuid())
  userId String
  vendor String
  invoiceNumber String?
  invoiceDate DateTime?
  totalAmount Float
  currency String @default("INR")
  category String?
  rawText String?
  createdAt DateTime @default(now())
}
```

**Frontend**:
```typescript
interface Invoice {
  id: string;
  userId: string;
  vendor: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount: number;
  currency: string;
  category?: string;
  rawText?: string;
  createdAt: string;
}
```

### Gmail Connection Model

**Backend**:
```prisma
model GmailConnection {
  id String @id @default(uuid())
  userId String @unique
  googleEmail String
  accessToken String
  refreshToken String
  expiryDate DateTime?
  createdAt DateTime @default(now())
}
```

**Frontend**:
```typescript
interface GmailConnection {
  id: string;
  userId: string;
  googleEmail: string;
  accessToken: string;
  refreshToken: string;
  expiryDate?: string;
  createdAt: string;
}
```

### Email Message Model

**Backend**:
```prisma
model EmailMessage {
  id String @id @default(uuid())
  gmailMessageId String @unique
  subject String?
  sender String?
  snippet String?
  receivedAt DateTime?
  rawPayload Json?
  processed Boolean @default(false)
  userId String
  createdAt DateTime @default(now())
}
```

**Frontend**:
```typescript
interface EmailMessage {
  id: string;
  gmailMessageId: string;
  subject?: string;
  sender?: string;
  snippet?: string;
  receivedAt?: string;
  rawPayload?: Record<string, unknown>;
  processed: boolean;
  userId: string;
  createdAt: string;
}
```

## 🔗 API Endpoint Mapping

### Authentication Endpoints

| Backend Route | Method | Frontend Hook | Client Method |
|---|---|---|---|
| `/auth/register` | POST | - | `authClient.registerUser()` |
| `/auth/users` | GET | - | `authClient.getAllUsers()` |

### User Endpoints

| Backend Route | Method | Frontend Hook | Client Method |
|---|---|---|---|
| `/users/me` | GET | `useCurrentUser()` | `userClient.getCurrentUser()` |

### Gmail Endpoints

| Backend Route | Method | Frontend Hook | Client Method |
|---|---|---|---|
| `/gmail/authorize` | GET | `useConnectGmail()` | `gmailClient.initiateGmailAuthorization()` |
| `/gmail/oauth/callback` | GET | - | `gmailClient.handleGmailCallback()` |
| `/gmail/connection` | GET | `useGmailConnection()` | `gmailClient.getGmailConnection()` |
| `/gmail/disconnect` | POST | `useDisconnectGmail()` | `gmailClient.disconnectGmail()` |
| `/gmail/sync` | POST | `useSyncGmailEmails()` | `gmailClient.syncGmailEmails()` |

### Email Endpoints

| Backend Route | Method | Frontend Hook | Client Method |
|---|---|---|---|
| `/email/messages` | GET | `useEmailMessages()` | `emailClient.getEmailMessages()` |
| `/email/unread` | GET | `useUnreadMessages()` | `emailClient.getUnreadMessages()` |
| `/email/messages/:id/read` | PUT | `useMarkAsRead()` | `emailClient.markAsRead()` |
| `/email/messages/:id/process` | POST | `useProcessEmailMessage()` | `emailClient.processEmailMessage()` |

### Invoice Endpoints

| Backend Route | Method | Frontend Hook | Client Method |
|---|---|---|---|
| `/invoices` | GET | `useInvoices()` | `invoiceClient.getInvoices()` |
| `/invoices/:id` | GET | `useInvoice()` | `invoiceClient.getInvoiceById()` |
| `/invoices` | POST | `useCreateInvoice()` | `invoiceClient.createInvoice()` |
| `/invoices/:id` | PUT | `useUpdateInvoice()` | `invoiceClient.updateInvoice()` |
| `/invoices/:id` | DELETE | `useDeleteInvoice()` | `invoiceClient.deleteInvoice()` |
| `/invoices/stats` | GET | `useExpenseStats()` | `invoiceClient.getExpenseStats()` |

## 🔌 Adding New Backend Endpoints

### Step 1: Create Backend Endpoint

```typescript
// backend/src/modules/feature/feature.routes.ts
router.get('/endpoint', requireAuth, controller.method);
```

### Step 2: Create Frontend Type

```typescript
// frontend/src/types/index.ts
export interface FeatureData {
  id: string;
  // ... fields
}

export interface FeatureResponse {
  success: boolean;
  data: FeatureData;
}
```

### Step 3: Create API Client

```typescript
// frontend/src/api/feature.api.ts
export class FeatureApiClient {
  constructor(private apiClient: AxiosInstance) {}

  async getFeature(): Promise<FeatureData> {
    const response = await this.apiClient.get<FeatureResponse>(
      '/endpoint'
    );
    return response.data.data;
  }
}
```

### Step 4: Add to Factory

```typescript
// frontend/src/api/factory.ts
export class ApiClientFactory {
  public feature: FeatureApiClient;

  constructor(getToken: () => Promise<string | null>) {
    this.feature = new FeatureApiClient(this.apiClient);
  }
}
```

### Step 5: Create Custom Hook

```typescript
// frontend/src/hooks/useApi.ts
export const useFeature = () => {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => apiClient.feature.getFeature(),
  });
};
```

### Step 6: Use in Component

```typescript
// Component
const { data, isLoading, error } = useFeature();
```

## 🔄 Error Handling

### Backend Error Format

```typescript
// Custom AppError
throw new AppError("Error message", 400);
```

### Frontend Error Handling

```typescript
// API Client
catch (error) {
  console.error('Error message:', error);
  throw error; // Propagate to hook
}

// Hook
const { data, error } = useQuery({...});
if (error) {
  // Handle error
}

// Component
{error && <Alert type="error" message={error.message} />}
```

## 🔐 Authentication

### Token Flow

1. **Frontend**: `useAuth().getToken()` from Clerk
2. **HTTP Interceptor**: Adds `Authorization: Bearer {token}`
3. **Backend**: `verifyToken()` validates with Clerk
4. **Request**: Continues with authenticated user

### Protected Routes

```typescript
<ProtectedRoute>
  <Route path="/dashboard" element={<Dashboard />} />
</ProtectedRoute>
```

## 📝 Request/Response Examples

### Get Current User

**Frontend**:
```typescript
const { data: user } = useCurrentUser();
```

**HTTP Request**:
```
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Backend Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clerkId": "user_xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-06-10T10:00:00Z",
    "updatedAt": "2026-06-10T10:00:00Z"
  }
}
```

### Create Invoice

**Frontend**:
```typescript
const createInvoice = useCreateInvoice();
await createInvoice.mutateAsync({
  vendor: "Uber",
  totalAmount: 150,
  category: "Transportation"
});
```

**HTTP Request**:
```
POST /api/v1/invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "vendor": "Uber",
  "totalAmount": 150,
  "category": "Transportation",
  "currency": "INR"
}
```

**Backend Response**:
```json
{
  "success": true,
  "data": {
    "id": "invoice-uuid",
    "userId": "user-uuid",
    "vendor": "Uber",
    "totalAmount": 150,
    "currency": "INR",
    "category": "Transportation",
    "createdAt": "2026-06-10T10:00:00Z"
  }
}
```

## 🧪 Testing Integration

### Manual Testing

1. **Start Backend**: `npm run dev` in backend folder
2. **Start Frontend**: `npm run dev` in frontend folder
3. **Open App**: Navigate to `http://localhost:5173`
4. **Sign In**: Use Clerk UI
5. **Test Features**: Use dashboard and features

### API Testing with Postman

1. Get Clerk token from frontend
2. Create request with header: `Authorization: Bearer {token}`
3. Test endpoints manually

## 📚 Extending the API

### Common Extensions

**Search/Filter**:
```typescript
// Backend
router.get('/invoices', (req, res) => {
  const { vendor, category } = req.query;
  // Filter logic
});

// Frontend
useInvoices({ vendor: 'Uber', category: 'Transport' })
```

**Pagination**:
```typescript
// Backend
router.get('/invoices', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // Pagination logic
});

// Frontend
useInvoices({}, { page: 1, limit: 10 })
```

**Sorting**:
```typescript
// Frontend
useInvoices({ sortBy: 'date', sortOrder: 'desc' })
```

## 🚀 Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] CORS configured for frontend domain
- [ ] `.env` variables set correctly
- [ ] Clerk production keys configured
- [ ] API base URL points to production backend
- [ ] All endpoints tested
- [ ] Error handling verified
