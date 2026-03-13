"use client";

import DecryptedText from "@/components/reactbits/decrypted-text";
import { useToast } from "@/components/ui/toast";
import { useDevJournalStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Folder, FolderInput, Plus, Settings, LayoutDashboard } from "lucide-react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useMemo, useRef } from "react";

function EditorLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const projects = useDevJournalStore((state) => state.projects);
    const importDevJournal = useDevJournalStore((state) => state.importDevJournal);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();
    const pathname = usePathname();
    const isDashboardActive = pathname === "/editor";
    const isSettingsActive = pathname === "/editor/settings";
    const isEntryFormRoute = /^\/editor\/projects\/[^/]+\/entries\/(new|[^/]+\/edit)$/.test(pathname);
    const uiPreferences = useDevJournalStore((state) => state.uiPreferences);

    const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
        const segments = pathname.split("/").filter(Boolean);
        const items: BreadcrumbItem[] = [{ label: "Editor", href: "/editor" }];

        if (segments.length <= 1) return items;

        if (segments[1] === "settings") {
            items.push({ label: "Settings" });
            return items;
        }

        if (segments[1] === "projects") {
            if (segments[2] === "new") {
                items.push({ label: "New Project" });
                return items;
            }

            const project = projects.find((p) => p.id === segments[2]);
            items.push({
                label: project?.name ?? "Project",
                href: segments[2] ? `/editor/projects/${segments[2]}` : undefined,
            });

            if (segments[3] === "entries") {
                if (segments[4] === "new") {
                    items.push({ label: "New Entry" });
                } else if (segments[5] === "edit") {
                    items.push({ label: "Edit Entry" });
                }
            }
        }

        return items;
    }, [pathname, projects]);

    const getNavItemClasses = (isActive: boolean) =>
        cn(
            "group flex items-center gap-2 rounded border px-3 py-2 text-sm transition-colors",
            isActive
                ? "border-brand-400/50 bg-brand-500/10 text-zinc-50"
                : "border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        );

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await importDevJournal(file);
        if (result.success) {
            addToast({ message: result.message, type: "success", copyKey: "import-success" });
        } else {
            addToast({ message: result.message, type: "error", copyKey: "import-error" });
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
                    "w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col",
                    uiPreferences.density === "compact" ? "p-4" : "p-6",
                    uiPreferences.focusMode && "bg-zinc-950"
                )}
            >
                <div className="mb-8">
                    <Link
                        href="/editor"
                        className="text-xl font-bold text-zinc-100 transition-colors hover:text-brand-400"
                    >
                        <DecryptedText
                            text="DevJournal"
                            animateOn="hover"
                            speed={60}
                            maxIterations={8}
                            characters="01"
                            className="text-zinc-100"
                            encryptedClassName="text-brand-400/60"
                        />
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
                            Editor Mode
                        </span>
                    </div>
                </div>

                <nav className="space-y-8 flex-1 overflow-y-auto pr-2" aria-label="Editor navigation">
                    <div className="space-y-1">
                        <Link
                            href="/editor"
                            className={getNavItemClasses(isDashboardActive)}
                        >
                            <LayoutDashboard
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isDashboardActive
                                        ? "text-brand-300"
                                        : "text-zinc-500 group-hover:text-zinc-200"
                                )}
                            />
                            <span
                                className={cn(
                                    "transition-colors",
                                    isDashboardActive && "font-medium text-zinc-50"
                                )}
                            >
                                Dashboard
                            </span>
                        </Link>
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Projects
                            </h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-brand-400"
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="h-4 w-4" />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-brand-400"
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
                                                    ? "text-brand-300"
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

                    <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            System
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/editor/settings"
                                className={getNavItemClasses(isSettingsActive)}
                            >
                                <Settings
                                    className={cn(
                                        "h-4 w-4 transition-colors",
                                        isSettingsActive
                                            ? "text-brand-300"
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
                    </div>
                </nav>

                <div className="mt-auto pt-8">
                    <Link
                        href="/portfolio"
                        target="_blank"
                        className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm transition-colors hover:border-brand-500/30 hover:bg-brand-500/10"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-zinc-400 group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                        <div>
                            <p className="font-medium text-zinc-200 group-hover:text-brand-400 transition-colors">View Portfolio</p>
                            <p className="text-xs text-zinc-500">Public profile</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1", uiPreferences.density === "compact" ? "p-5" : "p-8")}>
                {!isEntryFormRoute && <Breadcrumbs items={breadcrumbItems} />}
                {children}
            </main>
        </div>
    );
}


export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-100" />}>
            <EditorLayoutContent>{children}</EditorLayoutContent>
        </Suspense>
    );
}
