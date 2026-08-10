## 1. Publishing Data Contract

- [x] 1.1 Add a Supabase migration that removes first-signup ownership, enforces one explicitly provisioned owner, adds nullable unique `source_id` fields, tightens anonymous project reads, and includes a read-only legacy-row preflight.
- [x] 1.2 Update Supabase row contracts and focused mapping tests for source identifiers and public write payloads.
- [x] 1.3 Add a browser Supabase client and owner-session helper using the installed client package and public environment variables.
- [x] 1.4 Add the Settings Publishing section for email OTP connection, disconnect, session status, missing-configuration feedback, and retry guidance.
- [x] 1.5 Add failing route tests for missing configuration, malformed actions, expired tokens, non-owner tokens, source conflicts, and valid owner mutations.
- [x] 1.6 Implement the single `/api/publishing` mutation route with boundary validation, bearer-token verification, and existing owner RLS enforcement.
- [x] 1.7 Implement source-aware profile and project adoption plus entry upsert, update, unpublish, and delete actions without a service-role key.
- [x] 1.8 Invalidate the portfolio tags, `/portfolio`, and affected old and new project paths after each successful public mutation.
- [x] 1.9 Filter portfolio index and slug reads to projects with at least one public Supabase entry, with tests for first-publish and last-unpublish behavior.

## 2. Confirmed Publishing UX

- [x] 2.1 Make store creation actions return the created project or entry while preserving current persisted data and import behavior.
- [x] 2.2 Add tests proving that new entries default private, a failed publish remains private, and a failed unpublish remains marked public.
- [x] 2.3 Split composer submission into `Save private` and `Publish entry`, preserving a private local copy before any remote attempt.
- [x] 2.4 Connect entry visibility toggles to remote-first publish and unpublish actions with accurate pending, success, reconnect, conflict, and failure messages.
- [x] 2.5 Make edits to confirmed public entries update Supabase before local state and retain the edit draft when the remote update fails.
- [x] 2.6 Make public project and profile edits update Supabase before closing or reporting success; keep private-only edits local.
- [x] 2.7 Make deletion of public entries and projects remote-first while keeping private deletion local and preserving the existing confirmation dialogs.
- [x] 2.8 Replace project-publishing claims with entry-level visibility copy and show `View public page` only when the project has a confirmed public entry.

## 3. Authoring Workflow Fixes

- [x] 3.1 Add focused tests for comma and Enter tech parsing, case-insensitive deduplication, local export dates, and created-project routing.
- [x] 3.2 Reuse one tech-stack field in project create and edit flows, with token removal and consistent parsing.
- [x] 3.3 Route successful project creation directly to the new project record using the returned project ID.
- [x] 3.4 Add a mobile selected-TypeStamp summary and `Change type` disclosure while retaining the full desktop picker and keyboard access.
- [x] 3.5 Add a safe-area-aware sticky composer action row and matching content clearance for narrow visual viewports.
- [x] 3.6 Detect the platform after mount for the shortcut hint while continuing to accept both Meta+Enter and Ctrl+Enter.
- [x] 3.7 Format global and selected-project export filenames with the user's local `yyyy-MM-dd` date.
- [x] 3.8 Move the root redirect into `next.config.ts`, remove the rendered redirect page, and add a regression check for the Cache Components console error.

## 4. Editorial Surface Variation

- [x] 4.1 Recompose the editor index as a working ledger with compact totals and clear active-work entry points using existing Press Proof primitives.
- [x] 4.2 Recompose the project header as an issue cover that groups identity, status, dates, stack, record actions, and confirmed public access before the timeline.
- [x] 4.3 Recompose Settings as a colophon with a short chapter index and native disclosures; keep Profile and Publishing open initially and preserve dirty form state across collapse.
- [x] 4.4 Replace the public empty-state warning slab with an unprinted-folio treatment and accurate entry-level copy.
- [x] 4.5 Adjust Midnight Ink token values to separate canvas, base, raised sheet, inputs, and rules without adding colors or effects.
- [x] 4.6 Verify the revised surfaces retain semantic heading order, 44px targets, visible focus, safe areas, 66ch prose, and reduced-motion behavior.
- [x] 4.7 Leave populated public project rows and timelines structurally unchanged except for publishing correctness and access-state fixes.

## 5. Documentation and Automated Verification

- [ ] 5.1 Update README and blueprint documentation for the local-draft/public-projection boundary, owner connection, source-ID migration, entry-level visibility, and rollback steps.
- [ ] 5.2 Add or update automated tests for publishing payload validation, source matching, auth failure, public filtering, composer privacy, workflow utilities, and root routing.
- [ ] 5.3 Run `bun test` and resolve all failures.
- [ ] 5.4 Run `bun run lint` and `bun run build` and resolve all errors and warnings introduced by the change.
- [ ] 5.5 Run `bun audit`, review the final diff for secrets and unrelated files, and record any accepted dependency finding.
- [ ] 5.6 Run `openspec validate restore-publishing-trust-and-authoring-ux --type change --strict` and resolve every artifact or requirement error.

## 6. Persona-Based Manual Verification

- [ ] 6.1 Start the app with Bun against a preview Supabase project, use isolated browser storage per persona, and capture console and network failures during each flow.
- [ ] 6.2 Assign a privacy-conscious diarist subagent to create, edit, export, and delete private work and verify that no action publishes without explicit consent.
- [ ] 6.3 Assign a build-in-public solo developer subagent to connect, publish, edit, view cross-device, unpublish, and delete entries while checking portfolio cache refresh and truthful status.
- [ ] 6.4 Assign a mobile commuter subagent to create a project and entry at 320px and 390px with the software keyboard, type picker, sticky actions, touch targets, and platform shortcut in use.
- [ ] 6.5 Assign a returning power-user subagent to edit project metadata, manage tech tokens, traverse settings disclosures by keyboard, import and export data, switch themes, and reach public pages.
- [ ] 6.6 Assign an independent creative UX designer subagent to review the editor index, project issue cover, settings colophon, public empty folio, and Midnight Ink at mobile and desktop widths against Press Proof constraints.
- [ ] 6.7 Consolidate persona evidence, screenshots, hesitation and backtracking notes, focus order, clipping, overflow, console errors, and network errors; fix all P0 and P1 findings plus in-scope P2 regressions.
- [ ] 6.8 Re-run every affected persona path after fixes and record the final pass or any explicitly deferred low-severity issue.
