import { parsePublishingAction, type PublishingAction } from "@/lib/publishing/contract";

export class PublishingConflictError extends Error {}

export interface RevalidationTargets {
    paths: string[];
    tags: string[];
}

export interface PublishingHandlerDependencies {
    configured: boolean;
    authorize: (token: string) => Promise<"owner" | "unauthenticated" | "forbidden">;
    execute: (action: PublishingAction, token: string) => Promise<RevalidationTargets>;
    revalidate: (targets: RevalidationTargets) => void | Promise<void>;
}

function json(status: number, body: Record<string, unknown>) {
    return Response.json(body, { status });
}

function bearerToken(request: Request) {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return null;
    const token = authorization.slice(7).trim();
    return token || null;
}

export function createPublishingHandler(dependencies: PublishingHandlerDependencies) {
    return async function handlePublishing(request: Request): Promise<Response> {
        if (!dependencies.configured) {
            return json(503, { ok: false, message: "Publishing is not configured." });
        }

        const declaredLength = Number(request.headers.get("content-length") ?? 0);
        if (declaredLength > 512_000) {
            return json(413, { ok: false, message: "Publishing request is too large." });
        }

        const rawBody = await request.text();
        if (rawBody.length > 512_000) {
            return json(413, { ok: false, message: "Publishing request is too large." });
        }

        const body = (() => {
            try {
                return JSON.parse(rawBody) as unknown;
            } catch {
                return null;
            }
        })();
        const parsed = parsePublishingAction(body);
        if (!parsed.ok) return json(400, { ok: false, message: parsed.error });

        const token = bearerToken(request);
        if (!token) return json(401, { ok: false, message: "Connect the owner account to publish." });

        const authorization = await dependencies.authorize(token).catch(() => "unauthenticated" as const);
        if (authorization === "unauthenticated") {
            return json(401, { ok: false, message: "The owner session expired. Reconnect and try again." });
        }
        if (authorization === "forbidden") {
            return json(403, { ok: false, message: "This account cannot publish this portfolio." });
        }

        try {
            const targets = await dependencies.execute(parsed.value, token);
            await dependencies.revalidate(targets);
            return json(200, { ok: true });
        } catch (error) {
            if (error instanceof PublishingConflictError) {
                return json(409, { ok: false, message: error.message });
            }
            console.error("Publishing mutation failed:", error);
            return json(500, { ok: false, message: "Publishing failed. Your local work is unchanged." });
        }
    };
}
