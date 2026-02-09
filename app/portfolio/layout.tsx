import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Portfolio - DevJournal",
    description: "Build logs and development journey",
};

export default function PortfolioLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
