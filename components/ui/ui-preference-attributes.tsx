"use client";

import { useEffect } from "react";
import { useDevJournalStore } from "@/lib/store";

/**
 * Applies UI preference values from the global store to the document root and body as data attributes.
 *
 * Sets `themeMode`, `focusMode`, `density`, `rewardIntensity`, and `motionLevel` on both `document.documentElement` and `document.body` whenever the stored preferences change.
 *
 * @returns `null` — the component renders nothing.
 */
export function UiPreferenceAttributes() {
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        root.dataset.themeMode = uiPreferences.themeMode;
        root.dataset.focusMode = String(uiPreferences.focusMode);
        root.dataset.density = uiPreferences.density;
        root.dataset.rewardIntensity = uiPreferences.rewardIntensity;
        root.dataset.motionLevel = uiPreferences.motionLevel;

        body.dataset.themeMode = uiPreferences.themeMode;
        body.dataset.focusMode = String(uiPreferences.focusMode);
        body.dataset.density = uiPreferences.density;
        body.dataset.rewardIntensity = uiPreferences.rewardIntensity;
        body.dataset.motionLevel = uiPreferences.motionLevel;

    }, [uiPreferences]);

    return null;
}