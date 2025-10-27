'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { useSetPassword } from '@/hooks/useAuthApi';
import { SetPasswordRequest } from '@/types/auth';

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const setPasswordMutation = useSetPassword();

  useEffect(() => {
    // Check for Google OAuth params
    const emailParam = searchParams.get('email');
    const provider = searchParams.get('provider');
    const isGoogleProvider = provider === 'google';

    if (emailParam && isGoogleProvider) {
      setEmail(emailParam);
      setIsGoogleAuth(true);
      return;
    }

    // Regular email registration flow
    const storedEmail = sessionStorage.getItem('registerEmail');
    if (!storedEmail) {
      router.push('/auth/register/email');
      return;
    }
    setEmail(storedEmail);
  }, [searchParams, router]);

  const isPasswordValid = (password: string) => {
    // Simplified requirements - at least 8 characters and at least 3 of the other requirements
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    ];
    
    // Must have at least 8 characters and at least 3 of the other 4 requirements
    const hasMinLength = requirements[0];
    const otherRequirements = requirements.slice(1);
    const passedOtherRequirements = otherRequirements.filter(req => req).length;
    
    return hasMinLength && passedOtherRequirements >= 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    const requestData: SetPasswordRequest = {
      email,
      password,
      confirmPassword,
      ...(isGoogleAuth && { provider: 'google' as const }) // Add provider only for Google OAuth
    };

    setPasswordMutation.mutate(
      requestData,
      {
        onSuccess: (response) => {
          if (response.status === true) {
            // Pass along Google OAuth data to onboarding
            if (isGoogleAuth) {
              const params = new URLSearchParams({
                email,
                provider: 'google',
                ...(searchParams.get('name') && { name: searchParams.get('name')! }),
                ...(searchParams.get('picture') && { picture: searchParams.get('picture')! }),
                isEmailVerified: 'true'
              });
              router.push(`/auth/register/onboarding?${params}`);
            } else {
              router.push('/auth/register/onboarding');
            }
          } else {
            setError(response.message || 'Failed to set password. Please try again.');
          }
        },
        onError: (err: any) => setError(err?.message || 'Failed to set password. Please try again.'),
      }
    );
  };

  const isFormValid = () => {
    const passwordValid = isPasswordValid(password);
    const passwordsMatch = password === confirmPassword;
    const notLoading = !setPasswordMutation.isPending;
    return passwordValid && passwordsMatch && notLoading;
  };

  if (!email) {
    return null; // Will redirect to email page
  }

  return (
    <AuthLayout
      title="Set your password"
      subtitle="Create a strong password for your account"
      showBackButton={!isGoogleAuth}
      backUrl="/auth/register/verify-otp"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="email"
            label="Email address"
            value={email}
            disabled
            classNames={{
              input: 'text-base bg-gray-100',
            }}
          />

          <Input
            type="password"
            label="New Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            isInvalid={!!error && !isPasswordValid(password)}
            classNames={{
              input: 'text-base',
            }}
          />

          {password && <PasswordStrength password={password} />}

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isRequired
            isInvalid={confirmPassword.length > 0 && password !== confirmPassword}
            errorMessage={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
            classNames={{
              input: 'text-base',
            }}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}

        <Button
          type="submit"
          color="primary"
          size="lg"
          className="w-full"
          isLoading={setPasswordMutation.isPending}
          isDisabled={!isFormValid()}
        >
          Continue
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordContent />
    </Suspense>
  );
} 