"use client";

import { useState, useEffect, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";
import { Project } from "@/lib/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const inputClasses =
    "w-full rounded-md border border-surface-border bg-surface-raised px-3.5 py-2.5 text-ui text-text-primary transition-colors duration-subtle";

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
    const updateProject = useDevJournalStore((state) => state.updateProject);
    const modalRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!isOpen) return;
        const modal = modalRef.current;
        if (!modal) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusable = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) focusable[0].focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab" || focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        modal.addEventListener("keydown", handleKeyDown);
        return () => {
            modal.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [isOpen, onClose]);

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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/45 p-4"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={modalRef}
                className="sheet w-full max-w-md overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Edit project"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-rule/15 px-7 py-5">
                    <h2 className="font-mono text-label uppercase text-text-secondary">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted transition-colors duration-subtle hover:text-text-primary"
                        aria-label="Close dialog"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
                    <div>
                        <label htmlFor="edit-project-name" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                            Name
                        </label>
                        <input
                            id="edit-project-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(inputClasses, "font-serif text-subtitle")}
                            placeholder="e.g. My Awesome Project"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-project-description" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                            Description
                        </label>
                        <textarea
                            id="edit-project-description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className={cn(inputClasses, "resize-none")}
                            placeholder="Short summary of the project..."
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-project-tech" className="mb-2 block font-mono text-label uppercase text-text-secondary">
                            Tech Stack <span className="normal-case tracking-normal text-text-muted">(comma separated)</span>
                        </label>
                        <input
                            id="edit-project-tech"
                            type="text"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            className={cn(inputClasses, "font-mono text-meta")}
                            placeholder="e.g. React, Next.js, Tailwind"
                        />
                    </div>

                    <div>
                        <p className="mb-2 font-mono text-label uppercase text-text-secondary">Status</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus("in-progress")}
                                aria-pressed={status === "in-progress"}
                                className={cn(
                                    "stamp",
                                    status === "in-progress"
                                        ? "stamp-pressed text-text-primary"
                                        : "text-text-muted hover:text-text-secondary"
                                )}
                            >
                                In Progress
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("shipped")}
                                aria-pressed={status === "shipped"}
                                className={cn(
                                    "stamp",
                                    status === "shipped"
                                        ? "stamp-pressed text-positive"
                                        : "text-text-muted hover:text-text-secondary"
                                )}
                            >
                                Shipped
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-rule/15 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-accent px-4 py-2 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
