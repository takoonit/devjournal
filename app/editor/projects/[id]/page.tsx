"use client";

import { useState, use, useMemo, useEffect, useRef, useCallback } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff, Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { StatusStamp } from "@/components/ui/stamp";
import { Reveal } from "@/components/ui/reveal";
import { formatDate, groupEntriesByYearMonth } from "@/lib/utils";
import { ProjectActions } from "@/components/editor/project-actions";
import { EditProjectModal } from "@/components/editor/edit-project-modal";
import { useToast } from "@/components/ui/toast";

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);
    const { addToast } = useToast();

    const projects = useDevJournalStore((state) => state.projects);
    const allEntries = useDevJournalStore((state) => state.entries);
    const deleteProject = useDevJournalStore((state) => state.deleteProject);
    const deleteEntry = useDevJournalStore((state) => state.deleteEntry);
    const updateEntry = useDevJournalStore((state) => state.updateEntry);

    const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);
    const entries = useMemo(
        () => allEntries
            .filter((e) => e.projectId === id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [allEntries, id]
    );
    const groupedEntries = useMemo(() => groupEntriesByYearMonth(entries), [entries]);
    const years = useMemo(
        () => Object.keys(groupedEntries).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)),
        [groupedEntries]
    );

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [hasDraft, setHasDraft] = useState(false);

    const deleteModalRef = useRef<HTMLDivElement>(null);
    const entryDeleteModalRef = useRef<HTMLDivElement>(null);

    const trapFocus = useCallback((modalRef: React.RefObject<HTMLDivElement | null>, onClose: () => void) => {
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
            if (e.key !== "Tab") return;
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
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const draftKey = `devjournal-entry-draft-${id}`;
        const rawDraft = localStorage.getItem(draftKey);
        if (!rawDraft) {
            setHasDraft(false);
            return;
        }

        try {
            const parsed = JSON.parse(rawDraft) as { title?: string; content?: string; details?: string };
            const hasMeaningfulDraft = [parsed.title, parsed.content, parsed.details].some((value) => Boolean(value?.trim()));
            setHasDraft(hasMeaningfulDraft);
        } catch {
            setHasDraft(false);
        }
    }, [id]);

    useEffect(() => {
        if (showDeleteConfirm) return trapFocus(deleteModalRef, () => setShowDeleteConfirm(false));
    }, [showDeleteConfirm, trapFocus]);

    useEffect(() => {
        if (entryToDelete) return trapFocus(entryDeleteModalRef, () => setEntryToDelete(null));
    }, [entryToDelete, trapFocus]);

    if (!project) {
        return (
            <div className="max-w-measure">
                <p className="text-ui italic text-text-muted">This project is not on record.</p>
                <p className="mt-4 font-mono text-meta">
                    <Link href="/editor" className="link-ink">Back to the editor</Link>
                </p>
            </div>
        );
    }

    const handleDeleteProject = () => {
        deleteProject(project.id);
        addToast({ message: `"${project.name}" deleted.`, type: "success", copyKey: "project-deleted" });
        router.push("/editor");
    };

    const handleDeleteEntry = () => {
        if (!entryToDelete) return;
        const entry = entries.find((e) => e.id === entryToDelete);
        deleteEntry(entryToDelete);
        addToast({ message: `Entry "${entry?.title || "Untitled"}" deleted.`, type: "success", copyKey: "entry-deleted" });
        setEntryToDelete(null);
    };

    const toggleEntryVisibility = (entryId: string, currentStatus: boolean) => {
        updateEntry(entryId, { isPublic: !currentStatus });
        addToast({
            message: currentStatus ? "Entry set to private." : "Entry set to public.",
            type: "info",
            copyKey: currentStatus ? "entry-private" : "entry-public",
        });
    };

    let entryIndex = 0;

    return (
        <div className="max-w-4xl">
            {/* Project masthead */}
            <header className="rule-oxford mb-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <h1 className="font-serif text-display text-text-primary">{project.name}</h1>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2.5 text-text-muted transition-colors duration-subtle hover:text-accent md:p-2"
                            aria-label="Edit project"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2.5 text-text-muted transition-colors duration-subtle hover:text-destructive md:p-2"
                            aria-label="Delete project"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {project.description ? (
                    <p className="mt-3 max-w-measure text-prose text-text-secondary">{project.description}</p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <StatusStamp status={project.status} />
                    <span className="font-mono text-meta tabular-nums text-text-muted">
                        Opened {formatDate(project.createdAt, "dd MMM yyyy")} · {entries.length}{" "}
                        {entries.length === 1 ? "entry" : "entries"}
                    </span>
                    {project.techStack.length > 0 && (
                        <span className="font-mono text-meta text-text-muted">
                            {project.techStack.join(" · ")}
                        </span>
                    )}
                </div>
            </header>

            {/* Actions row */}
            <div className="mb-14 flex flex-wrap items-center gap-3">
                <Link
                    href={`/editor/projects/${project.id}/entries/new`}
                    className="rounded bg-accent px-5 py-2.5 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                >
                    New Entry
                </Link>
                {hasDraft && (
                    <Link
                        href={`/editor/projects/${project.id}/entries/new`}
                        className="inline-flex items-center gap-2 rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                    >
                        <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                        Resume draft
                    </Link>
                )}
                <ProjectActions projectId={project.id} />
            </div>

            {/* The record */}
            {entries.length === 0 ? (
                <div className="border-y border-rule/15 py-12">
                    <p className="text-subtitle italic text-text-secondary">
                        Nothing on record yet.
                    </p>
                    <p className="mt-3 text-ui text-text-muted">
                        Write the first entry — what you built, broke, or learned today.
                    </p>
                    <p className="mt-6 font-mono text-meta">
                        <Link href={`/editor/projects/${project.id}/entries/new`} className="link-ink">
                            Open a fresh page
                        </Link>
                    </p>
                </div>
            ) : (
                <div className="relative">
                    <div
                        className="margin-rule absolute inset-y-0 hidden md:block"
                        style={{ left: "calc(9.75rem - 0.5px)" }}
                        aria-hidden="true"
                    />

                    {years.map((year) =>
                        Object.keys(groupedEntries[year]).map((month) => (
                            <div key={`${year}-${month}`}>
                                <div className="keyline mb-10 md:ml-[10.5rem]">
                                    <h2>{month} {year}</h2>
                                </div>
                                {groupedEntries[year][month].map((entry) => (
                                    <Reveal key={entry.id} index={entryIndex++}>
                                        <div className="group/actions relative">
                                            <div className="absolute right-0 top-0 z-10 flex items-center gap-0.5 opacity-60 transition-opacity duration-subtle focus-within:opacity-100 md:opacity-0 md:group-hover/actions:opacity-100">
                                                <button
                                                    onClick={() => toggleEntryVisibility(entry.id, entry.isPublic)}
                                                    className="p-2.5 text-text-muted transition-colors duration-subtle hover:text-text-primary md:p-2"
                                                    aria-label={entry.isPublic ? "Set entry to private" : "Set entry to public"}
                                                >
                                                    {entry.isPublic
                                                        ? <Eye className="h-4 w-4" strokeWidth={1.5} />
                                                        : <EyeOff className="h-4 w-4" strokeWidth={1.5} />}
                                                </button>
                                                <Link
                                                    href={`/editor/projects/${project.id}/entries/${entry.id}/edit`}
                                                    className="p-2.5 text-text-muted transition-colors duration-subtle hover:text-accent md:p-2"
                                                    aria-label={`Edit entry: ${entry.title}`}
                                                >
                                                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                                                </Link>
                                                <button
                                                    onClick={() => setEntryToDelete(entry.id)}
                                                    className="p-2.5 text-text-muted transition-colors duration-subtle hover:text-destructive md:p-2"
                                                    aria-label={`Delete entry: ${entry.title}`}
                                                >
                                                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            <TimelineEntry entry={entry} showVisibility />
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Delete Project Modal */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/45 p-4"
                    onClick={() => setShowDeleteConfirm(false)}
                    role="presentation"
                >
                    <div
                        ref={deleteModalRef}
                        className="sheet w-full max-w-md p-7"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-project-title"
                        aria-describedby="delete-project-desc"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="delete-project-title" className="font-mono text-label uppercase text-destructive">
                            Delete Project
                        </h3>
                        <p id="delete-project-desc" className="mt-4 text-ui leading-relaxed text-text-secondary">
                            Strike &ldquo;{project.name}&rdquo; from the record? This also deletes all{" "}
                            {entries.length} {entries.length === 1 ? "entry" : "entries"}. There is no undo.
                        </p>
                        <div className="mt-7 flex justify-end gap-3 border-t border-rule/15 pt-5">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="rounded bg-destructive px-4 py-2 font-mono text-label uppercase text-destructive-contrast transition-colors duration-subtle hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Entry Confirmation Modal */}
            {entryToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/45 p-4"
                    onClick={() => setEntryToDelete(null)}
                    role="presentation"
                >
                    <div
                        ref={entryDeleteModalRef}
                        className="sheet w-full max-w-md p-7"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-entry-title"
                        aria-describedby="delete-entry-desc"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="delete-entry-title" className="font-mono text-label uppercase text-destructive">
                            Delete Entry
                        </h3>
                        <p id="delete-entry-desc" className="mt-4 text-ui leading-relaxed text-text-secondary">
                            Strike this entry from the record? There is no undo.
                        </p>
                        <div className="mt-7 flex justify-end gap-3 border-t border-rule/15 pt-5">
                            <button
                                onClick={() => setEntryToDelete(null)}
                                className="rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEntry}
                                className="rounded bg-destructive px-4 py-2 font-mono text-label uppercase text-destructive-contrast transition-colors duration-subtle hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}
