import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Project, Entry } from "./types";
import { generateId, generateSlug } from "./utils";

interface DevJournalStore {
    // User
    user: User;
    updateUser: (updates: Partial<User>) => void;

    // Projects
    projects: Project[];
    addProject: (project: Omit<Project, "id" | "slug" | "createdAt" | "updatedAt">) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProjectById: (id: string) => Project | undefined;
    getProjectBySlug: (slug: string) => Project | undefined;

    // Entries
    entries: Entry[];
    addEntry: (entry: Omit<Entry, "id" | "createdAt" | "updatedAt">) => void;
    updateEntry: (id: string, updates: Partial<Entry>) => void;
    deleteEntry: (id: string) => void;
    getEntriesByProjectId: (projectId: string) => Entry[];
    getPublicEntriesByProjectId: (projectId: string) => Entry[];
    getPublicProjects: () => Project[];

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

            // Projects
            projects: [],

            addProject: (project) =>
                set((state) => {
                    const newProject: Project = {
                        ...project,
                        id: generateId(),
                        slug: generateSlug(project.name),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    return { projects: [...state.projects, newProject] };
                }),

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

            addEntry: (entry) =>
                set((state) => {
                    const newEntry: Entry = {
                        ...entry,
                        id: generateId(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    return { entries: [...state.entries, newEntry] };
                }),

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

            // Unified Export (.devjournal)
            exportJournal: () => {
                const state = get();
                const exportData = {
                    version: "1.0",
                    type: "global",
                    exportedAt: new Date().toISOString(),
                    user: state.user,
                    projects: state.projects,
                    entries: state.entries,
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const date = new Date().toISOString().split("T")[0];
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
                    : `selected-projects-${new Date().toISOString().split("T")[0]}`;

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

                    if (!data.version) {
                        return { success: false, message: "Invalid file format." };
                    }

                    const state = get();
                    const projectsToImport: Project[] = [];
                    const entriesToImport: Entry[] = [];

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
                        entries: existingEntries
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
        }
    )
);
