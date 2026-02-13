"use client";

import type { Entry } from "@/lib/types";
import { getEntryContent, getEntryType, getEntryTypeConfig } from "@/lib/entry-types";

interface TimelineEntryProps {
    entry: Entry;
}

export function TimelineEntry({ entry }: TimelineEntryProps) {
    const date = new Date(entry.createdAt);
    const entryType = getEntryType(entry);
    const content = getEntryContent(entry);
    const config = getEntryTypeConfig(entryType);
    const Shape = config.shape;

    return (
        <div className="group relative pl-8 md:pl-0">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-800 md:left-[calc(33.333%-1px)]" />

            <div className="md:grid md:grid-cols-[1fr_30px_2fr] md:gap-8">
                <div className="hidden md:flex flex-col items-end pt-1">
                    <time className="text-sm text-zinc-500">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time>
                    <span className="text-xs text-zinc-600">{date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div className="absolute left-0 top-1 z-10 flex justify-center md:relative md:left-auto">
                    <div className={`h-7 w-7 rounded-full border-2 ${config.dotBorder} ${config.dotBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:shadow-[0_0_0_2px_rgba(24,24,27,0.9)]`}>
                        <Shape className={`h-4 w-4 ${config.color}`} />
                    </div>
                </div>

                <article className="mb-6 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-5 transition-colors duration-200 group-hover:border-zinc-700">
                    <header className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${config.color} ${config.badgeBg} ${config.badgeBorder}`}>
                            <Shape className="h-3.5 w-3.5" />
                            {config.label}
                        </span>
                        <span className="text-xs text-zinc-500 md:hidden">
                            {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                    </header>

                    <h3 className="mb-2 text-sm font-medium text-zinc-200">{entry.title}</h3>
                    <p className="whitespace-pre-wrap text-base leading-8 text-zinc-200">{content || "No notes captured."}</p>
                </article>
            </div>
        </div>
    );
}
