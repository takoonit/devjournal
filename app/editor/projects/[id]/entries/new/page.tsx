"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDevJournalStore } from "@/lib/store";
import {
    EntryCategory,
    PlanSubcategory,
    BuildSubcategory,
    ReflectSubcategory,
} from "@/lib/types";
import {
    ArrowLeft,
    Save,
    Loader2,
    Brain,
    Hammer,
    Trophy,
    ChevronLeft,
    ChevronRight,
    Check,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import BlurText from "@/components/reactbits/blur-text";

const TEMPLATE_INFO = {
    "decision-log": {
        title: "Decision Log",
        purpose: "Record significant architectural or product decisions to avoid re-debating them later.",
        example: "Context: Choosing a DB. Options: Postgres vs Mongo. Decision: Postgres. Rationale: Relational data needs.",
    },
    "idea-spark": {
        title: "Idea Spark",
        purpose: "Capture a fleeting idea before it disappears. Focus on the core value and the 'vibe'.",
        example: "Core Value: 'Tinder for Code Reviews'. Vibe: Fast, gamified, mobile-first.",
    },
    "research-notes": {
        title: "Research Notes",
        purpose: "Document what you learned while exploring a new technology or problem space.",
        example: "Topic: React Server Components. Learnings: Great for initial load, harder for interactivity. Resources: <link>",
    },
    debugging: {
        title: "Debugging Log",
        purpose: "Use a scientific method for bugs so you can reason before patching.",
        example: "Symptom: 500 Error. Hypothesis: DB Connection. Tried: Restarting container. Solution: Fixed env var.",
    },
    "context-switch": {
        title: "Context Switch",
        purpose: "Save your current state before context switching so you can quickly resume.",
        example: "Current State: API fetch works but UI isn't updating. Next Steps: Check reducer and stale memo.",
    },
    "til-snippet": {
        title: "TIL / Snippet",
        purpose: "Store useful snippets and commands you can reuse later.",
        example: "Problem: Vertically center div. Solution: grid place-items-center.",
    },
    "implementation-guide": {
        title: "Implementation Guide",
        purpose: "Document how a feature works end-to-end for future maintenance and onboarding.",
        example: "Feature: Invite workflow. How it Works: token + email magic link. Edge Cases: expired invites.",
    },
    milestone: {
        title: "Milestone",
        purpose: "Celebrate progress and capture outcomes for your brag-doc trail.",
        example: "Achievement: Shipped v1.0. Impact: 100 new users.",
    },
    "post-mortem": {
        title: "Post-Mortem",
        purpose: "Reflect on incidents with blameless, prevention-focused analysis.",
        example: "Incident: Site down for 10m. Root Cause: Expired SSL cert. Prevention: Auto-renew bot.",
    },
    review: {
        title: "Periodic Review",
        purpose: "Look back over a sprint or week to improve your process.",
        example: "Went Well: Velocity up. Could Be Better: Too many meetings.",
    },
};

const FLOW_STEPS = [
    { id: 1, label: "Choose Track" },
    { id: 2, label: "Write Entry" },
    { id: 3, label: "Review & Save" },
] as const;

type EntryDraft = {
    title: string;
    category: EntryCategory;
    planSub: PlanSubcategory;
    buildSub: BuildSubcategory;
    reflectSub: ReflectSubcategory;
    formData: Record<string, string>;
    step: number;
};

export default function NewEntryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { projects, addEntry, consumeInboxCapture } = useDevJournalStore();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const project = projects.find((p) => p.id === id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<number>(1);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<EntryCategory>("plan-change");
    const [planSub, setPlanSub] = useState<PlanSubcategory>("decision-log");
    const [buildSub, setBuildSub] = useState<BuildSubcategory>("debugging");
    const [reflectSub, setReflectSub] = useState<ReflectSubcategory>("milestone");
    const [formData, setFormData] = useState<Record<string, string>>({});

    const draftStorageKey = `devjournal-entry-draft-${id}`;

    const selectedSubcategory =
        category === "plan-change" ? planSub : category === "build" ? buildSub : reflectSub;

    const progressPercent = (step / FLOW_STEPS.length) * 100;

    const hasAnyContent = useMemo(
        () => Object.values(formData).some((value) => value.trim().length > 0),
        [formData]
    );

    const canAdvanceFromStepTwo = title.trim().length > 0 && hasAnyContent;


    useEffect(() => {
        const captureId = searchParams.get("capture");
        if (!captureId) return;

        const capture = consumeInboxCapture(captureId);
        if (!capture) return;

        setCategory("build");
        setBuildSub("context-switch");
        setTitle(capture.content.slice(0, 72));
        setFormData({
            currentState: capture.content,
            nextSteps: "",
        });
        setStep(2);

        addToast({
            message: "Capture converted. Add next steps, then save your entry.",
            type: "info",
        });
    }, [addToast, consumeInboxCapture, searchParams]);

    useEffect(() => {
        const captureId = searchParams.get("capture");
        if (captureId) return;

        const rawDraft = localStorage.getItem(draftStorageKey);
        if (!rawDraft) return;

        try {
            const parsed = JSON.parse(rawDraft) as EntryDraft;
            setTitle(parsed.title ?? "");
            setCategory(parsed.category ?? "plan-change");
            setPlanSub(parsed.planSub ?? "decision-log");
            setBuildSub(parsed.buildSub ?? "debugging");
            setReflectSub(parsed.reflectSub ?? "milestone");
            setFormData(parsed.formData ?? {});
            setStep(parsed.step && parsed.step >= 1 && parsed.step <= 3 ? parsed.step : 1);

            addToast({
                message: "Restored your draft so you can continue where you left off.",
                type: "info",
            });
        } catch {
            localStorage.removeItem(draftStorageKey);
        }
    }, [addToast, draftStorageKey, searchParams]);

    useEffect(() => {
        const draft: EntryDraft = {
            title,
            category,
            planSub,
            buildSub,
            reflectSub,
            formData,
            step,
        };

        localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    }, [title, category, planSub, buildSub, reflectSub, formData, step, draftStorageKey]);

    const clearDraft = () => {
        localStorage.removeItem(draftStorageKey);
    };

    const saveAndReturn = () => {
        addToast({
            message: "Draft saved. Come back anytime to continue.",
            type: "success",
        });
        router.push(`/editor/projects/${id}`);
    };

    const currentTheme = {
        "plan-change": {
            bg: "from-indigo-500/10 via-zinc-950 to-zinc-950",
            border: "border-indigo-500/20",
            text: "text-indigo-400",
            button: "bg-indigo-500 hover:bg-indigo-400",
            ring: "focus:ring-indigo-500/50",
            icon: "bg-indigo-500/20 text-indigo-400",
            subActive: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
            label: "Plan & Change",
        },
        build: {
            bg: "from-amber-500/10 via-zinc-950 to-zinc-950",
            border: "border-amber-500/20",
            text: "text-amber-400",
            button: "bg-amber-500 hover:bg-amber-400",
            ring: "focus:ring-amber-500/50",
            icon: "bg-amber-500/20 text-amber-400",
            subActive: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            label: "Build",
        },
        reflect: {
            bg: "from-emerald-500/10 via-zinc-950 to-zinc-950",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            button: "bg-emerald-500 hover:bg-emerald-400",
            ring: "focus:ring-emerald-500/50",
            icon: "bg-emerald-500/20 text-emerald-400",
            subActive: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            label: "Reflect",
        },
    }[category];

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h1 className="mb-4 text-2xl font-bold text-zinc-100">Project Not Found</h1>
            </div>
        );
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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

            addEntry({
                projectId: project.id,
                category,
                title,
                templateData,
                isPublic: true,
            });

            clearDraft();
            addToast({
                message: "Entry saved. Nice progress.",
                type: "success",
            });
            router.push(`/editor/projects/${project.id}`);
        } catch (error) {
            console.error("Failed to create entry:", error);
            setIsSubmitting(false);
        }
    };

    const renderInput = (
        inputId: string,
        label: string,
        placeholder: string,
        isTextArea = false
    ) => (
        <div className="group space-y-2">
            <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    id={inputId}
                    required
                    value={formData[inputId] || ""}
                    onChange={(e) => handleInputChange(inputId, e.target.value)}
                    className={`h-32 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 font-mono text-sm text-zinc-100 transition-all focus:border-transparent focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type="text"
                    id={inputId}
                    required
                    value={formData[inputId] || ""}
                    onChange={(e) => handleInputChange(inputId, e.target.value)}
                    className={`w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 transition-all focus:border-transparent focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                    placeholder={placeholder}
                />
            )}
        </div>
    );

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} transition-colors duration-700`}>
            <div className="mx-auto max-w-4xl px-6 pb-20 pt-8">
                <header className="relative mb-8">
                    <Link
                        href={`/editor/projects/${project.id}`}
                        className="group mb-4 inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Project
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <BlurText
                                text="New Entry"
                                className="mb-2 text-4xl font-extrabold tracking-tight text-white"
                                delay={80}
                                animateBy="letters"
                            />
                            <p className="text-lg text-zinc-400">
                                Contributing to <span className={currentTheme.text}>{project.name}</span>
                            </p>
                        </div>
                        <div className={`rounded-2xl border p-4 backdrop-blur-sm ${currentTheme.icon} ${currentTheme.border}`}>
                            {category === "plan-change" ? <Brain className="h-8 w-8" /> : category === "build" ? <Hammer className="h-8 w-8" /> : <Trophy className="h-8 w-8" />}
                        </div>
                    </div>
                </header>

                <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
                        <span>Step {step} of {FLOW_STEPS.length}</span>
                        <span>{Math.round(progressPercent)}% complete</span>
                    </div>
                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div className="h-full rounded-full bg-cyan-400 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                        {FLOW_STEPS.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-lg border px-3 py-2 text-sm ${
                                    item.id === step
                                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                                        : item.id < step
                                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                          : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {item.id < step ? <Check className="h-3.5 w-3.5" /> : null}
                                    <span>{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={() => { setCategory("plan-change"); setFormData({}); }}
                                    className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${category === "plan-change" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50" : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"}`}
                                >
                                    <Brain className="mb-3 h-6 w-6" />
                                    <span className="mb-1 block text-lg font-bold">Plan & Change</span>
                                    <span className="text-xs opacity-70">Decisions, Ideas, Research</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCategory("build"); setFormData({}); }}
                                    className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${category === "build" ? "border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/50" : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"}`}
                                >
                                    <Hammer className="mb-3 h-6 w-6" />
                                    <span className="mb-1 block text-lg font-bold">Build</span>
                                    <span className="text-xs opacity-70">Logs, Debugging, Context</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCategory("reflect"); setFormData({}); }}
                                    className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${category === "reflect" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50" : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"}`}
                                >
                                    <Trophy className="mb-3 h-6 w-6" />
                                    <span className="mb-1 block text-lg font-bold">Reflect</span>
                                    <span className="text-xs opacity-70">Milestones, Reviews</span>
                                </button>
                            </div>

                            <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2">
                                {category === "plan-change" && (["decision-log", "idea-spark", "research-notes"] as const).map((sub) => (
                                    <button
                                        key={sub}
                                        type="button"
                                        onClick={() => { setPlanSub(sub); setFormData({}); }}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${planSub === sub ? currentTheme.subActive : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}
                                    >
                                        {sub.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </button>
                                ))}
                                {category === "build" && (["debugging", "context-switch", "til-snippet"] as const).map((sub) => (
                                    <button
                                        key={sub}
                                        type="button"
                                        onClick={() => { setBuildSub(sub); setFormData({}); }}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${buildSub === sub ? currentTheme.subActive : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}
                                    >
                                        {sub.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </button>
                                ))}
                                {category === "reflect" && (["milestone", "post-mortem", "review"] as const).map((sub) => (
                                    <button
                                        key={sub}
                                        type="button"
                                        onClick={() => { setReflectSub(sub); setFormData({}); }}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${reflectSub === sub ? currentTheme.subActive : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}
                                    >
                                        {sub.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {step === 2 ? (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="title" className="sr-only">Entry Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full border-b-2 border-zinc-800 bg-transparent px-0 py-4 text-3xl font-bold text-zinc-100 placeholder-zinc-700 transition-all focus:outline-none ${currentTheme.ring}`}
                                    placeholder="What's on your mind?"
                                />
                            </div>

                            <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 ${currentTheme.border}`}>
                                <div className={`absolute bottom-0 left-0 top-0 w-1 ${currentTheme.button}`}></div>
                                <h3 className="mb-2 text-base font-bold text-zinc-200">
                                    {TEMPLATE_INFO[selectedSubcategory].title}
                                </h3>
                                <p className="mb-2 text-sm text-zinc-400">{TEMPLATE_INFO[selectedSubcategory].purpose}</p>
                                <p className="text-xs text-zinc-500">Example: {TEMPLATE_INFO[selectedSubcategory].example}</p>
                            </div>

                            <div className="space-y-6">
                                {category === "plan-change" && planSub === "decision-log" && (
                                    <>
                                        {renderInput("context", "Context", "What situation triggered this decision?")}
                                        {renderInput("options", "Options Considered", "Option A vs Option B vs Option C")}
                                        {renderInput("decision", "Decision", "We are going with Option A")}
                                        {renderInput("rationale", "Rationale", "Why this decision?", true)}
                                    </>
                                )}
                                {category === "plan-change" && planSub === "idea-spark" && (
                                    <>
                                        {renderInput("coreValue", "Core Value", "What is the one thing this idea does well?")}
                                        {renderInput("vibe", "Vibe / Aesthetic", "Cyberpunk? Minimalist? Professional?")}
                                    </>
                                )}
                                {category === "plan-change" && planSub === "research-notes" && (
                                    <>
                                        {renderInput("topic", "Topic", "What are you researching?")}
                                        {renderInput("learnings", "Key Learnings", "What did you find out?", true)}
                                        {renderInput("resources", "Resources", "Links to articles/docs", true)}
                                    </>
                                )}
                                {category === "build" && buildSub === "debugging" && (
                                    <>
                                        {renderInput("symptom", "Symptom", "What is broken?")}
                                        {renderInput("hypothesis", "Hypothesis", "What do you think is causing it?")}
                                        {renderInput("attempted", "What I Tried", "List troubleshooting attempts", true)}
                                        {renderInput("solution", "Solution", "What fixed it?", true)}
                                    </>
                                )}
                                {category === "build" && buildSub === "context-switch" && (
                                    <>
                                        {renderInput("currentState", "Current State", "Where did you stop?", true)}
                                        {renderInput("nextSteps", "Next Steps", "What should future-you do first?", true)}
                                    </>
                                )}
                                {category === "build" && buildSub === "til-snippet" && (
                                    <>
                                        {renderInput("problem", "Problem", "What problem did this solve?")}
                                        {renderInput("solution", "Solution", "Short answer")}
                                        {renderInput("code", "Code Snippet", "Paste the snippet", true)}
                                    </>
                                )}
                                {category === "reflect" && reflectSub === "milestone" && (
                                    <>
                                        {renderInput("achievement", "Achievement", "What did you ship/finish?")}
                                        {renderInput("impact", "Impact", "What changed because of it?")}
                                        {renderInput("demoLink", "Demo Link", "https://...")}
                                    </>
                                )}
                                {category === "reflect" && reflectSub === "post-mortem" && (
                                    <>
                                        {renderInput("incident", "Incident", "What happened?")}
                                        {renderInput("rootCause", "Root Cause", "Why did it happen?")}
                                        {renderInput("prevention", "Prevention", "How will you avoid repeats?", true)}
                                    </>
                                )}
                                {category === "reflect" && reflectSub === "review" && (
                                    <>
                                        {renderInput("period", "Period", "Sprint/Week")}
                                        {renderInput("wentWell", "What Went Well", "Wins and strengths", true)}
                                        {renderInput("couldBeBetter", "What Could Be Better", "Gaps and next improvements", true)}
                                    </>
                                )}
                            </div>
                        </>
                    ) : null}

                    {step === 3 ? (
                        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                            <h3 className="text-lg font-semibold text-zinc-100">Review your entry</h3>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-zinc-500">Category</dt>
                                    <dd className="text-sm text-zinc-200">{currentTheme.label}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-zinc-500">Prompt</dt>
                                    <dd className="text-sm text-zinc-200">{TEMPLATE_INFO[selectedSubcategory].title}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-xs uppercase tracking-wide text-zinc-500">Title</dt>
                                    <dd className="text-sm text-zinc-200">{title || "(untitled)"}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-xs uppercase tracking-wide text-zinc-500">Captured fields</dt>
                                    <dd className="text-sm text-zinc-300">{Object.keys(formData).length} fields ready to save</dd>
                                </div>
                            </dl>
                            <p className="text-xs text-zinc-500">
                                Save now or use Save & Return to continue later. Drafts are persisted per project in local storage.
                            </p>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-6">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                                disabled={step === 1}
                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => Math.min(3, prev + 1))}
                                    disabled={step === 2 && !canAdvanceFromStepTwo}
                                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : null}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={saveAndReturn}
                                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                            >
                                Save & Return
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || step !== 3}
                                className={`inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-bold text-black shadow-lg transition-colors disabled:opacity-50 ${currentTheme.button}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Entry
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
