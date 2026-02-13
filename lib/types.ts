/**
 * User profile data shown on portfolio and editor surfaces.
 */
export interface User {
    id: string;
    name: string;
    role: string;
    bio: string;
    socialLinks: {
        github?: string;
        twitter?: string;
        linkedin?: string;
        email?: string;
    };
}

/**
 * Project metadata persisted in local state and/or Supabase.
 */
export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    techStack: string[];
    repositoryLink?: string;
    status: "in-progress" | "shipped";
    createdAt: string;
    updatedAt: string;
}

/**
 * Canonical entry classification used throughout the app.
 */
export type EntryType = "feature" | "fix" | "refactor" | "design" | "journal";

/**
 * Flexible template payload for structured entry details.
 */
export type EntryTemplateData = Record<string, unknown>;

/**
 * Journal entry domain model.
 */
export interface Entry {
    id: string;
    projectId: string;
    entryType: EntryType;
    title: string;
    content: string;
    templateData?: EntryTemplateData;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Quick-capture item that can later be converted into a project entry.
 */
export interface InboxCapture {
    id: string;
    content: string;
    projectId?: string;
    createdAt: string;
}
