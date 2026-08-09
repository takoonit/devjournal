import { Project } from "@/lib/types";
import { StatusStamp } from "@/components/ui/stamp";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectRowProps {
    project: Project;
    href: string;
    entryCount?: number;
}

/**
 * A project as a ledger row: title, dotted leader, figures on the right.
 * Rows are separated by hairlines; the whole row is the link.
 */
export function ProjectRow({ project, href, entryCount }: ProjectRowProps) {
    const figures = [
        entryCount !== undefined ? `${entryCount} ${entryCount === 1 ? "entry" : "entries"}` : null,
        `updated ${formatDate(project.updatedAt, "dd MMM yyyy")}`,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="project-row group relative border-t border-rule/15 transition-colors duration-subtle">
            <Link
                href={href}
                aria-label={`Open ${project.name} build log`}
                className="absolute inset-0 z-10"
            />

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <h3 className="project-row-title font-serif text-title text-text-primary transition-colors duration-subtle">
                    {project.name}
                </h3>
                <ArrowUpRight className="project-row-arrow mt-1 h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </div>

            <div className="mt-3 flex items-baseline gap-4">
                <span className="leader hidden sm:block" aria-hidden="true" />
                <span className="shrink-0 font-mono text-meta tabular-nums text-text-muted">
                    {figures}
                </span>
            </div>

            <p className="mt-3 max-w-measure text-ui leading-relaxed text-text-secondary">
                {project.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <StatusStamp status={project.status} />
                {project.techStack.length > 0 && (
                    <span className="font-mono text-meta text-text-muted">
                        {project.techStack.join(" · ")}
                    </span>
                )}
                {project.repositoryLink && (
                    <a
                        href={project.repositoryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="control-target link-ink relative z-20 justify-start font-mono text-meta"
                        aria-label={`Open ${project.name} repository`}
                    >
                        Repository
                        <ExternalLink className="ml-1.5 h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                )}
            </div>
        </div>
    );
}
