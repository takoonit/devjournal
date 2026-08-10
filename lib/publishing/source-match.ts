export interface SourceRow {
    id: string;
    source_id: string | null;
}

export class SourceMatchConflictError extends Error {}

export function resolveSourceMatch({
    direct,
    legacy,
    allowLegacyAdoption,
    resource,
}: {
    direct: SourceRow | null;
    legacy: SourceRow[];
    allowLegacyAdoption: boolean;
    resource: string;
}): { kind: "update"; id: string } | { kind: "adopt"; id: string } | { kind: "create" } {
    if (direct) return { kind: "update", id: direct.id };
    if (legacy.length === 0) return { kind: "create" };

    if (!allowLegacyAdoption) {
        throw new SourceMatchConflictError(`${resource} requires source ID reconciliation.`);
    }

    if (legacy.length !== 1 || legacy[0].source_id !== null) {
        throw new SourceMatchConflictError(`${resource} source identity is ambiguous.`);
    }

    return { kind: "adopt", id: legacy[0].id };
}
