"use client";

import { useState, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExportImportSection() {
    const projects = useDevJournalStore((state) => state.projects);
    const exportJournal = useDevJournalStore((state) => state.exportJournal);
    const exportSelectedProjects = useDevJournalStore((state) => state.exportSelectedProjects);
    const importDevJournal = useDevJournalStore((state) => state.importDevJournal);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
    const [status, setStatus] = useState<{
        type: "idle" | "success" | "error" | "loading";
        message: string;
    }>({ type: "idle", message: "" });

    const toggleProject = (projectId: string) => {
        setSelectedProjectIds(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const handleExportAll = () => {
        try {
            exportJournal();
            setStatus({ type: "success", message: "Full journal backup exported." });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
        } catch {
            setStatus({ type: "error", message: "Export failed." });
        }
    };

    const handleExportSelected = () => {
        if (selectedProjectIds.length === 0) return;
        try {
            exportSelectedProjects(selectedProjectIds);
            setStatus({ type: "success", message: `Exported ${selectedProjectIds.length} ${selectedProjectIds.length === 1 ? "project" : "projects"}.` });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
            setSelectedProjectIds([]);
        } catch {
            setStatus({ type: "error", message: "Export failed." });
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus({ type: "loading", message: "Reading .devjournal file..." });

        const result = await importDevJournal(file);

        if (result.success) {
            setStatus({ type: "success", message: result.message });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
        } else {
            setStatus({ type: "error", message: result.message });
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const quietButton =
        "control-target rounded border border-surface-border px-4 py-2 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:border-rule/10 disabled:text-text-muted disabled:hover:border-rule/10";

    return (
        <section className="mt-16">
            <div className="keyline mb-3">
                <h2>Data Portability</h2>
            </div>
            <p className="mb-8 max-w-measure text-ui text-text-secondary">
                Everything travels in the <code className="font-mono text-meta text-text-primary">.devjournal</code> format.
                Imports are additive — nothing you have is ever overwritten.
            </p>

            <div className="settings-container">
                <div className="settings-grid">
                    <div>
                        <p className="mb-4 font-mono text-label uppercase text-text-muted">Export</p>

                    {projects.length > 0 ? (
                        <>
                            <div className="mb-5 max-h-56 overflow-y-auto border-y border-rule/15">
                                {projects.map((project) => {
                                    const isSelected = selectedProjectIds.includes(project.id);
                                    return (
                                        <button
                                            key={project.id}
                                            onClick={() => toggleProject(project.id)}
                                            aria-pressed={isSelected}
                                            className={cn(
                                                "control-target flex w-full justify-start gap-3 border-b border-rule/10 px-1 py-2.5 text-left transition-colors duration-subtle last:border-b-0",
                                                isSelected ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                            )}
                                        >
                                            {isSelected
                                                ? <CheckSquare className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.5} />
                                                : <Square className="h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={1.5} />}
                                            <span className="truncate font-serif text-ui">{project.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleExportSelected}
                                    disabled={selectedProjectIds.length === 0}
                                    className={quietButton}
                                >
                                    Export Selected ({selectedProjectIds.length})
                                </button>
                                <button onClick={handleExportAll} className={quietButton}>
                                    Backup Everything
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-ui italic text-text-muted">Nothing to export yet.</p>
                    )}
                    </div>

                    <div>
                        <p className="mb-4 font-mono text-label uppercase text-text-muted">Import</p>
                        <p className="mb-5 max-w-prose text-ui leading-relaxed text-text-secondary">
                            Bring in single projects or full backups. Duplicate names get a
                            counter suffix; fresh IDs prevent collisions.
                        </p>

                        <button onClick={() => fileInputRef.current?.click()} className={quietButton}>
                            Select .devjournal file
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".devjournal"
                            className="hidden"
                            aria-label="Import .devjournal file"
                        />
                    </div>
                </div>
            </div>

            {status.type !== "idle" && (
                <div className="mt-8 flex items-baseline gap-3 border-t border-rule/15 pt-4" role="status">
                    <span
                        className={cn(
                            "font-mono text-label uppercase",
                            status.type === "success" && "text-positive",
                            status.type === "error" && "text-destructive",
                            status.type === "loading" && "text-text-muted"
                        )}
                    >
                        {status.type === "loading" ? "Working" : status.type}
                    </span>
                    <span className="text-ui text-text-secondary">{status.message}</span>
                </div>
            )}
        </section>
    );
}
