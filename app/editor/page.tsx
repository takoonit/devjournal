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
        <div className="max-w-measure lg:max-w-3xl">
            <header className="mb-10">
                <p className="font-mono text-label uppercase text-text-muted">{dateline}</p>
                <h1 className="mt-2 font-serif text-display text-text-primary">Projects</h1>
                <p className="mt-3 font-mono text-meta tabular-nums text-text-muted">
                    {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
                    {entries.length} {entries.length === 1 ? "entry" : "entries"} on record
                </p>
            </header>

            {projects.length === 0 ? (
                <div className="border-y border-rule/15 py-12">
                    <p className="mb-8 text-subtitle italic text-text-secondary">
                        Every journal starts with an empty page.
                    </p>
                    <ol className="mb-10 space-y-4">
                        {EMPTY_STEPS.map((step, index) => (
                            <li key={step} className="flex items-baseline gap-4">
                                <span className="font-mono text-meta tabular-nums text-text-muted">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-ui text-text-secondary">{step}</span>
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
                <div className="border-b border-rule/15">
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
