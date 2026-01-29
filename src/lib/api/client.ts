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

  console.log('🔄 Refreshing access token...');

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
  console.log('✅ Token refreshed successfully');

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
    console.log('🌐 API Call:', {
      url: fullUrl,
      method: options.method || 'GET',
      hasAuth: !!accessToken,
      isRetry,
    });

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log('📥 API Response:', {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !isRetry) {
      console.log('🔐 Got 401, attempting token refresh...');
      
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
        console.log('🔁 Retrying request with new token...');
        return await apiCall<T>(endpoint, options, true);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }

    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      console.log('✅ No content response (204)');
      return {} as T;
    }

    const data = await response.json();
    console.log('📦 Response data:', data);

    // Handle error responses
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }

    console.log('✅ API call successful');
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
