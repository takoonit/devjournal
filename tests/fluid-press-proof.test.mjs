import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the Press Proof type system is fluid and self-hosted by Next.js", () => {
    const globals = read("app/globals.css");
    const layout = read("app/layout.tsx");
    const tailwind = read("tailwind.config.ts");

    assert.doesNotMatch(globals, /@import\s+url\([^)]*fonts\.googleapis\.com/);
    assert.match(layout, /from\s+["']next\/font\/google["']/);
    assert.match(layout, /viewportFit:\s*["']cover["']/);
    assert.match(tailwind, /display:\s*\["clamp\(2\.25rem,/);
    assert.match(tailwind, /prose:\s*\["clamp\(1rem,/);
    assert.match(tailwind, /folio:\s*\["clamp\(4rem,/);
    assert.match(tailwind, /measure:\s*["']66ch["']/);
});

test("fluid layout tokens and adaptive component contracts are centralized", () => {
    const globals = read("app/globals.css");
    const timeline = read("components/ui/timeline-entry.tsx");
    const portfolioTimeline = read("components/portfolio/entry-timeline.tsx");
    const portfolio = read("app/portfolio/page.tsx");
    const editorLayout = read("app/editor/layout.tsx");

    for (const token of [
        "--space-page-inline",
        "--space-page-block",
        "--timeline-rail-width",
        "--timeline-node-column",
        "--editor-sidebar-width",
        "--portfolio-sidebar-width",
        "--control-min-size",
        "--composer-min-block",
        "--composer-details-min-block",
    ]) {
        assert.match(globals, new RegExp(token));
    }

    assert.match(globals, /@container\s+portfolio-shell\s+\(min-width:\s*60rem\)/);
    assert.match(globals, /@container\s+timeline\s+\(min-width:\s*42rem\)/);
    assert.match(globals, /env\(safe-area-inset-left\)/);
    assert.match(timeline, /timeline-entry/);
    assert.match(portfolioTimeline, /timeline-rule/);
    assert.doesNotMatch(portfolioTimeline, /9\.75rem|10\.5rem/);
    assert.match(portfolio, /page-frame/);
    assert.match(portfolio, /portfolio-shell/);
    assert.match(editorLayout, /lg:block/);
    assert.match(editorLayout, /lg:hidden/);
});

test("touch, composer, overlay, and print adaptations have shared utilities", () => {
    const globals = read("app/globals.css");
    const newEntry = read("app/editor/projects/[id]/entries/new/page.tsx");
    const editEntry = read("app/editor/projects/[id]/entries/[entryId]/edit/page.tsx");
    const toast = read("components/ui/toast.tsx");

    assert.match(globals, /\.control-target/);
    assert.match(globals, /\.modal-frame/);
    assert.match(globals, /\.toast-viewport/);
    assert.match(globals, /break-inside:\s*avoid/);
    assert.match(newEntry, /min-h-composer/);
    assert.match(newEntry, /min-h-composer-details/);
    assert.match(editEntry, /min-h-composer/);
    assert.match(editEntry, /min-h-composer-details/);
    assert.match(toast, /toast-viewport/);
});

test("timeline actions stay discoverable without hover and do not overlap entry content", () => {
    const globals = read("app/globals.css");
    const project = read("app/editor/projects/[id]/page.tsx");

    assert.match(project, /editor-timeline-entry/);
    assert.doesNotMatch(project, /timeline-actions absolute right-0 top-0/);
    assert.match(globals, /\.timeline-actions\s*\{[^}]*position:\s*relative/s);
    assert.match(globals, /@media\s*\(hover:\s*none\),\s*\(pointer:\s*coarse\)[\s\S]*?\.timeline-actions\s*\{[^}]*opacity:\s*1/s);
    assert.doesNotMatch(globals, /\.timeline-actions\s*\{\s*opacity:\s*0;\s*\}/);
    assert.match(globals, /\.editor-timeline-entry\s+\.timeline-entry-body\s*\{[^}]*padding-inline-end:/s);
});

test("navigation and form fields share the 2.75rem interaction floor", () => {
    const globals = read("app/globals.css");
    const editorLayout = read("app/editor/layout.tsx");
    const settings = read("app/editor/settings/page.tsx");
    const modal = read("components/editor/edit-project-modal.tsx");
    const newProject = read("app/editor/projects/new/page.tsx");
    const newEntry = read("app/editor/projects/[id]/entries/new/page.tsx");
    const editEntry = read("app/editor/projects/[id]/entries/[entryId]/edit/page.tsx");
    const notFound = read("app/portfolio/[slug]/not-found.tsx");

    assert.match(globals, /\.field-target\s*\{[^}]*min-block-size:\s*var\(--control-min-size\)/s);
    assert.match(editorLayout, /control-target[^"']*font-serif text-subtitle/);
    assert.match(editorLayout, /relative flex min-h-control/);
    assert.match(settings, /field-target w-full/);
    assert.match(modal, /field-target w-full/);
    assert.match(newProject, /field-target w-full/);
    assert.match(newEntry, /field-target[^"']*text-title/);
    assert.match(editEntry, /field-target[^"']*text-title/);
    assert.match(notFound, /control-target link-ink/);
});

test("settings, editor extremes, print, and favicon have explicit adaptations", () => {
    const globals = read("app/globals.css");
    const settings = read("app/editor/settings/page.tsx");
    const editorLayout = read("app/editor/layout.tsx");
    const project = read("app/editor/projects/[id]/page.tsx");
    const newEntry = read("app/editor/projects/[id]/entries/new/page.tsx");
    const icon = read("app/icon.svg");

    assert.match(settings, /<div className="max-w-page">/);
    assert.match(settings, /<div className="max-w-measure">/);
    assert.match(globals, /@container\s+settings\s+\(min-width:\s*38rem\)/);
    assert.match(editorLayout, /editor-workspace mx-auto w-full max-w-page/);
    assert.match(project, /text-title[^"']*sm:text-display/);
    assert.match(project, /print-display/);
    assert.match(project, /print:!text-\[2rem\]/);
    assert.match(newEntry, /entry-type-picker/);
    assert.match(globals, /\.entry-type-picker\s*\{[^}]*overflow-x:\s*auto/s);
    assert.match(globals, /@media print[\s\S]*?\.text-display\s*\{[^}]*font-size:\s*2rem/s);
    assert.match(globals, /@media print[\s\S]*?\.timeline-entry-meta-inner\s*\{[^}]*display:\s*flex/s);
    assert.match(icon, /<svg[^>]*viewBox="0 0 32 32"/);
});

test("portfolio and editor use a shared bold masthead with surface-specific ledgers", () => {
    const globals = read("app/globals.css");
    const portfolio = read("app/portfolio/page.tsx");
    const editor = read("app/editor/page.tsx");
    const bio = read("components/portfolio/bio-sidebar-static.tsx");
    const projectRow = read("components/portfolio/project-row.tsx");

    assert.match(globals, /\.masthead-block\s*\{/);
    assert.match(globals, /\.masthead-title\s*\{/);
    assert.match(globals, /\.project-ledger\s*\{/);
    assert.match(portfolio, /portfolio-masthead/);
    assert.match(portfolio, /portfolio-project-ledger/);
    assert.match(editor, /editor-masthead/);
    assert.match(editor, /editor-project-ledger/);
    assert.match(bio, /font-serif text-title text-text-primary/);
    assert.doesNotMatch(bio, /font-serif text-display text-text-primary/);
    assert.match(projectRow, /project-row-title/);
    assert.match(projectRow, /ArrowUpRight/);
});
