"use client";

import { useDevJournalStore } from "@/lib/store";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
    const projects = useDevJournalStore((state) => state.projects);

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Your Projects</h1>
                <p className="text-zinc-400">
                    Manage your projects and build logs.
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-500 mb-6">No projects yet. Start documenting your journey!</p>
                    <Link
                        href="/editor/projects/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create your first project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            href={`/editor/projects/${project.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
