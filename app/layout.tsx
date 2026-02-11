import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "DevJournal - Build in Public",
    description: "Document your development journey and showcase your process",
};

/**
 * Root HTML layout for the application that sets global data attributes and provides app-wide context.
 *
 * Renders an <html> and <body> with theme, density, focus, reward, and motion data attributes, and places the supplied children inside the global Providers component.
 *
 * @param children - Page content to render inside the application's root layout
 * @returns The root JSX element containing the HTML and body structure with Providers-wrapped children
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme-mode="noir" data-density="cozy" data-focus-mode="false" data-reward-intensity="subtle" data-motion-level="standard">
            <body data-theme-mode="noir" data-focus-mode="false" data-density="cozy" data-reward-intensity="subtle" data-motion-level="standard">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}