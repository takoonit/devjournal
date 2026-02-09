"use client";

import { useState, use, useMemo } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import Link from "next/link";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { formatDate } from "@/lib/utils";
import { ProjectActions } from "@/components/editor/project-actions";
import { EditProjectModal } from "@/components/editor/edit-project-modal";

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);

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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        router.push("/editor");
    };

    const toggleEntryVisibility = (entryId: string, currentStatus: boolean) => {
        updateEntry(entryId, { isPublic: !currentStatus });
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
                        <h1 className="text-3xl font-bold text-zinc-100 mb-2">
                            {project.name}
                        </h1>
                        <p className="text-zinc-400">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="Edit project"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        <ProjectActions projectId={project.id} />
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete project"
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
                </div>
            </div>

            {/* New Entry Button */}
            <div className="mb-8">
                <Link
                    href={`/editor/projects/${project.id}/entries/new`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Entry
                </Link>
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
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-zinc-700 transition-colors group"
                        >
                            {/* Entry Actions */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => toggleEntryVisibility(entry.id, entry.isPublic)}
                                    className={`p-2 rounded-lg transition-colors ${entry.isPublic
                                        ? "text-emerald-400 hover:bg-emerald-500/10"
                                        : "text-zinc-500 hover:bg-zinc-800"
                                        }`}
                                    title={entry.isPublic ? "Public" : "Private"}
                                >
                                    {entry.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Entry Content */}
                            <TimelineEntry entry={entry} />
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Project Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                            Delete Project
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Are you sure you want to delete "{project.name}"? This will also delete all entries. This action cannot be undone.
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

            {/* Edit Project Modal */}
            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}
