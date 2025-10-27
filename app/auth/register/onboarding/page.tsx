'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@heroui/button';
import { Switch } from '@heroui/switch';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { useToast } from '@/hooks/use-toast';
import { useCompleteSignup } from '@/hooks/useAuthApi';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [registeredWithSecurities, setRegisteredWithSecurities] = useState(false);
  const [pep, setPep] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const completeSignupMutation = useCompleteSignup();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    const requestData = {
      email,
      registeredWithSecurities,
      pep,
      acceptTerms,
      ...(isGoogleAuth && { provider: 'google' })
    };

    completeSignupMutation.mutate(
      requestData,
      {
        onSuccess: (response) => {
          if (response.status === true) {
            // Clear registration data
            sessionStorage.removeItem('registerEmail');
            
            // Show success message
            showToast({
              type: 'success',
              title: 'Registration successful',
              message: 'Please login to continue',
            });

            // Redirect to login page
            router.push('/auth/login');
          } else {
            setError(response.message || 'Failed to complete registration. Please try again.');
          }
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to complete onboarding. Please try again.');
        },
      }
    );
  };

  const isFormValid = () => {
    return acceptTerms && !completeSignupMutation.isPending;
  };

  if (!email) {
    return null; // Will redirect to email page
  }

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Tell us a bit more about yourself"
      showBackButton={!isGoogleAuth}
      backUrl="/auth/register/set-password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Switch
              isSelected={registeredWithSecurities}
              onValueChange={setRegisteredWithSecurities}
              size="lg"
            >
              I am registered with securities regulators
            </Switch>
            <p className="text-sm text-gray-600 ml-12">
              Check this if you are registered with any securities regulatory body
            </p>
          </div>

          <div className="space-y-3">
            <Switch
              isSelected={pep}
              onValueChange={setPep}
              size="lg"
            >
              I am a Politically Exposed Person (PEP)
            </Switch>
            <p className="text-sm text-gray-600 ml-12">
              A PEP is someone who has been entrusted with a prominent public function
            </p>
          </div>

          <div className="space-y-3">
            <Switch
              isSelected={acceptTerms}
              onValueChange={setAcceptTerms}
              size="lg"
              className={!!error && !acceptTerms ? 'border-red-500' : ''}
            >
              I accept the Terms and Conditions
            </Switch>
            {!!error && !acceptTerms && (
              <p className="text-sm text-red-600 ml-12">
                You must accept the terms and conditions
              </p>
            )}
            <p className="text-sm text-gray-600 ml-12">
              You must accept our terms and conditions to continue
            </p>
          </div>
        </div>

        

        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}

        <Button
          type="submit"
          color="primary"
          size="lg"
          className="w-full"
          isLoading={completeSignupMutation.isPending}
          isDisabled={!isFormValid()}
        >
          Complete Registration
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            By completing registration, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
} 