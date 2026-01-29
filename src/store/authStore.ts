/**
 * Authentication Store (Zustand)
 * Global state for user authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import type { User } from '@/lib/api/types';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Set authentication data
      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        // Also save to localStorage for API client
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      },

      // Logout
      logout: () => {
        authApi.logout();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Login
      login: async (email, password) => {
        try {
          const response = await authApi.login(email, password);
          get().setAuth(response.user, response.accessToken, response.refreshToken);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      // Signup
      signup: async (email, password) => {
        try {
          await authApi.signup(email, password);
          // After signup, auto-login
          await get().login(email, password);
        } catch (error) {
          console.error('Signup failed:', error);
          throw error;
        }
      },

      // Check if user is authenticated (verify token)
      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) return false;

        try {
          const user = await authApi.me();
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Auth check failed:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
