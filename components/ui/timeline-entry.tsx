import { Entry, EntryCategory } from "@/lib/types";
import { formatTimelineDate } from "@/lib/utils";
import { Calendar, Lightbulb, Wrench, BookOpen } from "lucide-react";

interface TimelineEntryProps {
    entry: Entry;
}

const categoryConfig = {
    plan: {
        icon: Lightbulb,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
    },
    build: {
        icon: Wrench,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/30",
    },
    reflect: {
        icon: BookOpen,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
    },
};

export function TimelineEntry({ entry }: TimelineEntryProps) {
    const config = categoryConfig[entry.category];
    const Icon = config.icon;

    return (
        <div className="grid grid-cols-[140px_1fr] gap-8 pb-8 last:pb-0">
            {/* Date Column */}
            <div className="flex flex-col items-end pt-1">
                <time className="font-mono text-sm text-zinc-500">
                    {formatTimelineDate(entry.createdAt)}
                </time>
                <div className={`mt-2 p-1.5 rounded ${config.bgColor}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
            </div>

            {/* Content Column */}
            <div className="border-l border-zinc-800 pl-8 -ml-px">
                <div className={`inline-block px-2 py-0.5 rounded text-xs font-mono mb-2 ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                    {entry.category.toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    {entry.title}
                </h3>
                <div className="text-sm text-zinc-400 space-y-2">
                    {renderTemplateData(entry)}
                </div>
            </div>
        </div>
    );
}

function renderTemplateData(entry: Entry) {
    const { templateData, category } = entry;

    if (category === "plan") {
        const data = templateData as any;
        if (data.subcategory === "blast" && data.blastFramework) {
            return (
                <div className="space-y-3">
                    <div>
                        <span className="font-semibold text-zinc-300">Blueprint:</span>{" "}
                        {data.blastFramework.blueprint}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Link:</span>{" "}
                        {data.blastFramework.link}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Architect:</span>{" "}
                        {data.blastFramework.architect}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Style:</span>{" "}
                        {data.blastFramework.style}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Trigger:</span>{" "}
                        {data.blastFramework.trigger}
                    </div>
                </div>
            );
        } else if (data.subcategory === "feature-concept") {
            return <p>{data.featureConcept}</p>;
        }
    }

    if (category === "build") {
        const data = templateData as any;
        if (data.subcategory === "technical-decision" && data.technicalDecision) {
            return (
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold text-zinc-300">Context:</span>{" "}
                        {data.technicalDecision.context}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Decision:</span>{" "}
                        {data.technicalDecision.decision}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Rationale:</span>{" "}
                        {data.technicalDecision.rationale}
                    </div>
                </div>
            );
        } else if (data.subcategory === "bug-fix" && data.bugFix) {
            return (
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold text-zinc-300">Root Cause:</span>{" "}
                        {data.bugFix.rootCause}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Solution:</span>{" "}
                        {data.bugFix.solution}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">Prevention:</span>{" "}
                        {data.bugFix.prevention}
                    </div>
                </div>
            );
        } else if (data.subcategory === "progress-update" && data.progressUpdate) {
            return <p>{data.progressUpdate.accomplishments}</p>;
        }
    }

    if (category === "reflect") {
        const data = templateData as any;
        if (data.subcategory === "retrospective" && data.retrospective) {
            return (
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold text-zinc-300">What went well:</span>{" "}
                        {data.retrospective.whatWentWell}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">What didn't work:</span>{" "}
                        {data.retrospective.whatDidntWork}
                    </div>
                    <div>
                        <span className="font-semibold text-zinc-300">What to improve:</span>{" "}
                        {data.retrospective.whatToImprove}
                    </div>
                </div>
            );
        } else if (data.subcategory === "learning-note") {
            return <p>{data.learningNote}</p>;
        } else if (data.subcategory === "general-note") {
            return <p>{data.generalNote}</p>;
        }
    }

    return null;
}
