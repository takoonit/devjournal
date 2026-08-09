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
