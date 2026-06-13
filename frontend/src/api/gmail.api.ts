/**
 * Gmail API Client
 * Handles Gmail connection and email integration
 */

import { AxiosInstance } from 'axios';
import { GmailConnection, GmailConnectionResponse } from '../types';

export class GmailApiClient {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Initiate Gmail authorization flow
   * Redirects to Google OAuth consent screen
   */
  async initiateGmailAuthorization(): Promise<void> {
    try {
      const response = await this.apiClient.get<{ authUrl: string }>(
        '/gmail/authorize'
      );
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating Gmail authorization:', error);
      throw error;
    }
  }

  /**
   * Handle Gmail OAuth callback
   * This is called after user authorizes Gmail access
   */
  async handleGmailCallback(code: string, state: string): Promise<GmailConnection> {
    try {
      const response = await this.apiClient.get<GmailConnectionResponse>(
        '/gmail/oauth/callback',
        {
          params: { code, state },
        }
      );
      if (!response.data.success) {
        throw new Error('Failed to connect Gmail account');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error handling Gmail callback:', error);
      throw error;
    }
  }

  /**
   * Get Gmail connection status for current user
   */
  async getGmailConnection(): Promise<GmailConnection | null> {
    try {
      const response = await this.apiClient.get<GmailConnectionResponse>(
        '/gmail/connection'
      );
      if (!response.data.success) {
        return null;
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Gmail connection:', error);
      return null;
    }
  }

  /**
   * Disconnect Gmail account
   */
  async disconnectGmail(): Promise<void> {
    try {
      await this.apiClient.post('/gmail/disconnect');
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      throw error;
    }
  }

  /**
   * Sync Gmail emails
   */
  async syncGmailEmails(): Promise<void> {
    try {
      await this.apiClient.post('/gmail/sync');
    } catch (error) {
      console.error('Error syncing Gmail emails:', error);
      throw error;
    }
  }
}
