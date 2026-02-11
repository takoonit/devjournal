export const designTokens = {
  color: {
    surface: {
      canvas: "var(--color-surface-canvas)",
      base: "var(--color-surface-base)",
      raised: "var(--color-surface-raised)",
      border: "var(--color-surface-border)",
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      muted: "var(--color-text-muted)",
    },
    accent: {
      base: "var(--color-accent-base)",
      soft: "var(--color-accent-soft)",
      contrast: "var(--color-accent-contrast)",
    },
    warning: {
      base: "var(--color-warning-base)",
      soft: "var(--color-warning-soft)",
      contrast: "var(--color-warning-contrast)",
    },
    "destructive-soft": {
      base: "var(--color-destructive-base)",
      soft: "var(--color-destructive-soft)",
      contrast: "var(--color-destructive-contrast)",
    },
  },
  motion: {
    subtle: "var(--motion-subtle)",
    standard: "var(--motion-standard)",
    expressive: "var(--motion-expressive)",
  },
  spacing: {
    cozy: {
      stackXs: "0.5rem",
      stackSm: "0.75rem",
      stackMd: "1rem",
      stackLg: "1.5rem",
      section: "2.5rem",
    },
    compact: {
      stackXs: "0.25rem",
      stackSm: "0.5rem",
      stackMd: "0.75rem",
      stackLg: "1rem",
      section: "1.5rem",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
export type DensityScale = keyof DesignTokens["spacing"];
