/**
 * Custom React hooks for data fetching with React Query
 * These hooks encapsulate API calls and state management, redirected to mockDb
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import mockDb from "../utils/mockDb";
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
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: async (): Promise<User> => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDb.getUser();
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
  return useQuery({
    queryKey: ["invoices", filters, pagination],
    queryFn: async (): Promise<Invoice[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockDb.getInvoices(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to fetch single invoice
 */
export const useInvoice = (invoiceId: string | null) => {
  return useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: async (): Promise<Invoice> => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockDb.getInvoiceById(invoiceId!);
    },
    enabled: !!invoiceId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new invoice
 */
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceRequest): Promise<Invoice> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDb.createInvoice(data);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      data,
    }: {
      invoiceId: string;
      data: UpdateInvoiceRequest;
    }): Promise<Invoice> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDb.updateInvoice(invoiceId, data);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      mockDb.deleteInvoice(invoiceId);
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
  return useQuery({
    queryKey: ["invoices", "stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDb.getExpenseStats();
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ============ Gmail Hooks ============

/**
 * Hook to get Gmail connection status
 */
export const useGmailConnection = () => {
  return useQuery({
    queryKey: ["gmail", "connection"],
    queryFn: async (): Promise<GmailConnection | null> => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return mockDb.getGmailConnection();
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to connect Gmail
 */
export const useConnectGmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      mockDb.setGmailConnected(true);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      mockDb.setGmailConnected(false);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<EmailMessage[]> => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Syncing animation
      return mockDb.syncGmailEmails();
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
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/v1/emails?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to fetch emails");
      }
      const body = await res.json();
      return body.data as EmailMessage[];
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to fetch unread email messages
 */
export const useUnreadMessages = () => {
  return useQuery({
    queryKey: ["email", "unread"],
    queryFn: async (): Promise<EmailMessage[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDb.getEmailMessages().filter((m) => !m.processed);
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to mark email as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const emails = mockDb.getEmailMessages();
      const idx = emails.findIndex((e) => e.id === messageId);
      if (idx !== -1) {
        emails[idx].processed = true;
        localStorage.setItem("smartspend_emails", JSON.stringify(emails));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};

/**
 * Hook to process email message
 */
export const useProcessEmailMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string): Promise<EmailMessage> => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // processing visual delay
      return mockDb.processEmailMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};
