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

---

## 2026-02 Restart Pass: Phase 2 Feedback Review Checkpoint

### Observations
1. `RadiantPulse` already supports conditional accessibility behavior via the `decorative` prop and no longer blanket-hides semantic children.
2. Toast success feedback remains completion-scoped (`active` only for success and when reward intensity is not off).
3. In toast usage, pulse-wrapped status icons are decorative because toast title/message already carries semantic meaning.

### Decisions
- Mark Phase 2 restart review complete.
- Set toast `RadiantPulse` usage to `decorative` so assistive technology is not burdened with redundant icon announcements.
- Keep CTA emphasis and pulse timing behavior unchanged for this checkpoint.

### Guardrails
- Continue using `decorative` only where children are non-semantic.
- Preserve completion-only pulse activation and motion preference gating (`rewardIntensity`, `motionLevel`).
- Stop after this checkpoint and move to Phase 3 only after explicit confirmation.

---

## 2026-02 Restart Pass: Phase 3 Flow Review Checkpoint

### Observations
1. Entry-shape language existed across timeline and entry type chips, but shape size/contrast remained too subtle at normal scanning distance.
2. Entry type chips still used a hardcoded selected accent (`#ff914d`) instead of entry semantic token classes.
3. Timeline markers and badges could carry a stronger pictographic hierarchy while remaining compact.

### Decisions
- Mark Phase 3 restart review complete.
- Increase shape prominence in timeline markers and badges (slightly larger marker + icon sizes and stronger border weight).
- Tokenize selected entry-type chip state by using `ENTRY_TYPE_CONFIG` classes (`badgeBorder`, `badgeBg`, `color`) instead of hardcoded accent values.

### Guardrails
- Keep labels present and readable; shape remains assistive, not exclusive.
- Keep changes scoped to flow recognition cues (no architecture/model semantics changes).
- Continue restart protocol and stop after this checkpoint before Phase 4.

---

## 2026-02 Restart Pass: Phase 4 Wayfinding Review Checkpoint

### Observations
1. Active nav accent bar and halo behavior were present, but hover states still relied on `hover:border-2` in shared surface wrappers.
2. Border-width shifts on hover can introduce subtle layout jitter and inconsistent contour grammar.
3. Halo thickness should align with border hierarchy tokens to reinforce wayfinding consistency.

### Decisions
- Mark Phase 4 restart review complete.
- Remove hover border-width escalation from shared wayfinding wrappers and keep emphasis through color + halo, not layout-shifting border size changes.
- Align spotlight halo ring thickness with `--border-bold` token.

### Guardrails
- Preserve focus-mode suppression behavior for halo effects.
- Keep wayfinding emphasis semantic and restrained to interactive states.
- Stop after this checkpoint and move to Phase 5 only after explicit confirmation.

---

## 2026-02 Restart Pass: Phase 5 Polish + QA Review Checkpoint

### Observations
1. Keith-Haring readability remained weak in project detail contexts because semantic status and entry-type colors stayed mostly tiny (text/icons only).
2. Entry cards still relied on neutral surfaces and lacked medium-salience semantic accents.
3. Wayfinding consistency improved in Phase 4, but Phase 5 still needed a hardcoded-style sweep in high-traffic project detail surfaces.

### Decisions
- Mark Phase 5 restart review complete.
- Promote semantic status styling in project headers using `status.*` token classes (pill treatment).
- Add medium-salience entry-type accent strips to project detail entry cards via shared `ENTRY_TYPE_CONFIG` mapping.
- Keep card hover emphasis stable (no border-width jumps), preserving calm motion/contrast behavior.

### Guardrails
- Keep Noir base dominant; semantic accents remain additive and tied to model semantics.
- Avoid hardcoded palette values where semantic token classes exist.
- Preserve writing-first flow and avoid introducing extra decision points.
