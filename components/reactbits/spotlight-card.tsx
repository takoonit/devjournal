"use client";

import React, { useRef, useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { motion } from "framer-motion";

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

/**
 * Renders a card with an interactive radial spotlight overlay that follows the mouse and responds to focus and motion preferences.
 *
 * @param children - Content rendered inside the card.
 * @param className - Optional additional CSS classes applied to the root element.
 * @param spotlightColor - CSS color used for the radial spotlight gradient; defaults to `rgba(6, 182, 212, 0.15)`.
 * @returns The card element with an optional animated radial spotlight overlay.
 */
export function SpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(6, 182, 212, 0.15)",
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const { focusMode, motionLevel } = useDevJournalStore((state) => state.uiPreferences);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused || focusMode) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(
            focusMode
                ? 0
                : motionLevel === "reduced"
                  ? 0.3
                  : motionLevel === "expressive"
                    ? 0.8
                    : 0.6
        );
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(
            focusMode
                ? 0
                : motionLevel === "reduced"
                  ? 0.3
                  : motionLevel === "expressive"
                    ? 0.8
                    : 0.6
        );
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 ${className}`}
        >
            {!focusMode && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(${motionLevel === "reduced" ? 450 : motionLevel === "expressive" ? 680 : 600}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    );
}