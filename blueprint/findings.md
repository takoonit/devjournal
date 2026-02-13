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

## 2026-02 Phase 2 Complete: Feedback Signals

### Observations
1. Confirmation feedback existed in copy and iconography but lacked a reusable motion primitive.
2. Primary CTAs relied on soft translucent borders, reducing action salience on dark surfaces.

### Decisions
- Added a reusable `RadiantPulse` wrapper and integrated it with success toasts to provide lightweight completion feedback.
- Introduced a shared `.btn-primary` class with solid 2px accent borders, hover lift, and press states.
- Applied the new CTA treatment across editor primary actions (capture, project creation, settings save, entry save/update, and project-level entry creation).

### Guardrails
- Feedback remains brief and optional; reduced-motion users inherit globally reduced animation durations.
- Dark surfaces remain unchanged; accents are additive and semantic.

---

## 2026-02 Phase 3 Complete: Entry Shape Language in Flow

### Observations
1. Entry-type recognition relied on generic Lucide icons in timeline contexts and text-only labels in form selectors.
2. Type selection and timeline scanning could become label-dependent instead of shape-recognition dependent.

### Decisions
- Added a dedicated shape set (`Feature`, `Fix`, `Refactor`, `Design`, `Journal`) in `components/icons/entry-shapes.tsx`.
- Centralized entry visual metadata in `lib/entry-types.ts` so forms and timeline share one entry-type system.
- Updated new/edit entry forms and timeline markers/badges to use the same shape components.

### Guardrails
- Shapes remain compact and semantic to avoid decorative noise.
- Existing writing-first layout and interaction density remain unchanged.

---

## 2026-02 Reconciliation: Phases 1–3 Token Baseline

### Observations
1. Phase 2/3 UI behaviors were delivered before all Phase 1 token plumbing was fully finished.
2. Entry-type visuals were centralized, but still used hardcoded palette utilities instead of semantic `entry.*` tokens.

### Decisions
- Added semantic entry/status color variables to `app/globals.css` for both theme modes.
- Extended `lib/design-tokens.ts` with `color.entry`, `color.status`, and `border` groups.
- Extended `tailwind.config.ts` with `entry.*` and `status.*` color namespaces.
- Migrated `lib/entry-types.ts` visual classes to tokenized `entry.*` utilities.
- Marked Phase 1 checklist items complete after reconciliation with shipped Phase 2/3 work.

### Guardrails
- Keep future visual variants token-first (`entry.*`, `status.*`) and avoid direct palette utility regressions.
- Preserve deterministic behavior by sourcing entry visual semantics from one config surface.

---

## 2026-02 Phase 4 Complete: Wayfinding + Halo Signals

### Observations
1. Active navigation state still leaned on background tinting and lacked a clear directional line marker.
2. Spotlight cards still used diffuse radial glow instead of a geometric halo signal.
3. Several high-importance card surfaces used subtle hover borders that under-signaled interactivity.

### Decisions
- Added a 3px accent-bar active style for editor sidebar navigation items.
- Reworked `SpotlightCard` hover/focus feedback to a geometric halo ring + bold accent hover border.
- Applied selective 2px accent hover borders to key interactive cards (editor project entry cards and interactive surfaces).

### Guardrails
- Wayfinding accents are semantic and restrained to active/hover states.
- Focus mode continues suppressing non-essential halo effects.

---

## 2026-02 Restart Pass: Phase 1 Foundation Review Checkpoint

### Observations
1. Phase restart was requested with mandatory stop-and-review checkpoints after each phase.
2. Phase 1 tokenization surfaces are present and aligned: CSS variables, design token definitions, Tailwind semantic namespaces, and entry-type semantic mappings.
3. No palette-class regression was found in Phase 1 source-of-truth files during the review scan.

### Decisions
- Keep Phase 1 implementation as-is (no corrective code patch required in this checkpoint).
- Update the redesign plan to enforce phase-by-phase restart sequencing with explicit review gates.
- Treat this checkpoint as the required stop before moving to Phase 2.

### Guardrails
- Continue restart in strict order (Phase 2 next) only after explicit confirmation.
- Preserve token-first semantics (`entry.*`, `status.*`) and border hierarchy tokens.
- Continue documenting each phase checkpoint in findings before progression.
