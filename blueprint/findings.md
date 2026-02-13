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

## 2026-02 Visual Direction Update: Keith Haring-Inspired Energy

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
