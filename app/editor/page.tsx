"use client";

import { useDevJournalStore } from "@/lib/store";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Plus } from "lucide-react";
import Link from "next/link";
import RotatingText from "@/components/reactbits/rotating-text";
import ShinyText from "@/components/reactbits/shiny-text";
import ScrollReveal from "@/components/reactbits/scroll-reveal";
import BlurText from "@/components/reactbits/blur-text";
import CountUp from "@/components/reactbits/count-up";

export default function EditorPage() {
    const projects = useDevJournalStore((state) => state.projects);

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <BlurText
                    text="Your Projects"
                    className="mb-2 text-3xl font-bold text-zinc-100"
                    delay={80}
                    animateBy="letters"
                />
                <p className="text-zinc-400">
                    Manage your projects and build logs.
                    {projects.length > 0 && (
                        <span className="ml-2 font-mono text-brand-400">
                            <CountUp to={projects.length} duration={1.5} /> {projects.length === 1 ? "project" : "projects"}
                        </span>
                    )}
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 py-24 px-6 text-center max-w-3xl mx-auto mt-12">
                    <h3 className="text-xl font-bold text-zinc-100 mb-3">Welcome to DevJournal</h3>
                    <p className="text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
                        DevJournal helps you track your build logs, document decisions, and automatically generate a public portfolio.
                    </p>

                    <div className="mb-8 flex items-center justify-center gap-2 text-zinc-400 text-lg">
                        <span>Start by</span>
                        <RotatingText
                            texts={["documenting a decision", "logging a bug fix", "capturing an idea", "celebrating a win"]}
                            mainClassName="h-8 overflow-hidden font-medium text-brand-400"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            rotationInterval={3000}
                        />
                    </div>
                    <Link
                        href="/editor/projects/new"
                        className="inline-flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/10 px-8 py-4 transition-colors hover:bg-brand-500/20 group"
                    >
                        <Plus className="h-5 w-5 text-brand-400 group-hover:scale-110 transition-transform" />
                        <ShinyText text="Create your first project" className="font-medium text-brand-400 text-lg" speed={3} />
                    </Link>
                    <p className="mt-6 text-sm text-zinc-600">You can also import an existing <code className="text-zinc-500 bg-zinc-800/50 px-1 py-0.5 rounded">.devjournal</code> backup file from Settings.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <ScrollReveal key={project.id} delay={Math.min(index * 0.08, 0.8)}>
                            <ProjectCard
                                project={project}
                                href={`/editor/projects/${project.id}`}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}
