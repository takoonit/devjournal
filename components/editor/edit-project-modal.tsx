"use client";

import { useState, useEffect } from "react";
import { useDevJournalStore } from "@/lib/store";
import { Project } from "@/lib/types";
import { X, Save } from "lucide-react";

interface EditProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
    const updateProject = useDevJournalStore((state) => state.updateProject);

    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [techStack, setTechStack] = useState(project.techStack.join(", "));
    const [status, setStatus] = useState<"in-progress" | "shipped">(project.status);

    useEffect(() => {
        if (isOpen) {
            setName(project.name);
            setDescription(project.description);
            setTechStack(project.techStack.join(", "));
            setStatus(project.status);
        }
    }, [isOpen, project]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const techArray = Array.from(new Set(
            techStack
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t !== "")
        ));

        updateProject(project.id, {
            name,
            description,
            techStack: techArray,
            status,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div
                className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-100">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Project Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all"
                            placeholder="e.g. My Awesome Project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Description
                        </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all resize-none"
                            placeholder="Short summary of the project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Tech Stack (comma separated)
                        </label>
                        <input
                            type="text"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all"
                            placeholder="e.g. React, Next.js, Tailwind"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Status
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setStatus("in-progress")}
                                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${status === "in-progress"
                                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                    }`}
                            >
                                In Progress
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("shipped")}
                                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${status === "shipped"
                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                    }`}
                            >
                                Shipped
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-cyan-500/20"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
