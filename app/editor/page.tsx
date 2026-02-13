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
                        <span className="ml-2 font-mono text-cyan-400">
                            <CountUp to={projects.length} duration={1.5} /> {projects.length === 1 ? "project" : "projects"}
                        </span>
                    )}
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 py-20 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-zinc-500">
                        <span>Start by</span>
                        <RotatingText
                            texts={["documenting a decision", "logging a bug fix", "capturing an idea", "celebrating a win"]}
                            mainClassName="h-6 overflow-hidden font-medium text-cyan-400"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            rotationInterval={3000}
                        />
                    </div>
                    <p className="mb-6 text-sm text-zinc-600">Create a project to begin your build journal.</p>
                    <Link
                        href="/editor/projects/new"
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 transition-colors hover:bg-cyan-500/20"
                    >
                        <Plus className="h-5 w-5 text-cyan-400" />
                        <ShinyText text="Create your first project" className="font-medium text-cyan-400" speed={3} />
                    </Link>
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
