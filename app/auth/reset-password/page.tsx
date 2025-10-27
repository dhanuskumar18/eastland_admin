"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import EditText from "@/components/ui/EditText";
import { Button } from "@/components/ui/button";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { useResetPassword } from "@/hooks/useAuthApi";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTheme } from "next-themes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const resetPasswordMutation = useResetPassword();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");

    if (!storedEmail) {
      router.push("/auth/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const isPasswordValid = (password: string) => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    ];
    const hasMinLength = requirements[0];
    const otherRequirements = requirements.slice(1);
    const passedOtherRequirements = otherRequirements.filter(
      (req) => req,
    ).length;

    return hasMinLength && passedOtherRequirements >= 3;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(""); // Clear error when user types
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Password does not meet all requirements");
      return;
    }
    resetPasswordMutation.mutate(
      { email, newPassword: password },
      {
        onSuccess: (response) => {
          // Check for successful response - either status: true or message indicating success
          if (response.status === true || response.message === "Password reset successfully") {  
            sessionStorage.removeItem("resetPasswordEmail");
            router.push("/auth/login");
          } else {
            setError(
              response.message || "Failed to reset password. Please try again.",
            );
          }
        },
        onError: (err: any) =>
          setError(
            err?.message || "Failed to reset password. Please try again.",
          ),
      },
    );
  };

  const isFormValid = () => {
    return (
      isPasswordValid(password) &&
      password === confirmPassword &&
      !resetPasswordMutation.isPending
    );
  };

  if (!email) return null;

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="w-full flex flex-row h-screen">
        {/* Left Side - Mountain Climbing Background */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <Image
            src="/images/login/signup.jpg"
            alt="Mountain climbing inspiration"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="w-full lg:w-1/2 bg-background text-foreground flex flex-col items-center justify-center relative h-screen">
          <div className="w-full max-w-lg space-y-5 py-10 px-8">
            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-left">
                <h1 className="text-4xl font-lexend text-foreground mb-10 font-bold">
                  Reset your password
                </h1>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="password" className="text-base font-lexend text-foreground">
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <EditText
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    size="lg"
                    className="w-full [&_input::placeholder]:text-muted-foreground [&_input::placeholder]:opacity-100 [&_input::placeholder]:text-lg"
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    }
                  />
                  {password && <PasswordStrength password={password} />}
                </div>

                <div className="space-y-3">
                  <label htmlFor="confirmPassword" className="text-base font-lexend text-foreground">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <EditText
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm your new password"
                    size="lg"
                    className="w-full [&_input::placeholder]:text-muted-foreground [&_input::placeholder]:opacity-100 [&_input::placeholder]:text-lg"
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    }
                  />
                </div>

                {/* Error Messages */}
                {error && (
                  <div className="text-base text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid()}
                  className="w-full bg-[#017850] text-white font-medium py-5 text-xl h-12"
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center">
                  <span className="text-base font-lexend font-normal text-foreground">
                    Remember your password?{" "}
                  </span>
                  <Link
                    href="/auth/login"
                    className="text-[#017850] text-base font-lexend font-normal hover:underline transition-all duration-200"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
