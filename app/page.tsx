'use client';

import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useOAuthCallback } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useThemeConfig } from "@/app/providers";
import { SimpleLayoutType } from "@/config/constants";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import LoginPage from "./auth/login/page";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { theme } = useThemeConfig();
  
  // Handle OAuth callback
  useOAuthCallback();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-background">
       <LoginPage />
      </div>
    </ProtectedRoute>
  );
}
