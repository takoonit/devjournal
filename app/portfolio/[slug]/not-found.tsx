import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-zinc-100 mb-4">404</h1>
                <p className="text-zinc-400 mb-8">Project not found</p>
                <Link
                    href="/portfolio"
                    className="inline-block px-6 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                >
                    Back to portfolio
                </Link>
            </div>
        </div>
    );
}
