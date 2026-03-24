import { test } from "node:test";
import assert from "node:assert";
import { useDevJournalStore } from "../store.ts";

test("Store Initialization", () => {
    const state = useDevJournalStore.getState();
    assert.ok(state);
    assert.deepEqual(state.projects, []);
});

test("importDevJournal handles invalid JSON", async () => {
    const invalidFile = new File(["{ bad json "], "test.json", { type: "application/json" });
    const result = await useDevJournalStore.getState().importDevJournal(invalidFile);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, "Invalid JSON format.");
});

test("importDevJournal handles invalid structure", async () => {
    const invalidSchemaData = {
        version: "1.0",
        type: "global",
        projects: "not an array", // wrong type
    };
    const invalidFile = new File([JSON.stringify(invalidSchemaData)], "test.json", { type: "application/json" });
    const result = await useDevJournalStore.getState().importDevJournal(invalidFile);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, "Invalid DevJournal file structure.");
});

test("importDevJournal handles valid global import", async () => {
    const validData = {
        version: "1.0",
        type: "global",
        projects: [
            {
                id: "1",
                name: "Test",
                slug: "test",
                description: "Test desc",
                techStack: [],
                status: "in-progress",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ],
        entries: []
    };
    const validFile = new File([JSON.stringify(validData)], "test.json", { type: "application/json" });
    const result = await useDevJournalStore.getState().importDevJournal(validFile);
    assert.strictEqual(result.success, true);
});
