"use client";

import { useDevJournalStore } from "@/lib/store";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import GradientText from "@/components/reactbits/gradient-text";

export function BioSidebar() {
    const user = useDevJournalStore((state) => state.user);

    const socialIcons = {
        github: Github,
        twitter: Twitter,
        linkedin: Linkedin,
        email: Mail,
    };

    return (
        <aside className="w-full lg:w-80 lg:sticky lg:top-8 lg:self-start">
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-100 mb-1">{user.name}</h1>
                    <GradientText
                        colors={["#06b6d4", "#10b981", "#06b6d4"]}
                        animationSpeed={6}
                        className="font-mono text-sm justify-start"
                        isInteractive={false}
                    >
                        {user.role}
                    </GradientText>
                </div>

                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{user.bio}</p>

                <div className="flex gap-3">
                    {Object.entries(user.socialLinks).map(([platform, link]) => {
                        if (!link) return null;
                        const Icon = socialIcons[platform as keyof typeof socialIcons];
                        const href = platform === "email" ? `mailto:${link}` : link;

                        return (
                            <a
                                key={platform}
                                href={href}
                                target={platform !== "email" ? "_blank" : undefined}
                                rel={platform !== "email" ? "noopener noreferrer" : undefined}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                                aria-label={platform}
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <Link href="/editor" className="btn-primary w-full">
                        Editor →
                    </Link>
                </div>
            </div>
        </aside>
    );
}
