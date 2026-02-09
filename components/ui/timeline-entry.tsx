"use client";

import { Entry, EntryCategory } from "@/lib/types";
import {
    Lightbulb,
    Hammer,
    Search,
    BrainCircuit,
    Code2,
    Bug,
    BookOpen,
    Trophy,
    RotateCcw,
    AlertTriangle,
    FileText
} from "lucide-react";

interface TimelineEntryProps {
    entry: Entry;
}

const categoryConfig: Record<EntryCategory, { icon: any; color: string; bgColor: string; borderColor: string; label: string }> = {
    "plan-change": {
        icon: Lightbulb,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/30",
        label: "PLAN & CHANGE"
    },
    "build": {
        icon: Hammer,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        label: "BUILD"
    },
    "reflect": {
        icon: Search,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        label: "REFLECT"
    }
};

const subcategoryConfig: Record<string, { icon: any; label: string }> = {
    // Plan
    "idea-spark": { icon: Lightbulb, label: "Idea Spark" },
    "decision-log": { icon: BrainCircuit, label: "Decision Log" },
    "research-notes": { icon: BookOpen, label: "Research" },

    // Build
    "context-switch": { icon: RotateCcw, label: "Context Switch" },
    "debugging": { icon: Bug, label: "Rubber Ducking" },
    "til-snippet": { icon: Code2, label: "TIL / Snippet" },
    "implementation-guide": { icon: FileText, label: "Guide" },

    // Reflect
    "milestone": { icon: Trophy, label: "Milestone" },
    "post-mortem": { icon: AlertTriangle, label: "Post-Mortem" },
    "review": { icon: Search, label: "Review" }
};

