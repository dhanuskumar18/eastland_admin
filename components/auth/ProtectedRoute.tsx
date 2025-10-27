"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import AmarambaLoader from "@/components/ui/AmarambaLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/auth/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("isLoading", isLoading);
    console.log("requireAuth", requireAuth);
    console.log("pathname", pathname);
    console.log("redirectTo", redirectTo);
    console.log("shouldRedirect", shouldRedirect);
    // Only handle redirects if we're not loading and not already on the target path
    if (!isLoading) {
      if (requireAuth && !isAuthenticated && pathname !== redirectTo) {
        setShouldRedirect(true);
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated && pathname !== "/dashboard") {
        setShouldRedirect(true);
        router.replace("/dashboard");
      } else {
        setShouldRedirect(false);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname]);

  // Show loading state while checking authentication or during redirect
  if (isLoading || shouldRedirect) {
    return (
      <AmarambaLoader 
        fullscreen={true} 
        label="Authenticating..." 
        variant="default" 
      />
    );
  }

  // Only render children if authentication requirements are met
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Return loading state while redirect happens
  return (
    <AmarambaLoader 
      fullscreen={true} 
      label="Redirecting..." 
      variant="default" 
    />
  );
};