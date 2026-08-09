/**
 * Theme modes for the Press Proof design system.
 * "press" — warm paper, the default. "ink" — Midnight Ink, the dark twin.
 * All palette/motion/spacing values live as CSS variables in app/globals.css;
 * components consume them through the Tailwind theme, never directly.
 */
export type ThemeMode = "press" | "ink";
