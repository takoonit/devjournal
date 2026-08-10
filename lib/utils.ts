import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generate URL-safe slug from text
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, formatStr: string = "MMM d, yyyy"): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
}

/**
 * Group entries by year and month
 */
export function groupEntriesByYearMonth<T extends { createdAt: string }>(
    entries: T[]
): Record<string, Record<string, T[]>> {
    const grouped: Record<string, Record<string, T[]>> = {};

    entries.forEach((entry) => {
        const date = new Date(entry.createdAt);
        const year = date.getFullYear().toString();
        const month = format(date, "MMMM");

        if (!grouped[year]) {
            grouped[year] = {};
        }
        if (!grouped[year][month]) {
            grouped[year][month] = [];
        }

        grouped[year][month].push(entry);
    });

    return grouped;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Adds comma-separated technologies while retaining the first spelling.
 */
export function parseTechStack(existing: string[], input: string): string[] {
    const values = [...existing];
    const seen = new Set(existing.map((value) => value.toLocaleLowerCase()));

    for (const value of input.split(",").map((item) => item.trim()).filter(Boolean)) {
        const key = value.toLocaleLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        values.push(value);
    }

    return values;
}

/**
 * Formats a date from local calendar fields for filenames.
 */
export function formatLocalDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
