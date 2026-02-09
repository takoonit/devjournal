"use client";

import { useState, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";
import { FolderOutput, FolderInput, CheckCircle2, XCircle, CheckSquare, Square } from "lucide-react";

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
            setStatus({ type: "success", message: "Full journal backup exported!" });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
        } catch (error) {
            setStatus({ type: "error", message: "Export failed." });
        }
    };

    const handleExportSelected = () => {
        if (selectedProjectIds.length === 0) return;
        try {
            exportSelectedProjects(selectedProjectIds);
            setStatus({ type: "success", message: `Exported ${selectedProjectIds.length} projects.` });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
            setSelectedProjectIds([]);
        } catch (error) {
            setStatus({ type: "error", message: "Export failed." });
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus({ type: "loading", message: "Processing DevJournal file..." });

        const result = await importDevJournal(file);

        if (result.success) {
            setStatus({ type: "success", message: result.message });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
        } else {
            setStatus({ type: "error", message: result.message });
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Data Portability</h3>
            <p className="text-zinc-400 mb-8">
                Manage your exports and imports using the unified <code className="text-cyan-400">.devjournal</code> format.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
                {/* Export Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <FolderOutput className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="font-semibold text-zinc-200">Export Projects</h4>
                        </div>

                        {projects.length > 0 ? (
                            <div className="space-y-4">
                                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 mb-6 scrollbar-thin scrollbar-thumb-zinc-800">
                                    {projects.map((project) => {
                                        const isSelected = selectedProjectIds.includes(project.id);
                                        return (
                                            <button
                                                key={project.id}
                                                onClick={() => toggleProject(project.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${isSelected
                                                        ? "bg-cyan-500/5 border-cyan-500/30 text-cyan-400"
                                                        : "bg-zinc-800/20 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                                                    }`}
                                            >
                                                {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                <span className="text-sm font-medium truncate">{project.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleExportSelected}
                                        disabled={selectedProjectIds.length === 0}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 text-zinc-950 rounded-lg hover:bg-cyan-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Export Selected ({selectedProjectIds.length})
                                    </button>
                                    <button
                                        onClick={handleExportAll}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-zinc-700 font-medium text-sm"
                                    >
                                        Backup Everything
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 italic py-4">No projects to export.</p>
                        )}
                    </div>
                </div>

                {/* Import Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <FolderInput className="w-5 h-5 text-amber-400" />
                            </div>
                            <h4 className="font-semibold text-zinc-200">Import .devjournal</h4>
                        </div>

                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                            Import projects or full backups. This action is <span className="text-cyan-400 font-medium">non-destructive</span>—imported items will be merged with your existing data.
                        </p>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-zinc-700 font-medium text-sm"
                        >
                            <FolderInput className="w-4 h-4" />
                            Select File
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".devjournal"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Status Message */}
            {status.type !== "idle" && (
                <div
                    className={`mt-8 p-4 rounded-lg flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : status.type === "error"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                        }`}
                >
                    {status.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                    {status.type === "error" && <XCircle className="w-5 h-5" />}
                    {status.type === "loading" && (
                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                </div>
            )}
        </div>
    );
}

