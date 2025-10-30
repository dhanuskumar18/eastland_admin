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
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'x-csrf-token',
});

// CSRF helpers
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfCache: { token: string | null; ts: number } = { token: null, ts: 0 } as any;
const CSRF_TTL_MS = 2 * 60 * 1000;

async function ensureCsrfToken(forceFresh: boolean = false): Promise<string | null> {
  // For strict backends, prefer fresh token for writes
  if (!forceFresh) {
    const fromCookie = getCookie('csrfToken') || getCookie('XSRF-TOKEN') || getCookie('csrf-token');
    if (fromCookie) return fromCookie;
    if (csrfCache.token && Date.now() - csrfCache.ts < CSRF_TTL_MS) {
      return csrfCache.token;
    }
  }
  try {
    // Attempt to fetch from authenticated and public endpoints
    const endpoints = ['/auth/csrf-token/authenticated', '/auth/csrf-token', '/csrf-token', '/auth/csrf', '/csrf'];
    for (const ep of endpoints) {
      try {
        const authHeader = getAuthorizationHeader();
        const res = await axios.get(`${API_BASE_URL}${ep}`, {
          withCredentials: true,
          headers: authHeader ? { Authorization: authHeader } : undefined,
        });
        const headerToken = (res.headers['x-csrf-token'] as string) || (res.headers['X-CSRF-Token'] as any);
        const bodyToken = res.data?.token || res.data?.csrfToken;
        const cookieToken = getCookie('csrfToken') || getCookie('XSRF-TOKEN') || getCookie('csrf-token');
        const token = headerToken || bodyToken || cookieToken || null;
        if (token) {
          csrfCache = { token, ts: Date.now() } as any;
          return token;
        }
      } catch {}
    }
    return null;
  } catch {
    return null;
  }
}

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    // Add Authorization header if access token exists
    const authHeader = getAuthorizationHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    // Attach CSRF token on state-changing methods
    const method = (config.method || 'get').toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      const csrf = await ensureCsrfToken(true);
      if (csrf) {
        // Use canonical header expected by backend
        (config.headers as any)['X-CSRF-Token'] = csrf;
      }
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
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
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

    // Handle 403 errors (forbidden) - attempt CSRF token fetch and retry once, no auto-redirect
    if (error.response?.status === 403) {
      const originalRequest = error.config;
      if (!originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        const csrf = await ensureCsrfToken(true);
        if (csrf) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['X-CSRF-Token'] = csrf;
          try {
            return apiClient(originalRequest);
          } catch (e) {
            // fallthrough to redirect below
          }
        }
      }
      // Do not redirect on 403; surface the error to the UI instead
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Hybrid authentication approach:
// - Access token: Sent via Authorization header (stored in memory)
// - Refresh token: Sent via HTTP-only cookie (server-managed)