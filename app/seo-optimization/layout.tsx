'use client';

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import { lexend } from "@/config/theme";
import { ThemeMode, ThemeDirection, MenuOrientation } from "@/config/constants";

export default function SEOOptimizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout initialTheme={{
        fontFamily: lexend.className,
        mode: ThemeMode.LIGHT,
        menuOrientation: MenuOrientation.VERTICAL,
        miniDrawer: false,
        themeDirection: ThemeDirection.LTR,
        presetColor: 'default',
        container: true,
        i18n: 'en'
      }}>
        {children}
      </Layout>
    </ProtectedRoute>
  );
}

