import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    socialLinks: z.object({
        github: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        email: z.string().optional(),
    }).catchall(z.unknown()).default({}),
}).catchall(z.unknown());

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional().default(""), // Auto-generated if missing
    description: z.string().optional().default(""),
    techStack: z.array(z.string()).optional().default([]),
    repositoryLink: z.string().optional(),
    status: z.enum(["in-progress", "shipped"]).optional().default("in-progress"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
}).catchall(z.unknown());

export const EntryTypeSchema = z.union([
    z.literal("feature"),
    z.literal("fix"),
    z.literal("refactor"),
    z.literal("design"),
    z.literal("journal")
]);

export const EntrySchema = z.object({
    id: z.string(),
    projectId: z.string(),
    entryType: z.string().optional().default("journal"), // Handle category/entryType mismatches gracefully
    title: z.string().optional().default("Untitled Entry"),
    content: z.string().optional().default(""),
    templateData: z.record(z.unknown()).optional(),
    isPublic: z.boolean().optional().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
}).catchall(z.unknown()); // For 'category' in sample.devjournal

export const UiPreferencesSchema = z.object({
    themeMode: z.enum(["noir", "calm-focus"]).optional(),
    focusMode: z.boolean().optional(),
    density: z.enum(["cozy", "compact"]).optional(),
    rewardIntensity: z.enum(["off", "subtle", "full"]).optional(),
    motionLevel: z.enum(["reduced", "standard", "expressive"]).optional(),
}).catchall(z.unknown());

export const GlobalExportSchema = z.object({
    version: z.literal("1.0"),
    type: z.literal("global"),
    exportedAt: z.string().optional(),
    user: UserSchema.optional(),
    uiPreferences: UiPreferencesSchema.optional(),
    projects: z.array(ProjectSchema),
    entries: z.array(EntrySchema),
}).catchall(z.unknown());

export const SelectiveExportSchema = z.object({
    version: z.literal("1.0"),
    type: z.union([z.literal("selective"), z.literal("project")]),
    exportedAt: z.string().optional(),
    projects: z.array(ProjectSchema).optional(),
    project: ProjectSchema.optional(), // Older singular format check
    entries: z.array(EntrySchema).optional(),
}).catchall(z.unknown());

export const DevJournalExportSchema = z.union([GlobalExportSchema, SelectiveExportSchema]);
