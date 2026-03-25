"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`\${item.label}-\${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded px-1.5 py-0.5 transition-all duration-200 hover:bg-zinc-800/50 hover:text-zinc-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-zinc-200" : "text-zinc-400"} {...(isLast ? { "aria-current": "page" as const } : {})}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-zinc-700" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
