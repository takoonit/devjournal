## Context

The editor persists profile, project, and entry data in a Zustand store backed by `localStorage`. The public routes render on the server from Supabase. No editor write path connects those stores, even though the current controls set `Entry.isPublic` to `true` and describe the entry as published. The Supabase schema already has public-read policies, single-owner write policies, and an ISR revalidation route, but the application does not establish an owner session or perform writes.

The editor must remain useful for local drafting when Supabase is unavailable. Public portfolio data must remain server-readable. The Press Proof token system, Newsreader and IBM Plex Mono type pairing, stamp vocabulary, 66ch prose measure, and restrained block motion remain product constraints.

## Goals / Non-Goals

**Goals:**

- Make `isPublic` mean that Supabase has confirmed the entry as public.
- Let the configured owner publish, update, unpublish, and delete public records without exposing a privileged key.
- Preserve local content and truthful visibility state when a network or authorization step fails.
- Fix the verified mobile composer, project setup, navigation, export-date, and root-route problems.
- Give the main editor surfaces clearer individual roles within the current Press Proof system.
- Keep the implementation small by reusing the installed Supabase client, existing RLS rules, design tokens, controls, and browser primitives.

**Non-Goals:**

- Multi-user accounts, teams, or sharing editor access.
- Background synchronization, conflict resolution, or a general offline queue.
- A new component library, typeface, animation system, or color family.
- Redesigning populated public project pages or the timeline before real published data is available for review.
- Replacing `.devjournal` as the local backup and transfer format.

## Decisions

### 1. Separate local working state from confirmed public state

Private drafts remain local. Supabase is the source of truth for the public projection. `Entry.isPublic` is updated only after the remote mutation succeeds, so the eye stamp reports confirmed visibility rather than intent.

Creating an entry always starts from a private record. The composer offers separate `Save private` and `Publish entry` outcomes. A publish attempt first preserves the content locally as private, then sends the profile, project, and entry snapshot. Success marks the local entry public. Failure keeps it private and leaves a retry path.

For an already public entry, remote update, unpublish, and delete operations complete before their local equivalents. This prevents a failed unpublish from telling the owner that content is private while it remains public. Profile and project edits that affect published content use the same remote-first rule; private-only records still save locally without a connection.

Alternative considered: treat `isPublic` as desired state and add a background outbox. That introduces persistent queue state and conflict handling that the current single-owner product does not need.

### 2. Use Supabase Auth, the anon key, and RLS for owner writes

Settings gains a compact Publishing section where the owner connects with Supabase email OTP and can see connection state. Drafting does not require a session. A publish control without a valid session keeps the entry private and directs the owner to connect.

The browser sends its access token to one server mutation route. The route creates a Supabase client with the configured anon key and the request bearer token, verifies the user with Supabase Auth, validates the action payload, and performs the write under the existing owner RLS policies. The route invalidates the affected portfolio tags and paths only after a successful write.

No service-role key is sent to the browser or required by the mutation route. No new auth package is needed because the existing Supabase client can manage the browser session and bearer token.

Alternative considered: a custom publish password backed by a server environment variable. Supabase Auth already fits the schema and avoids maintaining a second authorization mechanism.

### 3. Add stable source identifiers without rewriting local IDs

Current local IDs are timestamp-based strings while Supabase primary keys are UUIDs. A migration adds nullable, unique `source_id` columns to profiles, projects, and entries. The mutation route uses local IDs as source identifiers and lets PostgreSQL keep its UUID primary keys.

Publishing resolves records in this order:

1. Match `source_id` and update the record.
2. For a legacy profile or project with a null `source_id`, adopt the newest profile or the matching project slug once.
3. Return a visible conflict if a matching slug already belongs to another non-null source identifier.

Entry records are matched only by `source_id`; title and date are not safe identity keys. The migration includes a preflight query for legacy public entries without source identifiers. Release pauses for backup and manual reconciliation if that query returns rows.

Alternative considered: migrate every persisted browser ID to UUID. That would rewrite project, entry, inbox, URL, and import references for a transport concern that three source columns solve directly.

### 4. Keep one narrow publishing route and explicit actions

One `/api/publishing` route accepts a small discriminated action set: publish entry, update published entry, unpublish entry, delete published entry, sync published project, sync public profile, and delete published project. Each action accepts only the domain fields it needs and checks string lengths, URL shape, entry type, project status, identifiers, and authorization at the boundary.

