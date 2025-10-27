"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backUrl,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="p-4 min-h-screen flex items-center bg-default-100 w-full justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="pb-0 pt-6 px-6">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  isIconOnly
                  className="text-gray-600"
                  size="sm"
                  variant="light"
                  onPress={handleBack}
                >
                  ←
                </Button>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-6 py-6">{children}</CardBody>
        </Card>

        {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};
