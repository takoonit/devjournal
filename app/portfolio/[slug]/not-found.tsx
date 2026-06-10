import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-zinc-100 mb-4">404</h1>
                <p className="text-zinc-400 mb-8">Project not found</p>
                <Link href="/portfolio" className="btn-primary px-6 py-3">
                    Back to portfolio
                </Link>
            </div>
        </div>
    );
}
