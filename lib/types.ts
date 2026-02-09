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
export type EntryCategory = "plan" | "build" | "reflect";

export type PlanSubcategory = "blast" | "feature-concept";
export type BuildSubcategory = "technical-decision" | "bug-fix" | "progress-update";
export type ReflectSubcategory = "learning-note" | "retrospective" | "general-note";

export type EntrySubcategory = PlanSubcategory | BuildSubcategory | ReflectSubcategory;

// BLAST Framework
export interface BlastFramework {
    blueprint: string; // The singular goal/North Star
    link: string; // Integrations and MCPs required
    architect: string; // Data structure and schema planning
    style: string; // UI/UX tokens and design system choices
    trigger: string; // The event that initiates the logic/automation
}

// Entry Template Data
export interface PlanTemplateData {
    subcategory: PlanSubcategory;
    blastFramework?: BlastFramework;
    featureConcept?: string;
}

export interface BuildTemplateData {
    subcategory: BuildSubcategory;
    technicalDecision?: {
        context: string;
        decision: string;
        rationale: string;
    };
    bugFix?: {
        rootCause: string;
        solution: string;
        prevention: string;
    };
    progressUpdate?: {
        accomplishments: string;
    };
}

export interface ReflectTemplateData {
    subcategory: ReflectSubcategory;
    learningNote?: string;
    retrospective?: {
        whatWentWell: string;
        whatDidntWork: string;
        whatToImprove: string;
    };
    generalNote?: string;
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
