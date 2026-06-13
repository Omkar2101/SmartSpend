/**
 * Type definitions derived from backend DTOs and Prisma schema
 * This is the source of truth for frontend data structures
 */

// ============ Auth Types ============
export interface AuthUser {
  clerkId: string;
  email: string;
}

export interface RegisterUserRequest {
  email: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
}

// ============ User Types ============
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
}

// ============ Invoice/Expense Types ============
export interface Invoice {
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

export interface CreateInvoiceRequest {
  vendor: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount: number;
  currency?: string;
  category?: string;
  rawText?: string;
}

export interface UpdateInvoiceRequest {
  vendor?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  currency?: string;
  category?: string;
  rawText?: string;
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

export interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
}

// ============ Gmail Types ============
export interface GmailConnection {
  id: string;
  userId: string;
  googleEmail: string;
  accessToken: string;
  refreshToken: string;
  expiryDate?: string;
  createdAt: string;
}

export interface GmailConnectionResponse {
  success: boolean;
  data: GmailConnection;
}

// ============ Email Message Types ============
export interface EmailMessage {
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

export interface EmailMessagesResponse {
  success: boolean;
  data: EmailMessage[];
}

// ============ Dashboard Types ============
export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  categoriesBreakdown: Record<string, number>;
  topVendors: Array<{ vendor: string; amount: number }>;
}

export interface DashboardData {
  stats: DashboardStats;
  recentInvoices: Invoice[];
  gmailConnected: boolean;
}

// ============ API Response Types ============
export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============ Common Filter Types ============
export interface InvoiceFilters {
  category?: string;
  vendor?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
