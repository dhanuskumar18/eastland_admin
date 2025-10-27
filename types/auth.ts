export interface User {
  id: string;
  email: string;
  role: string;
  type: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  // Legacy fields
  status?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    designation?: string;
    picture?: string;
    provider?: 'google' | 'email';
  };
  isEmailVerified?: boolean;
  needsCompletion?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
  // Legacy fields for backward compatibility
  type?: string;
  token?: string;
  user?: User;
  message?: string;
}

export interface InitiateSignupRequest {
  email: string;
}

export interface InitiateSignupResponse {
  otpExpiry: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  email: string;
  verified: boolean;
}

export interface SetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  provider?: 'google';
}

export interface SetPasswordResponse {
  id: string;
  email: string;
  type: string;
  status: string;
}

export interface CompleteSignupRequest {
  email: string;
  registeredWithSecurities: boolean;
  pep: boolean;
  acceptTerms: boolean;
}

export interface CompleteSignupResponse {
  id: string;
  email: string;
  type: string;
  status: string;
  profile: any;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  resetToken?: string;
  verified?: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  email: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  user: { email: string };
  otpExpiry: string;
}

export interface LockAccountRequest {
  userId: string;
}

export interface LockAccountResponse {
  message: string;
}

// reCAPTCHA removed from project

export interface LogoutResponse {
  message: string;
}

export interface ApiResponse<T = any> {
  version: string;
  validationErrors: { field: string; message: string }[];
  code: number;
  status: boolean;
  message: string;
  data: T | null;
}

export interface JwtPayload {
  id: string;
  email: string;
  type: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  loginWithGoogle: (source?: 'login' | 'register') => void;
  logout: () => Promise<void>;
  setAuthState: (state: Partial<AuthState>) => void;
}

export interface GoogleUserData {
  email: string;
  name?: string;
  picture?: string;
  provider: 'google';
  isEmailVerified: boolean;
  needsCompletion?: boolean;
}

export interface GoogleRegistrationRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  registeredWithSecurities: boolean;
  pep: boolean;
  acceptTerms: boolean;
}

export interface GoogleRegistrationResponse {
  token: string;
  user: User;
}

// MFA types removed from project