import type { Entry, Project } from "@/lib/types";

export function filterProjectsWithPublicEntries(
    projects: Project[],
    entries: Array<Pick<Entry, "projectId" | "isPublic">>
): Project[] {
    const publicProjectIds = new Set(
        entries.filter((entry) => entry.isPublic).map((entry) => entry.projectId)
    );
    return projects.filter((project) => publicProjectIds.has(project.id));
}
