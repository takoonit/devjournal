import type {
  BuildSubcategory,
  EntryCategory,
  EntryTemplateData,
  PlanSubcategory,
  ReflectSubcategory,
} from "@/lib/types";

export const TEMPLATE_INFO = {
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
} as const;

export const ENTRY_THEME: Record<
  EntryCategory,
  {
    bg: string;
    border: string;
    text: string;
    button: string;
    ring: string;
    icon: string;
    subActive: string;
    label: string;
  }
> = {
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
};

export const formatSubcategoryLabel = (subcategory: string) =>
  subcategory.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());


const pickFields = <T extends string>(fields: T[], formData: Record<string, string>) =>
  fields.reduce((acc, field) => {
    acc[field] = formData[field] ?? "";
    return acc;
  }, {} as Record<T, string>);

export const buildEntryTemplateData = ({
  category,
  planSub,
  buildSub,
  reflectSub,
  formData,
}: {
  category: EntryCategory;
  planSub: PlanSubcategory;
  buildSub: BuildSubcategory;
  reflectSub: ReflectSubcategory;
  formData: Record<string, string>;
}): EntryTemplateData => {
  if (category === "plan-change") {
    if (planSub === "decision-log") {
      return { subcategory: planSub, decisionLog: pickFields(["context", "options", "decision", "rationale"], formData) };
    }

    if (planSub === "idea-spark") {
      return { subcategory: planSub, ideaSpark: pickFields(["coreValue", "vibe"], formData) };
    }

    return { subcategory: planSub, researchNotes: pickFields(["topic", "learnings", "resources"], formData) };
  }

  if (category === "build") {
    if (buildSub === "debugging") {
      return { subcategory: buildSub, debugging: pickFields(["symptom", "hypothesis", "attempted", "solution"], formData) };
    }

    if (buildSub === "context-switch") {
      return { subcategory: buildSub, contextSwitch: pickFields(["currentState", "nextSteps"], formData) };
    }

    if (buildSub === "til-snippet") {
      return { subcategory: buildSub, tilSnippet: pickFields(["problem", "solution", "code"], formData) };
    }

    return { subcategory: buildSub, implementationGuide: pickFields(["feature", "howItWorks", "edgeCases"], formData) };
  }

  if (reflectSub === "milestone") {
    return { subcategory: reflectSub, milestone: pickFields(["achievement", "impact", "demoLink"], formData) };
  }

  if (reflectSub === "post-mortem") {
    return { subcategory: reflectSub, postMortem: pickFields(["incident", "rootCause", "prevention"], formData) };
  }

  return { subcategory: reflectSub, review: pickFields(["period", "wentWell", "couldBeBetter"], formData) };
};
