"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";

/**
 * Reader-facing Material light and dark scheme switch.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
    const themeMode = useDevJournalStore((state) => state.uiPreferences.themeMode);
    const updateUiPreferences = useDevJournalStore((state) => state.updateUiPreferences);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const ink = mounted && themeMode === "ink";
    const nextLabel = ink ? "Light" : "Dark";
    const Icon = ink ? Sun : Moon;

    return (
        <button
            type="button"
            onClick={() => updateUiPreferences({ themeMode: ink ? "press" : "ink" })}
            className={`m3-button-tonal control-target justify-start gap-2 font-sans text-label ${className}`}
            aria-label={ink ? "Switch to Light" : "Switch to Dark"}
        >
            <Icon className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            {nextLabel}
        </button>
    );
}
