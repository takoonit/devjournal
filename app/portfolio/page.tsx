import { BioSidebarStatic } from "@/components/portfolio/bio-sidebar-static";
import { ProjectCard } from "@/components/portfolio/project-card";
import BlurText from "@/components/reactbits/blur-text";
import CountUp from "@/components/reactbits/count-up";
import ScrollReveal from "@/components/reactbits/scroll-reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getPublicPortfolioOverview } from "@/lib/supabase/server";

export const revalidate = 150;

export default async function PortfolioPage() {
    const { projects, user } = await getPublicPortfolioOverview();

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Portfolio" }]} />
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <BioSidebarStatic user={user} />

                    <div className="flex-1">
                        <div className="mb-8">
                            <BlurText
                                as="h2"
                                text="Projects"
                                className="text-3xl font-bold text-zinc-100 mb-2"
                                delay={100}
                                animateBy="letters"
                            />
                            <p className="text-zinc-400">
                                Build logs documenting the development process.
                                {projects.length > 0 && (
                                    <span className="ml-2 text-[#ff914d] font-mono">
                                        <CountUp to={projects.length} duration={1.5} /> active
                                    </span>
                                )}
                            </p>
                        </div>

                        {projects.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 py-20 text-center">
                                <p className="text-zinc-500 mb-4">No public projects yet.</p>
                                <p className="text-sm text-zinc-600">
                                    Start documenting your journey in the editor.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project, index) => (
                                    <ScrollReveal key={project.id} delay={index * 0.08}>
                                        <ProjectCard project={project} href={`/portfolio/${project.slug}`} />
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
