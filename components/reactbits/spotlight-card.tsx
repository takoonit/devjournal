"use client";

import React, { useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgb(var(--color-accent-base) / 45%)",
}: SpotlightCardProps) {
  const { focusMode } = useDevJournalStore((state) => state.uiPreferences);
  const [isHaloActive, setIsHaloActive] = useState(false);

  const activateHalo = () => {
    if (focusMode) return;
    setIsHaloActive(true);
  };

  const deactivateHalo = () => setIsHaloActive(false);

  return (
    <motion.div
      onMouseEnter={activateHalo}
      onMouseLeave={deactivateHalo}
      onFocus={activateHalo}
      onBlur={deactivateHalo}
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm transition-all duration-standard ease-standard hover:border-accent/55",
        className
      )}
    >
      {!focusMode && isHaloActive ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ boxShadow: `0 0 0 var(--border-bold) ${spotlightColor}` }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </motion.div>
  );
}
