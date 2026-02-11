"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDevJournalStore } from "@/lib/store";
import {
    EntryCategory,
    PlanSubcategory,
    BuildSubcategory,
    ReflectSubcategory,
} from "@/lib/types";
import { ArrowLeft, Save, Loader2, RefreshCw, Brain, Hammer, Trophy } from "lucide-react";
import Link from "next/link";

const TEMPLATE_INFO = {
    // PLAN
    "decision-log": {
        title: "Decision Log",
        purpose: "Record significant architectural or product decisions to avoid re-debating them later.",
        example: "Context: Choosing a DB. Options: Postgres vs Mongo. Decision: Postgres. Rationale: Relational data needs."
    },
    "idea-spark": {
        title: "Idea Spark",
        purpose: "Capture a fleeting idea before it disappears. Focus on the core value and the 'vibe'.",
        example: "Core Value: 'Tinder for Code Reviews'. Vibe: Fast, gamified, mobile-first."
    },
    "research-notes": {
        title: "Research Notes",
        purpose: "Document what you learned while exploring a new technology or problem space.",
        example: "Topic: React Server Components. Learnings: Great for initial load, harder for interactivity. Resources: <link>"
    },
    // BUILD
    "debugging": {
        title: "Debugging Log",
        purpose: "The 'scientific method' for fixing bugs. Forces you to slow down and think before you hack.",
        example: "Symptom: 500 Error. Hypothesis: DB Connection. Tried: Restarting container. Solution: Fixed env var."
    },
    "context-switch": {
        title: "Context Switch",
        purpose: "Save your state before a break or meeting so you can resume flow immediately.",
        example: "Current State: API is fetching but UI isn't updating. Next Steps: Check the Redux reducer."
    },
    "til-snippet": {
        title: "TIL / Snippet",
        purpose: "Save a useful snippet or command you just figured out.",
        example: "Problem: Vertically center div. Solution: grid place-items-center. Code: display: grid; ..."
    },
    // REFLECT
    "milestone": {
        title: "Milestone",
        purpose: "Celebrate a win! These go into your 'Brag Doc' for performance reviews or morale boosts.",
        example: "Achievement: Shipped v1.0. Impact: 100 new users."
    },
    "post-mortem": {
        title: "Post-Mortem",
        purpose: "Honest analysis of what went wrong to prevent it from happening again. Blameless.",
        example: "Incident: Site down for 10m. Root Cause: Expired SSL cert. Prevention: Auto-renew bot."
    },
    "review": {
        title: "Periodic Review",
        purpose: "Look back at a sprint or week to calibrate your process.",
        example: "Went Well: Velocity up. Could Be Better: Too many meetings."
    }
};

