import { Project } from "@/lib/types";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";

interface ProjectCardProps {
    project: Project;
    href: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
    return (
        <SpotlightCard className="group relative h-full p-6 flex flex-col border-zinc-800/80 hover:border-zinc-700/80 transition-colors duration-300">
            <Link
                href={href}
                aria-label={`Open ${project.name} build log`}
                className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff914d]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            />

            <div className="flex items-start justify-between mb-4">
                <div className="relative z-10 antialias">
                    <h3 className="mb-1 text-xl font-semibold text-zinc-100 transition-colors group-hover:text-zinc-50">
                        {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${project.status === "shipped"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-300"
                            }`}>
                            {project.status === "shipped" ? "SHIPPED" : "IN PROGRESS"}
                        </span>
                    </div>
                </div>
                {project.repositoryLink && (
                    <a
                        href={project.repositoryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-30 -m-1 rounded p-1 text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff914d]/70"
                        aria-label={`Open ${project.name} repository`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GitBranch className="w-5 h-5" />
                    </a>
                )}
            </div>

            <p className="relative z-20 mb-4 flex-grow text-sm leading-relaxed text-zinc-400 line-clamp-3">
                {project.description}
            </p>

            <div className="relative z-20 mt-auto flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                    <span
                        key={`${tech}-${index}`}
                        className="rounded border border-zinc-700/40 bg-zinc-800/40 px-2 py-1 text-xs text-zinc-300"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="relative z-20 mt-4 flex items-center text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
                <span>View build log</span>
                <ExternalLink className="w-3 h-3 ml-1" />
            </div>
        </SpotlightCard>
    );
}
