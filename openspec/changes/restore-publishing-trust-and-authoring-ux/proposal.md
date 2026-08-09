## Why

Manual testing found a trust-breaking split: the editor marks local entries public while the public portfolio reads a separate Supabase data source, so published work can remain invisible. The same pass found privacy, mobile authoring, navigation, and visual hierarchy problems that make the product feel less reliable and less distinct than its Press Proof direction.

## What Changes

- Make new entries private by default and require an explicit publish choice.
- Connect authenticated owner publishing to the existing Supabase public projection, including publish, update, unpublish, delete, failure feedback, and cache revalidation.
- Make portfolio language and entry states describe entry-level visibility accurately; a project appears publicly when it has at least one published entry.
- Keep composer actions reachable above mobile keyboards, keep the selected entry type visible, and show the correct platform shortcut.
- Send a newly created project directly to its project page and simplify the repeated tech-stack input pattern.
- Give the editor index, project record, and settings colophon distinct editorial composition while preserving Press Proof typography, stamps, rules, prose measure, and restrained motion.
- Replace the public empty-state warning slab with a quieter unprinted-folio treatment, shorten settings through progressive disclosure, and improve Midnight Ink surface separation.
- Use the user's local calendar date in export filenames and move the root portfolio redirect out of the rendered page path.
- Defer populated public portfolio and timeline redesign until the publishing path is verified with real data.

## Capabilities

### New Capabilities

- `trusted-publishing`: Explicit, authenticated, failure-aware publishing from local authoring state to the server-readable Supabase portfolio projection.
- `editor-workflow-polish`: Privacy-safe entry creation, mobile composer access, clearer navigation, project onboarding, settings, export, and routing behavior.
- `editorial-surface-variation`: Distinct Press Proof compositions for editor surfaces, a quieter public empty state, and stronger Midnight Ink material hierarchy.

### Modified Capabilities

None. This repository has no existing OpenSpec capability specifications.

## Impact

- Affects the Zustand editor store, entry and project forms, project record, settings, editor navigation, portfolio empty state, global design tokens/styles, root routing, and export naming.
- Adds authenticated owner write flows around the existing Supabase schema and public read helpers, plus a small schema migration for stable local-to-remote identifiers if required by the final design.
- Reuses Next.js, Zustand, and the installed Supabase client; no new runtime package is expected.
- Requires unit, integration, responsive browser, keyboard, theme, and public-portfolio verification before release.
