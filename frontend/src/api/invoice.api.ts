/**
 * Invoice/Expense API Client
 * Handles invoice and expense management
 */

import { AxiosInstance } from 'axios';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceResponse,
  InvoicesResponse,
  InvoiceFilters,
  PaginationParams,
} from '../types';

export class InvoiceApiClient {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Get all invoices for current user
   */
  async getInvoices(
    filters?: InvoiceFilters,
    pagination?: PaginationParams
  ): Promise<Invoice[]> {
    try {
      const response = await this.apiClient.get<InvoicesResponse>(
        '/invoices',
        {
          params: { ...filters, ...pagination },
        }
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch invoices');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  /**
   * Get single invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    try {
      const response = await this.apiClient.get<InvoiceResponse>(
        `/invoices/${invoiceId}`
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch invoice');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  /**
   * Create a new invoice/expense
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await this.apiClient.post<InvoiceResponse>(
        '/invoices',
        data
      );
      if (!response.data.success) {
        throw new Error('Failed to create invoice');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Update an existing invoice
   */
  async updateInvoice(
    invoiceId: string,
    data: UpdateInvoiceRequest
  ): Promise<Invoice> {
    try {
      const response = await this.apiClient.put<InvoiceResponse>(
        `/invoices/${invoiceId}`,
        data
      );
      if (!response.data.success) {
        throw new Error('Failed to update invoice');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  /**
   * Delete an invoice
   */
  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/invoices/${invoiceId}`);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoices by category
   */
  async getInvoicesByCategory(category: string): Promise<Invoice[]> {
    try {
      const response = await this.apiClient.get<InvoicesResponse>(
        '/invoices/category/' + category
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch invoices by category');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoices by category:', error);
      throw error;
    }
  }

  /**
   * Get invoices within a date range
   */
  async getInvoicesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Invoice[]> {
    try {
      const response = await this.apiClient.get<InvoicesResponse>(
        '/invoices/date-range',
        {
          params: { startDate, endDate },
        }
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch invoices by date range');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoices by date range:', error);
      throw error;
    }
  }

  /**
   * Get expense statistics
   */
  async getExpenseStats(): Promise<{
    totalExpenses: number;
    monthlyExpenses: number;
    categoriesBreakdown: Record<string, number>;
  }> {
    try {
      const response = await this.apiClient.get<{
        success: boolean;
        data: {
          totalExpenses: number;
          monthlyExpenses: number;
          categoriesBreakdown: Record<string, number>;
        };
      }>('/invoices/stats');
      if (!response.data.success) {
        throw new Error('Failed to fetch expense statistics');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching expense statistics:', error);
      throw error;
    }
  }
}
