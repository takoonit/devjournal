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
    spotlightColor = "rgba(6, 182, 212, 0.15)",
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const { focusMode, motionLevel } = useDevJournalStore((state) => state.uiPreferences);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const spotlightOpacity = focusMode
        ? 0
        : motionLevel === "reduced"
          ? 0.3
          : motionLevel === "expressive"
            ? 0.8
            : 0.6;
    const spotlightSize = motionLevel === "reduced" ? 450 : motionLevel === "expressive" ? 680 : 600;

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
            className={cn("relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700", className)}
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
