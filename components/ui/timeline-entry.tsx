"use client";

import type { Entry, EntryType } from "@/lib/types";
import { getEntryContent, getEntryType } from "@/lib/entry-types";
import { BookOpenText, Bug, Palette, Sparkles, Wrench } from "lucide-react";

interface TimelineEntryProps {
    entry: Entry;
}

const TYPE_CONFIG: Record<EntryType, { label: string; icon: any; color: string; dotBg: string; dotBorder: string; badgeBg: string; badgeBorder: string }> = {
    feature: { label: "Feature", icon: Sparkles, color: "text-emerald-300", dotBg: "bg-emerald-500/15", dotBorder: "border-emerald-400/40", badgeBg: "bg-emerald-500/10", badgeBorder: "border-emerald-400/35" },
    fix: { label: "Fix", icon: Bug, color: "text-rose-300", dotBg: "bg-rose-500/15", dotBorder: "border-rose-400/40", badgeBg: "bg-rose-500/10", badgeBorder: "border-rose-400/35" },
    refactor: { label: "Refactor", icon: Wrench, color: "text-slate-300", dotBg: "bg-slate-500/20", dotBorder: "border-slate-400/40", badgeBg: "bg-slate-500/15", badgeBorder: "border-slate-400/35" },
    design: { label: "Design", icon: Palette, color: "text-amber-300", dotBg: "bg-amber-500/15", dotBorder: "border-amber-400/40", badgeBg: "bg-amber-500/10", badgeBorder: "border-amber-400/35" },
    journal: { label: "Journal", icon: BookOpenText, color: "text-zinc-300", dotBg: "bg-zinc-500/20", dotBorder: "border-zinc-400/40", badgeBg: "bg-zinc-500/10", badgeBorder: "border-zinc-400/35" },
};

export function TimelineEntry({ entry }: TimelineEntryProps) {
    const date = new Date(entry.createdAt);
    const entryType = getEntryType(entry);
    const content = getEntryContent(entry);
    const config = TYPE_CONFIG[entryType];
    const Icon = config.icon;

    return (
        <div className="group relative pl-8 md:pl-0">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-800 md:left-[calc(33.333%-1px)]" />

            <div className="md:grid md:grid-cols-[1fr_24px_2fr] md:gap-8">
                <div className="hidden md:flex flex-col items-end pt-1">
                    <time className="text-sm text-zinc-500">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time>
                    <span className="text-xs text-zinc-600">{date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div className="absolute left-0 top-1 z-10 flex justify-center md:relative md:left-auto">
                    <div className={`h-6 w-6 rounded-full border ${config.dotBorder} ${config.dotBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    </div>
                </div>

                <article className="mb-6 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-5 transition-colors duration-200 group-hover:border-zinc-700">
                    <header className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.color} ${config.badgeBg} ${config.badgeBorder}`}>
                            <Icon className="h-3 w-3" />
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
