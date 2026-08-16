import { describe, expect, test } from "bun:test";
import {
    resolveSourceMatch,
    SourceMatchConflictError,
} from "../lib/publishing/source-match";

describe("publishing source identity", () => {
    test("updates a direct source match", () => {
        expect(resolveSourceMatch({
            direct: { id: "remote-1", source_id: "local-1" },
            legacy: [],
            allowLegacyAdoption: false,
            resource: "Profile",
        })).toEqual({ kind: "update", id: "remote-1" });
    });

    test("adopts exactly one unclaimed project slug", () => {
        expect(resolveSourceMatch({
            direct: null,
            legacy: [{ id: "remote-project", source_id: null }],
            allowLegacyAdoption: true,
            resource: "Project",
        })).toEqual({ kind: "adopt", id: "remote-project" });
    });

    test("rejects ambiguous legacy projects", () => {
        expect(() => resolveSourceMatch({
            direct: null,
            legacy: [
                { id: "remote-1", source_id: null },
                { id: "remote-2", source_id: null },
            ],
            allowLegacyAdoption: true,
            resource: "Project",
        })).toThrow(SourceMatchConflictError);
    });

    test("requires manual reconciliation for a legacy profile", () => {
        expect(() => resolveSourceMatch({
            direct: null,
            legacy: [{ id: "profile-1", source_id: null }],
            allowLegacyAdoption: false,
            resource: "Profile",
        })).toThrow("Profile requires source ID reconciliation.");
    });

    test("creates when no remote record exists", () => {
        expect(resolveSourceMatch({
            direct: null,
            legacy: [],
            allowLegacyAdoption: true,
            resource: "Project",
        })).toEqual({ kind: "create" });
    });
});
