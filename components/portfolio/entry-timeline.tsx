"use client";

import { useMemo, useState } from "react";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import type { Entry, EntryType } from "@/lib/types";
import { groupEntriesByYearMonth } from "@/lib/utils";
import { getEntryType } from "@/lib/entry-types";

const FILTERS: Array<{ label: string; value: "all" | EntryType }> = [
    { label: "All", value: "all" },
    { label: "Features", value: "feature" },
    { label: "Fixes", value: "fix" },
    { label: "Refactors", value: "refactor" },
    { label: "Design", value: "design" },
    { label: "Journal", value: "journal" },
];

export function EntryTimeline({ entries }: { entries: Entry[] }) {
    const [filter, setFilter] = useState<"all" | EntryType>("all");

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [entries]
    );

    const filteredEntries = useMemo(
        () => sortedEntries.filter((entry) => filter === "all" || getEntryType(entry) === filter),
        [sortedEntries, filter]
    );

    const groupedEntries = useMemo(() => groupEntriesByYearMonth(filteredEntries), [filteredEntries]);
    const years = useMemo(() => Object.keys(groupedEntries).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)), [groupedEntries]);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setFilter(item.value)}
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition-colors ${filter === item.value ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {years.map((year) => (
                    <div key={year}>
                        <h2 className="mb-8 text-2xl font-bold font-mono text-zinc-100">{year}</h2>
                        {Object.keys(groupedEntries[year]).map((month) => (
                            <div key={month} className="mb-10">
                                <h3 className="mb-6 text-lg font-semibold text-zinc-300">{month}</h3>
                                <div className="space-y-4">
                                    {groupedEntries[year][month].map((entry) => (
                                        <TimelineEntry key={entry.id} entry={entry} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
