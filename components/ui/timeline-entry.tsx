"use client";

import type { Entry } from "@/lib/types";
import { getEntryContent, getEntryType } from "@/lib/entry-types";
import { TypeStamp } from "@/components/ui/stamp";
import { cn } from "@/lib/utils";

interface TimelineEntryProps {
    entry: Entry;
    /** Render the drop cap treatment (public portfolio only). */
    dropCap?: boolean;
    /** Mark private entries with a hollow node (editor only). */
    showVisibility?: boolean;
}

function readingMinutes(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
}

/**
 * One journal entry set on the margin grid: date, stamp, and reading time
 * hang in the rail; the node sits on the rule; prose holds the measure.
 */
export function TimelineEntry({ entry, dropCap = false, showVisibility = false }: TimelineEntryProps) {
    const date = new Date(entry.createdAt);
    const entryType = getEntryType(entry);
    const content = getEntryContent(entry);
    const isPrivate = showVisibility && !entry.isPublic;
    const minutes = readingMinutes(content);

    const dateLine = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeLine = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    const withDropCap = dropCap && entryType === "journal" && content.length > 140;

    return (
        <article className="group/entry relative md:grid md:grid-cols-[9rem_1.5rem_minmax(0,1fr)]">
            {/* Rail: everything measured, right-aligned, tracking the reader */}
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 md:mb-0 md:block md:text-right">
                <div className="md:sticky md:top-24 md:pb-6">
                    <time
                        dateTime={entry.createdAt}
                        className="block font-mono text-meta tabular-nums text-text-secondary"
                    >
                        {dateLine}
                    </time>
                    <span className="hidden font-mono text-meta tabular-nums text-text-muted md:mt-0.5 md:block">
                        {timeLine}
                        {minutes >= 2 ? ` · ${minutes} min` : ""}
                    </span>
                    <div className="md:mt-2.5">
                        <TypeStamp type={entryType} />
                    </div>
                    {isPrivate ? (
                        <span className="block font-mono text-label uppercase text-text-muted md:mt-2">
                            Private
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Node on the rule */}
            <div className="hidden justify-center pt-2 md:flex" aria-hidden="true">
                <span className={cn("node", isPrivate && "node-hollow")} />
            </div>

            {/* The measure */}
            <div className="border-l border-rule/20 pb-10 pl-5 md:border-0 md:pb-14 md:pl-0">
                <h3 className="text-title text-text-primary">{entry.title}</h3>
                <div className={cn("mt-3 max-w-measure", withDropCap && "prose-drop-cap")}>
                    <p className="whitespace-pre-wrap text-prose text-text-primary/90">
                        {content || "No notes captured."}
                    </p>
                </div>
            </div>
        </article>
    );
}
