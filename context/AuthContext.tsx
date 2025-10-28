"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { User, AuthState, AuthContextType } from "@/types/auth";
import { getProfileImageUrl, setProfileImageUrl, clearProfileImageUrl } from "@/utils/storage";
import { decryptToken } from "@/utils/decryptToken";
import { logout as logoutApi, getGoogleAuthUrl, getProfile, getAdminProfile } from "@/services/auth";
import { initializeTokenFromLogin, clearAccessToken, getAccessToken, attemptTokenRefresh, setSuppressAuthActions } from "@/utils/tokenManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });
  const pathname = usePathname();

  // Regular login with email/password
  const login = (token: string, user: User) => {
    try {
      // Initialize access token in memory
      initializeTokenFromLogin({ access_token: token });

      // Prefer image from decoded token; fall back to provided user object
      const decoded = decryptToken(token) as any | null;
      const imageUrl =
        (decoded?.profileImage as string | undefined) ||
        (decoded?.picture as string | undefined) ||
        (decoded?.profile?.picture as string | undefined) ||
        (user as any)?.profileImage ||
        (user as any)?.picture ||
        user?.profile?.picture ||
        "";

      if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
        setProfileImageUrl(imageUrl);
      }

      setAuthState({
        isAuthenticated: true,
        user: {
          id: String(user.id || ""),
          email: String(user.email || ""),
          role: String(user.role || user.type || "SUPERADMIN"),
          type: String(user.type || user.role || "SUPERADMIN"), 
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          isActive: user.isActive || true,
          profile: user.profile
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to login",
      }));
    }
  };

  // Google OAuth login/register
  const loginWithGoogle = (source?: "login" | "register") => {
    try {
      // Set loading state
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // Redirect to appropriate Google OAuth URL
      window.location.href = getGoogleAuthUrl(source);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initiate Google login",
      }));
    }
  };

  const logout = async () => {
    try {
      // Prevent any refresh attempts while logging out
      setSuppressAuthActions(true);
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Call logout API first - backend handles cookie clearing
      await logoutApi();

      // Clear local state after successful API call
      clearAccessToken();
      clearProfileImageUrl();
      
      // Clear all possible storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        // Clear any cookies that might be set
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });

      console.log("AuthContext - Logout completed, redirecting to login");
      
      // Small delay to ensure state updates are processed before redirect
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 100);
    } catch (error: any) {
      console.error("Error during logout:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Still clear the token and state even if API fails
      clearAccessToken();
      clearProfileImageUrl();
      
      // Clear all possible storage even on error
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        // Clear any cookies that might be set
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      
      console.log("AuthContext - Logout error, but cleared state, redirecting to login");
      
      // Small delay to ensure state updates are processed before redirect
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 100);
    }
  };


  const updateAuthState = (newState: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...newState }));
  };

  // Initialize auth state from cookie-backed session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentPath = pathname || "";
        const isProtectedRoute = currentPath.startsWith("/dashboard") || currentPath.startsWith("/client")|| currentPath.startsWith("/acd-accounts")|| currentPath.startsWith("/admin") || currentPath.startsWith("/profile") || currentPath.startsWith("/stocks") || currentPath.startsWith("/orders") || currentPath.startsWith("/language");

        console.log("AuthContext - Initializing auth:", {
          currentPath,
          isProtectedRoute,
          isLoading: authState.isLoading
        });

        // IMMEDIATE CHECK: If we're on a protected route and have no token, try to refresh first
        if (isProtectedRoute) {
          const hasToken = getAccessToken();
          if (!hasToken) {
            console.log("AuthContext - IMMEDIATE: No access token on protected route, attempting refresh");
            
            // Try to refresh token using HttpOnly refresh cookie
            const refreshSuccess = await attemptTokenRefresh();
            
            if (!refreshSuccess) {
              console.log("AuthContext - IMMEDIATE: Token refresh failed, setting unauthenticated");
              setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null,
              });
              return;
            }
            
            console.log("AuthContext - IMMEDIATE: Token refresh successful, continuing with profile fetch");
          }
        }

        if (!isProtectedRoute) {
          console.log("AuthContext - Not a protected route, setting loading to false");
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // For admin routes, check for admin authentication
        const isAdminRoute = currentPath.startsWith("/admin") || currentPath.startsWith("/acd-accounts") || currentPath.startsWith("/profile") || currentPath.startsWith("/dashboard") || currentPath.startsWith("/stocks") || currentPath.startsWith("/orders") || currentPath.startsWith("/language");

        console.log("AuthContext - Fetching profile for protected route:", { isAdminRoute });
        
        // First check if we have a token - if not, try to refresh first
        const hasToken = getAccessToken();
        if (!hasToken) {
          console.log("AuthContext - No access token found, attempting refresh");
          
          // Try to refresh token using HttpOnly refresh cookie
          const refreshSuccess = await attemptTokenRefresh();
          
          if (!refreshSuccess) {
            console.log("AuthContext - Token refresh failed, setting unauthenticated state");
            clearAccessToken();
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: null,
            });
            return;
          }
          
          console.log("AuthContext - Token refresh successful, continuing with profile fetch");
        }
        
        let profileResp;
        if (isAdminRoute) {
          // For admin routes, use admin profile API only
          profileResp = await getAdminProfile();
        } else {
          profileResp = await getProfile();
        }
        
        console.log("AuthContext - Profile response:", { 
          hasResponse: !!profileResp, 
          status: profileResp?.status,
          hasData: !!profileResp?.data 
        });
        
        // Check if we have a valid response
        if (profileResp?.status && profileResp?.data) {
          const dRaw: any = profileResp.data;
          const userData = dRaw?.user ?? dRaw;
          const profileData = dRaw?.profile ?? dRaw;
          const storedImageUrl = getProfileImageUrl();
          const derivedImageUrl =
            profileData?.profileImage || profileData?.picture || userData?.profileImage || userData?.picture || "";
          const imageUrl =
            typeof storedImageUrl === "string" && storedImageUrl.trim() !== ""
              ? storedImageUrl
              : derivedImageUrl;
          if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
            setProfileImageUrl(imageUrl);
          }

          setAuthState({
            isAuthenticated: true,
            user: {
              id: String(userData?.id ?? userData?.userId ?? ""),
              email: String(userData?.email ?? ""),
              role: String(userData?.type ?? userData?.role ?? "SUPERADMIN"),
              type: String(userData?.type ?? userData?.role ?? "SUPERADMIN"),
              firstName: profileData?.firstName || "",
              lastName: profileData?.lastName || "",
              isActive: true,
              profile: {
                firstName: profileData?.firstName || "",
                lastName: profileData?.lastName || "",
                phone: profileData?.phone || "",
                designation: profileData?.designation || "",
                picture: imageUrl || profileData?.picture,
                provider: profileData?.provider,
              }
            },
            isLoading: false,
            error: null,
          });
        } else {
          console.log("AuthContext - Profile fetch failed, no valid response");
          // If profile fetch failed and we're on a protected route, ensure we're logged out
          if (isProtectedRoute) {
            console.log("AuthContext - Setting unauthenticated state for protected route");
            clearAccessToken();
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: null,
            });
          } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error: any) {
        const statusCode = error?.response?.status as number | undefined;
        console.log("AuthContext - Error during auth initialization:", {
          statusCode,
          message: error.message,
          pathname: pathname
        });
        
        if (statusCode === 401 || statusCode === 403) {
          console.log("AuthContext - 401/403 error, setting unauthenticated state");
          // Only on 401 treat as logged out
          clearAccessToken();
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        } else if (statusCode === 404) {
          console.log("AuthContext - 404 error, keeping authenticated state");
          // Do NOT force logout on 404; avoid redirect loop
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        } else {
          console.error("AuthContext - Other error initializing auth:", error);
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();
  }, [pathname]);

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithGoogle,
    logout,
    setAuthState: updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};