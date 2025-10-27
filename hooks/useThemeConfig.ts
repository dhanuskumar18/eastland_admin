import { useTheme } from "next-themes";
import { useThemeConfig } from "@/app/providers";
import { themeClasses, themeColors } from "@/config/theme";

export const useThemeUtils = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const { theme: themeConfig } = useThemeConfig();

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
  const isLight = theme === "light" || (theme === "system" && systemTheme === "light");

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const getThemeClass = (type: keyof typeof themeClasses, variant?: string) => {
    if (variant) {
      return themeClasses[type][variant as keyof typeof themeClasses[typeof type]];
    }
    return themeClasses[type];
  };

  const getColor = (colorName: keyof typeof themeColors.light) => {
    return isDark ? themeColors.dark[colorName] : themeColors.light[colorName];
  };

  return {
    theme,
    systemTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    themeConfig,
    themeClasses,
    getThemeClass,
    getColor,
  };
};
