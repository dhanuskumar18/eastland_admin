import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import {
  LoginRequest,
  InitiateSignupRequest,
  VerifyOtpRequest,
  SetPasswordRequest,
  CompleteSignupRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  LockAccountRequest,
  ApiResponse,
  LoginResponse,
  InitiateSignupResponse,
  VerifyOtpResponse,
  SetPasswordResponse,
  CompleteSignupResponse,
  ForgotPasswordResponse,
  VerifyResetOtpResponse,
  ResetPasswordResponse,
  ResendOtpResponse,
  LockAccountResponse,
  
  LogoutResponse,
} from '@/types/auth';

// reCAPTCHA removed from project

// Initiate signup
export function useInitiateSignup() {
  return useMutation<ApiResponse<InitiateSignupResponse>, Error, InitiateSignupRequest>({
    mutationFn: api.initiateSignup,
  });
}

// Verify OTP
export function useVerifyOtp() {
  return useMutation<ApiResponse<VerifyOtpResponse>, Error, VerifyOtpRequest>({
    mutationFn: api.verifyOtp,
  });
}

// Set password
export function useSetPassword() {
  return useMutation<ApiResponse<SetPasswordResponse>, Error, SetPasswordRequest>({
    mutationFn: api.setPassword,
  });
}

// Complete signup
export function useCompleteSignup() {
  return useMutation<ApiResponse<CompleteSignupResponse>, Error, CompleteSignupRequest>({
    mutationFn: api.completeSignup,
  });
}

// Login
export function useLogin() {
  return useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: api.login,
  });
}

// Logout
export function useLogout() {
  return useMutation<ApiResponse<LogoutResponse>, Error, void>({
    mutationFn: api.logout,
  });
}

// Forgot password
export function useForgotPassword() {
  return useMutation<ApiResponse<ForgotPasswordResponse>, Error, ForgotPasswordRequest>({
    mutationFn: api.forgotPassword,
  });
}

// Verify reset OTP
export function useVerifyResetOtp() {
  return useMutation<ApiResponse<VerifyResetOtpResponse>, Error, VerifyResetOtpRequest>({
    mutationFn: api.verifyResetOtp,
  });
}

// Reset password
export function useResetPassword() {
  return useMutation<ApiResponse<ResetPasswordResponse>, Error, ResetPasswordRequest>({
    mutationFn: api.resetPassword,
  });
}

// Resend OTP
export function useResendOtp() {
  return useMutation<ApiResponse<ResendOtpResponse>, Error, ResendOtpRequest>({
    mutationFn: api.resendOtp,
  });
}

// Lock account
export function useLockAccount() {
  return useMutation<ApiResponse<LockAccountResponse>, Error, LockAccountRequest>({
    mutationFn: api.lockAccount,
  });
}

// Legacy hooks for backward compatibility
export function useRequestOtp() {
  return useInitiateSignup();
}

export function useOnboarding() {
  return useCompleteSignup();
}

// MFA hooks removed from project

// Additional hooks for profile page
export function useChangePassword() {
  return useMutation<ApiResponse<any>, Error, { currentPassword: string; newPassword: string; confirmPassword: string }>({
    mutationFn: api.changePassword,
  });
}

export function useClientProfile(enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['client-profile'],
    queryFn: api.getClientProfile,
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useUpdateClientProfile() {
  return useMutation<ApiResponse<any>, Error, any>({
    mutationFn: api.updateClientProfile,
  });
}

export function useUpdateProfileImage() {
  return useMutation<ApiResponse<any>, Error, { profileImage: string }>({
    mutationFn: api.updateUserProfileImage,
  });
}

export function useGetAntiPhishingPreferences(enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['anti-phishing-preferences'],
    queryFn: api.getAntiPhishingPreferences,
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useToggleAntiPhishingEmails() {
  return useMutation<ApiResponse<any>, Error, { enabled: boolean; code?: string }>({
    mutationFn: api.toggleAntiPhishingEmails,
  });
}

export function useSessions(enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['sessions'],
    queryFn: api.getSessions,
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useLogoutSession() {
  return useMutation<ApiResponse<any>, Error, { sessionId: string }>({
    mutationFn: api.logoutSession,
  });
}

export function useLoginHistory(page: number, limit: number, startDate?: string, endDate?: string, enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['login-history', page, limit, startDate, endDate],
    queryFn: () => api.getLoginHistory(page, limit, startDate, endDate),
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useEmailControlStatus(enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['email-control-status'],
    queryFn: api.getEmailControlStatus,
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useUpdateEmailControlPreference() {
  return useMutation<ApiResponse<any>, Error, { enabled: boolean }>({
    mutationFn: api.updateEmailControlPreference,
  });
}

// Admin profile hooks
export function useAdminProfile(enabled: boolean = true) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ['admin-profile'],
    queryFn: api.getAdminProfile,
    enabled: isAuthenticated && enabled,
    retry: 1,
  });
}

export function useUpdateAdminProfile() {
  return useMutation<ApiResponse<any>, Error, any>({
    mutationFn: api.updateAdminProfile,
  });
} 