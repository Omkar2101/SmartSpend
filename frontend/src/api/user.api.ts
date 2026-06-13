/**
 * User API Client
 * Handles user profile and account management
 */

import { AxiosInstance } from 'axios';
import { User, UserResponse } from '../types';

export class UserApiClient {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.apiClient.get<UserResponse>(
        '/users/me'
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch current user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Get current user without making API call (for quick access)
   * This would be replaced with actual API call
   */
  async getCurrentUserFromToken(token: string): Promise<User> {
    try {
      const response = await this.apiClient.get<UserResponse>(
        '/users/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch current user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
}

// Legacy function for backward compatibility
export const getCurrentUser = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};