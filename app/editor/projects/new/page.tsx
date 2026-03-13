"use client";

import { useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BlurText from "@/components/reactbits/blur-text";
import ShinyText from "@/components/reactbits/shiny-text";
import { TechStackInput } from "@/components/editor/tech-stack-input";

export default function NewProjectPage() {
    const router = useRouter();
    const addProject = useDevJournalStore((state) => state.addProject);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        techStack: [] as string[],
        repositoryLink: "",
        status: "in-progress" as "in-progress" | "shipped",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        addProject(formData);
        router.push("/editor");
    };

    return (
        <div className="max-w-3xl">
            <Link
                href="/editor"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to editor
            </Link>

            <h1 className="text-3xl font-bold text-zinc-100 mb-8">
                <BlurText
                    text="New Project"
                    delay={80}
                    animateBy="letters"
                />
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Project Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-400 transition-colors"
                        placeholder="e.g., My Awesome App"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-400 transition-colors resize-none"
                        placeholder="Brief description of your project..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Tech Stack
                    </label>
                    <TechStackInput
                        value={formData.techStack}
                        onChange={(newStack) => setFormData({ ...formData, techStack: newStack })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Repository Link
                    </label>
                    <input
                        type="url"
                        value={formData.repositoryLink}
                        onChange={(e) =>
                            setFormData({ ...formData, repositoryLink: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-400 transition-colors"
                        placeholder="https://github.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Status
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="in-progress"
                                checked={formData.status === "in-progress"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value as "in-progress",
                                    })
                                }
                                className="text-brand-400 focus:ring-brand-400"
                            />
                            <span className="text-sm text-zinc-300">In Progress</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="shipped"
                                checked={formData.status === "shipped"}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value as "shipped" })
                                }
                                className="text-brand-400 focus:ring-brand-400"
                            />
                            <span className="text-sm text-zinc-300">Shipped</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-brand-500/10 border border-brand-500/30 rounded-lg hover:bg-brand-500/20 transition-colors font-medium"
                    >
                        <ShinyText text="Create Project" className="text-brand-400" speed={3} />
                    </button>
                    <Link
                        href="/editor"
                        className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
