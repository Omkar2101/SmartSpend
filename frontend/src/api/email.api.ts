/**
 * Email API Client
 * Handles email message operations
 */

import { AxiosInstance } from 'axios';
import { EmailMessage, EmailMessagesResponse } from '../types';

export class EmailApiClient {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Get email messages for current user
   */
  async getEmailMessages(
    page?: number,
    limit?: number
  ): Promise<EmailMessage[]> {
    try {
      const response = await this.apiClient.get<EmailMessagesResponse>(
        '/email/messages',
        {
          params: { page, limit },
        }
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch email messages');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching email messages:', error);
      throw error;
    }
  }

  /**
   * Get unread email messages
   */
  async getUnreadMessages(): Promise<EmailMessage[]> {
    try {
      const response = await this.apiClient.get<EmailMessagesResponse>(
        '/email/unread'
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch unread messages');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }
  }

  /**
   * Mark email message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    try {
      await this.apiClient.put(`/email/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Process email message for invoice extraction
   */
  async processEmailMessage(messageId: string): Promise<void> {
    try {
      await this.apiClient.post(`/email/messages/${messageId}/process`);
    } catch (error) {
      console.error('Error processing email message:', error);
      throw error;
    }
  }
}
