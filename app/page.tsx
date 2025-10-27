'use client';

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useOAuthCallback } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginPage from "./auth/login/page";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Handle OAuth callback
  useOAuthCallback();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-background">
       <LoginPage />
      </div>
    </ProtectedRoute>
  );
}
