"use client";

import { useMemo, useState } from "react";
import type { EntryType } from "@/lib/types";
import { ENTRY_TYPE_OPTIONS } from "@/lib/entry-types";
import { ENTRY_STAMPS, TypeStamp, getEntryStampControlTone } from "@/components/ui/stamp";
import { cn } from "@/lib/utils";

export function EntryTypePicker({ value, onChange }: { value: EntryType; onChange: (value: EntryType) => void }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const description = useMemo(
        () => ENTRY_TYPE_OPTIONS.find((option) => option.value === value)?.description ?? "",
        [value]
    );

    const choices = (
        <div className="entry-type-picker" role="group" aria-label="Entry type">
            {ENTRY_TYPE_OPTIONS.map((option) => {
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                            onChange(option.value);
                            setMobileOpen(false);
                        }}
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
    );

    return (
        <div>
            <div className="entry-type-picker-desktop">{choices}</div>
            <div className="entry-type-picker-mobile">
                <div className="flex items-center justify-between gap-4">
                    <TypeStamp type={value} pressed />
                    <button
                        type="button"
                        className="control-target link-ink font-mono text-meta"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        Change type
                    </button>
                </div>
                {mobileOpen ? <div className="mt-3">{choices}</div> : null}
            </div>
            <p className="mt-2.5 text-ui italic text-text-muted">{description}</p>
        </div>
    );
}
