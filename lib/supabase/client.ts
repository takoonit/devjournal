"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient(): SupabaseClient | null {
    if (browserClient !== undefined) return browserClient;

    const config = getSupabasePublicConfig();
    browserClient = config
        ? createClient(config.url, config.publishableKey)
        : null;
    return browserClient;
}
