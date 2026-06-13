/**
 * Authentication API Client
 * Handles user registration and user listing
 */

import { AxiosInstance } from 'axios';
import { RegisterUserRequest, User, AuthResponse, GetUsersResponse } from '../types';

export class AuthApiClient {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Register a new user
   */
  async registerUser(data: RegisterUserRequest): Promise<User> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/register',
        data
      );
      if (!response.data.success) {
        throw new Error('Registration failed');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin endpoint)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.apiClient.get<GetUsersResponse>(
        '/auth/users'
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch users');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}
