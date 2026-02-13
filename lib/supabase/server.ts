import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { Entry, Project, User } from "@/lib/types";
import {
    EntryRow,
    mapEntryRowToEntry,
    mapProfileRowToUser,
    mapProjectRowToProject,
    ProfileRow,
    ProjectRow,
} from "@/lib/supabase/types";

/**
 * Cache revalidation window for portfolio-facing Supabase reads.
 */
const ISR_WINDOW_SECONDS = 150;

/**
 * Builds a public Supabase client from environment variables, or returns null when unavailable.
 */
function getSupabasePublicClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !publishableKey) {
        return null;
    }

    return createClient(url, publishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

/**
 * Emits a production-only warning when public Supabase credentials are missing.
 */
function logSupabaseConfigWarning() {
    if (process.env.NODE_ENV === "production") {
        console.error(
            "Supabase public client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or publishable key aliases)."
        );
    }
}

const getCachedPublicProfile = unstable_cache(
    async (): Promise<User> => {
        const client = getSupabasePublicClient();
        if (!client) {
            logSupabaseConfigWarning();
            return mapProfileRowToUser(null);
        }

        const { data, error } = await client
            .from("profiles")
            .select("id,name,role,bio,github_url,twitter_url,linkedin_url,email,updated_at")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle<ProfileRow>();

        if (error) {
            console.error("Failed to fetch profile", error.message);
            return mapProfileRowToUser(null);
        }

        return mapProfileRowToUser(data);
    },
    ["portfolio-profile"],
    { revalidate: ISR_WINDOW_SECONDS, tags: ["portfolio", "portfolio-profile"] }
);

const getCachedPublicProjects = unstable_cache(
    async (): Promise<Project[]> => {
        const client = getSupabasePublicClient();
        if (!client) {
            logSupabaseConfigWarning();
            return [];
        }

        const { data, error } = await client
            .from("projects")
            .select("id,name,slug,description,tech_stack,repository_link,status,created_at,updated_at")
            .order("updated_at", { ascending: false })
            .returns<ProjectRow[]>();

        if (error) {
            console.error("Failed to fetch projects", error.message);
            return [];
        }

        return data.map(mapProjectRowToProject);
    },
    ["portfolio-projects"],
    { revalidate: ISR_WINDOW_SECONDS, tags: ["portfolio", "portfolio-projects"] }
);

/**
 * Fetches profile + projects for the public portfolio landing pages.
 */
export async function getPublicPortfolioOverview() {
    const [user, projects] = await Promise.all([
        getCachedPublicProfile(),
        getCachedPublicProjects(),
    ]);

    return {
        user,
        projects,
    };
}

/**
 * Returns project slugs for static path generation and portfolio navigation.
 */
export const getPublicProjectSlugs = unstable_cache(
    async (): Promise<string[]> => {
        const client = getSupabasePublicClient();
        if (!client) {
            logSupabaseConfigWarning();
            return [];
        }

        const { data, error } = await client
            .from("projects")
            .select("slug")
            .returns<Array<{ slug: string }>>();

        if (error) {
            console.error("Failed to fetch project slugs", error.message);
            return [];
        }

        return data.map((row) => row.slug);
    },
    ["portfolio-project-slugs"],
    { revalidate: ISR_WINDOW_SECONDS, tags: ["portfolio", "portfolio-projects"] }
);

/**
 * Fetches a single public project with its published entries and profile context.
 */
export const getPublicProjectBySlug = unstable_cache(
    async (slug: string): Promise<{ project: Project | null; entries: Entry[]; user: User }> => {
        const client = getSupabasePublicClient();
        const fallbackUser = mapProfileRowToUser(null);

        if (!client) {
            logSupabaseConfigWarning();
            return {
                project: null,
                entries: [],
                user: fallbackUser,
            };
        }

        const [profileResult, projectResult] = await Promise.all([
            client
                .from("profiles")
                .select("id,name,role,bio,github_url,twitter_url,linkedin_url,email,updated_at")
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle<ProfileRow>(),
            client
                .from("projects")
                .select("id,name,slug,description,tech_stack,repository_link,status,created_at,updated_at")
                .eq("slug", slug)
                .maybeSingle<ProjectRow>(),
        ]);

        const user = profileResult.error ? fallbackUser : mapProfileRowToUser(profileResult.data);

        if (projectResult.error || !projectResult.data) {
            if (projectResult.error) {
                console.error("Failed to fetch project by slug", projectResult.error.message);
            }
            return { project: null, entries: [], user };
        }

        const project = mapProjectRowToProject(projectResult.data);
        const { data: entriesData, error: entriesError } = await client
            .from("entries")
            .select("id,project_id,entry_type,title,content,template_data,is_public,created_at,updated_at")
            .eq("project_id", project.id)
            .eq("is_public", true)
            .order("created_at", { ascending: false })
            .returns<EntryRow[]>();

        if (entriesError) {
            console.error("Failed to fetch public entries", entriesError.message);
            return { project, entries: [], user };
        }

        return {
            project,
            entries: entriesData.map(mapEntryRowToEntry),
            user,
        };
    },
    ["portfolio-project-by-slug"],
    { revalidate: ISR_WINDOW_SECONDS, tags: ["portfolio", "portfolio-projects", "portfolio-entries", "portfolio-profile"] }
);

export { ISR_WINDOW_SECONDS };
