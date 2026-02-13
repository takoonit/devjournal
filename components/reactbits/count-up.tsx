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
  const hasStartedRef = useRef(false);
  const hasEndedRef = useRef(false);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
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
    hasStartedRef.current = false;
    hasEndedRef.current = false;
  }, [to, from, direction, delay, startWhen]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (isInView && startWhen) {
      const timeoutId = setTimeout(() => {
        if (!hasStartedRef.current && typeof onStartRef.current === "function") {
          onStartRef.current();
        }
        hasStartedRef.current = true;
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId);
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
  ]);

  useEffect(() => {
    const target = direction === "down" ? from : to;
    const epsilon = Math.max(0.01, Math.abs(target) * 0.001);
    const velocityThreshold = 0.05;

    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }

      const velocity = Math.abs(springValue.getVelocity());
      const isSettled = Math.abs(latest - target) <= epsilon && velocity <= velocityThreshold;

      if (hasStartedRef.current && !hasEndedRef.current && isSettled) {
        hasEndedRef.current = true;
        if (typeof onEndRef.current === "function") {
          onEndRef.current();
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue, direction, from, to]);

  return <span className={className} ref={ref} />;
}
