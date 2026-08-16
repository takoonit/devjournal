/**
 * Material light and dark theme modes. Persisted values retain the original
 * names so existing local journals migrate without losing preferences.
 * All palette/motion/spacing values live as CSS variables in app/globals.css;
 * components consume them through the Tailwind theme, never directly.
 */
export type ThemeMode = "press" | "ink";
