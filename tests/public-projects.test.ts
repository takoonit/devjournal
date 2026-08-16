import { describe, expect, test } from "bun:test";
import type { Entry, Project } from "../lib/types";
import { filterProjectsWithPublicEntries } from "../lib/supabase/public-projects";

const project = (id: string): Project => ({
    id,
    name: id,
    slug: id,
    description: "",
    techStack: [],
    status: "in-progress",
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z",
});

const entry = (projectId: string, isPublic: boolean): Entry => ({
    id: `${projectId}-entry`,
    projectId,
    entryType: "journal",
    title: "Entry",
    content: "Content",
    isPublic,
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z",
});

describe("public project filtering", () => {
    test("includes only projects with a public entry", () => {
        const projects = [project("public"), project("private"), project("empty")];
        const entries = [entry("public", true), entry("private", false)];

        expect(filterProjectsWithPublicEntries(projects, entries).map((item) => item.id)).toEqual(["public"]);
    });
});
