export const APP_DEFAULT_PATH = '/';
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;
export const HORIZONTAL_MAX_ITEM = 7;

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const MenuOrientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
} as const;

export const ThemeDirection = {
  LTR: 'ltr',
  RTL: 'rtl'
} as const;

export const SimpleLayoutType = {
  SIMPLE: 'simple',
  LANDING: 'landing'
} as const;

export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female'
} as const;

export const DropzoneType = {
  DEFAULT: 'default',
  STANDARD: 'standard'
} as const;

export const NavActionType = {
  LINK: 'link',
  FUNCTION: 'function'
} as const;

// Type exports for TypeScript
export type ThemeModeType = typeof ThemeMode[keyof typeof ThemeMode];
export type MenuOrientationType = typeof MenuOrientation[keyof typeof MenuOrientation];
export type ThemeDirectionType = typeof ThemeDirection[keyof typeof ThemeDirection];
export type SimpleLayoutTypeType = typeof SimpleLayoutType[keyof typeof SimpleLayoutType];
export type GenderType = typeof Gender[keyof typeof Gender];
export type DropzoneTypeType = typeof DropzoneType[keyof typeof DropzoneType];
export type NavActionTypeType = typeof NavActionType[keyof typeof NavActionType]; 