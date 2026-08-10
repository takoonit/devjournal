import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("editor index reads as a working ledger", () => {
    const editor = read("app/editor/page.tsx");

    assert.match(editor, /working-ledger/);
    assert.match(editor, /activeProjects/);
    assert.match(editor, /privateEntries/);
    assert.match(editor, /Continue active work/i);
});

test("project identity and actions form an issue cover", () => {
    const project = read("app/editor/projects/[id]/page.tsx");

    assert.match(project, /issue-cover/);
    assert.match(project, /Updated/);
    assert.match(project, /View public page/);
    assert.ok(project.indexOf("issue-cover") < project.indexOf("timeline-container"));
});

test("settings uses a colophon index and native disclosures", () => {
    const settings = read("app/editor/settings/page.tsx");

    assert.match(settings, /settings-chapter-index/);
    assert.match(settings, /<details[^>]*open[^>]*id="profile"/);
    assert.match(settings, /<details[^>]*open[^>]*id="publishing"/);
    assert.match(settings, /<summary[^>]*>\s*Composition\s*</);
    assert.match(settings, /<summary[^>]*>\s*Links\s*</);
    assert.match(settings, /<summary[^>]*>\s*Data portability\s*</i);
});

test("public empty state is an unprinted folio", () => {
    const portfolio = read("app/portfolio/page.tsx");

    assert.match(portfolio, /portfolio-empty-folio/);
    assert.match(portfolio, /No entries have been published/i);
    assert.doesNotMatch(portfolio, /projects are published from the editor/i);
});

test("surface tokens and editorial primitives stay semantic", () => {
    const globals = read("app/globals.css");
    const tailwind = read("tailwind.config.ts");
    const forms = read("components/ui/form-styles.ts");

    assert.match(globals, /--color-surface-input:/);
    assert.match(globals, /\.portfolio-empty-folio\s*\{[^}]*surface-raised/s);
    assert.match(globals, /\.settings-disclosure\s*>\s*summary\s*\{[^}]*min-block-size:\s*var\(--control-min-size\)/s);
    assert.match(globals, /\.issue-cover\s*\{/);
    assert.match(tailwind, /input:\s*"rgb\(var\(--color-surface-input\)/);
    assert.match(forms, /bg-surface-input/);
});
