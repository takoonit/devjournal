import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { createPublishingHandler } from "@/lib/publishing/handler";
import { executePublishingAction } from "@/lib/publishing/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const revalidateTagCompat = revalidateTag as unknown as (tag: string) => void;

function authenticatedClient(token: string) {
    const config = getSupabasePublicConfig();
    if (!config) return null;
    return createClient(config.url, config.publishableKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

export async function POST(request: Request) {
    const handler = createPublishingHandler({
        configured: Boolean(getSupabasePublicConfig()),
        authorize: async (token) => {
            const client = authenticatedClient(token);
            if (!client) return "unauthenticated";

            const { data: { user }, error } = await client.auth.getUser(token);
            if (error || !user) return "unauthenticated";

            const ownerResult = await client.rpc("is_portfolio_owner");
            return ownerResult.error || ownerResult.data !== true ? "forbidden" : "owner";
        },
        execute: async (action, token) => {
            const client = authenticatedClient(token);
            if (!client) throw new Error("Publishing is not configured.");
            return executePublishingAction(client, action);
        },
        revalidate: ({ paths, tags }) => {
            for (const tag of tags) revalidateTagCompat(tag);
            for (const path of paths) revalidatePath(path);
        },
    });
    return handler(request);
}
