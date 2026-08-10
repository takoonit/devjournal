# 🔎 Findings Log

## Purpose
This file captures architecture/UX findings that shape DevJournal as a thinking system.
Entries should be concise, decision-oriented, and tied to user outcomes.

---

## 2026-02 Blueprint Reframe: Critical Thinking + ADHD Support

### Observations
1. Previous blueprint language emphasized technical clarity but underrepresented the core cognitive mission.
2. Task-paralysis prevention needed to be explicit in planning and quality criteria.
3. Guided reflection and light AI assistance needed clearer boundaries (assistive, not dominant).

### Decisions
- Reframed constitution around three experience pillars:
  - Frictionless thought capture
  - Guided reflection depth
  - Optional light AI support
- Updated task plan to track capture speed, reflection quality, and actionable progress.
- Added execution criteria that tie PR quality to thinking outcomes, not only implementation correctness.

### Guardrails
- First interaction should always favor writing momentum.
- Prompt/template systems must reduce “stuckness,” not increase complexity.
- AI features must preserve user agency and original reasoning.

---

## Ongoing Review Questions
- Does this change reduce or increase activation energy?
- Does it help users think deeper when they feel blocked?
- Does it convert reflection into next-step clarity?
- Does it keep the system calm and cognitively manageable?

---

## 2026-08-10 Private Authoring and Confirmed Publishing

### Observations
1. A local visibility toggle could claim an entry was public even when no server write happened.
2. Matching public rows by title or insertion order could update the wrong record after imports, renames, or legacy data.
3. Granting ownership to the first signup made deployment order part of the security model.

### Decisions
- Keep every new entry private in localStorage and expose separate `Save private` and `Publish entry` outcomes.
- Treat Supabase as the server-readable public projection. Public edits, unpublishes, and deletes finish remotely before local state changes.
- Link local records to Supabase rows with unique nullable `source_id` values. Only one unclaimed project slug may be adopted automatically; legacy profiles and entries require manual reconciliation.
- Provision one owner UUID explicitly in `owner_settings`. The app uses the anonymous key and the signed owner's token, never a service-role key.
- Route all public mutations through `/api/publishing`, which owns validation, RLS-backed authorization, mutation, and cache invalidation.

### Rollback
- Remove the owner row to stop public writes without touching local drafts or published rows.
- Redeploy the previous app version if needed, but keep the additive source-ID columns and indexes. Take a `.devjournal` backup before any rollback work.


---

## 2026-02 Visual Direction Update: Keith Haring-Inspired Energy

> Superseded on 2026-08-09 by the Fluid Press Proof decision below. Retained as
> historical context, not current styling guidance.

### Observations
1. Current guidance captured calm-focus well but lacked explicit expressive art direction.
2. The product needs energizing visual cues for motivation without increasing cognitive load.

### Decisions
- Adopt a **Noir × Haring** direction: dark stable base + bold shape/color accents.
- Treat shape and color as semantic guides (focus/progress/state), not decoration.
- Keep visual rhythm lightweight so writing/reflection remains primary.

### Guardrails
- Readability and focus stability take precedence over expressive styling.
- Accent elements must be repeatable via tokens/wrappers, not ad hoc one-offs.
- Motion + color must support momentum, not overwhelm ADHD users.

---

## 2026-08-09 Fluid Press Proof Redesign

### Observations
1. Fixed viewport breakpoints made shared timelines compose differently depending on which page contained them.
2. Fixed type sizes and 42rem prose measure weakened reading rhythm at both narrow and very wide widths.
3. Mobile editor navigation omitted import, and several small print-mark controls did not provide a 44px target.

### Decisions
- Keep Press Proof as the single visual direction, with Midnight Ink as its reading twin; Noir and Haring guidance is retired.
- Use `rem`, `ch`, and `clamp()` for scalable type and spacing, with a narrow documented pixel allowlist for rendering details.
- Use container queries for portfolio, timeline, and settings composition; reserve viewport breakpoints for application chrome such as the editor index.
- Treat the editor as an Operate surface and the portfolio as a Read/Experience surface while sharing identical prose metrics.
- Make page frames, overlays, notifications, and fixed actions safe-area aware.

### Guardrails
- Composer and published prose remain identical at `text-prose` and `66ch`.
- DOM, visual, and keyboard order must remain aligned through every reflow.
- Fluidity must not hide primary actions or introduce horizontal scrolling at 320px.

---

## 2026-02 UX Audit Pass: Capture-to-Convert Flow

### Observations
1. Inbox captures without a project forced users into a dead-end "Assign a project to convert" state with no direct recovery in-row.
2. Quick capture required pointer movement to click "Capture" even for single-line thoughts, increasing interruption cost.
3. Project assignment controls were inconsistent between capture input and unassigned inbox cards.

### Decisions
- Added inline project assignment for each unassigned inbox capture so users can convert in the same context.
- Added Enter-to-capture behavior on quick capture input to reduce interaction steps for habit-forming fast logging.
- Reused consistent project option lists in the quick capture form to reduce navigation ambiguity.

### Guardrails
- Keep capture-to-convert a single-screen flow whenever possible.
- Prefer reversible, low-risk inline actions over page hops for routine organization tasks.
- Preserve calm-focus hierarchy: write first, organize second.


---

## 2026-02 UX Audit Follow-up: Navigation Pattern Consolidation

### Observations
1. Some hierarchical pages showed both breadcrumbs and a local back link, duplicating orientation controls.
2. Entry forms inherited breadcrumbs from layout while also presenting a local contextual back link, creating stacked navigation cues during focused writing tasks.

### Decisions
- Standardized hierarchical browsing surfaces to breadcrumbs-first by removing redundant local back links where breadcrumbs already provide path context.
- Standardized entry forms to back-link-first by suppressing layout breadcrumbs on entry creation/edit routes.

### Guardrails
- Keep one dominant top-level navigation cue per screen.
- Preserve focus-visible styles and ARIA semantics on whichever cue remains.
