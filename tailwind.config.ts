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
                rule: "rgb(var(--color-rule) / <alpha-value>)",
                scrim: "rgb(var(--color-scrim) / <alpha-value>)",
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
                positive: {
                    DEFAULT: "rgb(var(--color-positive-base) / <alpha-value>)",
                    soft: "rgb(var(--color-positive-soft) / <alpha-value>)",
                    contrast: "rgb(var(--color-positive-contrast) / <alpha-value>)",
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
            },
            fontFamily: {
                sans: ["var(--font-serif)", "Georgia", "serif"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
            fontSize: {
                // The Press Proof scale — serif for the written, mono for the measured
                display: ["2.375rem", { lineHeight: "2.75rem", letterSpacing: "-0.01em", fontWeight: "400" }],
                title: ["1.625rem", { lineHeight: "2rem", fontWeight: "500" }],
                subtitle: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "500" }],
                prose: ["1.09375rem", { lineHeight: "1.8125rem", fontWeight: "400" }],
                ui: ["0.9375rem", { lineHeight: "1.375rem", fontWeight: "400" }],
                meta: ["0.78125rem", { lineHeight: "1.125rem", fontWeight: "400" }],
                label: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em", fontWeight: "500" }],
            },
            maxWidth: {
                measure: "42rem",
                page: "70rem",
            },
            borderRadius: {
                // Print radii: 3px for sheets and buttons, 6px for inputs
                DEFAULT: "3px",
                md: "6px",
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
                "stack-xs": "var(--space-stack-xs)",
                "stack-sm": "var(--space-stack-sm)",
                "stack-md": "var(--space-stack-md)",
                "stack-lg": "var(--space-stack-lg)",
                section: "var(--space-section)",
            },
        },
    },
    plugins: [],
};

export default config;
