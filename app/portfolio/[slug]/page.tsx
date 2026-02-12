import { BioSidebarStatic } from "@/components/portfolio/bio-sidebar-static";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { groupEntriesByYearMonth } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import BlurText from "@/components/reactbits/blur-text";
import ScrollReveal from "@/components/reactbits/scroll-reveal";
import {
    getPublicProjectBySlug,
    getPublicProjectSlugs,
} from "@/lib/supabase/server";

export const revalidate = 150;

export async function generateStaticParams() {
    const slugs = await getPublicProjectSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { project, entries, user } = await getPublicProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const groupedEntries = groupEntriesByYearMonth(entries);
    const years = Object.keys(groupedEntries).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <BioSidebarStatic user={user} />

                    <div className="flex-1">
                        <Breadcrumbs items={[{ label: "Portfolio", href: "/portfolio" }, { label: project.name }]} />
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#ff914d] transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to projects
                        </Link>

                        <div className="mb-12">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-zinc-100 mb-2">
                                        <BlurText text={project.name} delay={80} animateBy="letters" />
                                    </h1>
                                    <p className="text-zinc-400 text-lg">{project.description}</p>
                                </div>
                                {project.repositoryLink && (
                                    <a
                                        href={project.repositoryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:text-[#ff914d] hover:border-[#ff914d]/50 transition-all text-sm"
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

                        {entries.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-zinc-500">No public entries yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {years.map((year) => (
                                    <div key={year}>
                                        <h2 className="text-2xl font-bold text-zinc-100 mb-8 font-mono">{year}</h2>
                                        {Object.keys(groupedEntries[year])
                                            .sort((a, b) => {
                                                const monthOrder = [
                                                    "January",
                                                    "February",
                                                    "March",
                                                    "April",
                                                    "May",
                                                    "June",
                                                    "July",
                                                    "August",
                                                    "September",
                                                    "October",
                                                    "November",
                                                    "December",
                                                ];
                                                return monthOrder.indexOf(b) - monthOrder.indexOf(a);
                                            })
                                            .map((month) => (
                                                <div key={month} className="mb-10">
                                                    <h3 className="text-lg font-semibold text-zinc-300 mb-6">{month}</h3>
                                                    <div className="space-y-6">
                                                        {groupedEntries[year][month].map((entry, index) => (
                                                            <ScrollReveal key={entry.id} delay={Math.min(index * 0.08, 0.5)}>
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
