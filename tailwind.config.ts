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
                display: ["clamp(2.25rem, calc(1.5rem + 2vw), 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "400" }],
                title: ["clamp(1.375rem, calc(1.15rem + 0.9vw), 1.875rem)", { lineHeight: "1.2", fontWeight: "500" }],
                subtitle: ["clamp(1.125rem, calc(1rem + 0.4vw), 1.375rem)", { lineHeight: "1.3", fontWeight: "500" }],
                prose: ["clamp(1rem, calc(0.95rem + 0.25vw), 1.125rem)", { lineHeight: "var(--line-height-prose)", letterSpacing: "var(--tracking-prose)", fontWeight: "var(--font-weight-prose)" }],
                ui: ["clamp(0.875rem, calc(0.825rem + 0.2vw), 1rem)", { lineHeight: "1.5", fontWeight: "400" }],
                meta: ["clamp(0.75rem, calc(0.72rem + 0.1vw), 0.8125rem)", { lineHeight: "1.45", fontWeight: "400" }],
                label: ["clamp(0.6875rem, calc(0.66rem + 0.08vw), 0.75rem)", { lineHeight: "1.45", letterSpacing: "0.08em", fontWeight: "500" }],
                folio: ["clamp(4rem, calc(2.75rem + 4vw), 6.5rem)", { lineHeight: "1", fontWeight: "300" }],
            },
            maxWidth: {
                measure: "66ch",
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
                "page-inline": "var(--space-page-inline)",
                "page-block": "var(--space-page-block)",
                "timeline-rail": "var(--timeline-rail-width)",
                "timeline-node": "var(--timeline-node-column)",
            },
            width: {
                "editor-sidebar": "var(--editor-sidebar-width)",
                "portfolio-sidebar": "var(--portfolio-sidebar-width)",
            },
            minHeight: {
                composer: "var(--composer-min-block)",
                "composer-details": "var(--composer-details-min-block)",
            },
        },
    },
    plugins: [],
};

export default config;
