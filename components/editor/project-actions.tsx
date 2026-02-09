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
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors border border-zinc-700 text-sm font-medium"
            title="Export project journal as .devjournal"
        >
            <FolderOutput className="w-4 h-4" />
            Export Project
        </button>
    );
}
