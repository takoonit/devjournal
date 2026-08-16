import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Project, Entry, InboxCapture } from "@/lib/types";
import type { ThemeMode } from "@/lib/design-tokens";
import { formatLocalDate, generateId, generateSlug } from "@/lib/utils";

export interface UiPreferences {
    themeMode: ThemeMode;
    focusMode: boolean;
    density: "cozy" | "compact";
    rewardIntensity: "off" | "subtle" | "full";
    motionLevel: "reduced" | "standard" | "expressive";
}

export const defaultUiPreferences: UiPreferences = {
    themeMode: "press",
    focusMode: false,
    density: "cozy",
    rewardIntensity: "subtle",
    motionLevel: "standard",
};

export function normalizeThemeMode(value: unknown): ThemeMode {
    return value === "press" || value === "ink" ? value : "press";
}

interface DevJournalStore {
    // User
    user: User;
    updateUser: (updates: Partial<User>) => void;

    // Projects
    projects: Project[];
    addProject: (project: Omit<Project, "id" | "slug" | "createdAt" | "updatedAt">) => Project;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProjectById: (id: string) => Project | undefined;
    getProjectBySlug: (slug: string) => Project | undefined;

    // Entries
    entries: Entry[];
    addEntry: (entry: Omit<Entry, "id" | "isPublic" | "createdAt" | "updatedAt">) => Entry;
    updateEntry: (id: string, updates: Partial<Entry>) => void;
    deleteEntry: (id: string) => void;
    getEntriesByProjectId: (projectId: string) => Entry[];
    getPublicEntriesByProjectId: (projectId: string) => Entry[];
    getPublicProjects: () => Project[];

    // Inbox capture
    inboxCaptures: InboxCapture[];
    addInboxCapture: (content: string, projectId?: string) => void;
    assignInboxCaptureProject: (id: string, projectId?: string) => void;
    deleteInboxCapture: (id: string) => void;
    peekInboxCapture: (id: string) => InboxCapture | undefined;
    consumeInboxCapture: (id: string) => InboxCapture | undefined;

    // UI preferences
    uiPreferences: UiPreferences;
    updateUiPreferences: (updates: Partial<UiPreferences>) => void;

    // Unified Portability (.devjournal)
    exportJournal: () => void;
    exportSelectedProjects: (projectIds: string[]) => void;
    importDevJournal: (file: File) => Promise<{ success: boolean; message: string }>;
}

