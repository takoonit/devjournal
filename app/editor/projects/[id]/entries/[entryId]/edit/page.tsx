"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";
import type { EntryType } from "@/lib/types";
import { ENTRY_TYPE_OPTIONS, getEntryContent, getEntryType } from "@/lib/entry-types";
import { ENTRY_STAMPS, getEntryStampControlTone } from "@/components/ui/stamp";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type EditEntryDraft = {
    entryType: EntryType;
    title: string;
    content: string;
    details: string;
};

const DETAILS_MARKER = "\n\n<!-- details -->\n";

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
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const syncedEntryIdRef = useRef<string | null>(null);
    const hydratedEntryIdRef = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const draftKey = `entry-draft-${entryId}`;

    useEffect(() => {
        if (!entry) return;
        if (hydratedEntryIdRef.current === entryId) return;

        const raw = localStorage.getItem(draftKey);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw) as EditEntryDraft;
            setEntryType(parsed.entryType ?? baseType);
            setTitle(parsed.title ?? entry.title ?? "");
            setContent(parsed.content ?? baseContent);
            setDetails(parsed.details ?? "");
            setShowDetails(Boolean(parsed.details?.trim()));
        } catch {
            localStorage.removeItem(draftKey);
            return;
        }

        hydratedEntryIdRef.current = entryId;
    }, [draftKey, entry, entryId, baseType, baseContent]);

    useEffect(() => {
        if (!entry) return;
        if (syncedEntryIdRef.current === entry.id) return;

        const markerIndex = baseContent.indexOf(DETAILS_MARKER);
        const mainContent = markerIndex >= 0 ? baseContent.slice(0, markerIndex) : baseContent;
        const detailsContent = markerIndex >= 0 ? baseContent.slice(markerIndex + DETAILS_MARKER.length) : "";

        if (hydratedEntryIdRef.current !== entry.id) {
            setEntryType(baseType);
            setTitle(entry.title ?? "");
            setContent(mainContent ?? "");
            setDetails(detailsContent);
            setShowDetails(detailsContent.trim().length > 0);
        }

        syncedEntryIdRef.current = entry.id;
    }, [entry, baseType, baseContent]);

    useEffect(() => {
        const draft: EditEntryDraft = { entryType, title, content, details };
        localStorage.setItem(draftKey, JSON.stringify(draft));

        const inactivityTimer = window.setTimeout(() => {
            setShowDraftSaved(true);
        }, 10000);

        return () => window.clearTimeout(inactivityTimer);
    }, [draftKey, entryType, title, content, details]);

    useEffect(() => {
        if (!showDraftSaved) return;
        const visibilityTimer = window.setTimeout(() => setShowDraftSaved(false), 2200);
        return () => window.clearTimeout(visibilityTimer);
    }, [showDraftSaved]);

    const selectedTypeDescription = useMemo(() => {
        const selected = ENTRY_TYPE_OPTIONS.find((option) => option.value === entryType);
        return selected?.description ?? "";
    }, [entryType]);

    const wordCount = useMemo(() => {
        const text = `${content} ${details}`.trim();
        return text ? text.split(/\s+/).filter(Boolean).length : 0;
    }, [content, details]);

    const submitShortcut = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    if (!project || !entry) {
        return (
            <div className="mx-auto max-w-measure py-8">
                <p className="text-ui italic text-text-muted">This entry is not on record.</p>
            </div>
        );
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
                    content: details.trim() ? `${content.trim()}${DETAILS_MARKER}${details.trim()}` : content.trim(),
                    templateData: undefined,
                })
            );

            localStorage.removeItem(draftKey);
            addToast({ message: "Entry updated.", type: "success" });
            await Promise.resolve(router.push(`/editor/projects/${project.id}`));
        } catch (err) {
            console.error("Failed to update entry:", err);
            addToast({ message: "Failed to update entry. Please try again.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="mx-auto max-w-3xl">
                <Link
                    href={`/editor/projects/${project.id}`}
                    className="control-target mb-8 justify-start gap-2 font-mono text-label uppercase text-text-muted transition-colors duration-subtle hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> {project.name}
                </Link>

                <form ref={formRef} onSubmit={onSubmit} className="sheet px-7 py-8 md:px-12 md:py-10">
                    <div className="mb-8">
                        <div className="entry-type-picker" role="group" aria-label="Entry type">
                            {ENTRY_TYPE_OPTIONS.map((option) => {
                                const active = entryType === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setEntryType(option.value)}
                                        className={cn(
                                            "control-target stamp stamp-control transition-colors",
                                            getEntryStampControlTone(option.value, active)
                                        )}
                                    >
                                        <span className="opacity-70" aria-hidden="true">{ENTRY_STAMPS[option.value].code}</span>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-2.5 text-ui italic text-text-muted">{selectedTypeDescription}</p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={submitShortcut}
                            className="field-target -ml-3 w-full border-0 bg-transparent pl-3 font-serif text-title text-text-primary focus:outline-none focus-visible:shadow-[inset_2px_0_0_rgb(var(--color-accent-base))]"
                            placeholder="What changed?"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="sr-only">Body</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={submitShortcut}
                            className="-ml-3 min-h-composer w-full max-w-measure resize-y border-0 bg-transparent pl-3 text-prose text-text-primary focus:outline-none focus-visible:shadow-[inset_2px_0_0_rgb(var(--color-accent-base))]"
                        />
                    </div>

                    <div className="mt-2 border-t border-rule/10 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowDetails((prev) => !prev)}
                            aria-expanded={showDetails}
                            className="control-target justify-start gap-1.5 font-mono text-label uppercase text-text-muted transition-colors duration-subtle hover:text-text-secondary"
                        >
                            <ChevronDown
                                className={cn("h-3 w-3 transition-transform duration-subtle", showDetails && "rotate-180")}
                                strokeWidth={1.5}
                            />
                            More details
                        </button>
                        {showDetails ? (
                            <>
                                <label htmlFor="details" className="sr-only">Details</label>
                                <textarea
                                    id="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    onKeyDown={submitShortcut}
                                    className="-ml-3 mt-3 min-h-composer-details w-full max-w-measure resize-y border-0 bg-transparent pl-3 text-ui text-text-secondary focus:outline-none focus-visible:shadow-[inset_2px_0_0_rgb(var(--color-accent-base))]"
                                    placeholder="Optional tags, links, context, or attachment notes..."
                                />
                            </>
                        ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule/15 pt-5">
                        <p className="font-mono text-meta tabular-nums text-text-muted">
                            {wordCount} {wordCount === 1 ? "word" : "words"}
                            <span
                                aria-hidden={!showDraftSaved}
                                className={cn(
                                    "transition-opacity duration-subtle",
                                    showDraftSaved ? "opacity-100" : "opacity-0"
                                )}
                            >
                                {" "}· draft saved
                            </span>
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="hidden font-mono text-meta text-text-muted sm:block" aria-hidden="true">
                                ⌘↵
                            </span>
                            <button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="control-target gap-2 rounded border border-transparent bg-accent px-5 py-2.5 font-mono text-label uppercase text-accent-contrast transition-colors duration-subtle hover:bg-accent-soft disabled:cursor-not-allowed disabled:border-surface-border disabled:bg-surface-base disabled:text-text-muted"
                            >
                                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} /> : null}
                                Update Entry
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
