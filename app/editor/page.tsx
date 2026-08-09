"use client";

import { useMemo } from "react";
import { useDevJournalStore } from "@/lib/store";
import { ProjectRow } from "@/components/portfolio/project-row";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

const EMPTY_STEPS = [
    "Name the project you are building",
    "Write down what happened today — a fix, a feature, a dead end",
    "Publish the entries worth showing, keep the rest private",
];

export default function EditorPage() {
    const projects = useDevJournalStore((state) => state.projects);
    const entries = useDevJournalStore((state) => state.entries);

    const entryCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const entry of entries) {
            counts.set(entry.projectId, (counts.get(entry.projectId) ?? 0) + 1);
        }
        return counts;
    }, [entries]);

    const now = new Date();
    const dateline = `${now.toLocaleDateString("en-GB", { weekday: "long" })} · ${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`.toUpperCase();

    return (
        <div className="max-w-page">
            <header className="editor-masthead masthead-block rule-oxford mb-12">
                <h1 className="masthead-title text-text-primary">Projects</h1>
                <div className="masthead-meta font-mono text-text-muted">
                    <p className="text-label uppercase">{dateline}</p>
                    <p className="text-meta tabular-nums">
                        {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
                        {entries.length} {entries.length === 1 ? "entry" : "entries"} on record
                    </p>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="empty-ledger">
                    <p className="mb-8 max-w-measure text-title italic text-text-secondary">
                        Every journal starts with an empty page.
                    </p>
                    <ol className="editor-empty-steps mb-10 max-w-measure">
                        {EMPTY_STEPS.map((step, index) => (
                            <li key={step} className="flex items-baseline gap-4">
                                <span className="w-6 shrink-0 font-mono text-meta tabular-nums text-accent">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-subtitle text-text-secondary">{step}</span>
                            </li>
                        ))}
                    </ol>
                    <Link
                        href="/editor/projects/new"
                        className="inline-block rounded bg-accent px-5 py-2.5 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft"
                    >
                        Start your first project
                    </Link>
                </div>
            ) : (
                <div className="project-ledger editor-project-ledger">
                    {projects.map((project, index) => (
                        <Reveal key={project.id} index={index}>
                            <ProjectRow
                                project={project}
                                href={`/editor/projects/${project.id}`}
                                entryCount={entryCounts.get(project.id) ?? 0}
                            />
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
}
