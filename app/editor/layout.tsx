"use client";

import DecryptedText from "@/components/reactbits/decrypted-text";
import { useToast } from "@/components/ui/toast";
import { useDevJournalStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Folder, FolderInput, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const projects = useDevJournalStore((state) => state.projects);
    const importDevJournal = useDevJournalStore((state) => state.importDevJournal);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();
    const pathname = usePathname();
    const isSettingsActive = pathname === "/editor/settings";
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);

    const getNavItemClasses = (isActive: boolean) =>
        cn(
            "group flex items-center gap-2 rounded border px-3 py-2 text-sm transition-colors",
            isActive
                ? "border-cyan-400/50 bg-cyan-500/10 text-zinc-50"
                : "border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        );

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
        <div
            className={cn(
                "flex min-h-screen",
                uiPreferences.themeMode === "calm-focus" && "bg-zinc-950",
                uiPreferences.density === "compact" ? "text-sm" : "text-base"
            )}
            data-theme-mode={uiPreferences.themeMode}
            data-focus-mode={uiPreferences.focusMode}
            data-density={uiPreferences.density}
            data-reward-intensity={uiPreferences.rewardIntensity}
            data-motion-level={uiPreferences.motionLevel}
        >
            {/* Sidebar */}
            <aside
                className={cn(
                    "w-64 border-r border-zinc-800 bg-zinc-950/50",
                    uiPreferences.density === "compact" ? "p-4" : "p-6",
                    uiPreferences.focusMode && "bg-zinc-950"
                )}
            >
                <div className="mb-8">
                    <Link
                        href="/portfolio"
                        className="text-xl font-bold text-zinc-100 transition-colors hover:text-cyan-400"
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
                    <p className="mt-1 text-xs text-zinc-500">Editor Mode</p>
                </div>

                <nav className="space-y-6" aria-label="Editor navigation">
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                                Projects
                            </h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-cyan-400"
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="h-4 w-4" />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-cyan-400"
                                    title="New Project"
                                    aria-label="Create new project"
                                >
                                    <Plus className="h-4 w-4" />
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
                            {projects.map((project) => {
                                const projectPath = `/editor/projects/${project.id}`;
                                const isProjectActive =
                                    pathname === projectPath || pathname.startsWith(`${projectPath}/`);

                                return (
                                    <Link
                                        key={project.id}
                                        href={projectPath}
                                        className={getNavItemClasses(isProjectActive)}
                                    >
                                        <Folder
                                            className={cn(
                                                "h-4 w-4 transition-colors",
                                                isProjectActive
                                                    ? "text-cyan-300"
                                                    : "text-zinc-500 group-hover:text-zinc-200"
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "truncate transition-colors",
                                                isProjectActive && "font-medium text-zinc-50"
                                            )}
                                        >
                                            {project.name}
                                        </span>
                                    </Link>
                                );
                            })}
                            {projects.length === 0 && (
                                <p className="px-3 py-2 text-xs text-zinc-600">No projects yet</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-6">
                        <Link
                            href="/editor/settings"
                            className={getNavItemClasses(isSettingsActive)}
                        >
                            <Settings
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isSettingsActive
                                        ? "text-cyan-300"
                                        : "text-zinc-500 group-hover:text-zinc-200"
                                )}
                            />
                            <span
                                className={cn(
                                    "transition-colors",
                                    isSettingsActive && "font-medium text-zinc-50"
                                )}
                            >
                                Settings
                            </span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1", uiPreferences.density === "compact" ? "p-5" : "p-8")}>{children}</main>
        </div>
    );
}
