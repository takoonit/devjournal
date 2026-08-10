import { describe, expect, test } from "bun:test";
import type { Entry, Project, User } from "../lib/types";
import {
    buildEntryWrite,
    buildProfileWrite,
    buildProjectWrite,
    parsePublishingAction,
} from "../lib/publishing/contract";

const profile: User = {
    id: "local-profile-1",
    name: "Ada Lovelace",
    role: "Engineer",
    bio: "Writing the machine in public.",
    socialLinks: {
        github: "https://github.com/ada",
        twitter: "",
        linkedin: "https://linkedin.com/in/ada",
        email: "ada@example.com",
    },
};

const project: Project = {
    id: "local-project-1",
    name: "Analytical Engine",
    slug: "analytical-engine",
    description: "Notes from the engine room.",
    techStack: ["TypeScript"],
    repositoryLink: "https://github.com/ada/engine",
    status: "in-progress",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z",
};

const entry: Entry = {
    id: "local-entry-1",
    projectId: project.id,
    entryType: "feature",
    title: "First calculation",
    content: "The cards finally line up.",
    isPublic: false,
    createdAt: "2026-08-10T01:00:00.000Z",
    updatedAt: "2026-08-10T01:00:00.000Z",
};

describe("publishing action validation", () => {
    test("accepts a complete publish-entry action", () => {
        const result = parsePublishingAction({ type: "publish-entry", profile, project, entry });

        expect(result.ok).toBe(true);
        if (result.ok) expect(result.value.type).toBe("publish-entry");
    });

    test("rejects unsupported actions", () => {
        const result = parsePublishingAction({ type: "publish-everything" });

        expect(result).toEqual({ ok: false, error: "Unsupported publishing action." });
    });

    test("rejects malformed URLs and invalid enums", () => {
        const result = parsePublishingAction({
            type: "publish-entry",
            profile,
            project: { ...project, repositoryLink: "javascript:alert(1)", status: "paused" },
            entry: { ...entry, entryType: "announcement" },
        });

        expect(result.ok).toBe(false);
    });

    test("rejects oversized content at the request boundary", () => {
        const result = parsePublishingAction({
            type: "publish-entry",
            profile,
            project,
            entry: { ...entry, content: "x".repeat(200_001) },
        });

        expect(result).toEqual({ ok: false, error: "Entry content is too long." });
    });

    test("rejects unknown fields instead of allowing overposting", () => {
        const result = parsePublishingAction({
            type: "publish-entry",
            profile,
            project,
            entry,
            is_public: true,
        });

        expect(result).toEqual({ ok: false, error: "Publishing action contains unknown fields." });
    });
});

describe("Supabase write mapping", () => {
    test("maps local IDs to source IDs while leaving database UUIDs alone", () => {
        expect(buildProfileWrite(profile)).toMatchObject({ source_id: profile.id, name: profile.name });
        expect(buildProjectWrite(project)).toMatchObject({ source_id: project.id, slug: project.slug });
        expect(buildEntryWrite(entry, "remote-project-uuid", true)).toMatchObject({
            source_id: entry.id,
            project_id: "remote-project-uuid",
            is_public: true,
        });
    });

    test("never includes private email in the public profile row", () => {
        expect(buildProfileWrite(profile)).not.toHaveProperty("email");
    });
});
