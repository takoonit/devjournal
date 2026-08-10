"use client";

import type { PublishingAction } from "@/lib/publishing/contract";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface OwnerConnection {
    configured: boolean;
    connected: boolean;
    owner: boolean;
    email?: string;
    userId?: string;
    error?: string;
}

export interface PublishingClientResult {
    ok: boolean;
    status: number;
    message: string;
}

export async function getOwnerConnection(): Promise<OwnerConnection> {
    const client = getSupabaseBrowserClient();
    if (!client) return { configured: false, connected: false, owner: false };

    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
        return { configured: true, connected: false, owner: false, error: sessionError.message };
    }
    if (!session) return { configured: true, connected: false, owner: false };

    const { data, error } = await client.rpc("is_portfolio_owner");
    return {
        configured: true,
        connected: true,
        owner: !error && data === true,
        email: session.user.email,
        userId: session.user.id,
        error: error?.message,
    };
}

export async function sendOwnerMagicLink(email: string): Promise<PublishingClientResult> {
    const client = getSupabaseBrowserClient();
    if (!client) return { ok: false, status: 503, message: "Publishing is not configured." };

    const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/editor/settings` },
    });
    return error
        ? { ok: false, status: 400, message: error.message }
        : { ok: true, status: 200, message: "Check your email for the owner sign-in link." };
}

export async function disconnectOwner(): Promise<void> {
    await getSupabaseBrowserClient()?.auth.signOut();
}

export async function requestPublishingAction(action: PublishingAction): Promise<PublishingClientResult> {
    const client = getSupabaseBrowserClient();
    if (!client) return { ok: false, status: 503, message: "Publishing is not configured." };

    const { data: { session } } = await client.auth.getSession();
    if (!session) return { ok: false, status: 401, message: "Connect the owner account to publish." };

    try {
        const response = await fetch("/api/publishing", {
            method: "POST",
            headers: {
                authorization: `Bearer ${session.access_token}`,
                "content-type": "application/json",
            },
            body: JSON.stringify(action),
        });
        const body = await response.json().catch(() => ({})) as { message?: string };
        return {
            ok: response.ok,
            status: response.status,
            message: body.message ?? (response.ok ? "Portfolio updated." : "Publishing failed. Your local work is unchanged."),
        };
    } catch {
        return { ok: false, status: 0, message: "Publishing is offline. Your local work is unchanged." };
    }
}
