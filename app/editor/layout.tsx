"use client";

import { useToast } from "@/components/ui/toast";
import { useDevJournalStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FolderInput, Plus, Settings } from "lucide-react";
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

    const navItemClasses = (isActive: boolean) =>
        cn(
            "relative flex min-h-control items-center py-1.5 pl-4 font-serif text-ui transition-colors duration-subtle",
            isActive
                ? "text-text-primary before:absolute before:left-0 before:top-1/2 before:h-3.5 before:w-0.5 before:-translate-y-1/2 before:bg-accent"
                : "text-text-secondary hover:text-text-primary"
        );

    return (
        <div
            className="flex min-h-screen"
            data-theme-mode={uiPreferences.themeMode}
            data-focus-mode={uiPreferences.focusMode}
            data-density={uiPreferences.density}
            data-reward-intensity={uiPreferences.rewardIntensity}
            data-motion-level={uiPreferences.motionLevel}
        >
            <a
                href="#editor-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:uppercase focus:text-accent-contrast"
            >
                Skip to content
            </a>
            {/* The index column */}
            <aside
                className={cn(
                    "editor-sidebar hidden shrink-0 border-r border-surface-border bg-surface-base lg:block",
                    uiPreferences.focusMode &&
                        "opacity-30 transition-opacity duration-expressive hover:opacity-100 focus-within:opacity-100"
                )}
            >
                <div className="mb-10">
                    <Link
                        href="/portfolio"
                        className="control-target justify-start font-serif text-subtitle text-text-primary transition-colors duration-subtle hover:text-accent"
                    >
                        DevJournal
                    </Link>
                    <p className="mt-1 font-mono text-label uppercase text-text-muted">The Editor</p>
                </div>

                <nav className="space-y-8" aria-label="Editor navigation">
                    <div>
                        <div className="mb-3 flex items-baseline justify-between gap-2">
                            <div className="keyline flex-1">
                                <span>Projects</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="control-target text-text-muted transition-colors duration-subtle hover:text-accent"
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className="control-target text-text-muted transition-colors duration-subtle hover:text-accent"
                                    title="New Project"
                                    aria-label="Create new project"
                                >
                                    <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
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
                        <div>
                            {projects.map((project) => {
                                const projectPath = `/editor/projects/${project.id}`;
                                const isProjectActive =
                                    pathname === projectPath || pathname.startsWith(`${projectPath}/`);

                                return (
                                    <Link
                                        key={project.id}
                                        href={projectPath}
                                        className={navItemClasses(isProjectActive)}
                                        aria-current={isProjectActive ? "page" : undefined}
                                    >
                                        <span className="block truncate">{project.name}</span>
                                    </Link>
                                );
                            })}
                            {projects.length === 0 && (
                                <p className="py-1.5 text-ui italic text-text-muted">No projects yet</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-rule/15 pt-6">
                        <Link
                            href="/editor/settings"
                            className={navItemClasses(isSettingsActive)}
                            aria-current={isSettingsActive ? "page" : undefined}
                        >
                            <span className="flex items-center gap-2">
                                <Settings className="h-3.5 w-3.5" strokeWidth={1.5} />
                                Settings
                            </span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* The working page */}
            <main id="editor-content" className="editor-page-frame min-w-0 flex-1">
                <div className="editor-workspace mx-auto w-full max-w-page">
                    <div className="mb-8 flex items-center justify-between border-b border-rule/15 pb-4 lg:hidden">
                        <Link href="/editor" className="control-target justify-start font-serif text-subtitle text-text-primary">
                            DevJournal
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="control-target text-text-muted transition-colors duration-subtle hover:text-accent"
                                aria-label="Import project from file"
                            >
                                <FolderInput className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                            <Link
                                href="/editor/projects/new"
                                className="control-target text-text-muted transition-colors duration-subtle hover:text-accent"
                                aria-label="Create new project"
                            >
                                <Plus className="h-5 w-5" strokeWidth={1.5} />
                            </Link>
                            <Link
                                href="/editor/settings"
                                className="control-target text-text-muted transition-colors duration-subtle hover:text-accent"
                                aria-label="Settings"
                            >
                                <Settings className="h-5 w-5" strokeWidth={1.5} />
                            </Link>
                        </div>
                    </div>
                    {!isEntryFormRoute && <Breadcrumbs items={breadcrumbItems} />}
                    {children}
                </div>
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
        <Suspense fallback={<div className="min-h-screen bg-surface-canvas" />}>
            <EditorLayoutContent>{children}</EditorLayoutContent>
        </Suspense>
    );
}
