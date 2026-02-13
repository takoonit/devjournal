"use client";

import ShinyText from "@/components/reactbits/shiny-text";
import { cn } from "@/lib/utils";

type RewardLabelTone = "neutral" | "accent" | "warning";

interface RewardLabelProps {
  text: string;
  tone?: RewardLabelTone;
  className?: string;
}

const tonePreset: Record<
  RewardLabelTone,
  { color: string; shineColor: string; className: string }
> = {
  neutral: {
    color: "rgb(var(--color-text-secondary))",
    shineColor: "rgb(var(--color-text-primary))",
    className: "text-sm font-medium tracking-wide",
  },
  accent: {
    color: "rgb(var(--color-accent-base))",
    shineColor: "rgb(var(--color-accent-contrast))",
    className: "text-sm font-semibold uppercase tracking-[0.14em]",
  },
  warning: {
    color: "rgb(var(--color-warning-base))",
    shineColor: "rgb(var(--color-warning-contrast))",
    className: "text-xs font-semibold uppercase tracking-[0.16em]",
  },
};

export function RewardLabel({
  text,
  tone = "accent",
  className,
}: RewardLabelProps) {
  const preset = tonePreset[tone];

  return (
    <ShinyText
      text={text}
      speed={2.4}
      spread={118}
      pauseOnHover
      color={preset.color}
      shineColor={preset.shineColor}
      className={cn(preset.className, className)}
    />
  );
}
