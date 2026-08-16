"use client";

import { useEffect, useMemo, useState } from "react";
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
    const [dateline, setDateline] = useState("");

    const entryCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const entry of entries) {
            counts.set(entry.projectId, (counts.get(entry.projectId) ?? 0) + 1);
        }
        return counts;
    }, [entries]);
    const activeProjects = projects.filter((project) => project.status === "in-progress");
    const privateEntries = entries.filter((entry) => !entry.isPublic);
    const publicEntries = entries.filter((entry) => entry.isPublic);
    const activeProject = activeProjects[0] ?? projects[0];

    useEffect(() => {
        const now = new Date();
        setDateline(
            `${now.toLocaleDateString("en-GB", { weekday: "long" })} · ${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`.toUpperCase()
        );
    }, []);

    return (
        <div className="working-ledger max-w-page">
            <header className="m3-hero editor-masthead masthead-block mb-10">
                <div>
                    <p className="m3-label mb-4">Build in public</p>
                    <h1 className="masthead-title text-text-primary">Make the work visible.</h1>
                </div>
                <div className="masthead-meta font-mono text-text-muted">
                    <p className="text-label uppercase">{dateline || "\u00a0"}</p>
                    <p className="text-meta tabular-nums">
                        {projects.length} {projects.length === 1 ? "project" : "projects"} on record
                    </p>
                </div>
            </header>

            {projects.length > 0 ? (
                <div className="ledger-summary mb-12">
                    <dl className="ledger-figures">
                        <div><dt>Active</dt><dd>{activeProjects.length}</dd></div>
                        <div><dt>Private</dt><dd>{privateEntries.length}</dd></div>
                        <div><dt>Public</dt><dd>{publicEntries.length}</dd></div>
                    </dl>
                    <div className="flex flex-wrap items-center gap-3 border-b border-rule/15 py-4">
                        <Link
                            href={`/editor/projects/${activeProject.id}/entries/new`}
                            className="m3-button-filled control-target gap-2 font-sans text-label"
                        >
                            Continue active work
                        </Link>
                        <Link href="/editor/projects/new" className="control-target link-ink justify-start font-mono text-meta">
                            Open another project
                        </Link>
                    </div>
                </div>
            ) : null}

            {projects.length === 0 ? (
                <div className="empty-ledger m3-card m3-card-tertiary">
                    <p className="m3-label mb-4">Your first move</p>
                    <p className="mb-8 max-w-measure text-title text-text-secondary">
                        Start with what you&apos;re building.
                    </p>
                    <Link
                        href="/editor/projects/new"
                        className="m3-button-filled control-target mb-10 inline-flex font-sans text-label"
                    >
                        Start your first project
                    </Link>
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
