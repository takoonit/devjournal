"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
}

/**
 * Reveal children with a configurable scroll-triggered entrance animation.
 *
 * The element starts offset in the specified direction by `distance` and animates to its original position when it enters the viewport.
 *
 * @param children - Content to render inside the reveal container
 * @param className - Optional CSS class names applied to the container
 * @param delay - Animation delay in seconds
 * @param direction - Initial reveal direction: `"up" | "down" | "left" | "right"`
 * @param distance - Offset distance in pixels for the initial hidden state
 * @param duration - Animation duration in seconds
 * @param once - If `true`, the animation runs only the first time the element enters the viewport
 * @returns A React element that animates its children into view from the specified direction and distance
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 0.5,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}