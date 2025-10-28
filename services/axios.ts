import axios from 'axios';
import { getAuthorizationHeader, handleAuthError, refreshAccessToken } from '@/utils/tokenManager';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amarambaadmin.webnoxdigital.com/api'
const API_BASE_URL = 'http://localhost:5000'  

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with requests (for refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization header if access token exists
    const authHeader = getAuthorizationHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    
    console.log('Making API request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      hasAuthHeader: !!authHeader,
      headers: config.headers,
    });
    
    // Log current cookies for debugging
    if (typeof document !== 'undefined') {
      console.log('Current cookies:', document.cookie);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('API response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Handle authentication errors with automatic token refresh
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      // Avoid infinite retry loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          await refreshAccessToken();
          
          // Retry the original request with new token
          const authHeader = getAuthorizationHeader();
          if (authHeader) {
            originalRequest.headers.Authorization = authHeader;
          }
          
          return apiClient(originalRequest);
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);
          
          // If refresh already redirected, don't redirect again
          if (refreshError?.message?.includes('redirected to login')) {
            return Promise.reject(refreshError);
          }
          
          // Clear any stored auth data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('profileImageUrl');
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = '/auth/login';
          }
        }
      }
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.log('Access forbidden - redirecting to login');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('profileImageUrl');
        sessionStorage.clear();
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// Hybrid authentication approach:
// - Access token: Sent via Authorization header (stored in memory)
// - Refresh token: Sent via HTTP-only cookie (server-managed)