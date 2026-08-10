import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("entry creation makes private save and publish separate outcomes", () => {
    const page = read("app/editor/projects/[id]/entries/new/page.tsx");

    assert.match(page, /Save private/i);
    assert.match(page, /Publish entry/i);
    assert.match(page, /requestPublishingAction/);
    const creation = page.slice(page.indexOf("const savedEntry = addEntry"), page.indexOf("let message"));
    assert.doesNotMatch(creation, /isPublic\s*:/);
    assert.ok(page.indexOf("const savedEntry = addEntry") < page.indexOf("await requestPublishingAction"));
    assert.ok(page.indexOf("await requestPublishingAction") < page.indexOf("updateEntry(savedEntry.id, { isPublic: true })"));
});

test("public entry mutations are remote-first", () => {
    const project = read("app/editor/projects/[id]/page.tsx");
    const edit = read("app/editor/projects/[id]/entries/[entryId]/edit/page.tsx");
    const modal = read("components/editor/edit-project-modal.tsx");
    const settings = read("app/editor/settings/page.tsx");

    assert.match(project, /await requestPublishingAction/);
    assert.match(project, /type:\s*"unpublish-entry"/);
    assert.match(project, /type:\s*"delete-entry"/);
    assert.match(project, /type:\s*"delete-project"/);
    assert.match(edit, /type:\s*"update-entry"/);
    assert.match(modal, /type:\s*"sync-project"/);
    assert.match(settings, /type:\s*"sync-profile"/);
    const visibility = project.slice(project.indexOf("const toggleEntryVisibility"), project.indexOf("let entryIndex"));
    assert.ok(visibility.indexOf("await requestPublishingAction") < visibility.indexOf("updateEntry(entryId"));
    assert.match(visibility, /entry is still.*public.*private/s);
});

test("settings exposes explicit owner connection state", () => {
    const settings = read("app/editor/settings/page.tsx");
    const publishing = read("components/settings/publishing-section.tsx");

    assert.match(settings, /PublishingSection/);
    assert.match(publishing, /sendOwnerMagicLink/);
    assert.match(publishing, /disconnectOwner/);
    assert.match(publishing, /owner_settings/);
});

test("project forms share one tech stack field and creation opens the record", () => {
    const create = read("app/editor/projects/new/page.tsx");
    const edit = read("components/editor/edit-project-modal.tsx");
    const field = read("components/editor/tech-stack-field.tsx");

    assert.match(create, /TechStackField/);
    assert.match(edit, /TechStackField/);
    assert.match(field, /parseTechStack/);
    assert.match(create, /router\.push\(`\/editor\/projects\/\$\{project\.id\}`\)/);
});

test("entry composers share mobile type and shortcut behavior", () => {
    const create = read("app/editor/projects/[id]/entries/new/page.tsx");
    const edit = read("app/editor/projects/[id]/entries/[entryId]/edit/page.tsx");
    const picker = read("components/editor/entry-type-picker.tsx");
    const shortcut = read("components/editor/use-submit-shortcut.ts");
    const globals = read("app/globals.css");

    assert.match(create, /EntryTypePicker/);
    assert.match(edit, /EntryTypePicker/);
    assert.match(picker, /Change type/);
    assert.match(shortcut, /Ctrl\+Enter/);
    assert.match(shortcut, /⌘↵/);
    assert.match(globals, /\.composer-actions\s*\{[^}]*position:\s*sticky/s);
    assert.match(create, /composer-actions/);
    assert.match(edit, /composer-actions/);
});

test("root redirect is configuration-driven", () => {
    const config = read("next.config.ts");

    assert.match(config, /async redirects\(\)/);
    assert.match(config, /source:\s*"\/"/);
    assert.match(config, /destination:\s*"\/portfolio"/);
    assert.equal(existsSync(new URL("../app/page.tsx", import.meta.url)), false);
});
