"use client";

import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type InteractiveSurfaceIntensity = "subtle" | "standard" | "expressive";

interface InteractiveSurfaceProps {
  children: ReactNode;
  intensity?: InteractiveSurfaceIntensity;
  className?: string;
}

const intensityPresets: Record<
  InteractiveSurfaceIntensity,
  { spotlightColor: string; className: string }
> = {
  subtle: {
    spotlightColor: "rgba(52, 211, 153, 0.12)",
    className: "border-surface-border/70 bg-surface-raised/35",
  },
  standard: {
    spotlightColor: "rgba(34, 211, 238, 0.18)",
    className: "border-surface-border bg-surface-raised/45",
  },
  expressive: {
    spotlightColor: "rgba(167, 139, 250, 0.26)",
    className: "border-accent-soft/50 bg-surface-raised/55",
  },
};

export function InteractiveSurface({
  children,
  intensity = "standard",
  className,
}: InteractiveSurfaceProps) {
  const preset = intensityPresets[intensity];

  return (
    <SpotlightCard
      spotlightColor={preset.spotlightColor}
      className={cn(
        "rounded-2xl border shadow-[0_12px_32px_-16px_rgba(0,0,0,0.6)]",
        "transition duration-standard ease-standard hover:border-2 hover:border-accent/55",
        preset.className,
        className
      )}
    >
      {children}
    </SpotlightCard>
  );
}
