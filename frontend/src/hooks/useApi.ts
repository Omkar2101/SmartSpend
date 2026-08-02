/**
 * Custom React hooks for data fetching with React Query
 * These hooks encapsulate API calls and state management, integrated with the real backend.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import type {
  User,
  Invoice,
  GmailConnection,
  EmailMessage,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilters,
  PaginationParams,
} from "../types";

// ============ User Hooks ============

/**
 * Hook to fetch current user profile
 */
export const useCurrentUser = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: async (): Promise<User> => {
      console.log("[API] GET /users/me - Fetching current user profile...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /users/me failed:", body);
        throw new Error(body?.message || "Failed to fetch user");
      }
      const body = await res.json();
      console.log("[API] GET /users/me success:", body.data);
      return body.data as User;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ============ Invoice/Expense Hooks ============

/**
 * Hook to fetch all invoices
 */
export const useInvoices = (
  filters?: InvoiceFilters,
  pagination?: PaginationParams,
) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["invoices", filters, pagination],
    queryFn: async (): Promise<Invoice[]> => {
      console.log("[API] GET /expenses - Fetching invoices with filters:", filters, "and pagination:", pagination);
      const token = await getToken();
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.vendor) params.append("vendor", filters.vendor);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.currency) params.append("currency", filters.currency);
      if (pagination?.page) params.append("page", pagination.page.toString());
      if (pagination?.limit) params.append("limit", pagination.limit.toString());

      const url = `http://localhost:5000/api/v1/expenses?${params.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /expenses failed:", body);
        throw new Error(body?.message || "Failed to fetch invoices");
      }
      const body = await res.json();
      console.log("[API] GET /expenses success. Count:", body.data?.length);
      return body.data as Invoice[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to fetch single invoice
 */
export const useInvoice = (invoiceId: string | null) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: async (): Promise<Invoice> => {
      console.log(`[API] GET /expenses/${invoiceId} - Fetching single invoice details...`);
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/expenses/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error(`[API] GET /expenses/${invoiceId} failed:`, body);
        throw new Error(body?.message || "Failed to fetch invoice");
      }
      const body = await res.json();
      console.log(`[API] GET /expenses/${invoiceId} success:`, body.data);
      return body.data as Invoice;
    },
    enabled: !!invoiceId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new invoice
 */
export const useCreateInvoice = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceRequest): Promise<Invoice> => {
      console.log("[API] POST /expenses - Manually creating a new invoice:", data);
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/expenses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] POST /expenses failed:", body);
        throw new Error(body?.message || "Failed to create invoice");
      }
      const body = await res.json();
      console.log("[API] POST /expenses success:", body.data);
      return body.data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

/**
 * Hook to update an invoice
 */
export const useUpdateInvoice = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      data,
    }: {
      invoiceId: string;
      data: UpdateInvoiceRequest;
    }): Promise<Invoice> => {
      console.log(`[API] PUT /expenses/${invoiceId} - Updating invoice:`, data);
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/expenses/${invoiceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error(`[API] PUT /expenses/${invoiceId} failed:`, body);
        throw new Error(body?.message || "Failed to update invoice");
      }
      const body = await res.json();
      console.log(`[API] PUT /expenses/${invoiceId} success:`, body.data);
      return body.data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

/**
 * Hook to delete an invoice
 */
export const useDeleteInvoice = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: string): Promise<void> => {
      console.log(`[API] DELETE /expenses/${invoiceId} - Deleting invoice...`);
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/expenses/${invoiceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error(`[API] DELETE /expenses/${invoiceId} failed:`, body);
        throw new Error(body?.message || "Failed to delete invoice");
      }
      console.log(`[API] DELETE /expenses/${invoiceId} success`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

/**
 * Hook to fetch expense statistics
 */
export const useExpenseStats = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["invoices", "stats"],
    queryFn: async () => {
      console.log("[API] GET /expenses/stats - Fetching statistics...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/expenses/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /expenses/stats failed:", body);
        throw new Error(body?.message || "Failed to fetch stats");
      }
      const body = await res.json();
      console.log("[API] GET /expenses/stats success:", body.data);
      return body.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ============ Gmail Hooks ============

/**
 * Hook to get Gmail connection status
 */
export const useGmailConnection = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["gmail", "connection"],
    queryFn: async (): Promise<GmailConnection | null> => {
      console.log("[API] GET /gmail/connection - Checking Gmail connection status...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/gmail/connection", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /gmail/connection failed:", body);
        throw new Error(body?.message || "Failed to check Gmail connection");
      }
      const body = await res.json();
      console.log("[API] GET /gmail/connection success:", body.data);
      return body.data as GmailConnection | null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to connect Gmail
 */
export const useConnectGmail = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      console.log("[API] GET /gmail/authorization-url - Fetching URL to connect Gmail...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/gmail/authorization-url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /gmail/authorization-url failed:", body);
        throw new Error(body?.message || "Failed to generate authorization URL");
      }
      const body = await res.json();
      console.log("[API] Redirecting user to Google OAuth:", body.data.authorizationUrl);
      window.location.href = body.data.authorizationUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail"] });
    },
  });
};

/**
 * Hook to disconnect Gmail
 */
export const useDisconnectGmail = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      console.log("[API] POST /gmail/disconnect - Disconnecting Gmail connection...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/gmail/disconnect", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] POST /gmail/disconnect failed:", body);
        throw new Error(body?.message || "Failed to disconnect Gmail");
      }
      console.log("[API] POST /gmail/disconnect success");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail"] });
    },
  });
};

/**
 * Hook to sync Gmail emails
 */
export const useSyncGmailEmails = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<EmailMessage[]> => {
      console.log("[API] POST /emails/sync - Triggering Gmail sync...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/emails/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] POST /emails/sync failed:", body);
        throw new Error(body?.message || "Failed to sync Gmail emails");
      }
      const body = await res.json();
      console.log("[API] POST /emails/sync success:", body.data);
      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};

// ============ Email Hooks ============

/**
 * Hook to fetch email messages
 */
export const useEmailMessages = (page = 1, limit = 50) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["email", "messages", page, limit],
    queryFn: async (): Promise<EmailMessage[]> => {
      console.log(`[API] GET /emails - Fetching email messages (page: ${page}, limit: ${limit})...`);
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/v1/emails?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /emails failed:", body);
        throw new Error(body?.message || "Failed to fetch emails");
      }
      const body = await res.json();
      console.log("[API] GET /emails success. Count:", body.data?.length);
      return body.data as EmailMessage[];
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to fetch unread email messages
 */
export const useUnreadMessages = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["email", "unread"],
    queryFn: async (): Promise<EmailMessage[]> => {
      console.log("[API] GET /emails - Fetching unread emails...");
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/emails?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[API] GET /emails failed while fetching unread:", body);
        throw new Error(body?.message || "Failed to fetch unread emails");
      }
      const body = await res.json();
      const all: EmailMessage[] = body.data || [];
      const unread = all.filter((m) => m.processingStatus !== "PROCESSED" && !m.processed);
      console.log("[API] Unread emails filtered successfully. Count:", unread.length);
      return unread;
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to process email message
 */
export const useProcessEmailMessage = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string): Promise<EmailMessage> => {
      console.log(`[API] POST /expenses/process/${messageId} - Triggering manual process of email...`);
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/expenses/process/${messageId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error(`[API] POST /expenses/process/${messageId} failed:`, body);
        throw new Error(body?.message || "Failed to process email message");
      }
      const body = await res.json();
      console.log(`[API] POST /expenses/process/${messageId} success:`, body.data);
      return body.data as EmailMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};
