"use client";

import { useState, use } from "react";
import { useDevJournalStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type {
    EntryCategory,
    EntrySubcategory,
    PlanSubcategory,
    BuildSubcategory,
    ReflectSubcategory,
    BlastFramework,
} from "@/lib/types";

export default function NewEntryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);
    const project = useDevJournalStore((state) => state.getProjectById(id));
    const addEntry = useDevJournalStore((state) => state.addEntry);

    const [category, setCategory] = useState<EntryCategory>("plan");
    const [subcategory, setSubcategory] = useState<EntrySubcategory>("blast");
    const [title, setTitle] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    // BLAST Framework fields
    const [blast, setBlast] = useState<BlastFramework>({
        blueprint: "",
        link: "",
        architect: "",
        style: "",
        trigger: "",
    });

    // Other template fields
    const [featureConcept, setFeatureConcept] = useState("");
    const [technicalDecision, setTechnicalDecision] = useState({
        context: "",
        decision: "",
        rationale: "",
    });
    const [bugFix, setBugFix] = useState({
        rootCause: "",
        solution: "",
        prevention: "",
    });
    const [progressUpdate, setProgressUpdate] = useState("");
    const [learningNote, setLearningNote] = useState("");
    const [retrospective, setRetrospective] = useState({
        whatWentWell: "",
        whatDidntWork: "",
        whatToImprove: "",
    });
    const [generalNote, setGeneralNote] = useState("");

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleCategoryChange = (newCategory: EntryCategory) => {
        setCategory(newCategory);
        // Set default subcategory for each category
        if (newCategory === "plan") setSubcategory("blast");
        if (newCategory === "build") setSubcategory("technical-decision");
        if (newCategory === "reflect") setSubcategory("learning-note");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        let templateData: any = { subcategory };

        if (category === "plan") {
            if (subcategory === "blast") {
                templateData.blastFramework = blast;
            } else if (subcategory === "feature-concept") {
                templateData.featureConcept = featureConcept;
            }
        } else if (category === "build") {
            if (subcategory === "technical-decision") {
                templateData.technicalDecision = technicalDecision;
            } else if (subcategory === "bug-fix") {
                templateData.bugFix = bugFix;
            } else if (subcategory === "progress-update") {
                templateData.progressUpdate = { accomplishments: progressUpdate };
            }
        } else if (category === "reflect") {
            if (subcategory === "learning-note") {
                templateData.learningNote = learningNote;
            } else if (subcategory === "retrospective") {
                templateData.retrospective = retrospective;
            } else if (subcategory === "general-note") {
                templateData.generalNote = generalNote;
            }
        }

        addEntry({
            projectId: project.id,
            category,
            title,
            templateData,
            isPublic,
        });

        router.push(`/editor/projects/${project.id}`);
    };

    return (
        <div className="max-w-4xl pb-20">
            <Link
                href={`/editor/projects/${project.id}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to project
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">New Entry</h1>
                <p className="text-zinc-400">for {project.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                        Category *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange("plan")}
                            className={`px-4 py-3 rounded-lg border transition-colors ${category === "plan"
                                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                        >
                            📋 Plan
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCategoryChange("build")}
                            className={`px-4 py-3 rounded-lg border transition-colors ${category === "build"
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                                : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                        >
                            🔧 Build
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCategoryChange("reflect")}
                            className={`px-4 py-3 rounded-lg border transition-colors ${category === "reflect"
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                }`}
                        >
                            📖 Reflect
                        </button>
                    </div>
                </div>

                {/* Subcategory Selection */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                        Type *
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {category === "plan" && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("blast")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "blast"
                                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    BLAST Framework
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("feature-concept")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "feature-concept"
                                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Feature Concept
                                </button>
                            </>
                        )}

                        {category === "build" && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("technical-decision")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "technical-decision"
                                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Technical Decision
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("bug-fix")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "bug-fix"
                                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Bug Fix
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("progress-update")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "progress-update"
                                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Progress Update
                                </button>
                            </>
                        )}

                        {category === "reflect" && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("learning-note")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "learning-note"
                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Learning Note
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("retrospective")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "retrospective"
                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    Retrospective
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubcategory("general-note")}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${subcategory === "general-note"
                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                        : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                                        }`}
                                >
                                    General Note
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="Entry title..."
                        required
                    />
                </div>

                {/* Template Fields */}
                <div className="pt-4 border-t border-zinc-800">
                    {/* BLAST Framework */}
                    {category === "plan" && subcategory === "blast" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-zinc-300 mb-4">
                                BLAST Framework
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Blueprint (North Star Goal)
                                </label>
                                <textarea
                                    value={blast.blueprint}
                                    onChange={(e) => setBlast({ ...blast, blueprint: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="The singular goal..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Link (Integrations & MCPs)
                                </label>
                                <textarea
                                    value={blast.link}
                                    onChange={(e) => setBlast({ ...blast, link: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="Required integrations..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Architect (Data Structure)
                                </label>
                                <textarea
                                    value={blast.architect}
                                    onChange={(e) => setBlast({ ...blast, architect: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="Schema planning..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Style (UI/UX Tokens)
                                </label>
                                <textarea
                                    value={blast.style}
                                    onChange={(e) => setBlast({ ...blast, style: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="Design system choices..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Trigger (Initiating Event)
                                </label>
                                <textarea
                                    value={blast.trigger}
                                    onChange={(e) => setBlast({ ...blast, trigger: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="Event that starts the logic..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Feature Concept */}
                    {category === "plan" && subcategory === "feature-concept" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Feature Description
                            </label>
                            <textarea
                                value={featureConcept}
                                onChange={(e) => setFeatureConcept(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                placeholder="Describe the feature concept..."
                            />
                        </div>
                    )}

                    {/* Technical Decision */}
                    {category === "build" && subcategory === "technical-decision" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Context
                                </label>
                                <textarea
                                    value={technicalDecision.context}
                                    onChange={(e) =>
                                        setTechnicalDecision({ ...technicalDecision, context: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="What was the situation?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Decision
                                </label>
                                <textarea
                                    value={technicalDecision.decision}
                                    onChange={(e) =>
                                        setTechnicalDecision({ ...technicalDecision, decision: e.target.value })
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="What did you decide?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Rationale
                                </label>
                                <textarea
                                    value={technicalDecision.rationale}
                                    onChange={(e) =>
                                        setTechnicalDecision({ ...technicalDecision, rationale: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="Why did you make this decision?"
                                />
                            </div>
                        </div>
                    )}

                    {/* Bug Fix */}
                    {category === "build" && subcategory === "bug-fix" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Root Cause
                                </label>
                                <textarea
                                    value={bugFix.rootCause}
                                    onChange={(e) => setBugFix({ ...bugFix, rootCause: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="What caused the bug?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Solution
                                </label>
                                <textarea
                                    value={bugFix.solution}
                                    onChange={(e) => setBugFix({ ...bugFix, solution: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="How did you fix it?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Prevention
                                </label>
                                <textarea
                                    value={bugFix.prevention}
                                    onChange={(e) => setBugFix({ ...bugFix, prevention: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    placeholder="How to prevent it in the future?"
                                />
                            </div>
                        </div>
                    )}

                    {/* Progress Update */}
                    {category === "build" && subcategory === "progress-update" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                What was accomplished?
                            </label>
                            <textarea
                                value={progressUpdate}
                                onChange={(e) => setProgressUpdate(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                placeholder="Describe what you accomplished..."
                            />
                        </div>
                    )}

                    {/* Learning Note */}
                    {category === "reflect" && subcategory === "learning-note" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                What did you learn?
                            </label>
                            <textarea
                                value={learningNote}
                                onChange={(e) => setLearningNote(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                placeholder="Share your learning..."
                            />
                        </div>
                    )}

                    {/* Retrospective */}
                    {category === "reflect" && subcategory === "retrospective" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    What went well?
                                </label>
                                <textarea
                                    value={retrospective.whatWentWell}
                                    onChange={(e) =>
                                        setRetrospective({ ...retrospective, whatWentWell: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    What didn't work?
                                </label>
                                <textarea
                                    value={retrospective.whatDidntWork}
                                    onChange={(e) =>
                                        setRetrospective({ ...retrospective, whatDidntWork: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    What to improve?
                                </label>
                                <textarea
                                    value={retrospective.whatToImprove}
                                    onChange={(e) =>
                                        setRetrospective({ ...retrospective, whatToImprove: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* General Note */}
                    {category === "reflect" && subcategory === "general-note" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Note
                            </label>
                            <textarea
                                value={generalNote}
                                onChange={(e) => setGeneralNote(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                placeholder="Write your note..."
                            />
                        </div>
                    )}
                </div>

                {/* Visibility Toggle */}
                <div className="pt-4 border-t border-zinc-800">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-5 h-5 rounded bg-zinc-900/50 border-zinc-700 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                        />
                        <div>
                            <span className="text-sm font-medium text-zinc-300">
                                Make this entry public
                            </span>
                            <p className="text-xs text-zinc-500">
                                Public entries will appear on your portfolio
                            </p>
                        </div>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors font-medium"
                    >
                        Create Entry
                    </button>
                    <Link
                        href={`/editor/projects/${project.id}`}
                        className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors font-medium inline-block"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
