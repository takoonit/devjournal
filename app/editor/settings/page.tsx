"use client";

import { useState, useEffect, useRef } from "react";
import { useDevJournalStore, type UiPreferences } from "@/lib/store";
import Link from "next/link";
import { ExportImportSection } from "@/components/settings/export-import-section";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { PublishingSection } from "@/components/settings/publishing-section";
import { requestPublishingAction } from "@/lib/publishing/client";

const inputClasses =
    "field-target w-full rounded-md border border-surface-border bg-surface-input px-3.5 py-2.5 text-ui text-text-primary transition-colors duration-subtle";

interface ToggleOption<T extends string> {
    value: T;
    label: string;
}

function ToggleGroup<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: ToggleOption<T>[];
    onChange: (value: T) => void;
}) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule/10 py-4">
            <span className="font-mono text-label uppercase text-text-secondary">{label}</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
                {options.map((option) => {
                    const active = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "control-target stamp stamp-control",
                                active
                                    ? "stamp-pressed text-text-primary"
                                    : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const user = useDevJournalStore((state) => state.user);
    const updateUser = useDevJournalStore((state) => state.updateUser);
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);
    const updateUiPreferences = useDevJournalStore((state) => state.updateUiPreferences);
    const allEntries = useDevJournalStore((state) => state.entries);

    const [formData, setFormData] = useState(user);
    const [uiFormData, setUiFormData] = useState<UiPreferences>(uiPreferences);
    const profileDirtyRef = useRef(false);
    const preferencesDirtyRef = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (!profileDirtyRef.current) {
            setFormData(user);
        }
    }, [user]);

    useEffect(() => {
        if (!preferencesDirtyRef.current) {
            setUiFormData(uiPreferences);
        }
    }, [uiPreferences]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        if (profileDirtyRef.current && allEntries.some((entry) => entry.isPublic)) {
            const result = await requestPublishingAction({ type: "sync-profile", profile: formData });
            if (!result.ok) {
                setIsSaving(false);
                addToast({ message: result.message, type: "error" });
                return;
            }
        }
        updateUser(formData);
        updateUiPreferences(uiFormData);
        profileDirtyRef.current = false;
        preferencesDirtyRef.current = false;
        setIsSaving(false);
        addToast({ message: "Settings saved.", type: "success" });
    };

    const updatePreference = <K extends keyof UiPreferences>(key: K, value: UiPreferences[K]) => {
        preferencesDirtyRef.current = true;
        setUiFormData((prev) => ({ ...prev, [key]: value }));
    };

    const openSettingsChapter = (id: string) => {
        const chapter = document.getElementById(id);
        if (!(chapter instanceof HTMLDetailsElement)) return;
        chapter.open = true;
        window.requestAnimationFrame(() => chapter.querySelector("summary")?.focus());
    };

    const socialFields: Array<{ key: keyof typeof formData.socialLinks; label: string; type: string; placeholder: string }> = [
        { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/username" },
        { key: "twitter", label: "Twitter / X", type: "url", placeholder: "https://twitter.com/username" },
        { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/username" },
        { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
    ];

    return (
        <div className="max-w-page">
            <div className="max-w-measure">
                <header className="colophon-header mb-8">
                    <h1 className="text-display text-text-primary">Colophon</h1>
                    <p className="mt-2 text-ui text-text-secondary">
                        Who you are, how the journal is set, and what leaves this browser.
                    </p>
                </header>

                <nav className="settings-chapter-index mb-10" aria-label="Settings chapters">
                    <a href="#profile" onClick={() => openSettingsChapter("profile")} className="control-target justify-start">Profile</a>
                    <a href="#publishing" onClick={() => openSettingsChapter("publishing")} className="control-target justify-start">Publishing</a>
                    <a href="#composition" onClick={() => openSettingsChapter("composition")} className="control-target justify-start">Composition</a>
                    <a href="#links" onClick={() => openSettingsChapter("links")} className="control-target justify-start">Links</a>
                    <a href="#data-portability" onClick={() => openSettingsChapter("data-portability")} className="control-target justify-start">Data portability</a>
                </nav>

                <form onSubmit={handleSubmit} className="space-y-3">
                <details open id="profile" className="settings-disclosure">
                    <summary>Profile</summary>
                    <div className="space-y-6 px-1 pb-8 pt-4">
                        <div>
                            <label htmlFor="settings-name" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                                Full Name
                            </label>
                            <input
                                id="settings-name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => { profileDirtyRef.current = true; setFormData({ ...formData, name: e.target.value }); }}
                                className={cn(inputClasses, "font-serif text-subtitle")}
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="settings-role" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                                Role / Title
                            </label>
                            <input
                                id="settings-role"
                                type="text"
                                value={formData.role}
                                onChange={(e) => { profileDirtyRef.current = true; setFormData({ ...formData, role: e.target.value }); }}
                                className={inputClasses}
                                placeholder="e.g., Software Engineer"
                            />
                        </div>

                        <div>
                            <label htmlFor="settings-bio" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                                Bio
                            </label>
                            <textarea
                                id="settings-bio"
                                value={formData.bio}
                                onChange={(e) => { profileDirtyRef.current = true; setFormData({ ...formData, bio: e.target.value }); }}
                                rows={3}
                                className={cn(inputClasses, "resize-none")}
                                placeholder="A few lines about you and what you build..."
                            />
                        </div>
                    </div>
                </details>

                <details open id="publishing" className="settings-disclosure">
                    <summary>Publishing</summary>
                    <div className="px-1 pb-8 pt-4">
                        <PublishingSection />
                    </div>
                </details>

                <details id="composition" className="settings-disclosure">
                    <summary>Composition</summary>
                    <div className="px-1 pb-8 pt-2">
                    <ToggleGroup
                        label="Theme"
                        value={uiFormData.themeMode}
                        options={[
                            { value: "press", label: "Press Proof" },
                            { value: "ink", label: "Midnight Ink" },
                        ]}
                        onChange={(value) => updatePreference("themeMode", value)}
                    />
                    <ToggleGroup
                        label="Density"
                        value={uiFormData.density}
                        options={[
                            { value: "cozy", label: "Cozy" },
                            { value: "compact", label: "Compact" },
                        ]}
                        onChange={(value) => updatePreference("density", value)}
                    />
                    <ToggleGroup
                        label="Motion"
                        value={uiFormData.motionLevel}
                        options={[
                            { value: "reduced", label: "Reduced" },
                            { value: "standard", label: "Standard" },
                            { value: "expressive", label: "Expressive" },
                        ]}
                        onChange={(value) => updatePreference("motionLevel", value)}
                    />
                    <ToggleGroup
                        label="Encouragement"
                        value={uiFormData.rewardIntensity}
                        options={[
                            { value: "off", label: "Off" },
                            { value: "subtle", label: "Subtle" },
                            { value: "full", label: "Full" },
                        ]}
                        onChange={(value) => updatePreference("rewardIntensity", value)}
                    />
                    <ToggleGroup
                        label="Focus Mode"
                        value={uiFormData.focusMode ? "on" : "off"}
                        options={[
                            { value: "off", label: "Off" },
                            { value: "on", label: "On" },
                        ]}
                        onChange={(value) => updatePreference("focusMode", value === "on")}
                    />
                    <p className="mt-3 text-ui italic text-text-muted">
                        Focus mode quiets the chrome and leaves ink on the page.
                    </p>
                    </div>
                </details>

                <details id="links" className="settings-disclosure">
                    <summary>Links</summary>
                    <div className="space-y-6 px-1 pb-8 pt-4">
                        {socialFields.map((field) => (
                            <div key={field.key}>
                                <label htmlFor={`settings-${field.key}`} className="mb-2 block font-mono text-label uppercase text-text-secondary">
                                    {field.label}
                                </label>
                                <input
                                    id={`settings-${field.key}`}
                                    type={field.type}
                                    value={formData.socialLinks[field.key] || ""}
                                    onChange={(e) => {
                                        profileDirtyRef.current = true;
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, [field.key]: e.target.value },
                                        });
                                    }}
                                    className={cn(inputClasses, "font-mono text-meta")}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </details>

                <div className="flex items-center justify-between gap-4 border-t border-rule/15 pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="control-target rounded bg-accent px-5 py-2.5 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                    >
                        {isSaving ? "Saving…" : "Save Changes"}
                    </button>
                    <Link href="/portfolio" target="_blank" className="control-target link-ink justify-start font-mono text-meta">
                        Preview your public portfolio
                        <ArrowUpRight className="ml-1.5 h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                </div>
                </form>
                <details id="data-portability" className="settings-disclosure mt-3">
                    <summary>Data portability</summary>
                    <div className="px-1 pb-8 pt-4">
                        <ExportImportSection />
                    </div>
                </details>
            </div>
        </div>
    );
}
