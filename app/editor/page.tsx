"use client";

import { useMemo, useState } from "react";
import { useDevJournalStore } from "@/lib/store";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ArrowRightCircle, CheckCircle2, Plus, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import RotatingText from "@/components/reactbits/rotating-text";
import ShinyText from "@/components/reactbits/shiny-text";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useToast } from "@/components/ui/toast";
import ScrollReveal from "@/components/reactbits/scroll-reveal";
import BlurText from "@/components/reactbits/blur-text";
import CountUp from "@/components/reactbits/count-up";

/**
 * Renders the Editor page UI for managing projects and performing quick inbox captures.
 *
 * Displays a projects list (with animated header and count), an inbox quick-capture input that stores short notes into the inbox (up to the first 8 shown), per-capture actions to convert or delete captures, and an empty-state CTA when no projects exist. Successful quick captures show a success toast.
 *
 * @returns The Editor page React element containing project management, inbox capture controls, and related actions.
 */
export default function EditorPage() {
    const projects = useDevJournalStore((state) => state.projects);
    const inboxCaptures = useDevJournalStore((state) => state.inboxCaptures);
    const addInboxCapture = useDevJournalStore((state) => state.addInboxCapture);
    const deleteInboxCapture = useDevJournalStore((state) => state.deleteInboxCapture);
    const { addToast } = useToast();

    const [captureText, setCaptureText] = useState("");
    const [captureProjectId, setCaptureProjectId] = useState<string>(projects[0]?.id ?? "");

    const captureProjectMap = useMemo(
        () => new Map(projects.map((project) => [project.id, project.name])),
        [projects]
    );

    const handleQuickCapture = () => {
        const trimmed = captureText.trim();
        if (!trimmed) return;

        addInboxCapture(trimmed, captureProjectId || undefined);
        setCaptureText("");

        addToast({
            message: "Captured in your inbox. Convert it when you are ready.",
            type: "success",
        });
    };

    return (
        <div className="max-w-6xl">
            <Breadcrumbs items={[{ label: "Editor" }]} />

            <div className="mb-8">
                <BlurText
                    text="Your Projects"
                    className="mb-2 text-3xl font-bold text-zinc-100"
                    delay={80}
                    animateBy="letters"
                />
                <p className="text-zinc-400">
                    Manage your projects and build logs.
                    {projects.length > 0 && (
                        <span className="ml-2 font-mono text-cyan-400">
                            <CountUp to={projects.length} duration={1.5} /> {projects.length === 1 ? "project" : "projects"}
                        </span>
                    )}
                </p>
            </div>

            <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Inbox Quick Capture
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                    <label htmlFor="capture-input" className="sr-only">Quick capture note</label>
                    <input
                        id="capture-input"
                        value={captureText}
                        onChange={(e) => setCaptureText(e.target.value)}
                        placeholder="Capture an idea, blocker, or context note in one line..."
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500/60 focus:outline-none"
                    />
                    <label htmlFor="capture-project" className="sr-only">Assign project for capture</label>
                    <select
                        id="capture-project"
                        value={captureProjectId}
                        onChange={(e) => setCaptureProjectId(e.target.value)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-200 focus:border-cyan-500/60 focus:outline-none"
                    >
                        <option value="">No project yet</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleQuickCapture}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Capture
                    </button>
                </div>

                <div className="mt-4 space-y-2">
                    {inboxCaptures.length === 0 ? (
                        <p className="text-xs text-zinc-500">Inbox is clear. Capture something fast to convert it later.</p>
                    ) : (
                        inboxCaptures.slice(0, 8).map((capture) => {
                            const projectName = capture.projectId
                                ? captureProjectMap.get(capture.projectId)
                                : undefined;

                            return (
                                <div
                                    key={capture.id}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm text-zinc-200">{capture.content}</p>
                                        <p className="text-xs text-zinc-500">
                                            {projectName ? `Project: ${projectName}` : "Unassigned"} • {new Date(capture.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {capture.projectId ? (
                                            <Link
                                                href={`/editor/projects/${capture.projectId}/entries/new?capture=${capture.id}`}
                                                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
                                            >
                                                Convert
                                                <ArrowRightCircle className="h-3.5 w-3.5" />
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-amber-400">Assign a project to convert</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteInboxCapture(capture.id)}
                                            className="rounded-md border border-zinc-700 p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                            aria-label="Delete capture"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 py-20 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-zinc-500">
                        <span>Start by</span>
                        <RotatingText
                            texts={["documenting a decision", "logging a bug fix", "capturing an idea", "celebrating a win"]}
                            mainClassName="h-6 overflow-hidden font-medium text-cyan-400"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            rotationInterval={3000}
                        />
                    </div>
                    <p className="mb-6 text-sm text-zinc-600">Create a project to begin your build journal.</p>
                    <Link
                        href="/editor/projects/new"
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 transition-colors hover:bg-cyan-500/20"
                    >
                        <Plus className="h-5 w-5 text-cyan-400" />
                        <ShinyText text="Create your first project" className="font-medium text-cyan-400" speed={3} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <ScrollReveal key={project.id} delay={index * 0.1}>
                            <ProjectCard
                                project={project}
                                href={`/editor/projects/${project.id}`}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}