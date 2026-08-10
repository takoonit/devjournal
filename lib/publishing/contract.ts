import type { Entry, EntryType, Project, User } from "@/lib/types";

const ENTRY_TYPES = new Set<EntryType>(["feature", "fix", "refactor", "design", "journal"]);
const PROJECT_STATUSES = new Set<Project["status"]>(["in-progress", "shipped"]);
const SOURCE_ID_MAX = 160;
const ENTRY_CONTENT_MAX = 200_000;

export type PublishingAction =
    | { type: "publish-entry"; profile: User; project: Project; entry: Entry }
    | { type: "update-entry"; project: Project; entry: Entry }
    | { type: "unpublish-entry"; entrySourceId: string; projectSlug: string }
    | { type: "delete-entry"; entrySourceId: string; projectSlug: string }
    | { type: "sync-project"; project: Project; oldSlug?: string }
    | { type: "sync-profile"; profile: User }
    | { type: "delete-project"; projectSourceId: string; projectSlug: string };

export type PublishingParseResult =
    | { ok: true; value: PublishingAction }
    | { ok: false; error: string };

export interface ProfileWrite {
    source_id: string;
    name: string;
    role: string;
    bio: string;
    github_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
}

export interface ProjectWrite {
    source_id: string;
    name: string;
    slug: string;
    description: string;
    tech_stack: string[];
    repository_link: string | null;
    status: Project["status"];
    created_at: string;
    updated_at: string;
}

export interface EntryWrite {
    source_id: string;
    project_id: string;
    entry_type: EntryType;
    title: string;
    content: string;
    template_data: Entry["templateData"] | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
    const keys = new Set(allowed);
    return Object.keys(value).every((key) => keys.has(key));
}

function isString(value: unknown, max: number, allowEmpty = false): value is string {
    return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}

function isSourceId(value: unknown): value is string {
    return isString(value, SOURCE_ID_MAX) && !/[\u0000-\u001f]/.test(value);
}

