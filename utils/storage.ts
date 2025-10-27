import { AuthTokens } from "@/types/auth";

const ADMIN_TOKEN_KEY = "admin_auth_token";
const PROFILE_IMAGE_KEY = "profileImageUrl";
export const PROFILE_IMAGE_CHANGED_EVENT = "profileImageUrlChanged";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split("=")[1]) : null;
};

// Legacy functions for backward compatibility - now deprecated
// Access tokens are now stored in memory via tokenManager.ts
export const getToken = (): AuthTokens | null => {
  console.warn("getToken() is deprecated. Use tokenManager.getAccessToken() instead.");
  return null;
};

export const setToken = (_tokens: AuthTokens): void => {
  console.warn("setToken() is deprecated. Use tokenManager.setAccessToken() instead.");
};

export const clearToken = (): void => {
  console.warn("clearToken() is deprecated. Use tokenManager.clearAccessToken() instead.");
};

export const clearAdminToken = (): void => {
  if (typeof document === "undefined") return;
  // Expire the admin auth cookie client-side; server will also clear on /admin/auth/logout
  document.cookie = `${ADMIN_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};

// Legacy function for backward compatibility
export const getAccessToken = (): string | null => {
  console.warn("getAccessToken() is deprecated. Use tokenManager.getAccessToken() instead.");
  return null;
};

// Legacy function for backward compatibility
export const getRefreshToken = (): string | null => {
  return null; // No refresh token in new structure
};

// Profile image storage helpers
export const getProfileImageUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(PROFILE_IMAGE_KEY);
};

export const setProfileImageUrl = (url: string): void => {
  if (typeof window === "undefined") return;
  if (!url) return;

  localStorage.setItem(PROFILE_IMAGE_KEY, url);
  try {
    // Notify listeners in this tab about the change
    window.dispatchEvent(
      new CustomEvent(PROFILE_IMAGE_CHANGED_EVENT, { detail: url })
    );
  } catch {
    // noop
  }
};

export const clearProfileImageUrl = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(PROFILE_IMAGE_KEY);
};

export const addProfileImageListener = (
  callback: (url: string | null) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as string | undefined;
    callback(detail ?? null);
  };

  window.addEventListener(PROFILE_IMAGE_CHANGED_EVENT, handler as EventListener);

  return () => {
    window.removeEventListener(
      PROFILE_IMAGE_CHANGED_EVENT,
      handler as EventListener,
    );
  };
};