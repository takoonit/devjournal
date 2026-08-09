import type { EntryType, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Ink stamps: two-letter code + word, one hue only where it means something.
 * Fix carries destructive ink, feature carries positive ink; everything else
 * stays in secondary text — the one-red discipline holds.
 */
export const ENTRY_STAMPS: Record<EntryType, { code: string; label: string; tone: string }> = {
    feature: { code: "FT", label: "Feature", tone: "text-positive" },
    fix: { code: "FX", label: "Fix", tone: "text-destructive" },
    refactor: { code: "RF", label: "Refactor", tone: "text-text-secondary" },
    design: { code: "DS", label: "Design", tone: "text-text-secondary" },
    journal: { code: "JN", label: "Journal", tone: "text-text-secondary" },
};

interface TypeStampProps {
    type: EntryType;
    pressed?: boolean;
    className?: string;
}

export function TypeStamp({ type, pressed = false, className }: TypeStampProps) {
    const stamp = ENTRY_STAMPS[type];

    return (
        <span className={cn("stamp", stamp.tone, pressed && "stamp-pressed", className)}>
            <span className="opacity-70" aria-hidden="true">{stamp.code}</span>
            {stamp.label}
        </span>
    );
}

interface StatusStampProps {
    status: Project["status"];
    className?: string;
}

export function StatusStamp({ status, className }: StatusStampProps) {
    const shipped = status === "shipped";

    return (
        <span
            className={cn(
                "stamp",
                shipped ? "stamp-pressed text-positive" : "text-text-secondary",
                className
            )}
        >
            {shipped ? "Shipped" : "In Progress"}
        </span>
    );
}
