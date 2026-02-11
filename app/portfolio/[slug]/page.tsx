"use client";

import { use, useMemo } from "react";
import { useDevJournalStore } from "@/lib/store";
import { BioSidebar } from "@/components/portfolio/bio-sidebar";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { groupEntriesByYearMonth } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import BlurText from "@/components/reactbits/blur-text";
import ScrollReveal from "@/components/reactbits/scroll-reveal";

/**
 * Renders the detailed project page including header, tech stack, repository link, and a timeline of public entries grouped by year and month.
 *
 * @param params - A promise that resolves to an object containing the route `slug` for the target project.
 * @returns The React element tree for the project detail view.
 *
 * @remarks
 * If no project matches the provided `slug`, this component invokes `notFound()` to trigger a 404 response.
 */
export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);

    // Get store state
    const projects = useDevJournalStore((state) => state.projects);
    const allEntries = useDevJournalStore((state) => state.entries);

    // Memoize derived data
    const project = useMemo(() => projects.find((p) => p.slug === slug), [projects, slug]);
    const entries = useMemo(
        () => {
            if (!project) return [];
            return allEntries
                .filter((e) => e.projectId === project.id && e.isPublic)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        [allEntries, project]
    );

    if (!project) {
        notFound();
    }

    const groupedEntries = groupEntriesByYearMonth(entries);
    const years = Object.keys(groupedEntries).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Bio Sidebar */}
                    <BioSidebar />

                    {/* Build Log */}
                    <div className="flex-1">
                        <Breadcrumbs items={[{ label: "Portfolio", href: "/portfolio" }, { label: project.name }]} />
                        {/* Back Button */}
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to projects
                        </Link>

                        {/* Project Header */}
                        <div className="mb-12">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <BlurText
                                        text={project.name}
                                        className="text-4xl font-bold text-zinc-100 mb-2"
                                        delay={80}
                                        animateBy="letters"
                                    />
                                    <p className="text-zinc-400 text-lg">{project.description}</p>
                                </div>
                                {project.repositoryLink && (
                                    <a
                                        href={project.repositoryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-sm"
                                    >
                                        <span>Repository</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 text-sm rounded bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        {entries.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-zinc-500">No public entries yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {years.map((year) => (
                                    <div key={year}>
                                        <h2 className="text-2xl font-bold text-zinc-100 mb-8 font-mono">
                                            {year}
                                        </h2>
                                        {Object.keys(groupedEntries[year])
                                            .sort((a, b) => {
                                                const monthOrder = [
                                                    "January", "February", "March", "April", "May", "June",
                                                    "July", "August", "September", "October", "November", "December"
                                                ];
                                                return monthOrder.indexOf(b) - monthOrder.indexOf(a);
                                            })
                                            .map((month) => (
                                                <div key={month} className="mb-10">
                                                    <h3 className="text-lg font-semibold text-zinc-300 mb-6">
                                                        {month}
                                                    </h3>
                                                    <div className="space-y-6">
                                                        {groupedEntries[year][month].map((entry, index) => (
                                                            <ScrollReveal key={entry.id} delay={index * 0.08}>
                                                                <TimelineEntry entry={entry} />
                                                            </ScrollReveal>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}