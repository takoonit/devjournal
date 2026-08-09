"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useDevJournalStore } from "@/lib/store";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    /** Stagger order within a group; delay caps at index 5 so long lists settle together. */
    index?: number;
}

const EASE_SETTLE = [0.2, 0, 0, 1] as const;

/**
 * The only entrance in the system: whole blocks settle like ink —
 * opacity with a small vertical drift, never blur, never letter-by-letter.
 */
export function Reveal({ children, className, index = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const { motionLevel, focusMode } = useDevJournalStore((state) => state.uiPreferences);
    const osReduced = useReducedMotion();

    const still = focusMode || motionLevel === "reduced" || Boolean(osReduced);
    const delay = still ? 0 : Math.min(index, 5) * 0.045;
    const duration = still ? 0.08 : motionLevel === "expressive" ? 0.48 : 0.36;

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: still ? 0 : 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: still ? 0 : 8 }}
            transition={{ duration, delay, ease: EASE_SETTLE }}
        >
            {children}
        </motion.div>
    );
}
