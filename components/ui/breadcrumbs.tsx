"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 print-hidden">
      <ol className="flex flex-wrap items-baseline gap-2 font-mono text-meta uppercase tracking-[0.08em] text-text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-baseline gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="control-target justify-start transition-colors duration-subtle hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-text-secondary" : undefined}
                  {...(isLast ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
