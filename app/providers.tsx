"use client";

import { createContext, useContext, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
// import { NextIntlClientProvider } from "next-intl";
// import enCommon from "@/messages/en/common.json";
// import ptCommon from "@/messages/pt/common.json";
import { defaultTheme, ThemeConfig } from "@/config/theme";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Toaster } from "@/components/ui/toaster";

const ThemeConfigContext = createContext<{
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
}>({
  theme: defaultTheme,
  updateTheme: () => {},
});

export const useThemeConfig = () => useContext(ThemeConfigContext);

export const useThemeUtils = () => {
  const { theme } = useThemeConfig();
  return {
    isDark: theme.mode === 'dark',
    theme,
  };
};

export interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [locale, setLocale] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = window.localStorage.getItem("lang");
      if (stored === "pt" || stored === "en") return stored;
    } catch {}
    if (typeof navigator !== "undefined") {
      return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
    }
    return "en";
  });

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setThemeConfig(prev => ({
      ...prev,
      ...updates,
    }));
  };



  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lang", locale);
        document?.documentElement?.setAttribute("lang", locale);
      }
    } catch {}
  }, [locale]);

  return (
    <ThemeConfigContext.Provider value={{ theme: themeConfig, updateTheme }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={themeConfig.mode}
        enableSystem
        disableTransitionOnChange
      >
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <AuthProvider>
                <LoaderProvider>
                  <React.Fragment key="main-content">
                    {children}
                  </React.Fragment>
                  <React.Fragment key="devtools">
                    <ReactQueryDevtools initialIsOpen={false} />
                  </React.Fragment>
                </LoaderProvider>
              </AuthProvider>
              <Toaster />
            </ToastProvider>
          </QueryClientProvider>
      </NextThemesProvider>
    </ThemeConfigContext.Provider>
  );
}
