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
                        <div className="keyline mb-2">
                            <h2>Projects</h2>
                        </div>
                        <p className="mb-10 font-mono text-meta tabular-nums text-text-muted">
                            <CountUp to={projects.length} />{" "}
                            {projects.length === 1 ? "build log" : "build logs"}, kept in public
                        </p>

                        {projects.length === 0 ? (
                            <div className="border-t border-rule/15 py-10">
                                <p className="text-subtitle italic text-text-secondary">
                                    The first entry is still unwritten.
                                </p>
                                <p className="mt-3 max-w-prose text-ui text-text-muted">
                                    When projects are published from the editor, they are set
                                    here — dated, typed, and bound into a record.
                                </p>
                            </div>
                        ) : (
                            <div className="border-b border-rule/15">
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
