"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Animate a numeric value from a start value to a target and render the formatted result inside a span.
 *
 * The component animates between `from` and `to` using a spring whose timing adapts to a motion preference,
 * optionally delays the start, and begins when the element enters the viewport if `startWhen` is true.
 *
 * @param to - Target numeric value to animate to.
 * @param from - Starting numeric value (default 0).
 * @param direction - "up" to animate from `from` to `to`, "down" to animate from `to` to `from` (default "up").
 * @param delay - Seconds to wait before beginning the animation (default 0).
 * @param duration - Base animation duration in seconds; adjusted by motion preferences (default 2).
 * @param className - CSS class applied to the returned span.
 * @param startWhen - If true, start the animation when the element enters the viewport (default true).
 * @param separator - Thousand separator string to use for formatted output (default "").
 * @param onStart - Optional callback invoked when the animation begins.
 * @param onEnd - Optional callback invoked after the animation completes.
 * @returns A span element whose text content is updated with the localized, optionally separated, animated numeric value.
 */
export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const { motionLevel } = useDevJournalStore((state) => state.uiPreferences);
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const effectiveDuration =
    motionLevel === "reduced" ? duration * 0.7 : motionLevel === "expressive" ? duration * 1.15 : duration;
  const damping = 20 + 40 * (1 / effectiveDuration);
  const stiffness = 100 * (1 / effectiveDuration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat("en-US", options).format(
        latest
      );

      return separator
        ? formattedNumber.replace(/,/g, separator)
        : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
        delay * 1000 + effectiveDuration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    effectiveDuration,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}