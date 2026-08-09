"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";

/**
 * Reader-facing theme switch: the person reading a portfolio didn't choose
 * the author's theme, so the masthead offers Press Proof / Midnight Ink.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
    const themeMode = useDevJournalStore((state) => state.uiPreferences.themeMode);
    const updateUiPreferences = useDevJournalStore((state) => state.updateUiPreferences);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const ink = mounted && themeMode === "ink";
    const nextLabel = ink ? "Press Proof" : "Midnight Ink";
    const Icon = ink ? Sun : Moon;

    return (
        <button
            type="button"
            onClick={() => updateUiPreferences({ themeMode: ink ? "press" : "ink" })}
            className={`inline-flex items-center gap-2 font-mono text-label uppercase text-text-muted transition-colors duration-subtle hover:text-accent ${className}`}
            aria-label={`Switch to ${nextLabel}`}
        >
            <Icon className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            {nextLabel}
        </button>
    );
}
