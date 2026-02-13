import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--color-surface-canvas) / <alpha-value>)",
                foreground: "rgb(var(--color-text-primary) / <alpha-value>)",
                surface: {
                    canvas: "rgb(var(--color-surface-canvas) / <alpha-value>)",
                    base: "rgb(var(--color-surface-base) / <alpha-value>)",
                    raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
                    border: "rgb(var(--color-surface-border) / <alpha-value>)",
                },
                text: {
                    primary: "rgb(var(--color-text-primary) / <alpha-value>)",
                    secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
                    muted: "rgb(var(--color-text-muted) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "rgb(var(--color-accent-base) / <alpha-value>)",
                    soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
                    contrast: "rgb(var(--color-accent-contrast) / <alpha-value>)",
                },
                warning: {
                    DEFAULT: "rgb(var(--color-warning-base) / <alpha-value>)",
                    soft: "rgb(var(--color-warning-soft) / <alpha-value>)",
                    contrast: "rgb(var(--color-warning-contrast) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "rgb(var(--color-destructive-base) / <alpha-value>)",
                    soft: "rgb(var(--color-destructive-soft) / <alpha-value>)",
                    contrast: "rgb(var(--color-destructive-contrast) / <alpha-value>)",
                },
                entry: {
                    feature: "rgb(var(--color-entry-feature) / <alpha-value>)",
                    fix: "rgb(var(--color-entry-fix) / <alpha-value>)",
                    refactor: "rgb(var(--color-entry-refactor) / <alpha-value>)",
                    design: "rgb(var(--color-entry-design) / <alpha-value>)",
                    journal: "rgb(var(--color-entry-journal) / <alpha-value>)",
                },
                status: {
                    shipped: "rgb(var(--color-status-shipped) / <alpha-value>)",
                    "in-progress": "rgb(var(--color-status-in-progress) / <alpha-value>)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "monospace"],
            },
            animation: {
                "spotlight": "spotlight 2s ease infinite",
                "blur-in": "blur-in 0.5s ease-out forwards",
            },
            keyframes: {
                spotlight: {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                "blur-in": {
                    "0%": { filter: "blur(10px)", opacity: "0" },
                    "100%": { filter: "blur(0)", opacity: "1" },
                },
            },
            transitionDuration: {
                subtle: "var(--motion-subtle)",
                standard: "var(--motion-standard)",
                expressive: "var(--motion-expressive)",
            },
            transitionTimingFunction: {
                subtle: "var(--easing-subtle)",
                standard: "var(--easing-standard)",
                expressive: "var(--easing-expressive)",
            },
            spacing: {
                "cozy-xs": "var(--space-cozy-stack-xs)",
                "cozy-sm": "var(--space-cozy-stack-sm)",
                "cozy-md": "var(--space-cozy-stack-md)",
                "cozy-lg": "var(--space-cozy-stack-lg)",
                "cozy-section": "var(--space-cozy-section)",
                "compact-xs": "var(--space-compact-stack-xs)",
                "compact-sm": "var(--space-compact-stack-sm)",
                "compact-md": "var(--space-compact-stack-md)",
                "compact-lg": "var(--space-compact-stack-lg)",
                "compact-section": "var(--space-compact-section)",
            },
        },
    },
    plugins: [],
};

export default config;
