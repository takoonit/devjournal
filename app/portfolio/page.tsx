"use client";

import { useMemo } from "react";
import { useDevJournalStore } from "@/lib/store";
import { BioSidebar } from "@/components/portfolio/bio-sidebar";
import { ProjectCard } from "@/components/portfolio/project-card";
import BlurText from "@/components/reactbits/blur-text";
import ShinyText from "@/components/reactbits/shiny-text";
import CountUp from "@/components/reactbits/count-up";
import ScrollReveal from "@/components/reactbits/scroll-reveal";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
                <Breadcrumbs items={[{ label: "Portfolio" }]} />
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Bio Sidebar */}
                    <BioSidebar />

                    {/* Projects Grid */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <BlurText
                                text="Projects"
                                className="text-3xl font-bold text-zinc-100 mb-2"
                                delay={100}
                                animateBy="letters"
                            />
                            <p className="text-zinc-400">
                                Build logs documenting the development process.
                                {projects.length > 0 && (
                                    <span className="ml-2 text-cyan-400 font-mono">
                                        <CountUp to={projects.length} duration={1.5} /> active
                                    </span>
                                )}
                            </p>
                        </div>

                        {projects.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 py-20 text-center">
                                <p className="text-zinc-500 mb-4">No public projects yet.</p>
                                <p className="text-sm text-zinc-600 mb-6">
                                    Start documenting your journey in the editor.
                                </p>
                                <Link
                                    href="/editor"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                                >
                                    <ShinyText text="Open Editor" className="text-cyan-400 font-medium" speed={3} />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project, index) => (
                                    <ScrollReveal key={project.id} delay={index * 0.1}>
                                        <ProjectCard
                                            project={project}
                                            href={`/portfolio/${project.slug}`}
                                        />
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
