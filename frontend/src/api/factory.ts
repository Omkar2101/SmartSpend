/**
 * API Client Factory
 * Provides centralized access to all API clients
 */

import { AxiosInstance } from 'axios';
import { createApiClient } from './config';
import { AuthApiClient } from './auth.api';
import { UserApiClient } from './user.api';
import { GmailApiClient } from './gmail.api';
import { EmailApiClient } from './email.api';
import { InvoiceApiClient } from './invoice.api';

export class ApiClientFactory {
  private apiClient: AxiosInstance;
  public auth: AuthApiClient;
  public user: UserApiClient;
  public gmail: GmailApiClient;
  public email: EmailApiClient;
  public invoice: InvoiceApiClient;

  constructor(getToken: () => Promise<string | null>) {
    this.apiClient = createApiClient(getToken);
    this.auth = new AuthApiClient(this.apiClient);
    this.user = new UserApiClient(this.apiClient);
    this.gmail = new GmailApiClient(this.apiClient);
    this.email = new EmailApiClient(this.apiClient);
    this.invoice = new InvoiceApiClient(this.apiClient);
  }

  /**
   * Get the underlying Axios client
   */
  getHttpClient(): AxiosInstance {
    return this.apiClient;
  }
}

let apiClientFactory: ApiClientFactory | null = null;

/**
 * Initialize the API client factory
 * Should be called in the app initialization phase
 */
export const initializeApiClient = (
  getToken: () => Promise<string | null>
): ApiClientFactory => {
  apiClientFactory = new ApiClientFactory(getToken);
  return apiClientFactory;
};

/**
 * Get the API client factory instance
 * Throws error if not initialized
 */
export const getApiClient = (): ApiClientFactory => {
  if (!apiClientFactory) {
    throw new Error('API client not initialized. Call initializeApiClient first.');
  }
  return apiClientFactory;
};

export default ApiClientFactory;
