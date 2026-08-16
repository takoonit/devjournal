import { BioSidebarStatic } from "@/components/portfolio/bio-sidebar-static";
import { EntryTimeline } from "@/components/portfolio/entry-timeline";
import { StatusStamp } from "@/components/ui/stamp";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { notFound } from "next/navigation";
import { getPublicProjectBySlug } from "@/lib/supabase/server";
import { ExternalLink } from "lucide-react";

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

    return (
        <div className="page-frame min-h-screen">
            <div className="portfolio-container mx-auto max-w-page">
                <Breadcrumbs items={[{ label: "Portfolio", href: "/portfolio" }, { label: project.name }]} />
                <div className="portfolio-shell">
                    <BioSidebarStatic user={user} />

                    <main className="min-w-0 flex-1">
                        <header className="m3-hero masthead-block mb-12">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
                                <h1 className="masthead-title print-display max-w-measure text-text-primary print:!text-[2rem] print:!leading-[1.1]">{project.name}</h1>
                                <StatusStamp status={project.status} />
                            </div>

                            {project.description ? (
                                <p className="mt-4 max-w-measure text-prose text-text-secondary">
                                    {project.description}
                                </p>
                            ) : null}

                            <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-meta text-text-muted">
                                {project.techStack.length > 0 && (
                                    <span className="min-w-0">{project.techStack.join(" · ")}</span>
                                )}
                                {project.repositoryLink && (
                                    <a
                                        href={project.repositoryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="control-target link-ink justify-start text-text-secondary"
                                    >
                                        Repository
                                        <ExternalLink className="ml-1.5 h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </header>

                        {entries.length === 0 ? (
                            <div className="border-y border-rule/15 py-16">
                                <p className="text-subtitle italic text-text-secondary">
                                    No entries have been published yet.
                                </p>
                                <p className="mt-3 text-ui text-text-muted">
                                    The record begins with the first public entry.
                                </p>
                            </div>
                        ) : (
                            <EntryTimeline entries={entries} />
                        )}

                        <footer className="mt-24 border-t border-rule/15 pt-5 print-hidden">
                            <p className="font-mono text-meta text-text-muted">
                                Built with DevJournal · Updated from the public record
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}
