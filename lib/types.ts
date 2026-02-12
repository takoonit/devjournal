// User Profile
export interface User {
    id: string;
    name: string;
    role: string;
    bio: string;
    socialLinks: {
        github?: string;
        twitter?: string;
        linkedin?: string;
        email?: string;
    };
}

// Project
export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    techStack: string[];
    repositoryLink?: string;
    status: "in-progress" | "shipped";
    createdAt: string;
    updatedAt: string;
}

// Legacy Categories + New semantic entry type
export type EntryCategory = "plan-change" | "build" | "reflect";
export type EntryType = "feature" | "fix" | "refactor" | "design" | "journal";

export type PlanSubcategory = "idea-spark" | "decision-log" | "research-notes";
export type BuildSubcategory = "context-switch" | "debugging" | "til-snippet" | "implementation-guide";
export type ReflectSubcategory = "milestone" | "post-mortem" | "review";

export type EntrySubcategory = PlanSubcategory | BuildSubcategory | ReflectSubcategory;

export interface PlanTemplateData {
    subcategory: PlanSubcategory;
    ideaSpark?: {
        coreValue: string;
        vibe: string;
    };
    decisionLog?: {
        context: string;
        options: string;
        decision: string;
        rationale: string;
    };
    researchNotes?: {
        topic: string;
        learnings: string;
        resources: string;
    };
}

export interface BuildTemplateData {
    subcategory: BuildSubcategory;
    contextSwitch?: {
        currentState: string;
        nextSteps: string;
    };
    debugging?: {
        symptom: string;
        hypothesis: string;
        attempted: string;
        solution: string;
    };
    tilSnippet?: {
        problem: string;
        solution: string;
        code: string;
    };
    implementationGuide?: {
        feature: string;
        howItWorks: string;
        edgeCases: string;
    };
}

export interface ReflectTemplateData {
    subcategory: ReflectSubcategory;
    milestone?: {
        achievement: string;
        impact: string;
        demoLink: string;
    };
    postMortem?: {
        incident: string;
        rootCause: string;
        prevention: string;
    };
    review?: {
        period: string;
        wentWell: string;
        couldBeBetter: string;
    };
}

export type EntryTemplateData = PlanTemplateData | BuildTemplateData | ReflectTemplateData | Record<string, unknown>;

export interface Entry {
    id: string;
    projectId: string;
    entryType: EntryType;
    title: string;
    content: string;
    templateData?: EntryTemplateData;
    category?: EntryCategory;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InboxCapture {
    id: string;
    content: string;
    projectId?: string;
    createdAt: string;
}
