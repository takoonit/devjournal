"use client";

import { motion, Transition, Easing } from "framer-motion";
import { useDevJournalStore } from "@/lib/store";
import { useEffect, useRef, useState, useMemo } from "react";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

/**
 * Animates text by staggering per-segment (word or letter) transitions of blur, opacity, and vertical offset when the element enters the viewport.
 *
 * @param text - The input string to animate.
 * @param delay - Base stagger delay in milliseconds between segments.
 * @param className - Additional CSS classes applied to the container paragraph.
 * @param animateBy - Segment mode: `"words"` splits on spaces, `"letters"` splits into characters.
 * @param direction - Animation direction for initial offset: `"top"` shifts upward, `"bottom"` shifts downward.
 * @param threshold - IntersectionObserver threshold that triggers the animation.
 * @param rootMargin - IntersectionObserver rootMargin applied when observing visibility.
 * @param animationFrom - Optional override for the initial animation style object (applied to all segments).
 * @param animationTo - Optional override for the array of intermediate/final snapshots (applied to all segments).
 * @param easing - Easing function for the transition (expects a value in [0,1] and returns a value in [0,1]).
 * @param onAnimationComplete - Callback invoked after the last segment finishes its animation.
 * @param stepDuration - Duration in seconds for each step between snapshots (controls total animation length).
 * @returns A JSX element (paragraph) containing motion-wrapped segments that animate when scrolled into view.
 */
export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const { focusMode, motionLevel } = useDevJournalStore((state) => state.uiPreferences);
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const effectiveDelay =
    motionLevel === "reduced" ? delay * 1.5 : motionLevel === "expressive" ? delay * 0.8 : delay;
  const effectiveStepDuration =
    motionLevel === "reduced"
      ? stepDuration * 0.8
      : motionLevel === "expressive"
        ? stepDuration * 1.15
        : stepDuration;
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? {
            filter: `blur(${motionLevel === "reduced" ? 4 : motionLevel === "expressive" ? 12 : 10}px)`,
            opacity: 0,
            y: motionLevel === "reduced" ? -20 : motionLevel === "expressive" ? -58 : -50,
          }
        : {
            filter: `blur(${motionLevel === "reduced" ? 4 : motionLevel === "expressive" ? 12 : 10}px)`,
            opacity: 0,
            y: motionLevel === "reduced" ? 20 : motionLevel === "expressive" ? 58 : 50,
          },
    [direction, motionLevel]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = focusMode ? { filter: "blur(0px)", opacity: 1, y: 0 } : animationFrom ?? defaultFrom;
  const toSnapshots = focusMode ? [{ filter: "blur(0px)", opacity: 1, y: 0 }] : animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = effectiveStepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * effectiveDelay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
}