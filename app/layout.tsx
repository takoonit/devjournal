import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "DevJournal - Build in Public",
    description: "Document your development journey and showcase your process",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme-mode="noir" data-density="cozy" data-focus-mode="false" data-reward-intensity="subtle" data-motion-level="standard">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
