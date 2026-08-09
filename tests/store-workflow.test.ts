import { beforeEach, describe, expect, test } from "bun:test";

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
    },
});

const { useDevJournalStore } = await import("../lib/store");

beforeEach(() => {
    storage.clear();
    useDevJournalStore.setState({ projects: [], entries: [], inboxCaptures: [] });
});

describe("local creation contracts", () => {
    test("returns a newly created project for immediate routing", () => {
        const project = useDevJournalStore.getState().addProject({
            name: "Field Notes",
            description: "Daily field notes.",
            techStack: [],
            repositoryLink: "",
            status: "in-progress",
        });

        expect(project.id).toBeTruthy();
        expect(useDevJournalStore.getState().projects).toContainEqual(project);
    });

    test("always creates a new entry as private", () => {
        const project = useDevJournalStore.getState().addProject({
            name: "Private Notes",
            description: "",
            techStack: [],
            repositoryLink: "",
            status: "in-progress",
        });
        const entry = useDevJournalStore.getState().addEntry({
            projectId: project.id,
            entryType: "journal",
            title: "A private thought",
            content: "Not ready for the portfolio.",
        });

        expect(entry.isPublic).toBe(false);
        expect(useDevJournalStore.getState().entries).toContainEqual(entry);
    });
});
