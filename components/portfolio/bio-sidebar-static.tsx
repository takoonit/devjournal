import { User } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

interface BioSidebarStaticProps {
    user: User;
}

const SOCIAL_LABELS: Record<string, string> = {
    github: "GitHub",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    email: "Email",
};

/**
 * The masthead: author, role, and colophon details set like the
 * front matter of a printed issue.
 */
export function BioSidebarStatic({ user }: BioSidebarStaticProps) {
    const links = Object.entries(user.socialLinks).filter(([platform, link]) => Boolean(link) && SOCIAL_LABELS[platform]);

    return (
        <aside className="w-full lg:sticky lg:top-12 lg:w-[17rem] lg:shrink-0 lg:self-start">
            <div className="rule-oxford">
                <p className="font-mono text-label uppercase text-text-muted">Build in Public</p>
                <h1 className="mt-4 font-serif text-display text-text-primary">{user.name}</h1>
                <p className="mt-2 font-mono text-label uppercase text-text-secondary">{user.role}</p>
            </div>

            <p className="mt-6 max-w-prose text-ui leading-relaxed text-text-secondary">{user.bio}</p>

            {links.length > 0 && (
                <ul className="mt-8 space-y-2">
                    {links.map(([platform, link]) => {
                        const href = platform === "email" ? `mailto:${link}` : (link as string);

                        return (
                            <li key={platform} className="font-mono text-meta">
                                <a
                                    href={href}
                                    target={platform !== "email" ? "_blank" : undefined}
                                    rel={platform !== "email" ? "noopener noreferrer" : undefined}
                                    className="link-ink"
                                >
                                    {SOCIAL_LABELS[platform]}
                                </a>
                                <span className="text-text-muted" aria-hidden="true"> ↗</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="mt-10 space-y-3 border-t border-rule/15 pt-5 print-hidden">
                <Link
                    href="/editor"
                    className="block font-mono text-label uppercase text-text-secondary transition-colors duration-subtle hover:text-accent"
                >
                    Open the editor →
                </Link>
                <ThemeToggle />
            </div>
        </aside>
    );
}
