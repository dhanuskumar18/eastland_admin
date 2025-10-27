# Authentication API Integration

This document describes the authentication API integration for the Amaramba User Dashboard.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5555/api
```

## API Endpoints Integrated

### Authentication Flow

1. **Initiate Signup** - `POST /auth/initiate-signup`
   - Sends email to start registration process
   - Returns OTP expiry time

2. **Verify OTP** - `POST /auth/verify-otp`
   - Verifies the OTP sent to user's email
   - Returns verification status

3. **Set Password** - `POST /auth/set-password`
   - Sets user password after OTP verification
   - Returns user status as "INCOMPLETE_REGISTRATION"

4. **Complete Signup** - `POST /auth/complete-signup`
   - Completes registration with additional user info
   - Returns user token and profile data

5. **Login** - `POST /auth/login`
   - Authenticates user with email/password
   - Returns user token and profile data

6. **Logout** - `POST /auth/logout`
   - Logs out user (requires Bearer token)
   - Clears local authentication state

### Password Reset Flow

7. **Forgot Password** - `POST /auth/forgot-password`
   - Sends password reset email
   - Returns OTP expiry time

8. **Verify Reset OTP** - `POST /auth/verify-reset-otp`
   - Verifies reset OTP
   - Returns reset token

9. **Reset Password** - `POST /auth/reset-password`
   - Resets password using reset token
   - Returns confirmation

### Additional Features

10. **Resend OTP** - `POST /auth/resend-otp`
    - Resends OTP to user's email
    - Returns new OTP expiry time

11. **Lock Account** - `POST /auth/lock-account`
    - Locks user account (requires Bearer token)
    - Returns confirmation message

12. (Removed) reCAPTCHA Site Key endpoint

13. **Google OAuth** - `GET /auth/google`
    - Redirects to Google OAuth flow
    - Returns to frontend with token parameter

## Frontend Implementation

### Key Components

- **AuthContext** (`/context/AuthContext.tsx`) - Manages authentication state
- **AuthService** (`/services/auth.ts`) - API service functions
- **useAuthApi** (`/hooks/useAuthApi.ts`) - React Query hooks for API calls
- **ToastProvider** (`/components/ui/Toast.tsx`) - Toast notifications
- **Storage Utils** (`/utils/storage.ts`) - Token storage management

### Authentication Flow Pages

1. `/auth/register/email` - Email input for registration
2. `/auth/register/verify-otp` - OTP verification
3. `/auth/register/set-password` - Password setup
4. `/auth/register/onboarding` - Additional user info
5. `/auth/login` - Login page
6. `/auth/forgot-password` - Password reset

### Features

- **Token Management**: Secure storage in localStorage
- **Error Handling**: Comprehensive error handling with toast notifications
- **Loading States**: Proper loading states for all API calls
- **Form Validation**: Client-side validation for all forms
- (Removed) reCAPTCHA Integration
- **Google OAuth**: OAuth flow with automatic token extraction
- **Responsive Design**: Mobile-friendly UI components

### Security Features

- **Token Storage**: Tokens stored securely in localStorage
- **Token Decoding**: JWT token decoding for user information
- **Automatic Logout**: Session expiration handling
- **Protected Routes**: Route protection based on authentication status
- (Removed) reCAPTCHA

## Usage Examples

### Login
```typescript
const { login } = useAuth();
const loginMutation = useLogin();

loginMutation.mutate(
  { email, password },
  {
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        login(response.data.token, response.data.user);
        router.push('/dashboard');
      }
    }
  }
);
```

### Registration
```typescript
const initiateSignupMutation = useInitiateSignup();

initiateSignupMutation.mutate(
  { email },
  {
    onSuccess: (response) => {
      if (response.status === 'success') {
        sessionStorage.setItem('registerEmail', email);
        router.push('/auth/register/verify-otp');
      }
    }
  }
);
```

### Logout
```typescript
const { logout } = useAuth();
await logout(); // Clears token and redirects
```

## Error Handling

All API calls include comprehensive error handling:

- **Network Errors**: Handled with user-friendly messages
- **Validation Errors**: Displayed as form errors
- **Authentication Errors**: Automatic logout and redirect
- **Toast Notifications**: Success and error messages

## Testing

To test the integration:

1. Start your backend server on `http://localhost:5555`
2. Update the `.env` file with your API URL
3. Run the frontend: `npm run dev`
4. Navigate through the registration and login flows

## Notes

- All API responses follow the standard format with `status`, `message`, and `data` fields
- Tokens are automatically included in API requests via axios interceptors
- Google OAuth tokens are automatically extracted from URL parameters
- Session state is restored on page refresh
- All forms include proper validation and error handling 