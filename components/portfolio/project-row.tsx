import { Project } from "@/lib/types";
import { StatusStamp } from "@/components/ui/stamp";
import { formatDate } from "@/lib/utils";
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
        <div className="group relative border-t border-rule/15 py-7 transition-colors duration-subtle hover:bg-surface-base/70">
            <Link
                href={href}
                aria-label={`Open ${project.name} build log`}
                className="absolute inset-0 z-10"
            />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-serif text-title text-text-primary transition-colors duration-subtle group-hover:text-accent">
                    {project.name}
                </h3>
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
                        Repository ↗
                    </a>
                )}
            </div>
        </div>
    );
}
