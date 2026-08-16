"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";
import type { EntryType } from "@/lib/types";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { EntryTypePicker } from "@/components/editor/entry-type-picker";
import { useSubmitShortcut } from "@/components/editor/use-submit-shortcut";
import { requestPublishingAction } from "@/lib/publishing/client";

type EntryDraft = {
    entryType: EntryType;
    title: string;
    content: string;
    details: string;
};

const DETAILS_MARKER = "\n\n<!-- details -->\n";

export default function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const { projects, user, addEntry, updateEntry, consumeInboxCapture } = useDevJournalStore();
    const peekInboxCapture = useDevJournalStore((state) => state.peekInboxCapture);
    const project = projects.find((p) => p.id === id);

    const [entryType, setEntryType] = useState<EntryType>("journal");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [details, setDetails] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [pendingCaptureId, setPendingCaptureId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { shortcutLabel, onSubmitShortcut } = useSubmitShortcut(formRef);

    const draftKey = `devjournal-entry-draft-${id}`;

    useEffect(() => {
        const captureId = searchParams.get("capture");
        if (!captureId) return;
        const capture = peekInboxCapture(captureId);
        if (!capture) return;

        setPendingCaptureId(captureId);
        setEntryType("journal");
        setTitle(capture.content.slice(0, 72));
        setContent(capture.content);
        addToast({ message: "Capture loaded. Finish the note, then save or publish it.", type: "info" });
    }, [addToast, peekInboxCapture, searchParams]);

    useEffect(() => {
        const captureId = searchParams.get("capture");
        if (captureId) return;

        const raw = localStorage.getItem(draftKey);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as EntryDraft;
            setEntryType(parsed.entryType ?? "journal");
            setTitle(parsed.title ?? "");
            setContent(parsed.content ?? "");
            setDetails(parsed.details ?? "");
            if (parsed.details?.trim()) setShowDetails(true);
        } catch {
            localStorage.removeItem(draftKey);
        }
    }, [draftKey, searchParams]);

    useEffect(() => {
        const draft: EntryDraft = { entryType, title, content, details };
        localStorage.setItem(draftKey, JSON.stringify(draft));
    }, [draftKey, entryType, title, content, details]);

    useEffect(() => {
        const inactivityTimer = window.setTimeout(() => {
            setShowDraftSaved(true);
        }, 10000);

        return () => window.clearTimeout(inactivityTimer);
    }, [entryType, title, content, details]);

    useEffect(() => {
        if (!showDraftSaved) return;
        const visibilityTimer = window.setTimeout(() => setShowDraftSaved(false), 2200);
        return () => window.clearTimeout(visibilityTimer);
    }, [showDraftSaved]);

    const wordCount = useMemo(() => {
        const text = `${content} ${details}`.trim();
        return text ? text.split(/\s+/).filter(Boolean).length : 0;
    }, [content, details]);

    if (!project) {
        return (
            <div className="mx-auto max-w-measure py-8">
                <p className="text-ui italic text-text-muted">This project is not on record.</p>
            </div>
        );
    }

    const canSubmit = title.trim().length > 0 && content.trim().length > 0;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);

        try {
            const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
            const intent = submitter?.value === "publish" ? "publish" : "private";
            const savedEntry = addEntry({
                projectId: project.id,
                entryType,
                title: title.trim(),
                content: details.trim() ? `${content.trim()}${DETAILS_MARKER}${details.trim()}` : content.trim(),
            });
            let message = "Entry saved privately.";

            if (intent === "publish") {
                const result = await requestPublishingAction({
                    type: "publish-entry",
                    profile: user,
                    project,
                    entry: savedEntry,
                });
                if (result.ok) {
                    updateEntry(savedEntry.id, { isPublic: true });
                    message = "Entry published.";
                } else {
                    addToast({
                        message: `${result.message} The entry is saved privately.`,
                        type: "error",
                        ...([401, 403, 503].includes(result.status)
                            ? { actionHref: "/editor/settings", actionLabel: "Open Publishing settings" }
                            : {}),
                    });
                }
            }

            if (pendingCaptureId) {
                await Promise.resolve(consumeInboxCapture(pendingCaptureId));
            }

            localStorage.removeItem(draftKey);
            if (intent === "private" || message === "Entry published.") {
                addToast({ message, type: "success" });
            }
            await Promise.resolve(router.push(`/editor/projects/${project.id}`));
        } catch {
            addToast({ message: "Failed to save entry. Please try again.", type: "error" });
            return;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="mx-auto max-w-3xl">
                <h1 className="sr-only">New entry for {project.name}</h1>
                <Link
                    href={`/editor/projects/${project.id}`}
                    className="control-target mb-8 justify-start gap-2 font-mono text-label uppercase text-text-muted transition-colors duration-subtle hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> {project.name}
                </Link>

                {/* The galley: one sheet, set to the same measure as the published page */}
                <form ref={formRef} onSubmit={onSubmit} className="sheet px-7 py-8 md:px-12 md:py-10">
                    <div className="mb-8">
                        <EntryTypePicker value={entryType} onChange={setEntryType} />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={onSubmitShortcut}
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
                            onKeyDown={onSubmitShortcut}
                            className="-ml-3 min-h-composer w-full max-w-measure resize-y border-0 bg-transparent pl-3 text-prose text-text-primary focus:outline-none focus-visible:shadow-[inset_2px_0_0_rgb(var(--color-accent-base))]"
                            placeholder="Write the story of what you built, fixed, or learned. It stays private until you publish it."
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
                                    onKeyDown={onSubmitShortcut}
                                    className="-ml-3 mt-3 min-h-composer-details w-full max-w-measure resize-y border-0 bg-transparent pl-3 text-ui text-text-secondary focus:outline-none focus-visible:shadow-[inset_2px_0_0_rgb(var(--color-accent-base))]"
                                    placeholder="Optional tags, links, context, or attachment notes..."
                                />
                            </>
                        ) : null}
                    </div>

                    {/* Folio line */}
                    <div className="composer-actions mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule/15 pt-5">
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
                                {shortcutLabel}
                            </span>
                            <button
                                type="submit"
                                name="intent"
                                value="private"
                                disabled={!canSubmit || isSubmitting}
                                className="m3-button-outlined control-target font-sans text-label disabled:cursor-not-allowed disabled:text-text-muted"
                            >
                                Save private
                            </button>
                            <button
                                type="submit"
                                name="intent"
                                value="publish"
                                disabled={!canSubmit || isSubmitting}
                                className="m3-button-filled control-target gap-2 font-sans text-label disabled:cursor-not-allowed disabled:bg-surface-base disabled:text-text-muted"
                            >
                                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} /> : null}
                                Publish entry
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
