"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { UiPreferences } from "@/lib/store";

interface RadiantPulseProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  rewardIntensity?: UiPreferences["rewardIntensity"];
}

export default function RadiantPulse({
  children,
  className,
  active = false,
  rewardIntensity = "subtle",
}: RadiantPulseProps) {
  return (
    <span
      className={cn("radiant-pulse", className)}
      data-active={active ? "true" : "false"}
      data-intensity={rewardIntensity}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
