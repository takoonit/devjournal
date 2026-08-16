"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    disconnectOwner,
    getOwnerConnection,
    sendOwnerMagicLink,
    type OwnerConnection,
} from "@/lib/publishing/client";
import { inputClasses } from "@/components/ui/form-styles";

const unknownConnection: OwnerConnection = { configured: true, connected: false, owner: false };

export function PublishingSection() {
    const [connection, setConnection] = useState<OwnerConnection>(unknownConnection);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            setConnection(await getOwnerConnection());
        } catch {
            setConnection({ configured: true, connected: false, owner: false, error: "Could not reach Supabase." });
        }
        setLoading(false);
    };

    useEffect(() => { void refresh(); }, []);

    const connect = async () => {
        if (!email.trim()) {
            setMessage("Enter the owner email, then try again.");
            return;
        }
        setLoading(true);
        const result = await sendOwnerMagicLink(email.trim());
        setMessage(result.message);
        setLoading(false);
    };

    const disconnect = async () => {
        setLoading(true);
        await disconnectOwner();
        setMessage("Owner account disconnected from this browser.");
        await refresh();
    };

    return (
        <div>
            {loading ? (
                <p className="flex items-center gap-2 text-ui text-text-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Checking owner connection…
                </p>
            ) : !connection.configured ? (
                <div className="border-y border-rule/15 py-5">
                    <p className="text-ui text-text-primary">Publishing is not configured.</p>
                    <p className="mt-2 text-ui text-text-muted">Add the public Supabase URL and anonymous key, then reload this page.</p>
                </div>
            ) : connection.connected ? (
                <div className="border-y border-rule/15 py-5">
                    <p className="text-ui text-text-primary">
                        {connection.error
                            ? "Could not verify the publishing owner"
                            : connection.owner
                                ? "Owner connected"
                                : "Signed in, but this account is not the publishing owner"}
                    </p>
                    <p className="mt-1 font-mono text-meta text-text-muted">{connection.email}</p>
                    {connection.userId ? <p className="mt-1 break-all font-mono text-meta text-text-muted">UUID {connection.userId}</p> : null}
                    {connection.error ? (
                        <p className="mt-3 text-ui text-warning">{connection.error} Check the connection and try again.</p>
                    ) : !connection.owner ? (
                        <p className="mt-3 text-ui text-warning">
                            Ask the database administrator to insert this account UUID into <code>owner_settings</code>, then reconnect.
                        </p>
                    ) : null}
                    <button type="button" onClick={disconnect} className="m3-button-outlined control-target mt-4 font-sans text-label">
                        Disconnect
                    </button>
                </div>
            ) : (
                <div className="space-y-4 border-y border-rule/15 py-5">
                    {connection.error ? <p className="text-ui text-warning">{connection.error} Check the connection and try again.</p> : null}
                    <div>
                        <label htmlFor="publishing-email" className="mb-2 block font-mono text-label uppercase text-text-secondary">Owner email</label>
                        <input
                            id="publishing-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    void connect();
                                }
                            }}
                            className={inputClasses}
                            placeholder="owner@example.com"
                        />
                    </div>
                    <button type="button" onClick={() => void connect()} className="m3-button-outlined control-target font-sans text-label">
                        Email sign-in link
                    </button>
                </div>
            )}
            {message ? <p role="status" className="mt-3 text-ui text-text-secondary">{message}</p> : null}
            {connection.configured ? (
                <button type="button" onClick={() => void refresh()} className="control-target mt-2 link-ink justify-start font-mono text-meta">
                    Check status again
                </button>
            ) : null}
            <p className="mt-3 text-ui italic text-text-muted">Private drafts stay in this browser. Publishing always requires the connected owner and an explicit public action.</p>
        </div>
    );
}
