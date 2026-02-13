"use client";

import { useState, use, useMemo, useEffect, useRef, useCallback } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { formatDate } from "@/lib/utils";
import { ProjectActions } from "@/components/editor/project-actions";
import { EditProjectModal } from "@/components/editor/edit-project-modal";
import { useToast } from "@/components/ui/toast";
import CountUp from "@/components/reactbits/count-up";
import BlurText from "@/components/reactbits/blur-text";
import ShinyText from "@/components/reactbits/shiny-text";
import ScrollReveal from "@/components/reactbits/scroll-reveal";

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);
    const { addToast } = useToast();

    // Get store state and actions
    const projects = useDevJournalStore((state) => state.projects);
    const allEntries = useDevJournalStore((state) => state.entries);
    const deleteProject = useDevJournalStore((state) => state.deleteProject);
    const deleteEntry = useDevJournalStore((state) => state.deleteEntry);
    const updateEntry = useDevJournalStore((state) => state.updateEntry);

    // Memoize derived data to avoid infinite loops
    const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);
    const entries = useMemo(
        () => allEntries
            .filter((e) => e.projectId === id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [allEntries, id]
    );

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [hasDraft, setHasDraft] = useState(false);

    // Focus trap for modals
    const deleteModalRef = useRef<HTMLDivElement>(null);
    const entryDeleteModalRef = useRef<HTMLDivElement>(null);

    const trapFocus = useCallback((modalRef: React.RefObject<HTMLDivElement | null>, onClose: () => void) => {
        const modal = modalRef.current;
        if (!modal) return;
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
        return () => modal.removeEventListener("keydown", handleKeyDown);
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
            <div className="max-w-4xl">
                <p className="text-zinc-500">Project not found.</p>
                <Link href="/editor" className="text-cyan-400 hover:text-cyan-300">
                    Back to editor
                </Link>
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

    return (
        <div className="max-w-5xl">
            <Link
                href="/editor"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to editor
            </Link>

            {/* Project Header */}
            <div className="mb-8 pb-8 border-b border-zinc-800">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <BlurText
                            text={project.name}
                            className="text-3xl font-bold text-zinc-100 mb-2"
                            delay={80}
                            animateBy="letters"
                        />
                        <p className="text-zinc-400">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            aria-label="Edit project"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        <ProjectActions projectId={project.id} />
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Delete project"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, index) => (
                        <span
                            key={`${tech}-${index}`}
                            className="px-3 py-1 text-sm rounded bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>Created {formatDate(project.createdAt)}</span>
                    <span>•</span>
                    <span className={project.status === "shipped" ? "text-emerald-400" : "text-cyan-400"}>
                        {project.status === "shipped" ? "Shipped" : "In Progress"}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                        <CountUp to={entries.length} duration={1} /> {Math.max(entries.length, 1) === 1 ? "entry" : "entries"}
                    </span>
                </div>
            </div>

            {/* New Entry Button */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
                <Link
                    href={`/editor/projects/${project.id}/entries/new`}
                    className="btn-primary px-6 py-3"
                >
                    <Plus className="w-5 h-5" />
                    <ShinyText text="New Entry" speed={3} />
                </Link>
                {hasDraft && (
                    <Link
                        href={`/editor/projects/${project.id}/entries/new`}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Resume draft
                    </Link>
                )}
            </div>

            {/* Entries List */}
            {entries.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-500 mb-4">No entries yet.</p>
                    <Link
                        href={`/editor/projects/${project.id}/entries/new`}
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Create your first entry →
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-zinc-300">Build Log Entries</h2>
                    {entries.map((entry, index) => (
                        <ScrollReveal key={entry.id} delay={Math.min(index * 0.06, 0.6)}>
                        <div
                            className="relative rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 transition-colors hover:border-zinc-700"
                        >
                            {/* Entry Actions — keep in normal flow to avoid border overlap */}
                            <div className="mb-4 flex items-center justify-end gap-1">
                                <button
                                    onClick={() => toggleEntryVisibility(entry.id, entry.isPublic)}
                                    className={`p-2 rounded-lg transition-colors ${entry.isPublic
                                        ? "text-emerald-400 hover:bg-emerald-500/10"
                                        : "text-zinc-500 hover:bg-zinc-800"
                                        }`}
                                    aria-label={entry.isPublic ? "Set entry to private" : "Set entry to public"}
                                >
                                    {entry.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <Link
                                    href={`/editor/projects/${project.id}/entries/${entry.id}/edit`}
                                    className="p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                    aria-label={`Edit entry: ${entry.title}`}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setEntryToDelete(entry.id)}
                                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    aria-label={`Delete entry: ${entry.title}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Entry Content */}
                            <TimelineEntry entry={entry} />
                        </div>
                        </ScrollReveal>
                    ))}
                </div>
            )}

            {/* Delete Project Modal */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowDeleteConfirm(false)}
                    role="presentation"
                >
                    <div
                        ref={deleteModalRef}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-project-title"
                        aria-describedby="delete-project-desc"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="delete-project-title" className="text-xl font-semibold text-zinc-100 mb-2">
                            Delete Project
                        </h3>
                        <p id="delete-project-desc" className="text-zinc-400 mb-6">
                            Are you sure you want to delete &ldquo;{project.name}&rdquo;? This will also delete all {entries.length} {entries.length === 1 ? "entry" : "entries"}. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteProject}
                                className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Entry Confirmation Modal */}
            {entryToDelete && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                    onClick={() => setEntryToDelete(null)}
                    role="presentation"
                >
                    <div
                        ref={entryDeleteModalRef}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-entry-title"
                        aria-describedby="delete-entry-desc"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="delete-entry-title" className="text-xl font-semibold text-zinc-100 mb-2">
                            Delete Entry
                        </h3>
                        <p id="delete-entry-desc" className="text-zinc-400 mb-6">
                            Are you sure you want to delete this entry? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteEntry}
                                className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setEntryToDelete(null)}
                                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors font-medium"
                            >
                                Cancel
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
