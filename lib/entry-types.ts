import type { Entry, EntryType } from "@/lib/types";

/**
 * Selectable entry-type presets used by editor forms and filters.
 */
export const ENTRY_TYPE_OPTIONS: Array<{ value: EntryType; label: string; description: string }> = [
  { value: "feature", label: "Feature", description: "New capabilities" },
  { value: "fix", label: "Fix", description: "Bug repairs" },
  { value: "refactor", label: "Refactor", description: "Code cleanup" },
  { value: "design", label: "Design", description: "UI/UX updates" },
  { value: "journal", label: "Journal", description: "Learnings + notes" },
];

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
    value.forEach((item) => {
      extractTextChunks(item, chunks);
    });
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => {
      extractTextChunks(item, chunks);
    });
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
