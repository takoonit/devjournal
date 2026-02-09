"use client";

import { useState, useRef } from "react";
import { useDevJournalStore } from "@/lib/store";
import { FolderOutput, FolderInput, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function ExportImportSection() {
    const exportJournal = useDevJournalStore((state) => state.exportJournal);
    const importJournal = useDevJournalStore((state) => state.importJournal);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState<{
        type: "idle" | "success" | "error" | "loading";
        message: string;
    }>({ type: "idle", message: "" });

    const handleExport = () => {
        try {
            exportJournal();
            setStatus({ type: "success", message: "Journal exported successfully!" });
            setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
        } catch (error) {
            setStatus({
                type: "error",
                message: "Failed to export journal. Please try again.",
            });
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("This will replace all your current data. Are you sure you want to continue?")) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setStatus({ type: "loading", message: "Importing journal..." });

        const result = await importJournal(file);

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
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Data Management</h3>
            <p className="text-zinc-400 mb-6">
                Back up your journal data or restore it from a previous export.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Section */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FolderOutput className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="font-semibold text-zinc-200">Export Journal</h4>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6">
                        Download your entire journal including profile, projects, and all entries as a JSON file.
                    </p>
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-zinc-700 font-medium"
                    >
                        <FolderOutput className="w-4 h-4" />
                        Download JSON
                    </button>
                </div>

                {/* Import Section */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <FolderInput className="w-5 h-5 text-amber-400" />
                        </div>
                        <h4 className="font-semibold text-zinc-200">Import Journal</h4>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6 font-medium flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>Warning: Importing will overwrite all your current data.</span>
                    </p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-zinc-700 font-medium"
                    >
                        <FolderInput className="w-4 h-4" />
                        Select File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Status Message */}
            {status.type !== "idle" && (
                <div
                    className={`mt-6 p-4 rounded-lg flex items-center gap-3 border ${status.type === "success"
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
