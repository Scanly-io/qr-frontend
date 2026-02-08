/**
 * Base API Client for Backend Communication
 * 
 * Centralized fetch wrapper with:
 * - Automatic auth header injection
 * - Token refresh on 401 errors
 * - Error handling
 * - JSON parsing
 * - Base URL configuration
 */

// API Gateway URL (nginx on port 80)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  const newAccessToken = data.accessToken;

  // Update localStorage
  localStorage.setItem('accessToken', newAccessToken);

  return newAccessToken;
}

/**
 * Generic API call wrapper
 * Automatically adds auth headers and handles common errors
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  // Get access token from localStorage
  const accessToken = localStorage.getItem('accessToken');

  // Merge headers (only set Content-Type if there's a body)
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type if there's a body
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if token exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !isRetry) {
      
      try {
        // Prevent multiple simultaneous refresh requests
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
        } else {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
          await refreshPromise;
          refreshPromise = null;
          isRefreshing = false;
        }

        // Retry the original request with new token
        return await apiCall<T>(endpoint, options, true);
      } catch {
        // Clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }

    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error or server unavailable');
  }
}

/**
 * Shorthand HTTP methods
 */
export const api = {
  get: <T = unknown>(endpoint: string) => 
    apiCall<T>(endpoint, { method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string) =>
    apiCall<T>(endpoint, { method: 'DELETE' }),
};
