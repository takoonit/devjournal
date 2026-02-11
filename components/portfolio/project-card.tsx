import { Project } from "@/lib/types";
import { SpotlightCard } from "../reactbits/spotlight-card";
import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";

interface ProjectCardProps {
    project: Project;
    href: string;
}

/**
 * Render a stylized project card showing title, status badge, optional repository link, description, tech stack tags, and a build log cue.
 *
 * @param project - Project data used to populate the card (name, status, description, techStack, optional repositoryLink)
 * @param href - Destination URL for the project title link
 * @returns The rendered ProjectCard element
 */
export function ProjectCard({ project, href }: ProjectCardProps) {
    return (
        <SpotlightCard className="group relative p-6 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="relative z-10 antialias">
                    <h3 className="text-xl font-semibold text-zinc-100 mb-1 group-hover:text-cyan-400 transition-colors">
                        <Link href={href} className="rounded-sm after:absolute after:inset-0 after:z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70">
                            {project.name}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${project.status === "shipped"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-cyan-500/20 text-cyan-400"
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
                        className="relative z-20 -m-1 rounded p-1 text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                        aria-label={`Open ${project.name} repository`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GitBranch className="w-5 h-5" />
                    </a>
                )}
            </div>

            <p className="text-zinc-400 text-sm mb-4 flex-grow line-clamp-3">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {project.techStack.map((tech, index) => (
                    <span
                        key={`${tech}-${index}`}
                        className="px-2 py-1 text-xs rounded bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="mt-4 flex items-center text-sm text-zinc-500 group-hover:text-cyan-400 transition-colors relative z-10">
                <span>View build log</span>
                <ExternalLink className="w-3 h-3 ml-1" />
            </div>
        </SpotlightCard>
    );
}