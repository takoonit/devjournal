import type { Metadata } from "next";
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
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
