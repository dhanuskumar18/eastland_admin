"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/OtpInput";
import { useVerifyResetOtp, useResendOtp } from "@/hooks/useAuthApi";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTheme } from "next-themes";

export default function VerifyResetOtpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const [resendUntil, setResendUntil] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const verifyResetOtpMutation = useVerifyResetOtp();
  const resendOtpMutation = useResendOtp();

  const RESEND_WINDOW_MS = 600_000; // 10 minutes
 
  const getResendKey = (addr: string) => `resetPasswordResendLock:${addr}`;

  React.useEffect(() => {
    // Clean up any old sessionStorage entries that might cause conflicts
    const oldKeys = ['resetEmail', 'resetResendAt', 'resetToken'];
    oldKeys.forEach(key => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
      }
    });

    const storedEmail = sessionStorage.getItem("resetPasswordEmail");

    if (!storedEmail) {
      router.push("/auth/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  // Initialize resend lock window from storage when email becomes available
  React.useEffect(() => {
    if (!email) return;
    const key = getResendKey(email);
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    const parsed = stored ? parseInt(stored, 10) : NaN;

    // Clear any invalid or expired entries
    if (stored && (Number.isNaN(parsed) || parsed <= Date.now())) {
      sessionStorage.removeItem(key);
    }

    if (stored && !Number.isNaN(parsed) && parsed > Date.now()) {
      setResendUntil(parsed);
      // The countdown ticker will handle setting resendSecondsLeft
    } else {
      setResendUntil(null);
      setResendSecondsLeft(0);
    }
  }, [email]);

  // Countdown ticker tied to `resendUntil`
  React.useEffect(() => {
    if (!resendUntil) return;

    const tick = () => {
      const diffMs = resendUntil - Date.now();
      const secs = Math.max(0, Math.ceil(diffMs / 1000));
      setResendSecondsLeft(secs);
      if (secs <= 0) {
        setResendUntil(null);
      }
    };

    // Initial tick to set the correct countdown
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [resendUntil]);

  // Countdown for OTP expiry (fallback to 60s if unknown)
  // Removed OTP expiry countdown

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (otp.length !== 6) return;
    verifyResetOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: (response) => {
          console.log('Full OTP Verification Response:', response);
          console.log('Response.data:', (response as any).data);
          
          // Handle the API response format: { message: string, verified: boolean }
          // The response is coming directly as the object, not wrapped in response.data
          const responseData = (response as any).data || response;
          
          console.log('Extracted Response Data:', responseData);
          console.log('Verified value:', responseData?.verified);
          console.log('Message value:', responseData?.message);
          
          // Check if verified is true in the response
          if (responseData?.verified === true) {
            console.log('OTP verification successful, navigating to reset password page...');
            // Clear any existing error messages and set success message
            setError("");
            setSuccessMessage(responseData?.message || "OTP verified successfully!");
            // Store email for reset password page
            sessionStorage.setItem("resetPasswordEmail", email);
            // Navigate immediately to reset password page
            console.log('Attempting navigation to /auth/reset-password');
            try {
              router.push("/auth/reset-password");
            } catch (error) {
              console.error('Router navigation failed, using window.location:', error);
              window.location.href = "/auth/reset-password";
            }
          } else {
            console.log('OTP verification failed, showing error message');
            setError(responseData?.message || "Invalid OTP. Please try again.");
          }
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message || err?.message || "Invalid OTP. Please try again."),
      },
    );
  };

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp);
    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          try {
            const target = Date.now() + RESEND_WINDOW_MS;
            sessionStorage.setItem(getResendKey(email), String(target));
            setResendUntil(target);
            // The countdown ticker will handle setting resendSecondsLeft
          } catch {}
        },
        onError: (err: any) => {
          const apiMessage =
            err?.response?.data?.message ||
            err?.response?.data?.apiResponse?.message ||
            err?.message ||
            "Failed to resend OTP. Please try again.";
          setError("");
        },
      },
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

        {/* Right Side - Verify OTP Form */}
        <div className="w-full lg:w-1/2 bg-background text-foreground flex flex-col items-center justify-center relative h-screen">
          <div className="w-full max-w-lg space-y-5 py-10 px-8 ">

            {/* Verify OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-left">
                <h1 className="text-4xl font-lexend text-foreground mb-10 font-bold">
                  Verify Reset Code
                </h1>
                <p className="text-base font-lexend text-foreground">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={verifyResetOtpMutation.isPending}
                    error={!!error}
                    errorMessage={error}
                  />
                </div>

                {/* Success Messages */}
                {successMessage && (
                  <div className="text-base text-green-600 text-center">
                    {successMessage}
                  </div>
                )}

                {/* Error Messages */}
                {error && (
                  <div className="text-base text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={verifyResetOtpMutation.isPending}
                  className="w-full bg-[#017850] text-white font-medium py-5 text-xl h-12"
                >
                  {verifyResetOtpMutation.isPending ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-base font-lexend text-foreground">
                    Didn't receive the code?{" "}
                    <button
                      className="text-[#017850] hover:text-[#017850]/80 font-lexend font-medium hover:underline transition-all duration-200"
                      disabled={resendOtpMutation.isPending || resendSecondsLeft > 0}
                      type="button"
                      onClick={handleResendOtp}
                    >
                      {resendOtpMutation.isPending
                        ? "Sending..."
                        : resendSecondsLeft > 0
                          ? `Resend in ${String(Math.floor(resendSecondsLeft / 60)).padStart(2, "0")}:${String(resendSecondsLeft % 60).padStart(2, "0")}`
                          : "Resend"}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Back to Forgot Password Link */}
          <div className="text-center">
            <span className="text-base font-lexend font-normal text-foreground">
              Wrong email?{" "}
            </span>
            <Link
              href="/auth/forgot-password"
              className="text-base font-medium text-[#017850] transition-colors"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
