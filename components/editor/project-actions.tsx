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
            className="m3-button-outlined control-target gap-2 font-sans text-label"
            title="Export project journal as .devjournal"
        >
            <FolderOutput className="h-3.5 w-3.5" strokeWidth={1.5} />
            Export
        </button>
    );
}
