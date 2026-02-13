"use client";

import DecryptedText from "@/components/reactbits/decrypted-text";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useToast } from "@/components/ui/toast";
import { useDevJournalStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Folder, FolderInput, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";

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
            "group flex items-center gap-2 rounded-r-md border-y border-r border-l-[3px] py-2 pr-3 pl-[9px] text-sm transition-colors",
            isActive
                ? "border-l-accent border-r-accent/45 border-y-accent/25 bg-accent/10 text-zinc-50"
                : "border-l-transparent border-r-transparent border-y-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
        );

    const getSidebarControlClasses = () =>
        "rounded border border-transparent p-1 text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 hover:border-accent/30 hover:bg-accent/10 hover:text-accent";

    const getNavIconClasses = (isActive: boolean) =>
        cn("h-4 w-4 transition-colors", isActive ? "text-accent" : "text-zinc-500 group-hover:text-zinc-200");

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
                    "w-64 border-r border-zinc-800 bg-zinc-950/50",
                    uiPreferences.density === "compact" ? "p-4" : "p-6",
                    uiPreferences.focusMode && "bg-zinc-950"
                )}
            >
                <div className="mb-8">
                    <Link
                        href="/portfolio"
                        className="inline-flex rounded-sm text-xl font-bold text-zinc-100 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
                    >
                        <DecryptedText
                            text="DevJournal"
                            animateOn="hover"
                            speed={60}
                            maxIterations={8}
                            characters="01"
                            className="text-zinc-100"
                            encryptedClassName="text-accent/60"
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
                                    className={getSidebarControlClasses()}
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="h-4 w-4" />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className={getSidebarControlClasses()}
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
                                        <Folder className={getNavIconClasses(isProjectActive)} />
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
                        <Link href="/editor/settings" className={getNavItemClasses(isSettingsActive)}>
                            <Settings className={getNavIconClasses(isSettingsActive)} />
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
            <main className={cn("flex-1", uiPreferences.density === "compact" ? "p-5" : "p-8")}>
                <Breadcrumbs items={breadcrumbItems} />
                {children}
            </main>
        </div>
    );
}
