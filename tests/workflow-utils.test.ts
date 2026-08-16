import { describe, expect, test } from "bun:test";
import { formatLocalDate, parseTechStack } from "../lib/utils";

describe("tech stack parsing", () => {
    test("splits comma-separated values and trims whitespace", () => {
        expect(parseTechStack(["React"], " Next.js, TypeScript ")).toEqual([
            "React",
            "Next.js",
            "TypeScript",
        ]);
    });

    test("deduplicates case-insensitively while keeping the first spelling", () => {
        expect(parseTechStack(["TypeScript"], "typescript, Bun, bun")).toEqual([
            "TypeScript",
            "Bun",
        ]);
    });
});

describe("local export dates", () => {
    test("uses local calendar fields rather than the UTC date string", () => {
        const localDate = new Date(2026, 7, 10, 1, 30, 0);

        expect(formatLocalDate(localDate)).toBe("2026-08-10");
    });
});