The route owns camelCase-to-row mapping for writes. Existing `lib/supabase/types.ts` remains the row contract, and public reads continue through `lib/supabase/server.ts`. Successful mutations invalidate `portfolio`, the relevant data tag, `/portfolio`, and the affected old and new slug paths.

No repository layer or generic sync engine is introduced. Two callers are not enough reason for either abstraction.

### 5. Align public project visibility with entry visibility

The portfolio index filters projects to those with at least one public entry. Direct project reads return not found when the project has no public entries. Project records may remain in Supabase after the last entry is unpublished, but they are not exposed by public routes.

Editor copy uses `public entry`, `private entry`, `publish`, and `unpublish`. It does not claim that a project has a separate publish switch. A project record with a confirmed public entry shows a direct `View public page` link.

### 6. Fix the authoring flow with native layout behavior

The composer uses a sticky action row with safe-area padding at small widths so Save and Publish stay reachable above the mobile keyboard. The selected type remains visible in a compact summary; `Change type` reveals the existing stamp choices. Desktop keeps the full type row.

The submit handler continues to accept both Meta+Enter and Ctrl+Enter. The displayed hint is selected after mount from the user's platform, avoiding a server/client text mismatch.

`addProject` returns the created project, allowing the form to route directly to its record. A shared tech-stack field is used by create and edit. It accepts comma or Enter submission, trims values, and removes case-insensitive duplicates.

The existing `date-fns` dependency formats export filenames with the local `yyyy-MM-dd` calendar date. The `/` to `/portfolio` redirect moves to `next.config.ts`, removing the redirect call from the Cache Components page render.

### 7. Vary composition, not the design language

Each main editor surface gets one editorial role:

- Editor index: a working ledger with a dateline, compact counts, and clear active-work entry points.
- Project record: an issue cover that binds title, status, dates, stack, public-page access, and the timeline.
- Settings: a colophon with a short chapter index and native disclosure sections. Profile and Publishing are initially open; Composition, Links, and Data Portability retain all controls but no longer form one long flat page.

The public empty state becomes an unprinted folio: paper surface, restrained rule, folio mark, short explanation, and one quiet editor link. It no longer uses the broad warning wash.

Midnight Ink changes only token values. Canvas, base, raised sheet, input, and rule values gain enough luminance separation to read as different materials. The single red accent and semantic positive, warning, and destructive roles remain unchanged.

Existing semantic headings, DOM order, focus behavior, 44px targets, safe areas, and reduced-motion behavior remain required. Populated public layouts receive correctness fixes only in this change.

## Risks / Trade-offs

- [Expired owner session during a publish] -> Preserve the local private copy, keep the form content, and offer reconnect plus retry.
- [Failed unpublish or delete leaves content public] -> Perform the remote mutation first and keep the local public marker until Supabase confirms success.
- [Legacy Supabase rows cannot be matched safely] -> Run the migration preflight, back up returned rows, and stop rollout until their source identifiers are reconciled.
- [Two stores drift after a published profile or project edit] -> Save remotely first for records with public entries and keep the local form dirty on failure.
- [ISR hides a successful write briefly] -> Revalidate tags and exact paths in the mutation route, then link to the public page only after success.
- [Sticky mobile actions cover content] -> Reserve matching bottom padding, include safe-area inset, and verify with small visual viewports and an open software keyboard.
- [Disclosure hides settings from keyboard or assistive technology users] -> Use native `details` and `summary`, preserve heading order, and test full keyboard traversal.
- [More surface variation weakens consistency] -> Reuse current tokens and signature components; change hierarchy and spacing before adding any new visual device.

## Migration Plan

1. Add the nullable `source_id` columns, unique indexes, owner-write policy coverage, and legacy-row preflight query. Back up any rows reported by the preflight.
2. Add owner connection and the authenticated publishing route behind controls that still default to private.
3. Change creation, visibility, edit, and delete flows to remote-first confirmed public state. Update public filtering and cache invalidation.
4. Verify publish, update, unpublish, last-entry removal, failure, reconnect, and legacy-conflict cases in a preview Supabase project.
5. Apply the authoring and editorial layout changes after the data path passes. Verify Press Proof and Midnight Ink at desktop and mobile widths.
6. Roll out to Preview, confirm cross-device public reads, then promote.

Rollback disables the publishing controls first, leaving local drafts intact. The `source_id` columns are additive and can remain in place. If public writes must be rolled back, restore the Supabase backup and revert the application route without rewriting local data.

## Open Questions

None. The existing single-owner RLS model, server-readable portfolio requirement, and verified findings determine the implementation boundary.
