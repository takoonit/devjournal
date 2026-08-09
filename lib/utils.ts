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
