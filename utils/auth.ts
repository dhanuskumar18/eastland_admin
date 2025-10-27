import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

// Extract token from URL parameters (for Google OAuth callback)
export const extractTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};

// Hook to handle OAuth callback
export const useOAuthCallback = () => {
  const { login } = useAuth();
  
  useEffect(() => {
    const token = extractTokenFromUrl();
    if (token) {
      // Decode the token to get user info
      try {
        // For now, we'll assume the token contains user info
        // In a real implementation, you might want to verify the token with the backend
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: decodedToken.sub || decodedToken.id,
          email: decodedToken.email,
          type: decodedToken.type || 'CLIENT',
          status: decodedToken.status || 'ACTIVE',
          profile: decodedToken.profile || {},
        };
        
        login(token, user);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error processing OAuth token:', error);
      }
    }
  }, [login]);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isPasswordStrong = (password: string): boolean => {
  return password.length >= 8;
};

// Format API error messages
export const formatApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}; 