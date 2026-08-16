"use client";

import { useEffect, useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { inputClasses } from "@/components/ui/form-styles";
import { TechStackField } from "@/components/editor/tech-stack-field";

export default function NewProjectPage() {
    const router = useRouter();
    const addProject = useDevJournalStore((state) => state.addProject);
    const [isHydrated, setIsHydrated] = useState(false);
    const [nameError, setNameError] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        techStack: [] as string[],
        repositoryLink: "",
        status: "in-progress" as "in-progress" | "shipped",
    });

    useEffect(() => setIsHydrated(true), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setNameError(true);
            return;
        }

        const project = addProject(formData);
        router.push(`/editor/projects/${project.id}`);
    };

    return (
        <div className="max-w-measure">
            <header className="masthead-block rule-oxford mb-10">
                <h1 className="masthead-title text-text-primary">New Project</h1>
                <p className="mt-2 text-ui text-text-secondary">
                    Open a fresh section of the journal.
                </p>
            </header>

            <form onSubmit={handleSubmit} aria-busy={!isHydrated} noValidate>
                <fieldset disabled={!isHydrated} className="space-y-7 border-0 p-0">
                <div>
                    <label htmlFor="project-name" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                        Name <span className="text-accent">*</span>
                    </label>
                    <input
                        id="project-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (e.target.value.trim()) setNameError(false);
                        }}
                        className={cn(inputClasses, "font-serif text-subtitle")}
                        placeholder="e.g. My Awesome App"
                        aria-invalid={nameError}
                        aria-describedby={nameError ? "project-name-error" : undefined}
                        required
                    />
                    {nameError ? (
                        <p id="project-name-error" className="mt-2 text-ui text-destructive">
                            Give the project a name to continue.
                        </p>
                    ) : null}
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

                <TechStackField
                    value={formData.techStack}
                    onChange={(techStack) => setFormData({ ...formData, techStack })}
                />

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
                        className={cn(inputClasses, "font-mono")}
                        placeholder="https://github.com/..."
                    />
                </div>

                <div>
                    <p className="mb-2 font-mono text-label uppercase text-text-secondary">Status</p>
                    <div className="flex gap-2" role="group" aria-label="Status">
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
                        className="m3-button-filled control-target font-sans text-label"
                    >
                        Create Project
                    </button>
                    <Link
                        href="/editor"
                        className="m3-button-outlined control-target font-sans text-label"
                    >
                        Cancel
                    </Link>
                </div>
                </fieldset>
            </form>
        </div>
    );
}
