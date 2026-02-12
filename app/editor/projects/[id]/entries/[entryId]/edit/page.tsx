"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2, Save } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";
import type { EntryType } from "@/lib/types";
import { ENTRY_TYPE_OPTIONS, getEntryContent, getEntryType } from "@/lib/entry-types";
import { useToast } from "@/components/ui/toast";

export default function EditEntryPage({ params }: { params: Promise<{ id: string; entryId: string }> }) {
    const { id, entryId } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const { projects, entries, updateEntry } = useDevJournalStore();

    const project = projects.find((p) => p.id === id);
    const entry = entries.find((item) => item.id === entryId);

    const baseType = useMemo(() => (entry ? getEntryType(entry) : "journal"), [entry]) as EntryType;
    const baseContent = useMemo(() => (entry ? getEntryContent(entry) : ""), [entry]);

    const [entryType, setEntryType] = useState<EntryType>(baseType);
    const [title, setTitle] = useState(entry?.title ?? "");
    const [content, setContent] = useState(baseContent);
    const [details, setDetails] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const syncedEntryIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!entry) return;
        if (syncedEntryIdRef.current === entry.id) return;

        const [mainContent, detailsContent = ""] = baseContent.split("\n\n---\n", 2);

        setEntryType(baseType);
        setTitle(entry.title ?? "");
        setContent(mainContent ?? "");
        setDetails(detailsContent);
        setShowDetails(detailsContent.trim().length > 0);

        syncedEntryIdRef.current = entry.id;
    }, [entry, baseType, baseContent]);

    if (!project || !entry) {
        return <div className="p-8 text-zinc-100">Entry not found.</div>;
    }

    const canSubmit = title.trim().length > 0 && content.trim().length > 0;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        try {
            await Promise.resolve(
                updateEntry(entry.id, {
                    entryType,
                    title: title.trim(),
                    content: details.trim() ? `${content.trim()}\n\n---\n${details.trim()}` : content.trim(),
                    category: undefined,
                    templateData: undefined,
                })
            );

            addToast({ message: "Entry updated.", type: "success" });
            await Promise.resolve(router.push(`/editor/projects/${project.id}`));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 px-6 pb-20 pt-8">
            <div className="mx-auto max-w-3xl">
                <Link href={`/editor/projects/${project.id}`} className="mb-4 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Project
                </Link>

                <h1 className="mb-6 text-4xl font-extrabold text-white">Edit Entry</h1>

                <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-wider text-zinc-400">Entry type</p>
                        <div className="flex flex-wrap gap-2">
                            {ENTRY_TYPE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setEntryType(option.value)}
                                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${entryType === option.value ? "border-[#ff914d]/40 bg-[#ff914d]/15 text-[#ff914d]" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm text-zinc-300">Title</label>
                        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-zinc-100" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm text-zinc-300">Body</label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="h-52 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-zinc-100" />
                    </div>

                    <div>
                        <button type="button" onClick={() => setShowDetails((prev) => !prev)} className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200">
                            <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} /> More Details
                        </button>
                        {showDetails ? (
                            <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="mt-3 h-28 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-zinc-100" placeholder="Optional tags, links, context, or attachment notes..." />
                        ) : null}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={!canSubmit || isSubmitting} className="inline-flex items-center gap-2 rounded-lg border border-[#ff914d]/30 bg-[#ff914d]/10 px-4 py-2 text-[#ff914d] disabled:opacity-60">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Update Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
