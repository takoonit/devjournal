"use client";

import { motion, Transition, Easing } from "framer-motion";
import { useDevJournalStore } from "@/lib/store";
import { forwardRef, useEffect, useRef, useState, useMemo, type HTMLAttributes } from "react";

type BlurTextTag = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";

type BlurTextProps = {
  as?: BlurTextTag;
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
} & Omit<HTMLAttributes<HTMLElement>, "children">;

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

const BlurText = forwardRef<HTMLElement, BlurTextProps>(function BlurText(
  {
  as = "p",
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
  ...restProps
}: BlurTextProps,
  forwardedRef
) {
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
  const localRef = useRef<HTMLElement | null>(null);

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
      return;
    }

    if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
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

  const fromSnapshot = useMemo(
    () => (focusMode ? { filter: "blur(0px)", opacity: 1, y: 0 } : animationFrom ?? defaultFrom),
    [focusMode, animationFrom, defaultFrom]
  );
  const toSnapshots = useMemo(
    () => (focusMode ? [{ filter: "blur(0px)", opacity: 1, y: 0 }] : animationTo ?? defaultTo),
    [focusMode, animationTo, defaultTo]
  );

  const stepCount = toSnapshots.length + 1;
  const totalDuration = effectiveStepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots]
  );

  const Component = as;

  return (
    <Component ref={setRefs} className={`blur-text ${className} flex flex-wrap`} {...restProps}>
      {elements.map((segment, index) => {

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
    </Component>
  );
});

export default BlurText;
