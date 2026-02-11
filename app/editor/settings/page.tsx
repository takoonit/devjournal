"use client";

import { useState, useEffect } from "react";
import { useDevJournalStore, type UiPreferences } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExportImportSection } from "@/components/settings/export-import-section";

export default function SettingsPage() {
    const user = useDevJournalStore((state) => state.user);
    const updateUser = useDevJournalStore((state) => state.updateUser);
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);
    const updateUiPreferences = useDevJournalStore((state) => state.updateUiPreferences);

    const [formData, setFormData] = useState(user);
    const [uiFormData, setUiFormData] = useState<UiPreferences>(uiPreferences);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    useEffect(() => {
        setUiFormData(uiPreferences);
    }, [uiPreferences]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        updateUiPreferences(uiFormData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updatePreference = <K extends keyof UiPreferences>(key: K, value: UiPreferences[K]) => {
        setUiFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-3xl">
            <Link
                href="/editor"
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-cyan-400"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to editor
            </Link>

            <h1 className="mb-2 text-3xl font-bold text-zinc-100">Settings</h1>
            <p className="mb-8 text-zinc-400">
                Configure your public portfolio profile and editor experience.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                        placeholder="Your Name"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Role / Title</label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                        placeholder="e.g., Software Engineer"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                        placeholder="Brief bio about you..."
                    />
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    <h3 className="mb-4 text-lg font-semibold text-zinc-300">UI Preferences</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm text-zinc-300">
                            Theme Mode
                            <select
                                value={uiFormData.themeMode}
                                onChange={(e) => updatePreference("themeMode", e.target.value as UiPreferences["themeMode"])}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-zinc-100"
                            >
                                <option value="noir">Noir</option>
                                <option value="calm-focus">Calm Focus</option>
                            </select>
                        </label>

                        <label className="text-sm text-zinc-300">
                            Density
                            <select
                                value={uiFormData.density}
                                onChange={(e) => updatePreference("density", e.target.value as UiPreferences["density"])}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-zinc-100"
                            >
                                <option value="cozy">Cozy</option>
                                <option value="compact">Compact</option>
                            </select>
                        </label>

                        <label className="text-sm text-zinc-300">
                            Reward Intensity
                            <select
                                value={uiFormData.rewardIntensity}
                                onChange={(e) => updatePreference("rewardIntensity", e.target.value as UiPreferences["rewardIntensity"])}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-zinc-100"
                            >
                                <option value="off">Off</option>
                                <option value="subtle">Subtle</option>
                                <option value="full">Full</option>
                            </select>
                        </label>

                        <label className="text-sm text-zinc-300">
                            Motion Level
                            <select
                                value={uiFormData.motionLevel}
                                onChange={(e) => updatePreference("motionLevel", e.target.value as UiPreferences["motionLevel"])}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-zinc-100"
                            >
                                <option value="reduced">Reduced</option>
                                <option value="standard">Standard</option>
                            </select>
                        </label>
                    </div>

                    <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
                        <input
                            type="checkbox"
                            checked={uiFormData.focusMode}
                            onChange={(e) => updatePreference("focusMode", e.target.checked)}
                            className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-cyan-400"
                        />
                        Focus Mode (reduce decorative effects)
                    </label>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    <h3 className="mb-4 text-lg font-semibold text-zinc-300">Social Links</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">GitHub</label>
                            <input
                                type="url"
                                value={formData.socialLinks.github || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                                    })
                                }
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Twitter / X</label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                                    })
                                }
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                                placeholder="https://twitter.com/username"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">LinkedIn</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                                    })
                                }
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
                            <input
                                type="email"
                                value={formData.socialLinks.email || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, email: e.target.value },
                                    })
                                }
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-cyan-400 focus:outline-none"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
                    >
                        Save Changes
                    </button>
                    {saved && <span className="text-sm text-emerald-400">✓ Saved!</span>}
                </div>
            </form>

            <div className="mt-8 border-t border-zinc-800 pt-8">
                <Link
                    href="/portfolio"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                >
                    Preview your public portfolio →
                </Link>
            </div>

            <ExportImportSection />
        </div>
    );
}