function isSlug(value: unknown): value is string {
    return isString(value, 160) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isHttpUrl(value: unknown, allowEmpty = true): value is string | undefined {
    if (value === undefined || (allowEmpty && value === "")) return true;
    if (typeof value !== "string" || value.length > 2_048) return false;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function isIsoDate(value: unknown): value is string {
    return typeof value === "string" && value.length <= 40 && !Number.isNaN(Date.parse(value));
}

function isUser(value: unknown): value is User {
    if (!isRecord(value) || !isRecord(value.socialLinks)) return false;
    return hasOnlyKeys(value, ["id", "name", "role", "bio", "socialLinks"])
        && hasOnlyKeys(value.socialLinks, ["github", "twitter", "linkedin", "email"])
        && isSourceId(value.id)
        && isString(value.name, 120)
        && isString(value.role, 160)
        && isString(value.bio, 4_000, true)
        && isHttpUrl(value.socialLinks.github)
        && isHttpUrl(value.socialLinks.twitter)
        && isHttpUrl(value.socialLinks.linkedin)
        && (value.socialLinks.email === undefined || isString(value.socialLinks.email, 320, true));
}

function isProject(value: unknown): value is Project {
    if (!isRecord(value) || !Array.isArray(value.techStack)) return false;
    return hasOnlyKeys(value, [
        "id", "name", "slug", "description", "techStack", "repositoryLink",
        "status", "createdAt", "updatedAt",
    ])
        && isSourceId(value.id)
        && isString(value.name, 160)
        && isSlug(value.slug)
        && isString(value.description, 8_000, true)
        && value.techStack.length <= 30
        && value.techStack.every((item) => isString(item, 80))
        && isHttpUrl(value.repositoryLink)
        && PROJECT_STATUSES.has(value.status as Project["status"])
        && isIsoDate(value.createdAt)
        && isIsoDate(value.updatedAt);
}

function entryError(value: unknown): string | null {
    if (!isRecord(value)) return "Entry is invalid.";
    if (!hasOnlyKeys(value, [
        "id", "projectId", "entryType", "title", "content", "templateData",
        "isPublic", "createdAt", "updatedAt",
    ])) return "Entry contains unknown fields.";
    if (!isSourceId(value.id) || !isSourceId(value.projectId)) return "Entry source identifier is invalid.";
    if (!ENTRY_TYPES.has(value.entryType as EntryType)) return "Entry type is invalid.";
    if (!isString(value.title, 240)) return "Entry title is invalid.";
    if (typeof value.content !== "string") return "Entry content is invalid.";
    if (value.content.length > ENTRY_CONTENT_MAX) return "Entry content is too long.";
    if (typeof value.isPublic !== "boolean") return "Entry visibility is invalid.";
    if (!isIsoDate(value.createdAt) || !isIsoDate(value.updatedAt)) return "Entry dates are invalid.";
    if (value.templateData !== undefined && !isRecord(value.templateData)) return "Entry template data is invalid.";
    return null;
}

function parseEntryAction(value: Record<string, unknown>, withProfile: boolean): PublishingParseResult {
    const allowed = withProfile
        ? ["type", "profile", "project", "entry"]
        : ["type", "project", "entry"];
    if (!hasOnlyKeys(value, allowed)) {
        return { ok: false, error: "Publishing action contains unknown fields." };
    }
    if (withProfile && !isUser(value.profile)) return { ok: false, error: "Profile is invalid." };
    if (!isProject(value.project)) return { ok: false, error: "Project is invalid." };
    const error = entryError(value.entry);
    if (error) return { ok: false, error };
    return { ok: true, value: value as unknown as PublishingAction };
}

export function parsePublishingAction(value: unknown): PublishingParseResult {
    if (!isRecord(value) || typeof value.type !== "string") {
        return { ok: false, error: "Unsupported publishing action." };
    }

    switch (value.type) {
        case "publish-entry":
            return parseEntryAction(value, true);
        case "update-entry":
            return parseEntryAction(value, false);
        case "sync-profile":
            if (!hasOnlyKeys(value, ["type", "profile"])) {
                return { ok: false, error: "Publishing action contains unknown fields." };
            }
            return isUser(value.profile)
                ? { ok: true, value: value as unknown as PublishingAction }
                : { ok: false, error: "Profile is invalid." };
        case "sync-project":
            if (!hasOnlyKeys(value, ["type", "project", "oldSlug"])) {
                return { ok: false, error: "Publishing action contains unknown fields." };
            }
            if (!isProject(value.project)) return { ok: false, error: "Project is invalid." };
            if (value.oldSlug !== undefined && !isSlug(value.oldSlug)) return { ok: false, error: "Old project slug is invalid." };
            return { ok: true, value: value as unknown as PublishingAction };
        case "unpublish-entry":
        case "delete-entry":
            if (!hasOnlyKeys(value, ["type", "entrySourceId", "projectSlug"])) {
                return { ok: false, error: "Publishing action contains unknown fields." };
            }
            return isSourceId(value.entrySourceId) && isSlug(value.projectSlug)
                ? { ok: true, value: value as unknown as PublishingAction }
                : { ok: false, error: "Entry mutation identifiers are invalid." };
        case "delete-project":
            if (!hasOnlyKeys(value, ["type", "projectSourceId", "projectSlug"])) {
                return { ok: false, error: "Publishing action contains unknown fields." };
            }
            return isSourceId(value.projectSourceId) && isSlug(value.projectSlug)
                ? { ok: true, value: value as unknown as PublishingAction }
                : { ok: false, error: "Project mutation identifiers are invalid." };
        default:
            return { ok: false, error: "Unsupported publishing action." };
    }
}

export function buildProfileWrite(profile: User): ProfileWrite {
    return {
        source_id: profile.id,
        name: profile.name.trim(),
        role: profile.role.trim(),
        bio: profile.bio.trim(),
        github_url: profile.socialLinks.github?.trim() || null,
        twitter_url: profile.socialLinks.twitter?.trim() || null,
        linkedin_url: profile.socialLinks.linkedin?.trim() || null,
    };
}

export function buildProjectWrite(project: Project): ProjectWrite {
    return {
        source_id: project.id,
        name: project.name.trim(),
        slug: project.slug,
        description: project.description.trim(),
        tech_stack: project.techStack,
        repository_link: project.repositoryLink?.trim() || null,
        status: project.status,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
    };
}

export function buildEntryWrite(entry: Entry, projectId: string, isPublic: boolean): EntryWrite {
    return {
        source_id: entry.id,
        project_id: projectId,
        entry_type: entry.entryType,
        title: entry.title.trim(),
        content: entry.content,
        template_data: entry.templateData ?? null,
        is_public: isPublic,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
    };
}
