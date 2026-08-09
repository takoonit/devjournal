"use client";

import { useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inputClasses =
    "field-target w-full rounded-md border border-surface-border bg-surface-raised px-3.5 py-2.5 text-ui text-text-primary transition-colors duration-subtle";

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
    const [techInput, setTechInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        addProject(formData);
        router.push("/editor");
    };

    const addTech = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData({
                ...formData,
                techStack: [...formData.techStack, techInput.trim()],
            });
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter((t) => t !== tech),
        });
    };

    return (
        <div className="max-w-measure">
            <header className="masthead-block rule-oxford mb-10">
                <h1 className="masthead-title text-text-primary">New Project</h1>
                <p className="mt-2 text-ui text-text-secondary">
                    Open a fresh section of the journal.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                    <label htmlFor="project-name" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                        Name <span className="text-accent">*</span>
                    </label>
                    <input
                        id="project-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(inputClasses, "font-serif text-subtitle")}
                        placeholder="e.g. My Awesome App"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="project-description" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                        Description
                    </label>
                    <textarea
                        id="project-description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className={cn(inputClasses, "resize-none")}
                        placeholder="What is this project, in a sentence or two?"
                    />
                </div>

                <div>
                    <label htmlFor="project-tech" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                        Tech Stack
                    </label>
                    <div className="mb-3 flex gap-2">
                        <input
                            id="project-tech"
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTech();
                                }
                            }}
                            className={cn(inputClasses, "flex-1 font-mono text-meta")}
                            placeholder="e.g. React, TypeScript, Next.js"
                        />
                        <button
                            type="button"
                            onClick={addTech}
                            className="control-target rounded-md border border-surface-border px-3.5 text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                            aria-label="Add technology"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                    </div>
                    {formData.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.techStack.map((tech, index) => (
                                <span
                                    key={`${tech}-${index}`}
                                    className="inline-flex items-center gap-2 rounded border border-surface-border px-2.5 py-1 font-mono text-meta text-text-secondary"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => removeTech(tech)}
                                        className="control-target -my-2 -mr-2 text-text-muted transition-colors duration-subtle hover:text-destructive"
                                        aria-label={`Remove ${tech}`}
                                    >
                                        <X className="h-3 w-3" strokeWidth={1.5} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="project-repo" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                        Repository Link
                    </label>
                    <input
                        id="project-repo"
                        type="url"
                        value={formData.repositoryLink}
                        onChange={(e) =>
                            setFormData({ ...formData, repositoryLink: e.target.value })
                        }
                        className={cn(inputClasses, "font-mono text-meta")}
                        placeholder="https://github.com/..."
                    />
                </div>

                <div>
                    <p className="mb-2 font-mono text-label uppercase text-text-secondary">Status</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: "in-progress" })}
                            aria-pressed={formData.status === "in-progress"}
                            className={cn(
                                "control-target stamp stamp-control",
                                formData.status === "in-progress"
                                    ? "stamp-pressed text-text-primary"
                                    : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            In Progress
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: "shipped" })}
                            aria-pressed={formData.status === "shipped"}
                            className={cn(
                                "control-target stamp stamp-control",
                                formData.status === "shipped"
                                    ? "stamp-pressed text-positive"
                                    : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            Shipped
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t border-rule/15 pt-7">
                    <button
                        type="submit"
                        className="control-target rounded bg-accent px-5 py-2.5 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                    >
                        Create Project
                    </button>
                    <Link
                        href="/editor"
                        className="control-target rounded border border-surface-border px-5 py-2.5 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
