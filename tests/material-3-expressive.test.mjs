import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the design contract makes Material 3 Expressive the web target", () => {
    const design = read("DESIGN.md");

    assert.match(design, /Target: `web`/);
    assert.match(design, /## Expressive Intent/);
    assert.match(design, /## Attention Hierarchy/);
    assert.match(design, /## Context & Restraint/);
    assert.match(design, /## Accessibility/);
    assert.match(design, /m3\.material\.io/);
    assert.match(design, /design\.google/);
});

test("Google Sans Flex and Material type roles replace the editorial font split", () => {
    const layout = read("app/layout.tsx");
    const tailwind = read("tailwind.config.ts");

    assert.match(layout, /Google_Sans_Flex/);
    assert.match(layout, /axes:\s*\[[^\]]*"GRAD"[^\]]*"ROND"[^\]]*"opsz"[^\]]*"slnt"[^\]]*"wdth"/s);
    assert.doesNotMatch(layout, /Newsreader|IBM_Plex_Mono/);
    assert.match(tailwind, /var\(--font-google-sans-flex\)/);
    assert.match(tailwind, /fontWeight:\s*"700"/);
});

test("the shared CSS exposes Material color, shape, state, and motion roles", () => {
    const globals = read("app/globals.css");

    for (const token of [
        "--md-sys-color-primary",
        "--md-sys-color-on-primary",
        "--md-sys-color-primary-container",
        "--md-sys-color-secondary-container",
        "--md-sys-color-tertiary-container",
        "--md-sys-color-surface-container-low",
        "--md-sys-color-surface-container-high",
        "--md-sys-color-outline-variant",
        "--md-sys-shape-corner-small",
        "--md-sys-shape-corner-large",
        "--md-sys-shape-corner-extra-large",
        "--md-sys-shape-corner-full",
        "--md-sys-state-hover-opacity",
        "--md-sys-motion-easing-emphasized",
    ]) {
        assert.match(globals, new RegExp(token));
    }

    assert.match(globals, /\.m3-button-filled\s*\{/);
    assert.match(globals, /\.m3-button-tonal\s*\{/);
    assert.match(globals, /\.m3-icon-button\s*\{/);
    assert.match(globals, /\.m3-card\s*\{/);
    assert.match(globals, /\.m3-navigation-rail\s*\{/);
    assert.match(globals, /\.m3-mobile-navigation\s*\{/);
    assert.match(globals, /data-motion-level="reduced"[\s\S]*?\.m3-button-filled[\s\S]*?transform:\s*none/);
});

test("primary product surfaces opt into expressive Material components", () => {
    const editorLayout = read("app/editor/layout.tsx");
    const editor = read("app/editor/page.tsx");
    const projectRow = read("components/portfolio/project-row.tsx");
    const entryTypePicker = read("components/editor/entry-type-picker.tsx");
    const themeToggle = read("components/ui/theme-toggle.tsx");

    assert.match(editorLayout, /m3-navigation-rail/);
    assert.match(editorLayout, /m3-mobile-navigation/);
    assert.match(editor, /m3-hero/);
    assert.match(editor, /m3-button-filled/);
    assert.match(projectRow, /m3-card/);
    assert.match(entryTypePicker, /m3-button-tonal/);
    assert.match(themeToggle, /Switch to (Light|Dark)/);
    assert.doesNotMatch(themeToggle, /Press Proof|Midnight Ink/);
});
