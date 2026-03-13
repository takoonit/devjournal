import { User } from "@/lib/types";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

interface BioSidebarStaticProps {
    user: User;
}

const socialIcons = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    email: Mail,
};

export function BioSidebarStatic({ user }: BioSidebarStaticProps) {
    return (
        <aside className="w-full lg:w-80 lg:sticky lg:top-8 lg:self-start">
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-100 mb-1">{user.name}</h1>
                    <p className="font-mono text-sm text-brand-400">{user.role}</p>
                </div>

                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{user.bio}</p>

                <div className="flex gap-3">
                    {Object.entries(user.socialLinks).map(([platform, link]) => {
                        if (!link) {
                            return null;
                        }

                        const Icon = socialIcons[platform as keyof typeof socialIcons];
                        if (!Icon) {
                            return null;
                        }

                        const href = platform === "email" ? `mailto:${link}` : link;

                        return (
                            <a
                                key={platform}
                                href={href}
                                target={platform !== "email" ? "_blank" : undefined}
                                rel={platform !== "email" ? "noopener noreferrer" : undefined}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-brand-400 hover:border-brand-400/50 transition-all"
                                aria-label={platform}
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <Link
                        href="/editor"
                        className="block w-full px-4 py-2 text-center text-sm font-medium rounded-lg bg-brand-400/10 text-brand-400 border border-brand-400/30 hover:bg-brand-400/20 transition-colors"
                    >
                        Editor →
                    </Link>
                </div>
            </div>
        </aside>
    );
}
