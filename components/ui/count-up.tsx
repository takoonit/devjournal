"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";

interface CountUpProps {
    to: number;
    from?: number;
    delay?: number;
    duration?: number;
    className?: string;
}

/**
 * Tabular-numeral count-up. Used once per view at most (portfolio masthead
 * stats); everywhere else numbers are set static, like figures in a ledger.
 */
export default function CountUp({
    to,
    from = 0,
    delay = 0,
    duration = 0.7,
    className = "",
}: CountUpProps) {
    const { motionLevel } = useDevJournalStore((state) => state.uiPreferences);
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(from);
    const osReduced = useReducedMotion();

    const still = motionLevel === "reduced" || Boolean(osReduced);
    const effectiveDuration = motionLevel === "expressive" ? duration * 1.15 : duration;
    const damping = 20 + 40 * (1 / effectiveDuration);
    const stiffness = 100 * (1 / effectiveDuration);

    const springValue = useSpring(motionValue, { damping, stiffness });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    const formatValue = useCallback(
        (latest: number) => Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(latest)),
        []
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = formatValue(still ? to : from);
        }
    }, [from, to, still, formatValue]);

    useEffect(() => {
        if (!isInView || still) return;

        const timeoutId = setTimeout(() => {
            motionValue.set(to);
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [isInView, still, motionValue, to, delay]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest: number) => {
            if (ref.current) {
                ref.current.textContent = formatValue(latest);
            }
        });

        return () => unsubscribe();
    }, [springValue, formatValue]);

    return <span className={`tabular-nums ${className}`} ref={ref}>{formatValue(from)}</span>;
}
