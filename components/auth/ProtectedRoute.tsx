"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { getAccessToken, attemptTokenRefresh } from "@/utils/tokenManager";
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
  console.log("ProtectedRoute - Component rendered with props:", {
    requireAuth,
    redirectTo,
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
  });
  
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check token directly as additional safety measure
  const hasToken = getAccessToken();
  const isActuallyAuthenticated = isAuthenticated && hasToken;

  console.log("ProtectedRoute - Token Check:", {
    hasToken: !!hasToken,
    isAuthenticated,
    isActuallyAuthenticated,
    isLoading,
    requireAuth
  });

  // Immediate check - attempt token refresh first if no token
  if (requireAuth && !isActuallyAuthenticated && !isLoading && !hasRedirected) {
    console.log("ProtectedRoute - IMMEDIATE CHECK: No token found, attempting refresh");
    
    // Attempt token refresh before redirecting
    attemptTokenRefresh().then((refreshSuccess) => {
      if (!refreshSuccess) {
        console.log("ProtectedRoute - IMMEDIATE CHECK: Token refresh failed, redirecting to login");
        setHasRedirected(true);
        
        // Use both router and window.location for maximum reliability
        router.replace(redirectTo);
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
            console.log("ProtectedRoute - Router failed, using window.location");
            window.location.href = redirectTo;
          }
        }, 100);
      } else {
        console.log("ProtectedRoute - IMMEDIATE CHECK: Token refresh successful, user should be authenticated now");
        // The AuthContext will handle updating the authentication state
      }
    });
    
    return (
      <AmarambaLoader 
        fullscreen={true} 
        label="Authenticating..." 
        variant="default" 
      />
    );
  }

  useEffect(() => {
    console.log("ProtectedRoute - Auth State:", {
      isAuthenticated,
      isActuallyAuthenticated,
      hasToken: !!hasToken,
      isLoading,
      requireAuth,
      pathname,
      redirectTo,
      shouldRedirect,
      hasRedirected
    });
    
    // Only handle redirects if we're not loading and not already on the target path
    if (!isLoading && !hasRedirected) {
      if (requireAuth && !isActuallyAuthenticated && pathname !== redirectTo) {
        console.log("ProtectedRoute - User not authenticated, attempting token refresh");
        
        // Attempt token refresh before redirecting
        attemptTokenRefresh().then((refreshSuccess) => {
          if (!refreshSuccess) {
            console.log("ProtectedRoute - Token refresh failed, redirecting to login");
            setShouldRedirect(true);
            setHasRedirected(true);
            
            // Use both router and window.location for maximum reliability
            router.replace(redirectTo);
            setTimeout(() => {
              if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
                console.log("ProtectedRoute - Router failed, using window.location");
                window.location.href = redirectTo;
              }
            }, 100);
          } else {
            console.log("ProtectedRoute - Token refresh successful, user should be authenticated now");
            // The AuthContext will handle updating the authentication state
          }
        });
      } else if (!requireAuth && isActuallyAuthenticated && pathname !== "/dashboard") {
        console.log("ProtectedRoute - Redirecting to dashboard: User already authenticated");
        setShouldRedirect(true);
        setHasRedirected(true);
        router.replace("/dashboard");
      } else {
        console.log("ProtectedRoute - No redirect needed");
        setShouldRedirect(false);
      }
    }
  }, [isAuthenticated, isActuallyAuthenticated, hasToken, isLoading, requireAuth, redirectTo, router, pathname, hasRedirected]);

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

  // Additional safety check: If we're on a protected route and not authenticated, 
  // attempt token refresh before force redirecting
  if (requireAuth && !isActuallyAuthenticated && !isLoading && !shouldRedirect && !hasRedirected) {
    console.log("ProtectedRoute - Safety check: No token found, attempting refresh");
    
    // Attempt token refresh before redirecting
    attemptTokenRefresh().then((refreshSuccess) => {
      if (!refreshSuccess) {
        console.log("ProtectedRoute - Safety check: Token refresh failed, force redirecting");
        setHasRedirected(true);
        
        // Use both router and window.location for maximum reliability
        router.replace(redirectTo);
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
            console.log("ProtectedRoute - Safety check: Router failed, using window.location");
            window.location.href = redirectTo;
          }
        }, 100);
      } else {
        console.log("ProtectedRoute - Safety check: Token refresh successful, user should be authenticated now");
        // The AuthContext will handle updating the authentication state
      }
    });
    
    return (
      <AmarambaLoader 
        fullscreen={true} 
        label="Authenticating..." 
        variant="default" 
      />
    );
  }

  // Only render children if authentication requirements are met
  if ((requireAuth && isActuallyAuthenticated) || (!requireAuth && !isActuallyAuthenticated)) {
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