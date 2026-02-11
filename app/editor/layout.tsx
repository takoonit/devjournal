"use client";

import { useDevJournalStore } from "@/lib/store";
import Link from "next/link";
import { Plus, Folder, Settings, FolderInput } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/components/ui/toast";
import DecryptedText from "@/components/reactbits/decrypted-text";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const projects = useDevJournalStore((state) => state.projects);
    const importDevJournal = useDevJournalStore((state) => state.importDevJournal);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await importDevJournal(file);
        if (result.success) {
            addToast(result.message, "success");
        } else {
            addToast(result.message, "error");
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 p-6">
                <div className="mb-8">
                    <Link
                        href="/portfolio"
                        className="text-xl font-bold text-zinc-100 hover:text-cyan-400 transition-colors"
                    >
                        <DecryptedText
                            text="DevJournal"
                            animateOn="hover"
                            speed={60}
                            maxIterations={8}
                            characters="01"
                            className="text-zinc-100"
                            encryptedClassName="text-cyan-400/60"
                        />
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1">Editor Mode</p>
                </div>

                <nav className="space-y-6" aria-label="Editor navigation">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                                Projects
                            </h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-cyan-400 transition-colors"
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="w-4 h-4" />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-cyan-400 transition-colors"
                                    title="New Project"
                                    aria-label="Create new project"
                                >
                                    <Plus className="w-4 h-4" />
                                </Link>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".devjournal"
                                className="hidden"
                                aria-label="Import .devjournal file"
                            />
                        </div>
                        <div className="space-y-1">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/editor/projects/${project.id}`}
                                    className="flex items-center gap-2 px-3 py-2 rounded text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                                >
                                    <Folder className="w-4 h-4" />
                                    <span className="truncate">{project.name}</span>
                                </Link>
                            ))}
                            {projects.length === 0 && (
                                <p className="text-xs text-zinc-600 px-3 py-2">
                                    No projects yet
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                        <Link
                            href="/editor/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
