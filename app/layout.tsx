import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "DevJournal — Build in Public",
    description: "Write the work. Ship the story. A typeset journal for developers building in public.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme-mode="press" data-density="cozy" data-focus-mode="false" data-reward-intensity="subtle" data-motion-level="standard">
            <body>
                <noscript>
                    <style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }`}</style>
                </noscript>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
