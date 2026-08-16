"use client";

import { useToast } from "@/components/ui/toast";
import { useDevJournalStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { BookOpenText, FolderInput, Plus, Settings } from "lucide-react";
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
    const isLedgerActive = pathname === "/editor";
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
            "m3-nav-item relative flex min-h-control items-center gap-3 px-4 py-2 font-sans text-ui transition-all duration-standard",
            isActive
                ? "is-active"
                : "text-text-secondary hover:text-text-primary"
        );

    return (
        <div
            className="editor-shell flex min-h-screen"
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
            <aside
                className={cn(
                    "m3-navigation-rail editor-sidebar hidden shrink-0 lg:block",
                    uiPreferences.focusMode &&
                        "opacity-30 transition-opacity duration-expressive hover:opacity-100 focus-within:opacity-100"
                )}
            >
                <div className="mb-6">
                    <Link
                        href="/portfolio"
                        className="control-target justify-start gap-3 px-2 font-sans text-subtitle text-text-primary transition-colors duration-subtle hover:text-accent"
                    >
                        <span className="m3-brand-mark" aria-hidden="true">D</span>
                        <span>DevJournal</span>
                    </Link>
                    <p className="ml-14 mt-1 font-sans text-meta text-text-muted">Build in public</p>
                </div>

                <Link
                    href="/editor/projects/new"
                    className="m3-fab control-target mb-6 w-full justify-start gap-3 px-5 py-3"
                >
                    <Plus className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    New project
                </Link>

                <nav className="space-y-4" aria-label="Editor navigation">
                    <Link
                        href="/editor"
                        className={navItemClasses(isLedgerActive)}
                        aria-current={isLedgerActive ? "page" : undefined}
                    >
                        <BookOpenText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        Ledger
                    </Link>
                    <div>
                        <div className="mb-3 flex items-baseline justify-between gap-2">
                            <div className="keyline flex-1">
                                <span>Projects</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="m3-icon-button control-target"
                                    title="Import Project"
                                    aria-label="Import project from file"
                                >
                                    <FolderInput className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                                <Link
                                    href="/editor/projects/new"
                                    className="m3-icon-button control-target"
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

                    <div className="pt-2">
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

            <main id="editor-content" className="editor-page-frame min-w-0 flex-1">
                <div className="editor-workspace mx-auto w-full max-w-page">
                    <div className="m3-top-app-bar mb-6 p-2 lg:hidden">
                        <Link href="/editor" className="control-target justify-start gap-2 px-2 font-sans text-subtitle text-text-primary">
                            <span className="m3-brand-mark" aria-hidden="true">D</span>
                            <span>DevJournal</span>
                        </Link>
                        <div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="m3-icon-button control-target"
                                aria-label="Import project from file"
                            >
                                <FolderInput className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                    {!isEntryFormRoute && <Breadcrumbs items={breadcrumbItems} />}
                    {children}
                </div>
            </main>
            {!isEntryFormRoute ? (
                <nav className="m3-mobile-navigation lg:hidden" aria-label="Primary navigation">
                    <Link href="/editor" aria-current={isLedgerActive ? "page" : undefined}>
                        <BookOpenText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        <span>Ledger</span>
                    </Link>
                    <Link href="/editor/projects/new" className="m3-fab" aria-label="Create new project">
                        <Plus className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                        <span>New</span>
                    </Link>
                    <Link href="/editor/settings" aria-current={isSettingsActive ? "page" : undefined}>
                        <Settings className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        <span>Settings</span>
                    </Link>
                </nav>
            ) : null}
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
