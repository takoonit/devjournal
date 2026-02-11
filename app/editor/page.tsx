"use client";

import { useDevJournalStore } from "@/lib/store";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Plus } from "lucide-react";
import Link from "next/link";
import RotatingText from "@/components/reactbits/rotating-text";
import ShinyText from "@/components/reactbits/shiny-text";

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
                    <div className="text-zinc-500 mb-2 flex items-center justify-center gap-2">
                        <span>Start by</span>
                        <RotatingText
                            texts={["documenting a decision", "logging a bug fix", "capturing an idea", "celebrating a win"]}
                            mainClassName="text-cyan-400 font-medium overflow-hidden h-6"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            rotationInterval={3000}
                        />
                    </div>
                    <p className="text-zinc-600 text-sm mb-6">Create a project to begin your build journal.</p>
                    <Link
                        href="/editor/projects/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                    >
                        <Plus className="w-5 h-5 text-cyan-400" />
                        <ShinyText text="Create your first project" className="text-cyan-400 font-medium" speed={3} />
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
