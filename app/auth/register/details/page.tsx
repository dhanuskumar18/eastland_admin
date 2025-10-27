'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegistrationDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get all query parameters
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // Redirect to set-password with all the same parameters
    router.replace(`/auth/register/set-password?${params.toString()}`);
  }, [router, searchParams]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to complete registration...</p>
      </div>
    </div>
  );
}

export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationDetailsContent />
    </Suspense>
  );
} 