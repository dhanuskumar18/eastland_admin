/**
 * Authentication Guard Utility
 * Provides additional safety checks for authentication
 */

import { getAccessToken } from './tokenManager';

/**
 * Check if user is authenticated by verifying token existence
 */
export const isUserAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && token.trim() !== '';
};

/**
 * Force redirect to login if user is not authenticated
 */
export const enforceAuthentication = (redirectTo: string = '/auth/login'): boolean => {
  if (!isUserAuthenticated()) {
    console.log('AuthGuard - User not authenticated, redirecting to:', redirectTo);
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return false;
  }
  return true;
};

/**
 * Check if current path requires authentication
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
    '/dashboard',
    '/client',
    '/acd-accounts',
    '/admin',
    '/profile',
    '/stocks',
    '/orders',
    '/language'
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
};

/**
 * Comprehensive authentication check
 */
export const checkAuthentication = (pathname: string): { isAuthenticated: boolean; shouldRedirect: boolean; redirectTo?: string } => {
  const authenticated = isUserAuthenticated();
  const isProtected = isProtectedRoute(pathname);
  
  if (isProtected && !authenticated) {
    return {
      isAuthenticated: false,
      shouldRedirect: true,
      redirectTo: '/auth/login'
    };
  }
  
  if (!isProtected && authenticated && pathname === '/') {
    return {
      isAuthenticated: true,
      shouldRedirect: true,
      redirectTo: '/dashboard'
    };
  }
  
  return {
    isAuthenticated: authenticated,
    shouldRedirect: false
  };
};
