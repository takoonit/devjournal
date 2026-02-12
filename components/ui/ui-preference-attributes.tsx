"use client";

import { useEffect } from "react";
import { useDevJournalStore } from "@/lib/store";

export function UiPreferenceAttributes() {
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.themeMode = uiPreferences.themeMode;
        root.dataset.focusMode = String(uiPreferences.focusMode);
        root.dataset.density = uiPreferences.density;
        root.dataset.rewardIntensity = uiPreferences.rewardIntensity;
        root.dataset.motionLevel = uiPreferences.motionLevel;


    }, [uiPreferences]);

    return null;
}
