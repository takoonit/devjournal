"use client";

import { useState, useEffect, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";
import { Project } from "@/lib/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses } from "@/components/ui/form-styles";
import { TechStackField } from "@/components/editor/tech-stack-field";
import { requestPublishingAction } from "@/lib/publishing/client";
import { useToast } from "@/components/ui/toast";

interface EditProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
    const updateProject = useDevJournalStore((state) => state.updateProject);
    const entries = useDevJournalStore((state) => state.entries);
    const { addToast } = useToast();
    const modalRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);

    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [techStack, setTechStack] = useState(project.techStack);
    const [status, setStatus] = useState<"in-progress" | "shipped">(project.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setName(project.name);
            setDescription(project.description);
            setTechStack(project.techStack);
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
                onCloseRef.current();
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
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedProject: Project = {
            ...project,
            name: name.trim(),
            description: description.trim(),
            techStack,
            status,
            updatedAt: new Date().toISOString(),
        };
        const hasPublicEntry = entries.some((entry) => entry.projectId === project.id && entry.isPublic);

        if (hasPublicEntry) {
            const result = await requestPublishingAction({ type: "sync-project", project: updatedProject });
            if (!result.ok) {
                setIsSubmitting(false);
                addToast({ message: result.message, type: "error" });
                return;
            }
        }

        updateProject(project.id, updatedProject);
        setIsSubmitting(false);
        addToast({ message: "Project updated.", type: "success" });
        onClose();
    };

    return (
        <div
            className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-scrim/45"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={modalRef}
                className="modal-frame sheet w-full max-w-md"
                role="dialog"
                aria-modal="true"
                aria-label="Edit project"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-rule/15 px-7 py-5">
                    <h2 className="font-mono text-label uppercase text-text-secondary">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="control-target -mr-3 text-text-muted transition-colors duration-subtle hover:text-text-primary"
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

                    <TechStackField id="edit-project-tech" value={techStack} onChange={setTechStack} />

                    <div>
                        <p className="mb-2 font-mono text-label uppercase text-text-secondary">Status</p>
                        <div className="flex gap-2" role="group" aria-label="Status">
                            <button
                                type="button"
                                onClick={() => setStatus("in-progress")}
                                aria-pressed={status === "in-progress"}
                                className={cn(
                                    "control-target stamp stamp-control",
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
                                    "control-target stamp stamp-control",
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
                            className="control-target rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="control-target rounded bg-accent px-4 py-2 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                        >
                            {isSubmitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
