"use client";

import { useState, useEffect } from "react";
import { useDevJournalStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const user = useDevJournalStore((state) => state.user);
    const updateUser = useDevJournalStore((state) => state.updateUser);

    const [formData, setFormData] = useState(user);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl">
            <Link
                href="/editor"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to editor
            </Link>

            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Settings</h1>
            <p className="text-zinc-400 mb-8">
                Configure your public portfolio profile.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="Your Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Role / Title
                    </label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="e.g., Software Engineer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                        placeholder="Brief bio about you..."
                    />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-4">Social Links</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                GitHub
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.github || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                placeholder="https://twitter.com/username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.socialLinks.email || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, email: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                    {saved && (
                        <span className="text-sm text-emerald-400">✓ Saved!</span>
                    )}
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-800">
                <Link
                    href="/portfolio"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                    Preview your public portfolio →
                </Link>
            </div>

            <ExportImportSection />
        </div>
    );
}

import { ExportImportSection } from "@/components/settings/export-import-section";
