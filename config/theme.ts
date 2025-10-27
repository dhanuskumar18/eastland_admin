import { Lexend } from "next/font/google";

import { ThemeMode, ThemeDirection, MenuOrientation } from "./constants";

export const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  // Include a range of weights for flexibility
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export interface ThemeConfig {
  fontFamily: string;
  mode: (typeof ThemeMode)[keyof typeof ThemeMode];
  themeDirection: (typeof ThemeDirection)[keyof typeof ThemeDirection];
  menuOrientation: (typeof MenuOrientation)[keyof typeof MenuOrientation];
  miniDrawer: boolean;
  presetColor: string;
  container: boolean;
  i18n: string;
}

export const defaultTheme: ThemeConfig = {
  fontFamily: lexend.className,
  mode: ThemeMode.LIGHT,
  themeDirection: ThemeDirection.LTR,
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  presetColor: "default",
  container: true,
  i18n: "en",
};

// Theme-aware utility classes
export const themeClasses = {
  // Background classes
  backgrounds: {
    primary: "bg-background",
    secondary: "bg-card",
    muted: "bg-muted",
    accent: "bg-accent",
    border: "bg-border",
  },
  
  // Text classes
  text: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    accent: "text-accent-foreground",
    primaryColor: "text-primary",
    destructive: "text-destructive",
  },
  
  // Border classes
  borders: {
    default: "border-border",
    primary: "border-primary",
    destructive: "border-destructive",
  },
  
  // Interactive states
  states: {
    hover: {
      background: "hover:bg-accent",
      text: "hover:text-accent-foreground",
      border: "hover:border-accent",
    },
    focus: {
      ring: "focus-visible:ring-ring",
      outline: "focus-visible:outline-none",
    },
    disabled: {
      opacity: "disabled:opacity-50",
      pointer: "disabled:pointer-events-none",
    },
  },
  
  // Common component patterns
  components: {
    card: "bg-card border border-border text-card-foreground shadow-sm rounded-lg",
    button: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    input: "bg-background border border-input text-foreground placeholder:text-muted-foreground",
  },
};

// Theme-aware color palette
export const themeColors = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(240 10% 3.9%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(240 10% 3.9%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(240 10% 3.9%)",
    primary: "hsl(240 5.9% 10%)",
    primaryForeground: "hsl(0 0% 98%)",
    secondary: "hsl(240 4.8% 95.9%)",
    secondaryForeground: "hsl(240 5.9% 10%)",
    muted: "hsl(240 4.8% 95.9%)",
    mutedForeground: "hsl(240 3.8% 46.1%)",
    accent: "hsl(240 4.8% 95.9%)",
    accentForeground: "hsl(240 5.9% 10%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 5.9% 90%)",
    input: "hsl(240 5.9% 90%)",
    ring: "hsl(240 10% 3.9%)",
  },
  dark: {
    background: "hsl(240 10% 3.9%)",
    foreground: "hsl(0 0% 98%)",
    card: "hsl(240 10% 3.9%)",
    cardForeground: "hsl(0 0% 98%)",
    popover: "hsl(240 10% 3.9%)",
    popoverForeground: "hsl(0 0% 98%)",
    primary: "hsl(0 0% 98%)",
    primaryForeground: "hsl(240 5.9% 10%)",
    secondary: "hsl(240 3.7% 15.9%)",
    secondaryForeground: "hsl(0 0% 98%)",
    muted: "hsl(240 3.7% 15.9%)",
    mutedForeground: "hsl(240 5% 64.9%)",
    accent: "hsl(240 3.7% 15.9%)",
    accentForeground: "hsl(0 0% 98%)",
    destructive: "hsl(0 62.8% 30.6%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 3.7% 15.9%)",
    input: "hsl(240 3.7% 15.9%)",
    ring: "hsl(240 4.9% 83.9%)",
  },
};
