/**
 * Authentication API
 * Handles login, signup, logout, token refresh
 */

import { api } from './client';
import type { LoginResponse, SignupResponse, RefreshResponse, User } from './types';

export const authApi = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', { email, password });
  },

  /**
   * Signup new user
   * POST /auth/signup
   */
  signup: async (email: string, password: string): Promise<SignupResponse> => {
    return api.post<SignupResponse>('/auth/signup', { email, password });
  },

  /**
   * Get current user
   * GET /auth/me
   */
  me: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    return api.post<RefreshResponse>('/auth/refresh', { refreshToken });
  },

  /**
   * Logout (client-side only - clear tokens)
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
