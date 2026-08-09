"use client";

import { useDevJournalStore } from "@/lib/store";
import { FolderOutput } from "lucide-react";

interface ProjectActionsProps {
    projectId: string;
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
    const exportSelectedProjects = useDevJournalStore((state) => state.exportSelectedProjects);

    return (
        <button
            onClick={() => exportSelectedProjects([projectId])}
            className="inline-flex items-center gap-2 rounded border border-surface-border bg-transparent px-3 py-1.5 font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
            title="Export project journal as .devjournal"
        >
            <FolderOutput className="h-3.5 w-3.5" strokeWidth={1.5} />
            Export
        </button>
    );
}
