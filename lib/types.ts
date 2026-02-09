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

// Entry Categories and Subcategories
export type EntryCategory = "plan-change" | "build" | "reflect";

export type PlanSubcategory = "idea-spark" | "decision-log" | "research-notes";
export type BuildSubcategory = "context-switch" | "debugging" | "til-snippet" | "implementation-guide";
export type ReflectSubcategory = "milestone" | "post-mortem" | "review";

export type EntrySubcategory = PlanSubcategory | BuildSubcategory | ReflectSubcategory;



// Entry Template Data

export interface PlanTemplateData {
    subcategory: PlanSubcategory;
    // content: string; // <-- Moving away from generic content
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
        resources: string; // Markdown links
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
        attempted: string; // Markdown list
        solution: string;
    };
    tilSnippet?: {
        problem: string;
        solution: string;
        code: string;  // Code block
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



export type EntryTemplateData = PlanTemplateData | BuildTemplateData | ReflectTemplateData;

// Entry
export interface Entry {
    id: string;
    projectId: string;
    category: EntryCategory;
    title: string;
    templateData: EntryTemplateData;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}
