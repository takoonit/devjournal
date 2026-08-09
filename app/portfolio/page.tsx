import { BioSidebarStatic } from "@/components/portfolio/bio-sidebar-static";
import { ProjectRow } from "@/components/portfolio/project-row";
import { Reveal } from "@/components/ui/reveal";
import CountUp from "@/components/ui/count-up";
import { getPublicPortfolioOverview } from "@/lib/supabase/server";

export default async function PortfolioPage() {
    const { projects, user } = await getPublicPortfolioOverview();

    return (
        <div className="page-frame min-h-screen">
            <div className="portfolio-container mx-auto max-w-page">
                <div className="portfolio-shell">
                    <BioSidebarStatic user={user} />

                    <main className="min-w-0 flex-1">
                        <header className="portfolio-masthead masthead-block rule-oxford mb-12">
                            <h2 className="masthead-title text-display text-text-primary">Projects</h2>
                            <div className="masthead-meta">
                                <p className="font-mono text-meta tabular-nums text-text-muted">
                                    <CountUp to={projects.length} />{" "}
                                    {projects.length === 1 ? "build log" : "build logs"}, kept in public
                                </p>
                            </div>
                        </header>

                        {projects.length === 0 ? (
                            <div className="empty-ledger">
                                <p className="max-w-measure text-title italic text-text-secondary">
                                    The first entry is still unwritten.
                                </p>
                                <p className="mt-3 max-w-prose text-ui text-text-muted">
                                    When projects are published from the editor, they are set
                                    here — dated, typed, and bound into a record.
                                </p>
                            </div>
                        ) : (
                            <div className="project-ledger portfolio-project-ledger">
                                {projects.map((project, index) => (
                                    <Reveal key={project.id} index={index}>
                                        <ProjectRow project={project} href={`/portfolio/${project.slug}`} />
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        <footer className="mt-16 border-t border-rule/15 pt-5">
                            <p className="font-mono text-meta text-text-muted">
                                Set in Newsreader &amp; IBM Plex Mono · Entries live on your machine
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}
