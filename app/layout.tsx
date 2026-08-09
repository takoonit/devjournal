import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--font-newsreader",
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-ibm-plex-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "DevJournal — Build in Public",
    description: "Write the work. Ship the story. A typeset journal for developers building in public.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${newsreader.variable} ${ibmPlexMono.variable}`}
            data-theme-mode="press"
            data-density="cozy"
            data-focus-mode="false"
            data-reward-intensity="subtle"
            data-motion-level="standard"
        >
            <body>
                <noscript>
                    <style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }`}</style>
                </noscript>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
