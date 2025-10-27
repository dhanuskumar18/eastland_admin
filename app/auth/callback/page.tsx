'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { decryptToken } from '@/utils/decryptToken';
import { User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthState, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { showToast } = useToast();

  const processAuth = useCallback(async () => {
    if (!isProcessing) return;

    try {
      // Check for new response format parameters
      const requireMfa = searchParams.get('requireMfa');
      const token = searchParams.get('token');
      const message = searchParams.get('message');
      const userData = searchParams.get('user');

      console.log('OAuth Callback - requireMfa:', requireMfa);
      console.log('OAuth Callback - token:', token);
      console.log('OAuth Callback - message:', message);
      console.log('OAuth Callback - userData:', userData);
      console.log('OAuth Callback - all URL params:', Object.fromEntries(searchParams.entries()));

      if (!token) {
        throw new Error('No token received from OAuth provider');
      }

      // Handle MFA required scenario
      if (requireMfa === 'true') {
        // Store token and redirect to MFA verification
        const userEmail = searchParams.get('email');
        if (userEmail) {
          sessionStorage.setItem('loginEmail', userEmail);
        }
        sessionStorage.setItem('mfaToken', token);
        
        showToast({
          type: 'info',
          title: 'MFA Required',
          message: message || 'Please complete two-factor authentication',
        });
        
        setIsProcessing(false);
        router.replace('/auth/login/mfa');
        return;
      }

      // Handle user data if provided (new format)
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          login(token, user);
          setIsProcessing(false);
          router.replace('/dashboard');
          return;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Fall back to token decoding
        }
      }

      // Fallback: Decode the JWT token (legacy format)
      const decodedToken = decryptToken(token);
      
      if (!decodedToken) {
        throw new Error('Invalid token format');
      }

      // Handle different scenarios
      if (decodedToken.needsCompletion) {
        // User needs to complete registration
        const params = new URLSearchParams({
          email: decodedToken.email,
          provider: 'google',
          ...(decodedToken.profile?.firstName && { firstName: decodedToken.profile.firstName }),
          ...(decodedToken.profile?.lastName && { lastName: decodedToken.profile.lastName }),
          ...(decodedToken.profile?.picture && { picture: decodedToken.profile.picture }),
          isEmailVerified: 'true',
          needsCompletion: 'true'
        });

        setIsProcessing(false);
        router.replace(`/auth/register/set-password?${params}`);
        return;
      }

      // Complete login for existing user (legacy format)
      login(token, decodedToken);
      setIsProcessing(false);
      router.replace('/dashboard');
      
    } catch (error) {
      console.error('Auth callback error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage
      });
      setIsProcessing(false);
      // Add a small delay before redirecting to show the error
      setTimeout(() => router.replace('/auth/login'), 2000);
    }
  }, [searchParams, router, setAuthState, login, showToast, isProcessing]);

  useEffect(() => {
    processAuth();
  }, [processAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
} 