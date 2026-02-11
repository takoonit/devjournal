"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useDevJournalStore } from "@/lib/store";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "framer-motion";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

/**
 * Render text with an animated linear-gradient background and an optional decorative border.
 *
 * The animation moves the gradient according to `direction` and `animationSpeed`, respects global motion preferences (reduced motion and focus mode), and can pause on hover when `pauseOnHover` is enabled.
 *
 * @param children - Content to render with the animated gradient
 * @param className - Additional CSS classes applied to the outer container
 * @param colors - Array of color strings used for the gradient (the first color is repeated to create a seamless loop)
 * @param animationSpeed - Base animation duration in seconds
 * @param showBorder - When true, render a matching gradient border (suppressed when focus mode is active)
 * @param direction - Gradient movement direction: "horizontal", "vertical", or "diagonal"
 * @param pauseOnHover - When true, hovering will pause the gradient animation
 * @param yoyo - When true, the animation reverses direction at the ends to create a back-and-forth loop
 * @returns The JSX element containing the gradient-animated text (and optional border)
 */
export default function GradientText({
  children,
  className = "",
  colors = ["#06b6d4", "#10b981", "#06b6d4"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const { focusMode, motionLevel } = useDevJournalStore((state) => state.uiPreferences);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const effectiveShowBorder = showBorder && !focusMode;
  const effectiveYoyo = motionLevel === "reduced" ? false : yoyo;
  const speedMultiplier =
    motionLevel === "reduced" ? 1.7 : motionLevel === "expressive" ? 0.75 : 1;
  const animationDuration = animationSpeed * speedMultiplier * 1000;

  useAnimationFrame((time) => {
    if (isPaused || focusMode) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (effectiveYoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(
          100 -
            ((cycleTime - animationDuration) / animationDuration) * 100
        );
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, effectiveYoyo, progress]);

  const backgroundPosition = useTransform(progress, (p) => {
    if (direction === "horizontal") {
      return `${p}% 50%`;
    } else if (direction === "vertical") {
      return `50% ${p}%`;
    } else {
      return `${p}% 50%`;
    }
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === "horizontal"
        ? "300% 100%"
        : direction === "vertical"
          ? "100% 300%"
          : "300% 300%",
    backgroundRepeat: "repeat",
  };

  return (
    <motion.div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${effectiveShowBorder ? "py-1 px-2" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {effectiveShowBorder && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]"
          style={{ ...gradientStyle, backgroundPosition }}
        >
          <div
            className="absolute bg-zinc-950 rounded-[1.25rem] z-[-1]"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      )}
      <motion.div
        className="inline-block relative z-[2] text-transparent bg-clip-text"
        style={{
          ...gradientStyle,
          backgroundPosition,
          WebkitBackgroundClip: "text",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}