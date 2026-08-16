import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { Entry, Project, User } from "@/lib/types";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { filterProjectsWithPublicEntries } from "@/lib/supabase/public-projects";
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
    const config = getSupabasePublicConfig();
    if (!config) return null;

    return createClient(config.url, config.publishableKey, {
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

async function getCachedPublicProfile(): Promise<User> {
    "use cache";
    cacheTag("portfolio");
    cacheTag("portfolio-profile");
    cacheLife({ revalidate: ISR_WINDOW_SECONDS });

    const client = getSupabasePublicClient();
    if (!client) {
        logSupabaseConfigWarning();
        return mapProfileRowToUser(null);
    }

    const { data, error } = await client
        .from("public_profiles")
        .select("id,name,role,bio,github_url,twitter_url,linkedin_url,updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<ProfileRow>();

    if (error) {
        console.error("Failed to fetch profile", error.message);
        return mapProfileRowToUser(null);
    }

    return mapProfileRowToUser(data);
}

async function getCachedPublicProjects(): Promise<Project[]> {
    "use cache";
    cacheTag("portfolio");
    cacheTag("portfolio-projects");
    cacheLife({ revalidate: ISR_WINDOW_SECONDS });

    const client = getSupabasePublicClient();
    if (!client) {
        logSupabaseConfigWarning();
        return [];
    }

    const [projectsResult, entriesResult] = await Promise.all([
        client
            .from("projects")
            .select("id,name,slug,description,tech_stack,repository_link,status,created_at,updated_at")
            .order("updated_at", { ascending: false })
            .returns<ProjectRow[]>(),
        client
            .from("entries")
            .select("project_id,is_public")
            .eq("is_public", true)
            .returns<Array<{ project_id: string; is_public: boolean }>>(),
    ]);

    if (projectsResult.error || entriesResult.error) {
        const message = projectsResult.error?.message ?? entriesResult.error?.message;
        console.error("Failed to fetch public projects", message);
        return [];
    }

    const projects = projectsResult.data.map(mapProjectRowToProject);
    const entries = entriesResult.data.map((entry) => ({
        projectId: entry.project_id,
        isPublic: entry.is_public,
    }));
    return filterProjectsWithPublicEntries(projects, entries);
}

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
export async function getPublicProjectSlugs(): Promise<string[]> {
    "use cache";
    cacheTag("portfolio");
    cacheTag("portfolio-projects");
    cacheLife({ revalidate: ISR_WINDOW_SECONDS });

    return (await getCachedPublicProjects()).map((project) => project.slug);
}

/**
 * Fetches a single public project with its published entries and profile context.
 */
export async function getPublicProjectBySlug(slug: string): Promise<{ project: Project | null; entries: Entry[]; user: User }> {
    "use cache";
    cacheTag("portfolio");
    cacheTag("portfolio-projects");
    cacheTag("portfolio-entries");
    cacheTag("portfolio-profile");
    cacheLife({ revalidate: ISR_WINDOW_SECONDS });

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
            .from("public_profiles")
            .select("id,name,role,bio,github_url,twitter_url,linkedin_url,updated_at")
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
        return { project: null, entries: [], user };
    }

    const entries = entriesData.map(mapEntryRowToEntry);
    if (entries.length === 0) return { project: null, entries: [], user };

    return {
        project,
        entries,
        user,
    };
}

export { ISR_WINDOW_SECONDS };
