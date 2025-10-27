"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EditText from "@/components/ui/EditText";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/useAuthApi";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  // Align with verify page countdown window
  const RESEND_WINDOW_MS = 600_000; // 10 minutes
  const getResendKey = (addr: string) => `resetPasswordResendLock:${addr}`;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          // Check if response is successful based on status or success message
          const isSuccess = response.status === true || 
            response.message === "If the email exists, an OTP has been sent";
          
          if (isSuccess) {
            // Persist email for verify page and prime countdown window
            sessionStorage.setItem("resetPasswordEmail", email);
            try {
              const now = Date.now();
              // Set/refresh resend lock window so countdown starts immediately on verify page
              sessionStorage.setItem(getResendKey(email), String(now + RESEND_WINDOW_MS));
            } catch {}
            router.push("/auth/verify-reset-otp");
          } else {
            setError(
              response.message ||
                "Failed to send reset email. Please try again.",
            );
          }
        },
        onError: (err: any) => {
          setError(
            err?.message || "Failed to send reset email. Please try again.",
          );
        },
      },
    );
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

        {/* Right Side - Forgot Password Form */}
        <div className="w-full lg:w-1/2 bg-background text-foreground flex flex-col items-center justify-center relative h-screen">
          <div className="w-full max-w-lg space-y-5 py-10 px-8 ">

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-left">
                <h1 className="text-4xl font-lexend text-foreground mb-10 font-bold">
                  Forgot your password?
                </h1>
                <p className="text-base font-lexend text-foreground">
                  Enter your email to receive reset instructions
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="email" className="text-base font-lexend text-foreground">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <EditText
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter Email ID"
                    size="lg"
                    className="w-full [&_input::placeholder]:text-muted-foreground [&_input::placeholder]:opacity-100 [&_input::placeholder]:text-lg"
                    required
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
                  disabled={!isValidEmail(email) || forgotPasswordMutation.isPending}
                  className="w-full bg-[#017850] text-white font-medium py-5 text-xl h-12"
                >
                  {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Email"}
                </Button>
              </div>
            </form>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <span className="text-base font-lexend font-normal text-foreground">
              Remember your password?{" "}
            </span>
            <Link
              href="/auth/login"
              className="text-base font-medium text-[#017850] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
