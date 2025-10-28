/**
 * Memory-based token management for hybrid authentication approach
 * - Access token: Stored in memory (JavaScript variable)
 * - Refresh token: Stored in HTTP-only cookie (server-managed)
 * - Authorization header: Automatically added to API requests
 */

// Memory storage for access token
let accessToken: string | null = null;

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Suppress any token refresh attempts (e.g., during logout)
let suppressAuthActions = false;

export const setSuppressAuthActions = (suppress: boolean): void => {
  suppressAuthActions = suppress;
};

export const getSuppressAuthActions = (): boolean => suppressAuthActions;

/**
 * Set access token in memory
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/**
 * Get access token from memory
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/**
 * Clear access token from memory
 */
export const clearAccessToken = (): void => {
  accessToken = null;
};

/**
 * Check if access token exists
 */
export const hasAccessToken = (): boolean => {
  return accessToken !== null && accessToken.trim() !== '';
};

/**
 * Get Authorization header value
 */
export const getAuthorizationHeader = (): string | null => {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Handle token refresh with promise deduplication
 * Prevents multiple simultaneous refresh requests
 */
export const refreshAccessToken = async (): Promise<string> => {
  if (suppressAuthActions) {
    return Promise.reject(new Error('auth_suppressed'));
  }
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Start new refresh process
  isRefreshing = true;
  refreshPromise = performTokenRefresh();

  try {
    const newToken = await refreshPromise;
    return newToken;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

/**
 * Perform actual token refresh
 */
const performTokenRefresh = async (): Promise<string> => {
  try {
    if (suppressAuthActions) {
      throw new Error('auth_suppressed');
    }
    // Use service layer (axios) to perform refresh so cookies/headers are consistent
    const { refreshToken } = await import('@/services/auth');
    const resp = await refreshToken();
console.log("resp",resp);
    if (suppressAuthActions) {
      throw new Error('auth_suppressed');
    }
    if (!resp?.status || !resp?.data?.access_token) {
      throw new Error('No access token in refresh response');
    }

    // Update access token in memory
    setAccessToken(resp.data.access_token);
    
    return resp.data.access_token;
  } catch (error) {
    // Clear token on refresh failure
    clearAccessToken();
    throw error;
  }
};

/**
 * Handle authentication errors
 * - 401: Try to refresh token
 * - 403: Clear token and redirect to login
 */
export const handleAuthError = async (error: any): Promise<boolean> => {
  const status = error?.response?.status;
  
  if (status === 401) {
    try {
      // Try to refresh token
      await refreshAccessToken();
      return true; // Token refreshed successfully
    } catch (refreshError) {
      // Refresh failed, redirect to login
      redirectToLogin();
      return false;
    }
  } else if (status === 403) {
    // Forbidden - clear token and redirect
    clearAccessToken();
    redirectToLogin();
    return false;
  }
  
  return false;
};

/**
 * Redirect to login page
 */
const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    // Clear any stored auth data
    localStorage.removeItem('profileImageUrl');
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/auth/login';
  }
};

/**
 * Initialize token from login response
 */
export const initializeTokenFromLogin = (loginResponse: any): void => {
  // Handle both direct response and wrapped response formats
  const token = loginResponse?.access_token || loginResponse?.data?.access_token;
  
  if (token) {
    setAccessToken(token);
  } else {
    throw new Error('No access token found in login response');
  }
};

/**
 * Check if token is expired (basic check)
 * Note: This is a simple implementation. In production, you might want to
 * decode the JWT and check the exp claim
 */
export const isTokenExpired = (): boolean => {
  // For now, we'll rely on the server to tell us when the token is expired
  // This could be enhanced to decode the JWT and check expiration
  return false;
};

/**
 * Attempt to refresh token using HttpOnly refresh cookie
 * Since refresh token is HttpOnly, we can't detect it client-side
 * Always attempt the API call and let the server handle the cookie
 */
export const attemptTokenRefresh = async (): Promise<boolean> => {
  try {
    if (suppressAuthActions) {
      return false;
    }
    console.log('Attempting token refresh using HttpOnly refresh cookie');
    await refreshAccessToken();
    return true;
  } catch (error) {
    if ((error as any)?.message === 'auth_suppressed') {
      return false;
    }
    console.error('Token refresh attempt failed:', error);
    return false;
  }
};

/**
 * Get token info for debugging
 */
export const getTokenInfo = () => {
  return {
    hasToken: hasAccessToken(),
    tokenLength: accessToken?.length || 0,
    isRefreshing,
  };
};
