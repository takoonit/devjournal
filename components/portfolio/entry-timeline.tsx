"use client";

import { useMemo, useState } from "react";
import { TimelineEntry } from "@/components/ui/timeline-entry";
import { Reveal } from "@/components/ui/reveal";
import { ENTRY_STAMPS } from "@/components/ui/stamp";
import type { Entry, EntryType } from "@/lib/types";
import { groupEntriesByYearMonth } from "@/lib/utils";
import { getEntryType } from "@/lib/entry-types";
import { cn } from "@/lib/utils";

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
    const years = useMemo(
        () => Object.keys(groupedEntries).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)),
        [groupedEntries]
    );

    let entryIndex = 0;

    return (
        <div>
            <div className="mb-12 flex flex-wrap gap-2 print-hidden" role="group" aria-label="Filter entries by type">
                {FILTERS.map((item) => {
                    const active = filter === item.value;
                    const tone =
                        item.value === "all" || !active
                            ? active
                                ? "text-accent"
                                : "text-text-muted hover:text-text-secondary"
                            : ENTRY_STAMPS[item.value].tone;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setFilter(item.value)}
                            aria-pressed={active}
                            className={cn("control-target stamp stamp-control transition-colors", active && "stamp-pressed", tone)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {filteredEntries.length === 0 ? (
                <div className="border-t border-rule/15 py-14">
                    <p className="text-ui italic text-text-muted">
                        Nothing filed under this mark yet.
                    </p>
                </div>
            ) : (
                <div className="timeline-container relative">
                    {/* The one vertical rule this view is allowed */}
                    <div
                        className="timeline-rule margin-rule"
                        aria-hidden="true"
                    />

                    {years.map((year) => (
                        <section key={year} className="relative">
                            <span
                                className="pointer-events-none absolute right-0 top-8 select-none font-serif text-folio text-text-primary/[0.07]"
                                aria-hidden="true"
                            >
                                {year}
                            </span>

                            {Object.keys(groupedEntries[year]).map((month) => (
                                <div key={`${year}-${month}`}>
                                    <div className="timeline-keyline keyline">
                                        <h2 className="font-mono text-subtitle uppercase text-text-secondary">
                                            {month} {year}
                                        </h2>
                                    </div>
                                    {groupedEntries[year][month].map((entry) => (
                                        <Reveal key={entry.id} index={entryIndex++}>
                                            <TimelineEntry entry={entry} dropCap />
                                        </Reveal>
                                    ))}
                                </div>
                            ))}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
