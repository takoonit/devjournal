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

    // Export/Import
    exportJournal: () => void;
    importJournal: (file: File) => Promise<{ success: boolean; message: string }>;
    exportProjectJournal: (projectId: string) => void;
    importProjectJournal: (file: File) => Promise<{ success: boolean; message: string }>;
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

            // Export journal as JSON file
            exportJournal: () => {
                const state = get();
                const exportData = {
                    version: "1.0",
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
                link.download = `devjournal-export-${date}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            // Import journal from JSON file
            importJournal: async (file: File) => {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);

                    // Validate structure
                    if (!data.version || !data.user || !data.projects || !data.entries) {
                        return {
                            success: false,
                            message: "Invalid journal file format. Missing required fields.",
                        };
                    }

                    // Validate data types
                    if (!Array.isArray(data.projects) || !Array.isArray(data.entries)) {
                        return {
                            success: false,
                            message: "Invalid journal file format. Projects and entries must be arrays.",
                        };
                    }

                    // Import the data (replace all)
                    set({
                        user: data.user,
                        projects: data.projects,
                        entries: data.entries,
                    });

                    return {
                        success: true,
                        message: `Successfully imported ${data.projects.length} projects and ${data.entries.length} entries.`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : "Failed to import journal.",
                    };
                }
            },

            // Export specific project and its entries
            exportProjectJournal: (projectId: string) => {
                const state = get();
                const project = state.projects.find((p) => p.id === projectId);
                if (!project) return;

                const entries = state.entries.filter((e) => e.projectId === projectId);

                const exportData = {
                    version: "1.0",
                    type: "project",
                    exportedAt: new Date().toISOString(),
                    project,
                    entries,
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const safeName = project.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
                link.href = url;
                link.download = `project-${safeName}-export.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            // Import a project journal as a new project
            importProjectJournal: async (file: File) => {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);

                    // Validate
                    if (!data.project || !Array.isArray(data.entries)) {
                        return {
                            success: false,
                            message: "Invalid project journal file format.",
                        };
                    }

                    // Generate new IDs to avoid collision and allow "importing as new"
                    const newProjectId = generateId();
                    const newProject: Project = {
                        ...data.project,
                        id: newProjectId,
                        slug: generateSlug(data.project.name + " (Imported " + new Date().toLocaleTimeString() + ")"),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    const newEntries: Entry[] = data.entries.map((entry: Entry) => ({
                        ...entry,
                        id: generateId(),
                        projectId: newProjectId,
                        createdAt: entry.createdAt, // Preserve original timestamps for logs? Or update?
                        updatedAt: new Date().toISOString(),
                    }));

                    set((state) => ({
                        projects: [...state.projects, newProject],
                        entries: [...state.entries, ...newEntries],
                    }));

                    return {
                        success: true,
                        message: `Successfully imported "${newProject.name}" with ${newEntries.length} entries.`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : "Failed to import project journal.",
                    };
                }
            },
        }),
        {
            name: "devjournal-storage",
        }
    )
);
