import test from "node:test";
import assert from "node:assert";
import { cn } from "./utils.ts";

test("cn utility", async (t) => {
    await t.test("merges standard classes", () => {
        assert.strictEqual(cn("hello", "world"), "hello world");
    });

    await t.test("merges conditional classes", () => {
        assert.strictEqual(cn("hello", { world: true, "not-this": false }), "hello world");
    });

    await t.test("merges arrays of classes", () => {
        assert.strictEqual(cn(["hello", "world"]), "hello world");
    });

    await t.test("resolves tailwind class conflicts", () => {
        assert.strictEqual(cn("px-2 py-1", "px-4"), "py-1 px-4");
        assert.strictEqual(cn("bg-red-500", "bg-blue-500"), "bg-blue-500");
    });

    await t.test("handles falsy values", () => {
        assert.strictEqual(cn("hello", undefined, null, false, "", "world"), "hello world");
    });
});
