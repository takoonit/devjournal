import { describe, expect, test } from "bun:test";
import {
    createPublishingHandler,
    PublishingConflictError,
    type PublishingHandlerDependencies,
} from "../lib/publishing/handler";

const validAction = {
    type: "unpublish-entry",
    entrySourceId: "entry-1",
    projectSlug: "project-1",
};

function request(body: unknown, token = "owner-token") {
    return new Request("http://localhost/api/publishing", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
}

function dependencies(overrides: Partial<PublishingHandlerDependencies> = {}): PublishingHandlerDependencies {
    return {
        configured: true,
        authorize: async () => "owner",
        execute: async () => ({ paths: ["/portfolio/project-1"], tags: ["portfolio"] }),
        revalidate: () => undefined,
        ...overrides,
    };
}

describe("publishing route handler", () => {
    test("reports missing Supabase configuration", async () => {
        const response = await createPublishingHandler(dependencies({ configured: false }))(request(validAction));

        expect(response.status).toBe(503);
    });

    test("rejects malformed actions before authorization", async () => {
        let authorized = false;
        const response = await createPublishingHandler(dependencies({
            authorize: async () => {
                authorized = true;
                return "owner";
            },
        }))(request({ type: "unknown" }));

        expect(response.status).toBe(400);
        expect(authorized).toBe(false);
    });

    test("rejects a missing bearer token", async () => {
        const response = await createPublishingHandler(dependencies())(request(validAction, ""));

        expect(response.status).toBe(401);
    });

    test("rejects an expired token", async () => {
        const response = await createPublishingHandler(dependencies({ authorize: async () => "unauthenticated" }))(request(validAction));

        expect(response.status).toBe(401);
    });

    test("rejects an authenticated non-owner", async () => {
        const response = await createPublishingHandler(dependencies({ authorize: async () => "forbidden" }))(request(validAction));

        expect(response.status).toBe(403);
    });

    test("returns conflicts without revalidating", async () => {
        let revalidated = false;
        const response = await createPublishingHandler(dependencies({
            execute: async () => { throw new PublishingConflictError("Project source conflict."); },
            revalidate: () => { revalidated = true; },
        }))(request(validAction));

        expect(response.status).toBe(409);
        expect(revalidated).toBe(false);
    });

    test("executes and revalidates a valid owner mutation", async () => {
        const calls: string[] = [];
        const response = await createPublishingHandler(dependencies({
            execute: async (action) => {
                calls.push(action.type);
                return { paths: ["/portfolio/project-1"], tags: ["portfolio", "portfolio-entries"] };
            },
            revalidate: ({ paths, tags }) => calls.push(...paths, ...tags),
        }))(request(validAction));

        expect(response.status).toBe(200);
        expect(calls).toEqual([
            "unpublish-entry",
            "/portfolio/project-1",
            "portfolio",
            "portfolio-entries",
        ]);
    });
});
