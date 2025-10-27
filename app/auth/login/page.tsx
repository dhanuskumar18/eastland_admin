"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EditText from "@/components/ui/EditText";
import PasswordInput from "@/components/ui/PasswordInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthWithToast } from "@/hooks/useAuthWithToast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useLogin } from "@/hooks/useAuthApi";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { loginWithToast, showToast } = useAuthWithToast();
  const { loginWithGoogle, login } = useAuth();
  const [email, setEmail] = useState<string>("dhanuskumar18@gmail.com");
  const [password, setPassword] = useState<string>("mdkmdkmdk");
  const [error, setError] = useState<string>("");

  const loginMutation = useLogin();

  const logoSrc = resolvedTheme === "dark" ? "/images/logo/logo2.svg" : "/images/logo/amaramba_logo.png";

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(""); // Clear error when user types
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response : any) => {
          // Handle direct API response format: { access_token: "...", role: "..." }
          if (response && response.access_token) {
            // Check if user role is USER - deny access
            if (response.role === "USER") {
              setError("Invalid access. Admin privileges required.");
              showToast({
                type: "destructive",
                title: "Access Denied",
                message: "Invalid access. Admin privileges required.",
              });
              return;
            }
            
            // Allow access for ADMIN role
            if (response.role === "ADMIN") {
              // New API response format: { access_token: "...", role: "ADMIN" }
              // Server sets refreshToken cookie automatically
              const userData = {
                id: "",
                email: email,
                role: response.role,
                type: response.role,
                firstName: "",
                lastName: "",
                isActive: true
              };
              
              // Pass access_token as token and user data
              // Token will be stored in memory and sent via Authorization header
              login(response.access_token, userData);
              
              showToast({
                type: "success",
                title: "Login successful",
                message: "Welcome back!",
              });
              
              router.replace("/dashboard");
            } else {
              // Handle any other role or missing role
              setError("Invalid access. Admin privileges required.");
              showToast({
                type: "destructive",
                title: "Access Denied",
                message: "Invalid access. Admin privileges required.",
              });
            }
          } else {
            // Handle wrapped API response format (fallback)
            if (response.status === true && response.data && response.data.access_token) {
              // Check if user role is USER - deny access
              if (response.data.role === "USER") {
                setError("Invalid access. Admin privileges required.");
                showToast({
                  type: "destructive",
                  title: "Access Denied",
                  message: "Invalid access. Admin privileges required.",
                });
                return;
              }
              
              // Allow access for ADMIN role
              if (response.data.role === "ADMIN") {
                const userData = {
                  id: "",
                  email: email,
                  role: response.data.role,
                  type: response.data.role,
                  firstName: "",
                  lastName: "",
                  isActive: true
                };
                
                // Pass access_token as token and user data
                // Token will be stored in memory and sent via Authorization header
                login(response.data.access_token, userData);
                
                showToast({
                  type: "success",
                  title: "Login successful",
                  message: "Welcome back!",
                });
                
                router.replace("/dashboard");
              } else {
                setError("Invalid access. Admin privileges required.");
                showToast({
                  type: "destructive",
                  title: "Access Denied",
                  message: "Invalid access. Admin privileges required.",
                });
              }
            } else {
              const apiMessage =
                response.message || "Invalid email or password. Please try again.";
              setError(apiMessage);
              showToast({
                type: "destructive",
                title: "Login failed",
                message: apiMessage,
              });
            }
          }
        },
        onError: (err: any) => {
          const apiMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid email or password. Please try again.";
          setError(apiMessage);
          showToast({
            type: "destructive",
            title: "Login failed",
            message: apiMessage,
          });
        },
      }
    );
  };

  const handleGoogleLogin = () => {
    loginWithGoogle("login");
  };

  const isValidForm = () => {
    return email && password && !loginMutation.isPending;
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="w-full  flex flex-row h-screen">
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

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-background text-foreground flex flex-col items-center justify-center relative h-screen">
          <div className="w-full max-w-lg space-y-5 py-10 px-8 ">
         

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="text-left">
                <h1 className="text-4xl font-lexend text-foreground mb-10 font-bold">
                  Login your account
                </h1>
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

                <div className="space-y-3">
                  <label htmlFor="password" className="text-base font-lexend text-foreground">
                    Password<span className="text-red-500 ">*</span>
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter Password"
                    size="lg"
                    className="[&_input::placeholder]:text-muted-foreground [&_input::placeholder]:opacity-100 [&_input::placeholder]:text-lg"
                    required
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-base font-medium text-[#017850]  transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Error Messages */}
                {error && (
                  <div className="text-base text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!isValidForm()}
                  className="w-full bg-[#017850]  text-white font-medium py-5 text-xl h-12 "
                >
                  {loginMutation.isPending ? "Logging in..." : "Log in"}
                </Button>

            
              </div>
            </form>
          </div>
          {/* Footer with Divider */}
          {/* <div className="  px-8 lg:px-16 w-full border-t-2  border-border">
            <div className="w-full max-w-md mx-auto">
              <div className="pt-2 space-y-2">
                <div className="text-center">
                  <span className="text-sm font-lexend font-normal text-global-1">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    href="/auth/register/email"
                    className="text-primary-light-blue text-sm font-lexend font-normal hover:underline transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;