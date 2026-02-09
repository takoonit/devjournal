"use client";

import { useMemo } from "react";
import { useDevJournalStore } from "@/lib/store";
import { BioSidebar } from "@/components/portfolio/bio-sidebar";
import { ProjectCard } from "@/components/portfolio/project-card";

export default function PortfolioPage() {
    // Get store state
    const allProjects = useDevJournalStore((state) => state.projects);
    const allEntries = useDevJournalStore((state) => state.entries);

    // Memoize public projects
    const projects = useMemo(
        () => allProjects.filter((p) => {
            const publicEntries = allEntries.filter(
                (e) => e.projectId === p.id && e.isPublic
            );
            return publicEntries.length > 0;
        }),
        [allProjects, allEntries]
    );

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Bio Sidebar */}
                    <BioSidebar />

                    {/* Projects Grid */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Projects</h2>
                            <p className="text-zinc-400">
                                Build logs documenting the development process.
                            </p>
                        </div>

                        {projects.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-zinc-500 mb-4">No public projects yet.</p>
                                <p className="text-sm text-zinc-600">
                                    Start documenting your journey in the editor.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        href={`/portfolio/${project.slug}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