export const useDevJournalStore = create<DevJournalStore>()(
    persist(
        (set, get) => ({
            // Initial user state
            user: {
                id: "default-user",
                name: "Your Name",
                role: "Software Engineer",
                bio: "Building in public. Documenting the journey.",
                socialLinks: {
                    github: "",
                    twitter: "",
                    linkedin: "",
                    email: "",
                },
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: { ...state.user, ...updates },
                })),

            uiPreferences: defaultUiPreferences,

            updateUiPreferences: (updates) =>
                set((state) => ({
                    uiPreferences: { ...state.uiPreferences, ...updates },
                })),

            // Projects
            projects: [],

            addProject: (project) => {
                const now = new Date().toISOString();
                const newProject: Project = {
                    ...project,
                    id: generateId(),
                    slug: generateSlug(project.name),
                    createdAt: now,
                    updatedAt: now,
                };
                set((state) => ({ projects: [...state.projects, newProject] }));
                return newProject;
            },

            updateProject: (id, updates) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                            : p
                    ),
                })),

            deleteProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                    entries: state.entries.filter((e) => e.projectId !== id),
                })),

            getProjectById: (id) => get().projects.find((p) => p.id === id),

            getProjectBySlug: (slug) => get().projects.find((p) => p.slug === slug),

            // Entries
            entries: [],

            addEntry: (entry) => {
                const now = new Date().toISOString();
                const newEntry: Entry = {
                    ...entry,
                    id: generateId(),
                    isPublic: false,
                    createdAt: now,
                    updatedAt: now,
                };
                set((state) => ({ entries: [...state.entries, newEntry] }));
                return newEntry;
            },

            updateEntry: (id, updates) =>
                set((state) => ({
                    entries: state.entries.map((e) =>
                        e.id === id
                            ? { ...e, ...updates, updatedAt: new Date().toISOString() }
                            : e
                    ),
                })),

            deleteEntry: (id) =>
                set((state) => ({
                    entries: state.entries.filter((e) => e.id !== id),
                })),

            getEntriesByProjectId: (projectId) =>
                get().entries.filter((e) => e.projectId === projectId)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

            getPublicEntriesByProjectId: (projectId) =>
                get().entries.filter((e) => e.projectId === projectId && e.isPublic)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

            getPublicProjects: () =>
                get().projects.filter((p) => {
                    const publicEntries = get().entries.filter(
                        (e) => e.projectId === p.id && e.isPublic
                    );
                    return publicEntries.length > 0;
                }),

            // Inbox capture
            inboxCaptures: [],

            addInboxCapture: (content, projectId) =>
                set((state) => ({
                    inboxCaptures: [
                        {
                            id: generateId(),
                            content: content.trim(),
                            projectId,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.inboxCaptures,
                    ],
                })),

            assignInboxCaptureProject: (id, projectId) =>
                set((state) => ({
                    inboxCaptures: state.inboxCaptures.map((capture) =>
                        capture.id === id ? { ...capture, projectId } : capture
                    ),
                })),

            deleteInboxCapture: (id) =>
                set((state) => ({
                    inboxCaptures: state.inboxCaptures.filter((item) => item.id !== id),
                })),

            peekInboxCapture: (id) => get().inboxCaptures.find((capture) => capture.id === id),

            consumeInboxCapture: (id) => {
                const item = get().inboxCaptures.find((capture) => capture.id === id);
                if (!item) return undefined;

                set((state) => ({
                    inboxCaptures: state.inboxCaptures.filter((capture) => capture.id !== id),
                }));

                return item;
            },

            // Unified Export (.devjournal)
            exportJournal: () => {
                const state = get();
                const exportData = {
                    version: "1.0",
                    type: "global",
                    exportedAt: new Date().toISOString(),
                    user: state.user,
                    uiPreferences: state.uiPreferences,
                    projects: state.projects,
                    entries: state.entries,
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const date = formatLocalDate();
                link.href = url;
                link.download = `devjournal-backup-${date}.devjournal`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            // Selective Project Export
            exportSelectedProjects: (projectIds) => {
                const state = get();
                const selectedProjects = state.projects.filter((p) => projectIds.includes(p.id));
                const selectedEntries = state.entries.filter((e) => projectIds.includes(e.projectId));

                const exportData = {
                    version: "1.0",
                    type: "selective",
                    exportedAt: new Date().toISOString(),
                    projects: selectedProjects,
                    entries: selectedEntries,
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const fileName = selectedProjects.length === 1
                    ? `project-${selectedProjects[0].name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
                    : `selected-projects-${formatLocalDate()}`;

                link.href = url;
                link.download = `${fileName}.devjournal`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            // Unified Smart Import
            importDevJournal: async (file) => {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);

                    if (data.version !== "1.0") {
                        return { success: false, message: "Unsupported or invalid DevJournal file version." };
                    }

                    const state = get();
                    const projectsToImport: Project[] = [];
                    const entriesToImport: Entry[] = [];

                    let importedUiPreferences: UiPreferences | undefined;

                    // 1. Resolve what to import
                    if (data.type === "global") {
                        if (!Array.isArray(data.projects) || !Array.isArray(data.entries)) {
                            return {
                                success: false,
                                message: "Invalid global DevJournal payload.",
                            };
                        }

                        projectsToImport.push(...data.projects);
                        entriesToImport.push(...data.entries);

                        if (data.uiPreferences && typeof data.uiPreferences === "object") {
                            importedUiPreferences = {
                                ...defaultUiPreferences,
                                ...data.uiPreferences,
                                themeMode: normalizeThemeMode(data.uiPreferences.themeMode),
                            };
                        }
                        // Optionally update user bio/data? Keeping merging non-destructive for user too.
                    } else if (data.type === "selective" || data.type === "project") {
                        const projs = Array.isArray(data.projects)
                            ? data.projects
                            : data.project
                                ? [data.project]
                                : [];
                        const safeEntries = Array.isArray(data.entries) ? data.entries : [];

                        projectsToImport.push(...projs);
                        entriesToImport.push(...safeEntries);
                    } else {
                        return { success: false, message: "Unknown DevJournal content type." };
                    }

                    if (projectsToImport.length === 0) {
                        return { success: false, message: "No projects found to import." };
                    }

                    const existingProjects = [...state.projects];
                    const existingEntries = [...state.entries];

                    // 2. Process each project with Windows-style renaming
                    const projectMappings: Record<string, string> = {}; // Old ID -> New ID

                    let importedProjectsCount = 0;

                    projectsToImport.forEach(incomingProj => {
                        if (!incomingProj?.id || !incomingProj?.name) {
                            return;
                        }

                        let finalName = incomingProj.name;
                        let counter = 1;

                        while (existingProjects.some(p => p.name === finalName)) {
                            finalName = `${incomingProj.name} (${counter})`;
                            counter++;
                        }

                        const newProjectId = generateId();
                        projectMappings[incomingProj.id] = newProjectId;

                        existingProjects.push({
                            ...incomingProj,
                            id: newProjectId,
                            name: finalName,
                            slug: generateSlug(finalName),
                            createdAt: incomingProj.createdAt || new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });

                        importedProjectsCount++;
                    });

                    if (importedProjectsCount === 0) {
                        return { success: false, message: "No valid projects found to import." };
                    }

                    // 3. Process entries linked to these projects
                    entriesToImport.forEach(incomingEntry => {
                        const newProjectId = projectMappings[incomingEntry.projectId];
                        if (newProjectId) {
                            existingEntries.push({
                                ...incomingEntry,
                                id: generateId(),
                                projectId: newProjectId,
                                updatedAt: new Date().toISOString()
                            });
                        }
                    });

                    // Update state
                    set({
                        projects: existingProjects,
                        entries: existingEntries,
                        ...(importedUiPreferences ? { uiPreferences: importedUiPreferences } : {}),
                    });

                    return {
                        success: true,
                        message: `Successfully imported ${importedProjectsCount} projects.`
                    };

                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : "Failed to import .devjournal file.",
                    };
                }
            },

        }),
        {
            name: "devjournal-storage",
            version: 4,
            migrate: (persistedState) => {
                const state = persistedState as Partial<DevJournalStore>;
                // v4 replaced the noir/calm-focus themes with press/ink
                const themeMode = normalizeThemeMode(state.uiPreferences?.themeMode);

                return {
                    ...state,
                    uiPreferences: {
                        ...defaultUiPreferences,
                        ...state.uiPreferences,
                        themeMode,
                    },
                    inboxCaptures: state.inboxCaptures ?? [],
                };
            },
        }
    )
);
