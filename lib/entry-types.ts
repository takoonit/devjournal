import type { Entry, EntryCategory, EntryType } from "@/lib/types";

export const ENTRY_TYPE_OPTIONS: Array<{ value: EntryType; label: string; description: string }> = [
  { value: "feature", label: "Feature", description: "New capabilities" },
  { value: "fix", label: "Fix", description: "Bug repairs" },
  { value: "refactor", label: "Refactor", description: "Code cleanup" },
  { value: "design", label: "Design", description: "UI/UX updates" },
  { value: "journal", label: "Journal", description: "Learnings + notes" },
];

export function inferEntryTypeFromLegacy(category?: EntryCategory, subcategory?: string): EntryType {
  if (subcategory === "debugging" || subcategory === "post-mortem") return "fix";
  if (subcategory === "implementation-guide" || subcategory === "decision-log") return "feature";
  if (subcategory === "idea-spark" || subcategory === "milestone") return "design";
  if (subcategory === "context-switch" || subcategory === "review") return "refactor";
  if (subcategory === "til-snippet" || subcategory === "research-notes") return "journal";

  if (category === "build") return "feature";
  if (category === "reflect") return "journal";
  return "journal";
}

export function extractLegacySubcategory(templateData: Entry["templateData"]): string | undefined {
  if (!templateData || typeof templateData !== "object") return undefined;
  const subcategory = (templateData as Record<string, unknown>).subcategory;
  return typeof subcategory === "string" ? subcategory : undefined;
}

export function getEntryType(entry: Entry): EntryType {
  return entry.entryType ?? inferEntryTypeFromLegacy(entry.category, extractLegacySubcategory(entry.templateData));
}

export function getEntryContent(entry: Entry): string {
  if (entry.content?.trim()) return entry.content;

  if (!entry.templateData || typeof entry.templateData !== "object") return "";
  const data = entry.templateData as Record<string, unknown>;
  const chunks: string[] = [];

  Object.values(data).forEach((value) => {
    if (!value) return;
    if (typeof value === "string") chunks.push(value);
    if (typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach((nested) => {
        if (typeof nested === "string" && nested.trim()) chunks.push(nested);
      });
    }
  });

  return chunks.join("\n\n");
}