export function TimelineEntry({ entry }: TimelineEntryProps) {
    const config = categoryConfig[entry.category];
    const date = new Date(entry.createdAt);

    // Get subcategory config or fallback
    const subcategoryFn = (
        entry.templateData.subcategory in subcategoryConfig
            ? subcategoryConfig[entry.templateData.subcategory as keyof typeof subcategoryConfig]
            : { icon: config.icon, label: entry.templateData.subcategory.replace("-", " ") }
    );
    const SubIcon = subcategoryFn.icon;

    // Helper to render markdown content sections
    const renderMarkdown = (content: string) => (
        <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-code:text-amber-200 prose-pre:bg-black/50 prose-pre:border prose-pre:border-zinc-800 prose-a:text-cyan-400 whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {content}
        </div>
    );

    // Dynamic Content Renderer based on Subcategory
    const renderContent = () => {
        const data = entry.templateData as any;

        // --- PLAN ---
        if (data.subcategory === "decision-log" && data.decisionLog) {
            return (
                <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Context</span>
                        <p className="text-zinc-300 text-sm">{data.decisionLog.context}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Options</span>
                            <p className="text-zinc-300 text-sm">{data.decisionLog.options}</p>
                        </div>
                        <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
                            <span className="text-xs font-mono text-indigo-400 uppercase block mb-1">Decision</span>
                            <p className="text-zinc-200 text-sm font-bold">{data.decisionLog.decision}</p>
                        </div>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Rationale</span>
                        {renderMarkdown(data.decisionLog.rationale)}
                    </div>
                </div>
            )
        }
        if (data.subcategory === "idea-spark" && data.ideaSpark) {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
                        <span className="text-xs font-mono text-indigo-400 uppercase block mb-2">Core Value</span>
                        <h4 className="text-xl font-bold text-indigo-200">{data.ideaSpark.coreValue}</h4>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Vibe</span>
                        <p className="text-zinc-300 text-sm italic">"{data.ideaSpark.vibe}"</p>
                    </div>
                </div>
            )
        }
        if (data.subcategory === "research-notes" && data.researchNotes) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase">Topic</span>
                        <span className="text-sm font-medium text-indigo-400">{data.researchNotes.topic}</span>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Learnings</span>
                        {renderMarkdown(data.researchNotes.learnings)}
                    </div>
                    <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Resources</span>
                        {renderMarkdown(data.researchNotes.resources)}
                    </div>
                </div>
            )
        }

        // --- BUILD ---
        if (data.subcategory === "debugging" && data.debugging) {
            return (
                <div className="space-y-4">
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <span className="text-xs font-mono text-red-400 uppercase block mb-1">Symptom</span>
                        <p className="text-zinc-300 text-sm font-mono">{data.debugging.symptom}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Hypothesis</span>
                            <p className="text-zinc-300 text-sm">{data.debugging.hypothesis}</p>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Attempted</span>
                            {renderMarkdown(data.debugging.attempted)}
                        </div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-xs font-mono text-green-400 uppercase block mb-1">Solution</span>
                        {renderMarkdown(data.debugging.solution)}
                    </div>
                </div>
            )
        }
        if (data.subcategory === "context-switch" && data.contextSwitch) {
            return (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <RotateCcw className="w-12 h-12" />
                        </div>
                        <span className="text-xs font-mono text-amber-500/70 uppercase block mb-2">Current State</span>
                        {renderMarkdown(data.contextSwitch.currentState)}
                    </div>
                    <div className="flex-1 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 relative">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-2">Next Steps</span>
                        {renderMarkdown(data.contextSwitch.nextSteps)}
                    </div>
                </div>
            )
        }
        if (data.subcategory === "til-snippet" && data.tilSnippet) {
            return (
                <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Problem</span>
                        <p className="text-zinc-300 text-sm">{data.tilSnippet.problem}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                        <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">Solution</span>
                        <p className="text-zinc-300 text-sm">{data.tilSnippet.solution}</p>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-zinc-800">
                        <div className="bg-zinc-900 px-3 py-1 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500">Snippet</span>
                            <Code2 className="w-3 h-3 text-zinc-600" />
                        </div>
                        <div className="p-3 bg-black">
                            {renderMarkdown(data.tilSnippet.code)}
                        </div>
                    </div>
                </div>
            )
        }

        // --- REFLECT ---
        if (data.subcategory === "milestone" && data.milestone) {
            return (
                <div className="relative overflow-hidden p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div>
                            <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">Achievement Unlocked</span>
                            <h3 className="text-2xl font-bold text-white leading-tight">{data.milestone.achievement}</h3>
                        </div>
                        <div className="p-4 bg-black/40 rounded-lg border border-emerald-500/10 backdrop-blur-sm">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-2">Impact</span>
                            <p className="text-zinc-300 text-sm">{data.milestone.impact}</p>
                        </div>
                        {data.milestone.demoLink && (
                            <div className="inline-flex">
                                <a href={data.milestone.demoLink} target="_blank" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 border-b border-emerald-500/30 hover:border-emerald-400 transition-colors pb-0.5">
                                    View Demo →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
        if (data.subcategory === "post-mortem" && data.postMortem) {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-mono text-red-400 uppercase">Incident</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{data.postMortem.incident}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Root Cause</span>
                            <p className="text-zinc-300 text-sm">{data.postMortem.rootCause}</p>
                        </div>
                        <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                            <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">Prevention</span>
                            {renderMarkdown(data.postMortem.prevention)}
                        </div>
                    </div>
                </div>
            )
        }
        if (data.subcategory === "review" && data.review) {
            return (
                <div className="space-y-4">
                    <div className="p-2 bg-zinc-900/30 rounded border border-zinc-800 inline-block">
                        <span className="text-xs font-mono text-zinc-400 uppercase px-2">Period: {data.review.period}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                            <span className="text-xs font-bold text-emerald-400 uppercase block mb-3 border-b border-emerald-500/20 pb-2">Went Well</span>
                            {renderMarkdown(data.review.wentWell)}
                        </div>
                        <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
                            <span className="text-xs font-bold text-amber-400 uppercase block mb-3 border-b border-amber-500/20 pb-2">Could Be Better</span>
                            {renderMarkdown(data.review.couldBeBetter)}
                        </div>
                    </div>
                </div>
            )
        }

        // Fallback for types not yet fully implemented or content-based
        return renderMarkdown(data.content || "No content provided.");
    };

    return (
        <div className="relative pl-8 md:pl-0">
            {/* Mobile Timeline Line */}
            <div className="md:hidden absolute left-3 top-0 bottom-0 w-px bg-zinc-800" />

            {/* Desktop Grid */}
            <div className={`md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 group ${
                // Alternating layout logic could go here, but for now we'll keep it simple
                ""
                }`}>

                {/* Time & Meta (Left side on Desktop) */}
                <div className="hidden md:flex flex-col items-end pt-1">
                    <time className="text-sm font-mono text-zinc-500">
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </time>
                    <span className="text-xs text-zinc-600 block mt-1">
                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-0 md:relative md:left-auto flex justify-center pt-1 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 ${config.borderColor} ${config.bgColor} flex items-center justify-center`}>
                        <config.icon className={`w-3 h-3 ${config.color}`} />
                    </div>
                </div>

                {/* Content Card (Right side on Desktop) */}
                <div className="mb-8 md:mb-0 pb-8 md:pb-12 md:pt-0">
                    <div className={`bg-black/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors`}>
                        {/* Header */}
                        <div className="px-5 py-3 border-b border-zinc-800/60 flex items-start justify-between bg-zinc-900/20">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold tracking-wider ${config.color} bg-black/40 px-2 py-0.5 rounded-full border ${config.borderColor} uppercase`}>
                                        {config.label}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full border border-zinc-800 uppercase">
                                        <SubIcon className="w-3 h-3" />
                                        {subcategoryFn.label}
                                    </span>
                                    {/* Mobile Date */}
                                    <span className="md:hidden text-xs text-zinc-500 ml-2">
                                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-zinc-200 leading-snug">
                                    {entry.title}
                                </h3>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
