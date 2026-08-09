import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-md">
                <p className="font-mono text-label uppercase text-text-muted">
                    Entry not found
                </p>
                <h1 className="rule-oxford mt-4 font-serif text-folio text-text-primary">
                    404<span className="ml-3 align-top text-[0.5em] text-accent" aria-hidden="true">¶</span>
                </h1>
                <p className="mt-6 text-prose text-text-secondary">
                    This page was never set in type, or it has been struck from
                    the record.
                </p>
                <p className="mt-8 font-mono text-meta">
                    <Link href="/portfolio" className="control-target link-ink justify-start">
                        Return to the portfolio
                    </Link>
                </p>
            </div>
        </div>
    );
}
