import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { RefactorShape } from "@/components/icons/entry-shapes";
import { Project } from "@/lib/types";
import { ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
    href: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
    return (
        <SpotlightCard className="group relative flex h-full flex-col p-6">
            <div className="mb-4 flex items-start justify-between">
                <div className="relative z-10 antialias">
                    <h3 className="mb-1 text-xl font-semibold text-zinc-100 transition-colors group-hover:text-accent">
                        <Link
                            href={href}
                            className="rounded-sm after:absolute after:inset-0 after:z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        >
                            {project.name}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-accent/80" aria-hidden="true">
                            <RefactorShape className="h-3 w-3" />
                        </span>
                        <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-mono ${
                                project.status === "shipped"
                                    ? "bg-status-shipped/20 text-status-shipped"
                                    : "bg-status-in-progress/20 text-status-in-progress"
                            }`}
                        >
                            {project.status === "shipped" ? "SHIPPED" : "IN PROGRESS"}
                        </span>
                    </div>
                </div>
                {project.repositoryLink && (
                    <a
                        href={project.repositoryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 -m-1 rounded p-1 text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        aria-label={`Open ${project.name} repository`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GitBranch className="h-5 w-5" />
                    </a>
                )}
            </div>

            <p className="mb-4 flex-grow line-clamp-3 text-sm text-zinc-400">{project.description}</p>

            <div className="relative z-10 mt-auto flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                    <span
                        key={`${tech}-${index}`}
                        className="rounded border border-zinc-700/50 bg-zinc-800/50 px-2 py-1 text-xs text-zinc-300"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="relative z-10 mt-4 flex items-center text-sm text-zinc-500 transition-colors group-hover:text-accent">
                <span>View build log</span>
                <ExternalLink className="ml-1 h-3 w-3" />
            </div>
        </SpotlightCard>
    );
}
