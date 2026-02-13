"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { UiPreferences } from "@/lib/store";

interface RadiantPulseProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  rewardIntensity?: UiPreferences["rewardIntensity"];
  decorative?: boolean;
}

export default function RadiantPulse({
  children,
  className,
  active = false,
  rewardIntensity = "subtle",
  decorative = false,
}: RadiantPulseProps) {
  return (
    <span
      className={cn("radiant-pulse", className)}
      data-active={active ? "true" : "false"}
      data-intensity={rewardIntensity}
      aria-hidden={decorative ? true : undefined}
    >
      {children}
    </span>
  );
}
