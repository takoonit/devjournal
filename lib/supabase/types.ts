import type { Entry, Project, User } from "@/lib/types";

/**
 * Database row shape for the public profile projection.
 */
export interface ProfileRow {
    id: string;
    name: string;
    role: string;
    bio: string;
    github_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    updated_at: string;
}

/**
 * Database row shape for projects used on editor + portfolio screens.
 */
export interface ProjectRow {
    id: string;
    name: string;
    slug: string;
    description: string;
    tech_stack: string[];
    repository_link: string | null;
    status: "in-progress" | "shipped";
    created_at: string;
    updated_at: string;
}

/**
 * Database row shape for entries.
 */
export interface EntryRow {
    id: string;
    project_id: string;
    entry_type: Entry["entryType"] | null;
    title: string;
    content: string | null;
    template_data: Entry["templateData"] | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Maps a nullable profile row into UI-safe user state with sensible defaults.
 */
export function mapProfileRowToUser(profile: ProfileRow | null): User {
    if (!profile) {
        return {
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
        };
    }

    return {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        bio: profile.bio,
        socialLinks: {
            github: profile.github_url ?? "",
            twitter: profile.twitter_url ?? "",
            linkedin: profile.linkedin_url ?? "",
            email: "",
        },
    };
}

/**
 * Converts a project row from snake_case database fields to app-level camelCase fields.
 */
export function mapProjectRowToProject(project: ProjectRow): Project {
    return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        techStack: project.tech_stack,
        repositoryLink: project.repository_link ?? undefined,
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
    };
}

/**
 * Converts an entry row from snake_case database fields to app-level camelCase fields.
 */
export function mapEntryRowToEntry(entry: EntryRow): Entry {
    return {
        id: entry.id,
        projectId: entry.project_id,
        entryType: entry.entry_type ?? "journal",
        title: entry.title,
        content: entry.content ?? "",
        templateData: entry.template_data ?? undefined,
        isPublic: entry.is_public,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
    };
}
