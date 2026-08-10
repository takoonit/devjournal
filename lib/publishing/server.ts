import type { SupabaseClient } from "@supabase/supabase-js";
import type { Entry, Project, User } from "@/lib/types";
import {
    buildEntryWrite,
    buildProfileWrite,
    buildProjectWrite,
    type PublishingAction,
} from "@/lib/publishing/contract";
import { PublishingConflictError, type RevalidationTargets } from "@/lib/publishing/handler";
import { resolveSourceMatch, SourceMatchConflictError, type SourceRow } from "@/lib/publishing/source-match";

type ProjectSourceRow = SourceRow & { slug: string };
type EntrySourceRow = SourceRow & { project_id: string };

function throwMutationError(error: { message: string } | null, fallback: string): void {
    if (error) throw new Error(`${fallback}: ${error.message}`);
}

function publishingConflict(error: unknown): never {
    if (error instanceof SourceMatchConflictError) {
        throw new PublishingConflictError(error.message);
    }
    throw error;
}

async function ensureProfile(client: SupabaseClient, profile: User): Promise<string> {
    const directResult = await client
        .from("profiles")
        .select("id,source_id")
        .eq("source_id", profile.id)
        .limit(2);
    throwMutationError(directResult.error, "Could not read public profile");

    const legacyResult = directResult.data?.length
        ? { data: [], error: null }
        : await client.from("profiles").select("id,source_id").limit(2);
    throwMutationError(legacyResult.error, "Could not inspect legacy profile");

    let match;
    try {
        match = resolveSourceMatch({
            direct: (directResult.data?.[0] as SourceRow | undefined) ?? null,
            legacy: (legacyResult.data ?? []) as SourceRow[],
            allowLegacyAdoption: false,
            resource: "Profile",
        });
    } catch (error) {
        publishingConflict(error);
    }

    const write = buildProfileWrite(profile);
    if (match.kind === "create") {
        const result = await client.from("profiles").insert(write).select("id").single();
        throwMutationError(result.error, "Could not create public profile");
        if (!result.data) throw new Error("Could not create public profile: no row returned.");
        return result.data.id as string;
    }

    const result = await client.from("profiles").update(write).eq("id", match.id);
    throwMutationError(result.error, "Could not update public profile");
    return match.id;
}

async function ensureProject(
    client: SupabaseClient,
    project: Project
): Promise<{ id: string; previousSlug: string | null }> {
    const directResult = await client
        .from("projects")
        .select("id,source_id,slug")
        .eq("source_id", project.id)
        .limit(2);
    throwMutationError(directResult.error, "Could not read public project");

    const slugResult = directResult.data?.length
        ? { data: [], error: null }
        : await client.from("projects").select("id,source_id,slug").eq("slug", project.slug).limit(2);
    throwMutationError(slugResult.error, "Could not inspect project slug");

    let match;
    try {
        match = resolveSourceMatch({
            direct: (directResult.data?.[0] as ProjectSourceRow | undefined) ?? null,
            legacy: (slugResult.data ?? []) as ProjectSourceRow[],
            allowLegacyAdoption: true,
            resource: "Project",
        });
    } catch (error) {
        publishingConflict(error);
    }

    const previousSlug = match.kind === "update"
        ? (directResult.data?.[0] as ProjectSourceRow).slug
        : match.kind === "adopt"
            ? (slugResult.data?.[0] as ProjectSourceRow).slug
            : null;
    const write = buildProjectWrite(project);

    if (match.kind === "create") {
        const result = await client.from("projects").insert(write).select("id").single();
        throwMutationError(result.error, "Could not create public project");
        if (!result.data) throw new Error("Could not create public project: no row returned.");
        return { id: result.data.id as string, previousSlug };
    }

    const { created_at: _createdAt, ...updates } = write;
    const result = await client.from("projects").update(updates).eq("id", match.id);
    throwMutationError(result.error, "Could not update public project");
    return { id: match.id, previousSlug };
}

async function putEntry(client: SupabaseClient, entry: Entry, projectId: string): Promise<void> {
    const existingResult = await client
        .from("entries")
        .select("id,source_id,project_id")
        .eq("source_id", entry.id)
        .limit(2);
    throwMutationError(existingResult.error, "Could not read public entry");

    const existing = existingResult.data?.[0] as EntrySourceRow | undefined;
    if (existing && existing.project_id !== projectId) {
        throw new PublishingConflictError("Entry source identity belongs to another project.");
    }

    const write = buildEntryWrite(entry, projectId, true);
    if (!existing) {
        const result = await client.from("entries").insert(write);
        throwMutationError(result.error, "Could not publish entry");
        return;
    }

    const { created_at: _createdAt, ...updates } = write;
    const result = await client.from("entries").update(updates).eq("id", existing.id);
    throwMutationError(result.error, "Could not update public entry");
}

function targets(slugs: Array<string | null | undefined>, tags: string[]): RevalidationTargets {
    const projectPaths = slugs
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => `/portfolio/${slug}`);
    return {
        paths: Array.from(new Set(["/portfolio", ...projectPaths])),
        tags: Array.from(new Set(["portfolio", ...tags])),
    };
}

export async function executePublishingAction(
    client: SupabaseClient,
    action: PublishingAction
): Promise<RevalidationTargets> {
    switch (action.type) {
        case "publish-entry": {
            await ensureProfile(client, action.profile);
            const remoteProject = await ensureProject(client, action.project);
            await putEntry(client, action.entry, remoteProject.id);
            return targets(
                [remoteProject.previousSlug, action.project.slug],
                ["portfolio-profile", "portfolio-projects", "portfolio-entries"]
            );
        }
        case "update-entry": {
            const remoteProject = await ensureProject(client, action.project);
            await putEntry(client, action.entry, remoteProject.id);
            return targets(
                [remoteProject.previousSlug, action.project.slug],
                ["portfolio-projects", "portfolio-entries"]
            );
        }
        case "sync-profile":
            await ensureProfile(client, action.profile);
            return targets([], ["portfolio-profile"]);
        case "sync-project": {
            const remoteProject = await ensureProject(client, action.project);
            return targets([remoteProject.previousSlug, action.project.slug], ["portfolio-projects"]);
        }
        case "unpublish-entry": {
            const result = await client
                .from("entries")
                .update({ is_public: false })
                .eq("source_id", action.entrySourceId)
                .select("id")
                .maybeSingle();
            throwMutationError(result.error, "Could not unpublish entry");
            if (!result.data) throw new PublishingConflictError("Published entry could not be matched.");
            return targets([action.projectSlug], ["portfolio-projects", "portfolio-entries"]);
        }
        case "delete-entry": {
            const result = await client
                .from("entries")
                .delete()
                .eq("source_id", action.entrySourceId)
                .select("id")
                .maybeSingle();
            throwMutationError(result.error, "Could not delete public entry");
            if (!result.data) throw new PublishingConflictError("Published entry could not be matched.");
            return targets([action.projectSlug], ["portfolio-projects", "portfolio-entries"]);
        }
        case "delete-project": {
            const result = await client
                .from("projects")
                .delete()
                .eq("source_id", action.projectSourceId)
                .select("id")
                .maybeSingle();
            throwMutationError(result.error, "Could not delete public project");
            if (!result.data) throw new PublishingConflictError("Published project could not be matched.");
            return targets([action.projectSlug], ["portfolio-projects", "portfolio-entries"]);
        }
    }
}