export default function NewEntryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { projects, addEntry } = useDevJournalStore();
    const project = projects.find((p) => p.id === id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<EntryCategory>("plan-change");

    // Unified Subcategory State
    const [planSub, setPlanSub] = useState<PlanSubcategory>("decision-log");
    const [buildSub, setBuildSub] = useState<BuildSubcategory>("debugging");
    const [reflectSub, setReflectSub] = useState<ReflectSubcategory>("milestone");

    // Form data states
    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Theme definition based on category
    const currentTheme = {
        "plan-change": {
            bg: "from-indigo-500/10 via-zinc-950 to-zinc-950",
            border: "border-indigo-500/20",
            text: "text-indigo-400",
            button: "bg-indigo-500 hover:bg-indigo-400",
            ring: "focus:ring-indigo-500/50",
            icon: "bg-indigo-500/20 text-indigo-400",
            sub_active: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
            label: "Plan & Change"
        },
        "build": {
            bg: "from-amber-500/10 via-zinc-950 to-zinc-950",
            border: "border-amber-500/20",
            text: "text-amber-400",
            button: "bg-amber-500 hover:bg-amber-400",
            ring: "focus:ring-amber-500/50",
            icon: "bg-amber-500/20 text-amber-400",
            sub_active: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            label: "Build"
        },
        "reflect": {
            bg: "from-emerald-500/10 via-zinc-950 to-zinc-950",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            button: "bg-emerald-500 hover:bg-emerald-400",
            ring: "focus:ring-emerald-500/50",
            icon: "bg-emerald-500/20 text-emerald-400",
            sub_active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            label: "Reflect"
        }
    }[category];

    if (!project) {
        return (
            <div className="p-8 text-center"><h1 className="text-2xl font-bold text-zinc-100 mb-4">Project Not Found</h1></div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let templateData: any = {};

            if (category === "plan-change") {
                templateData = { subcategory: planSub };
                if (planSub === "decision-log") templateData.decisionLog = formData;
                else if (planSub === "idea-spark") templateData.ideaSpark = formData;
                else if (planSub === "research-notes") templateData.researchNotes = formData;
            } else if (category === "build") {
                templateData = { subcategory: buildSub };
                if (buildSub === "debugging") templateData.debugging = formData;
                else if (buildSub === "context-switch") templateData.contextSwitch = formData;
                else if (buildSub === "til-snippet") templateData.tilSnippet = formData;
            } else {
                templateData = { subcategory: reflectSub };
                if (reflectSub === "milestone") templateData.milestone = formData;
                else if (reflectSub === "post-mortem") templateData.postMortem = formData;
                else if (reflectSub === "review") templateData.review = formData;
            }

            // Fallback for unset fields to prevent undefined errors in rendering
            // (In a real app we'd use Zod, but for now we trust the form)

            addEntry({
                projectId: project.id,
                category,
                title,
                templateData,
                isPublic: true,
            });

            router.push(`/editor/projects/${project.id}`);
        } catch (error) {
            console.error("Failed to create entry:", error);
            setIsSubmitting(false);
        }
    };

    // Helper to render a text input with dynamic theming
    const renderInput = (id: string, label: string, placeholder: string, isTextArea = false) => (
        <div className="space-y-2 group">
            <label htmlFor={id} className="block text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    id={id}
                    required
                    value={formData[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:ring-2 ${currentTheme.ring} focus:border-transparent transition-all font-mono text-sm h-32`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type="text"
                    id={id}
                    required
                    value={formData[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 ${currentTheme.ring} focus:border-transparent transition-all`}
                    placeholder={placeholder}
                />
            )}
        </div>
    );

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} transition-colors duration-700`}>
            <div className="max-w-4xl mx-auto pb-20 pt-8 px-6">
                <header className="mb-10 relative">
                    <Link
                        href={`/editor/projects/${project.id}`}
                        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Project
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                                New Entry
                            </h1>
                            <p className="text-zinc-400 text-lg">
                                Contributing to <span className={currentTheme.text}>{project.name}</span>
                            </p>
                        </div>
                        <div className={`p-4 rounded-2xl ${currentTheme.icon} backdrop-blur-sm border ${currentTheme.border}`}>
                            {category === "plan-change" ? <Brain className="w-8 h-8" /> :
                                category === "build" ? <Hammer className="w-8 h-8" /> :
                                    <Trophy className="w-8 h-8" />}
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Category Selection - Visual Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => { setCategory("plan-change"); setFormData({}); }}
                            className={`p-6 rounded-2xl border transition-all text-left relative overflow-hidden group ${category === "plan-change"
                                ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-900/20"
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"
                                }`}
                        >
                            <Brain className={`w-6 h-6 mb-3 ${category === "plan-change" ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                            <span className="block font-bold text-lg mb-1">Plan & Change</span>
                            <span className="text-xs opacity-70">Decisions, Ideas, Research</span>
                            {category === "plan-change" && <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl -mr-6 -mt-6"></div>}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCategory("build"); setFormData({}); }}
                            className={`p-6 rounded-2xl border transition-all text-left relative overflow-hidden group ${category === "build"
                                ? "bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/50 shadow-lg shadow-amber-900/20"
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"
                                }`}
                        >
                            <Hammer className={`w-6 h-6 mb-3 ${category === "build" ? "text-amber-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                            <span className="block font-bold text-lg mb-1">Build</span>
                            <span className="text-xs opacity-70">Logs, Debugging, Context</span>
                            {category === "build" && <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl -mr-6 -mt-6"></div>}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCategory("reflect"); setFormData({}); }}
                            className={`p-6 rounded-2xl border transition-all text-left relative overflow-hidden group ${category === "reflect"
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-900/20"
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"
                                }`}
                        >
                            <Trophy className={`w-6 h-6 mb-3 ${category === "reflect" ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                            <span className="block font-bold text-lg mb-1">Reflect</span>
                            <span className="text-xs opacity-70">Milestones, Reviews</span>
                            {category === "reflect" && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl -mr-6 -mt-6"></div>}
                        </button>
                    </div>

                    {/* Subcategory Pills */}
                    <div className="flex gap-3 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {category === "plan-change" && (["decision-log", "idea-spark", "research-notes"] as const).map((sub) => (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => { setPlanSub(sub); setFormData({}); }}
                                className={`text-sm font-medium px-4 py-2 rounded-full transition-all border ${planSub === sub
                                    ? currentTheme.sub_active
                                    : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800"
                                    }`}
                            >
                                {sub.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                        {category === "build" && (["debugging", "context-switch", "til-snippet"] as const).map((sub) => (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => { setBuildSub(sub); setFormData({}); }}
                                className={`text-sm font-medium px-4 py-2 rounded-full transition-all border ${buildSub === sub
                                    ? currentTheme.sub_active
                                    : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800"
                                    }`}
                            >
                                {sub.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                        {category === "reflect" && (["milestone", "post-mortem", "review"] as const).map((sub) => (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => { setReflectSub(sub); setFormData({}); }}
                                className={`text-sm font-medium px-4 py-2 rounded-full transition-all border ${reflectSub === sub
                                    ? currentTheme.sub_active
                                    : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-800"
                                    }`}
                            >
                                {sub.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>

                    {/* Title Input - Large & Clean */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="sr-only">
                            Entry Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full bg-transparent border-b-2 border-zinc-800 px-0 py-4 text-zinc-100 focus:outline-none focus:border-${currentTheme.text.split('-')[1]}-500 transition-all font-bold text-3xl placeholder-zinc-700`}
                            placeholder="What's on your mind?"
                        />
                    </div>

                    {/* TEMPLATE GUIDELINES */}
                    <div className={`bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 ${currentTheme.border} relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentTheme.button}`}></div>
                        <h3 className={`text-base font-bold text-zinc-200 mb-2 flex items-center gap-2`}>
                            {TEMPLATE_INFO[(category === 'plan-change' ? planSub : category === 'build' ? buildSub : reflectSub) as keyof typeof TEMPLATE_INFO]?.title || "Guidance"}
                        </h3>
                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                            {TEMPLATE_INFO[(category === 'plan-change' ? planSub : category === 'build' ? buildSub : reflectSub) as keyof typeof TEMPLATE_INFO]?.purpose}
                        </p>
                        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                            <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Example</span>
                            <p className="text-sm text-zinc-300 italic font-medium">
                                "{TEMPLATE_INFO[(category === 'plan-change' ? planSub : category === 'build' ? buildSub : reflectSub) as keyof typeof TEMPLATE_INFO]?.example}"
                            </p>
                        </div>
                    </div>

                    {/* DYNAMIC FORM FIELDS */}
                    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* PLAN: Decision Log */}
                        {category === "plan-change" && planSub === "decision-log" && (
                            <>
                                {renderInput("context", "Context", "What is the situation? (e.g. 'Choosing a database')", true)}
                                {renderInput("options", "Options Considered", "Option A vs Option B vs Option C")}
                                {renderInput("decision", "Decision", "We are going with Option A")}
                                {renderInput("rationale", "Rationale", "Why? (e.g. 'Better performance, cheaper')", true)}
                            </>
                        )}

                        {/* PLAN: Idea Spark */}
                        {category === "plan-change" && planSub === "idea-spark" && (
                            <>
                                {renderInput("coreValue", "Core Value", "What is the one thing this idea does well?")}
                                {renderInput("vibe", "Vibe / Aesthetic", "Cyberpunk? Minimalist? Professional?")}
                            </>
                        )}

                        {/* PLAN: Research Notes */}
                        {category === "plan-change" && planSub === "research-notes" && (
                            <>
                                {renderInput("topic", "Topic", "What are you researching?")}
                                {renderInput("learnings", "Key Learnings", "What did you find out?", true)}
                                {renderInput("resources", "Resources", "Links to articles/docs", true)}
                            </>
                        )}

                        {/* BUILD: Debugging */}
                        {category === "build" && buildSub === "debugging" && (
                            <>
                                {renderInput("symptom", "Symptom", "What is broken? 'Error 500 on login'")}
                                {renderInput("hypothesis", "Hypothesis", "I think it's the auth token expiration")}
                                {renderInput("attempted", "What I Tried", "- Cleared cookies\n- Restarted server", true)}
                                {renderInput("solution", "Solution", "Updated the JWT secret env var", true)}
                            </>
                        )}

                        {/* BUILD: Context Switch */}
                        {category === "build" && buildSub === "context-switch" && (
                            <>
                                {renderInput("currentState", "Current State", "The new dashboard is rendering but empty", true)}
                                {renderInput("nextSteps", "Next Steps (For Future You)", "1. Hook up the API\n2. Fix the loading state", true)}
                            </>
                        )}

                        {/* BUILD: TIL Snippet */}
                        {category === "build" && buildSub === "til-snippet" && (
                            <>
                                {renderInput("problem", "Problem", "How to center a div horizontally and vertically?")}
                                {renderInput("solution", "Solution", "Flexbox!")}
                                {renderInput("code", "Code Snippet", "display: flex;\njustify-content: center;\nalign-items: center;", true)}
                            </>
                        )}

                        {/* REFLECT: Milestone */}
                        {category === "reflect" && reflectSub === "milestone" && (
                            <>
                                {renderInput("achievement", "Achievement", "Launched v1.0!")}
                                {renderInput("impact", "Impact", "Users can now sign up without crashing")}
                                {renderInput("demoLink", "Demo Link (Optional)", "https://myapp.com")}
                            </>
                        )}

                        {/* REFLECT: Post-Mortem */}
                        {category === "reflect" && reflectSub === "post-mortem" && (
                            <>
                                {renderInput("incident", "Incident", "Production DB outage for 2 hours")}
                                {renderInput("rootCause", "Root Cause", "Ran a migration on the wrong TABLE")}
                                {renderInput("prevention", "Prevention", "Added a 'dry-run' flag to the CLI tool", true)}
                            </>
                        )}

                        {/* REFLECT: Review */}
                        {category === "reflect" && reflectSub === "review" && (
                            <>
                                {renderInput("period", "Period", "Sprint 24 (Feb 1-14)")}
                                {renderInput("wentWell", "What Went Well", "- Shipped the new Dashboard\n- Fixed 5 critical bugs", true)}
                                {renderInput("couldBeBetter", "What Could Be Better", "- Deployment took too long\n- Missed one edge case", true)}
                            </>
                        )}

                    </div>

                    <div className="flex justify-end pt-8 border-t border-zinc-800">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center justify-center rounded-lg text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-black h-12 px-8 shadow-lg active:scale-95 ${currentTheme.button}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Entry
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
