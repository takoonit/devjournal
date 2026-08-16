import type { Metadata, Viewport } from "next";
import { Google_Sans_Flex } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
    subsets: ["latin"],
    axes: ["GRAD", "ROND", "opsz", "slnt", "wdth"],
    variable: "--font-google-sans-flex",
    adjustFontFallback: false,
    display: "swap",
});

export const metadata: Metadata = {
    title: "DevJournal — Build in Public",
    description: "Write the work. Share the story. A vivid journal for developers building in public.",
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
            className={googleSansFlex.variable}
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
