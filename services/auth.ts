import {
  LoginRequest,
  LoginResponse,
  InitiateSignupRequest,
  InitiateSignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  CompleteSignupRequest,
  CompleteSignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LockAccountRequest,
  LockAccountResponse,
  
  LogoutResponse,
  ApiResponse,
  GoogleRegistrationRequest,
  GoogleRegistrationResponse,
} from '@/types/auth';
import { apiClient } from './axios';

// Constants
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amarambaadmin.webnoxdigital.com/api'
const API_URL = 'http://localhost:5000'

export const GOOGLE_AUTH_URL = `${API_URL}/auth/admin/google`;
// export const CALLBACK_URL = 'http://localhost:3000/auth/admin/google/callback';
export const CALLBACK_URL = 'https://amarambaadmin.webnoxdigital.com/auth/admin/google/callback';

// reCAPTCHA removed from project

// Initiate signup
export async function initiateSignup(data: InitiateSignupRequest): Promise<ApiResponse<InitiateSignupResponse>> {
  const response = await apiClient.post('/auth/initiate-signup', data);
  return response.data;
}

// Verify OTP
export async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
  const response = await apiClient.post('/auth/verify-otp', data);
  return response.data;
}

// Set password
export async function setPassword(data: SetPasswordRequest): Promise<ApiResponse<SetPasswordResponse>> {
  const response = await apiClient.post('/auth/set-password', data);
  return response.data;
}

// Complete signup
export async function completeSignup(data: CompleteSignupRequest): Promise<ApiResponse<CompleteSignupResponse>> {
  const response = await apiClient.post('/auth/complete-signup', data);
  return response.data;
}

// Login
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

// Logout
export async function logout(): Promise<ApiResponse<LogoutResponse>> {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

// Forgot password
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
  const response = await apiClient.post('/auth/forgot-password', data);
  return response.data;
}

// Verify reset OTP
export async function verifyResetOtp(data: VerifyResetOtpRequest): Promise<ApiResponse<VerifyResetOtpResponse>> {
  const response = await apiClient.post('/auth/verify-otp', data);
  return response.data;
}

// Reset password
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
}

// Resend OTP
export async function resendOtp(data: ResendOtpRequest): Promise<ApiResponse<ResendOtpResponse>> {
  const response = await apiClient.post('/auth/resend-otp', data);
  return response.data;
}

// Lock account
export async function lockAccount(data: LockAccountRequest): Promise<ApiResponse<LockAccountResponse>> {
  const response = await apiClient.post('/auth/lock-account', data);
  return response.data;
}

// Google OAuth Registration
export async function registerWithGoogle(data: GoogleRegistrationRequest): Promise<ApiResponse<GoogleRegistrationResponse>> {
  const response = await apiClient.post('/auth/register/google', data);
  return response.data;
}

// Helper function to build Google OAuth URL
export function getGoogleAuthUrl(source?: 'login' | 'register'): string {
  const params = new URLSearchParams();
  if (source) {
    params.append('source', source);
  }
  return `${GOOGLE_AUTH_URL}${params.toString() ? `?${params.toString()}` : ''}`;
}

// Get profile (if needed)
export async function getProfile(): Promise<ApiResponse> {
  const response = await apiClient.get('/auth/profile');
  return response.data;
}

// MFA API removed from project

// Additional API functions for profile page
export async function changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<ApiResponse<any>> {
  const response = await apiClient.post('/auth/change-password', data);
  return response.data;
}

export async function getClientProfile(): Promise<ApiResponse<any>> {
  const response = await apiClient.get('/auth/client-profile');
  return response.data;
}

export async function updateClientProfile(data: any): Promise<ApiResponse<any>> {
  const response = await apiClient.put('/auth/client-profile', data);
  return response.data;
}

export async function updateUserProfileImage(payload: {
  profileImage: string;
}): Promise<ApiResponse<any>> {
  const response = await apiClient.put("/user/profile-image", payload);
  return response.data;
}

export async function getAntiPhishingPreferences(): Promise<ApiResponse<any>> {
  const response = await apiClient.get('/auth/anti-phishing-preferences');
  return response.data;
}

export async function toggleAntiPhishingEmails(data: { enabled: boolean; code?: string }): Promise<ApiResponse<any>> {
  const response = await apiClient.post('/auth/toggle-anti-phishing-emails', data);
  return response.data;
}

export async function getSessions(): Promise<ApiResponse<any>> {
  const response = await apiClient.get('/auth/sessions');
  return response.data;
}

export async function logoutSession(data: { sessionId: string }): Promise<ApiResponse<any>> {
  const response = await apiClient.post('/auth/sessions/logout', data);
  return response.data;
}

export async function getLoginHistory(page: number, limit: number, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await apiClient.get(`/user/login-history?${params.toString()}`);
  return response.data;
}

export async function getEmailControlStatus(): Promise<ApiResponse<any>> {
  const response = await apiClient.get('/email-control/user-status');
  return response.data;
}

export async function updateEmailControlPreference(data: { enabled: boolean }): Promise<ApiResponse<any>> {
  const response = await apiClient.put('/email-control/user-preference', data);
  return response.data;
}

export async function uploadSingleToS3(file: File): Promise<ApiResponse<any>> {
  const form = new FormData();
  form.append("file", file);

  // Override headers for multipart only for this request
  const response = await apiClient.post("/s3-upload/upload-single", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
} 



export async function getAdminProfile(): Promise<ApiResponse<any>> {
  const response = await apiClient.get('/admin/auth/profile');
  return response.data;
}

export async function updateAdminProfile(data: any): Promise<ApiResponse<any>> {
  const response = await apiClient.put('/admin/auth/profile/update', data);
  return response.data;
}

// Refresh access token using refresh cookie (HttpOnly) managed by the server
// Use direct fetch to avoid axios interceptor loops
export async function refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
  try {
    const response = await fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If refresh fails with 401/403, redirect to login immediately
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        throw new Error('Refresh token invalid - redirected to login');
      }
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: true,
      data: data,
      version: '1.0',
      validationErrors: [],
      code: 200,
      message: 'Success'
    };
  } catch (error: any) {
    // If it's a redirect error, don't re-throw to avoid loops
    if (error?.message?.includes('redirected to login')) {
      throw error;
    }
    throw new Error(`Refresh token API call failed: ${error?.message || 'Unknown error'}`);
  }
}