import type { ComponentType } from "react";
import type { Entry, EntryType } from "@/lib/types";
import {
  DesignShape,
  FeatureShape,
  FixShape,
  JournalShape,
  RefactorShape,
} from "@/components/icons/entry-shapes";
import type { EntryShapeProps } from "@/components/icons/entry-shapes";

type EntryShape = ComponentType<EntryShapeProps>;

export interface EntryTypeConfig {
  value: EntryType;
  label: string;
  description: string;
  shape: EntryShape;
  color: string;
  dotBg: string;
  dotBorder: string;
  badgeBg: string;
  badgeBorder: string;
}

export const ENTRY_TYPE_CONFIG: Record<EntryType, EntryTypeConfig> = {
  feature: {
    value: "feature",
    label: "Feature",
    description: "New capabilities",
    shape: FeatureShape,
    color: "text-emerald-300",
    dotBg: "bg-emerald-500/15",
    dotBorder: "border-emerald-400/40",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-400/35",
  },
  fix: {
    value: "fix",
    label: "Fix",
    description: "Bug repairs",
    shape: FixShape,
    color: "text-rose-300",
    dotBg: "bg-rose-500/15",
    dotBorder: "border-rose-400/40",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-400/35",
  },
  refactor: {
    value: "refactor",
    label: "Refactor",
    description: "Code cleanup",
    shape: RefactorShape,
    color: "text-slate-300",
    dotBg: "bg-slate-500/20",
    dotBorder: "border-slate-400/40",
    badgeBg: "bg-slate-500/15",
    badgeBorder: "border-slate-400/35",
  },
  design: {
    value: "design",
    label: "Design",
    description: "UI/UX updates",
    shape: DesignShape,
    color: "text-amber-300",
    dotBg: "bg-amber-500/15",
    dotBorder: "border-amber-400/40",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-400/35",
  },
  journal: {
    value: "journal",
    label: "Journal",
    description: "Learnings + notes",
    shape: JournalShape,
    color: "text-zinc-300",
    dotBg: "bg-zinc-500/20",
    dotBorder: "border-zinc-400/40",
    badgeBg: "bg-zinc-500/10",
    badgeBorder: "border-zinc-400/35",
  },
};

/**
 * Selectable entry-type presets used by editor forms and filters.
 */
export const ENTRY_TYPE_OPTIONS: Array<{ value: EntryType; label: string; description: string }> = [
  ENTRY_TYPE_CONFIG.feature,
  ENTRY_TYPE_CONFIG.fix,
  ENTRY_TYPE_CONFIG.refactor,
  ENTRY_TYPE_CONFIG.design,
  ENTRY_TYPE_CONFIG.journal,
];

export function getEntryTypeConfig(entryType: EntryType): EntryTypeConfig {
  return ENTRY_TYPE_CONFIG[entryType];
}

/**
 * Returns the canonical entry type, defaulting safely to `journal`.
 */
export function getEntryType(entry: Entry): EntryType {
  return entry.entryType ?? "journal";
}

/**
 * Recursively traverses nested template values and collects non-empty string chunks.
 */
function extractTextChunks(value: unknown, chunks: string[]): void {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) chunks.push(trimmed);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => extractTextChunks(item, chunks));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => extractTextChunks(item, chunks));
  }
}

/**
 * Returns authored content when present; otherwise derives a readable fallback from template data.
 */
export function getEntryContent(entry: Entry): string {
  const entryContent = entry.content?.trim();
  if (entryContent) return entryContent;

  const chunks: string[] = [];
  extractTextChunks(entry.templateData, chunks);

  return chunks.join("\n\n");
}
