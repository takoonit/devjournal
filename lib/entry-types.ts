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
  stripBg: string;
}

export const ENTRY_TYPE_CONFIG: Record<EntryType, EntryTypeConfig> = {
  feature: {
    value: "feature",
    label: "Feature",
    description: "New capabilities",
    shape: FeatureShape,
    color: "text-entry-feature",
    dotBg: "bg-entry-feature/15",
    dotBorder: "border-entry-feature/40",
    badgeBg: "bg-entry-feature/10",
    badgeBorder: "border-entry-feature/35",
    stripBg: "bg-entry-feature/45",
  },
  fix: {
    value: "fix",
    label: "Fix",
    description: "Bug repairs",
    shape: FixShape,
    color: "text-entry-fix",
    dotBg: "bg-entry-fix/15",
    dotBorder: "border-entry-fix/40",
    badgeBg: "bg-entry-fix/10",
    badgeBorder: "border-entry-fix/35",
    stripBg: "bg-entry-fix/45",
  },
  refactor: {
    value: "refactor",
    label: "Refactor",
    description: "Code cleanup",
    shape: RefactorShape,
    color: "text-entry-refactor",
    dotBg: "bg-entry-refactor/20",
    dotBorder: "border-entry-refactor/40",
    badgeBg: "bg-entry-refactor/15",
    badgeBorder: "border-entry-refactor/35",
    stripBg: "bg-entry-refactor/45",
  },
  design: {
    value: "design",
    label: "Design",
    description: "UI/UX updates",
    shape: DesignShape,
    color: "text-entry-design",
    dotBg: "bg-entry-design/15",
    dotBorder: "border-entry-design/40",
    badgeBg: "bg-entry-design/10",
    badgeBorder: "border-entry-design/35",
    stripBg: "bg-entry-design/45",
  },
  journal: {
    value: "journal",
    label: "Journal",
    description: "Learnings + notes",
    shape: JournalShape,
    color: "text-entry-journal",
    dotBg: "bg-entry-journal/20",
    dotBorder: "border-entry-journal/40",
    badgeBg: "bg-entry-journal/10",
    badgeBorder: "border-entry-journal/35",
    stripBg: "bg-entry-journal/45",
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
