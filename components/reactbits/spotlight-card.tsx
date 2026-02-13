"use client";

import React, { useRef, useState } from "react";
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
    spotlightColor = "rgba(148, 163, 184, 0.12)",
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const { focusMode, motionLevel } = useDevJournalStore((state) => state.uiPreferences);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const spotlightOpacity = focusMode
        ? 0
        : motionLevel === "reduced"
          ? 0.18
          : motionLevel === "expressive"
            ? 0.45
            : 0.28;
    const spotlightSize = motionLevel === "reduced" ? 520 : motionLevel === "expressive" ? 620 : 560;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused || focusMode) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(spotlightOpacity);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(spotlightOpacity);
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
            className={cn("relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45 backdrop-blur-sm transition-colors duration-300 hover:bg-zinc-900/55", className)}
        >
            {!focusMode && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    );
}
