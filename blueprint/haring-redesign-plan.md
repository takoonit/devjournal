# Noir × Haring UI Redesign Plan (Blueprint-Aligned Rewrite)

## Governing Documents (Priority Order)

This plan is explicitly constrained by:
1. `blueprint/constitution.md` (mission, pillars, UX rules, non-goals)
2. `blueprint/task_plan.md` (BLAST checklist + product execution tracks)
3. `blueprint/prd.md` (5-phase redesign contract)
4. `blueprint/design-patterns.md` (Noir × Haring implementation patterns)
5. `blueprint/findings.md` (decisions + guardrails)

---

## Compatibility Contract (No Blueprint Conflict)

This plan must never violate ongoing blueprint constraints:
- **Noir base is permanent**: dark canvas/surfaces remain the cognitive stability layer.
- **Activation first**: visual identity cannot add setup friction before writing.
- **Deterministic semantics**: entry/state color and shape usage must be token-driven.
- **Assistive motion only**: animation may confirm completion, never compete with writing.
- **Non-goals enforced**: no decorative overload, no random color usage, no AI-over-author intent.

---

## Design Intent: “Readable Haring Energy”

Haring influence is implemented as a constrained system:
1. **Semantic color blocks** (entry/status meaning)
2. **Recognizable geometric pictograms** (entry type language)
3. **Bold contour hierarchy** (active/hover/primary emphasis)
4. **Momentary radiant confirmation cues** (post-action momentum)

This is identity-through-structure, not decorative art layering.

---

## Phase Restart Protocol (Phase 1 → 5, Review Stop After Each)

Execution cadence for this run:
1. Implement one phase only.
2. Stop immediately after that phase.
3. Publish a phase review checkpoint (what changed, validation, risk notes).
4. Continue to the next phase only after explicit confirmation.

### Current Restart Status

### Phase 1 — Foundation ✅ (reviewed in restart)
- Re-verify semantic token coverage (`entry.*`, `status.*`) across CSS + token config + Tailwind mapping.
- Re-verify border hierarchy token usage (`subtle`, `standard`, `bold`) in shared styling paths.
- Re-verify `ENTRY_TYPE_CONFIG` color mapping stays token-backed (no palette regressions).
- Publish Phase 1 checkpoint summary before moving to Phase 2.

### Phase 2 — Feedback ✅ (reviewed in restart)
- Re-validate `RadiantPulse` semantics + accessibility behavior.
- Re-validate success feedback timing (completion-only) and CTA emphasis consistency.

### Phase 3 — Flow ✅ (reviewed in restart)
- Re-validate shape language consistency in timeline + new/edit entry flows.
- Re-validate entry-type metadata centralization stays deterministic.

### Phase 4 — Wayfinding ✅ (reviewed in restart)
- Re-validate active nav accent grammar, halo behavior, and selective bold interactive borders.

### Phase 5 — Polish + QA ✅ (reviewed in restart)
- Execute contrast/motion/focus safety checks and consistency sweep closure.

---

## Phase 5 — Polish + QA (Current Execution Focus)

### 5.1 Accessibility + Contrast
1. Audit tokenized accent combinations for WCAG AA on dark surfaces.
2. Verify text/icon contrast on all `entry.*`, `status.*`, and `accent` usages.
3. Resolve any contrast regressions via tokens first, not per-component overrides.

### 5.2 Motion/Focus Safety
4. Validate reduced/standard/expressive motion behavior for pulse + halo patterns.
5. Verify `focusMode` suppresses non-essential visual effects consistently.
6. Ensure completion feedback appears only after action completion.

### 5.3 Identity Consistency Sweep
7. Remove remaining hardcoded palette classes where semantic tokens exist.
8. Eliminate ad hoc border/motion variants that bypass shared wrappers/utilities.
9. Confirm shape language appears consistently in timeline + entry-type selectors.

---

## Haring Identity Pass Checklist (Conflict-Safe)

> This pass is explicitly constrained to stay compatible with Constitution + Task Plan.

### A) Semantic Color Presence (without noise)
- [ ] Each entry type has one medium-salience cue beyond tiny icons/badges.
- [ ] Status cues use `status.shipped` / `status.in-progress` tokens consistently.
- [ ] No random accent color usage outside semantic mappings.

### B) Shape Language Prominence (without clutter)
- [ ] Entry shapes remain recognizable at typical scanning distance.
- [ ] Shape usage is repeated in key flow contexts (timeline + type chips).
- [ ] Labels remain present for accessibility; shapes are assistive, not exclusive.

### C) Bold Line Wayfinding (without overload)
- [ ] Active nav line marker is visually primary over background tints.
- [ ] Interactive card emphasis uses border hierarchy tokens (`subtle/standard/bold`).
- [ ] Divider and container lines remain calm on inactive states.

### D) Momentum Signals (without distraction)
- [ ] Radiant confirmation appears only on successful completion moments.
- [ ] Motion obeys `motionLevel` and `rewardIntensity` preferences.
- [ ] Reduced/focus modes preserve calm and predictability.

### E) Blueprint Safety Gates
- [ ] First interaction remains writing-first.
- [ ] No architecture/model semantics changed for styling-only work.
- [ ] No additional user decision points introduced in core flows.

---

## BLAST Reconciliation Checklist (for closing Phase 5)
### Phase 5 — Polish + QA
5.1 **Accessibility contrast audit (WCAG thresholds)**
- Verify all accent usage against dark surfaces with these minimums:
  - Normal text: **>= 4.5:1**
  - Large text and icons: **>= 3:1**
  - Focus indicators on dark surfaces: must remain clearly visible with an explicit target of **>= 3:1** against adjacent colors.
- Evidence required: contrast report/output + before/after checklist for any adjusted tokens.

5.2 **Motion behavior validation by mode**
- Validate expected behavior for each interaction primitive per mode:
  - `reduced`:
    - `RadiantPulse`: disabled (no pulse animation).
    - Halo hover: static border/halo state only (no animated transition).
    - Focus mode: all non-essential animations off.
  - `standard`:
    - `RadiantPulse`: single 400ms pulse cycle.
    - Halo hover: one smooth enter/exit transition only.
    - Focus mode: disables pulse/halo animations when focus mode is active.
  - `expressive`:
    - `RadiantPulse`: two staggered pulse cycles.
    - Halo hover: enhanced but brief transition, still non-looping.
    - Focus mode: still overrides and disables decorative animation.
- Evidence required: mode-by-mode verification checklist + build/lint output.

5.3 **Design-system consistency sweep**
- Completion criteria:
  - **Zero hardcoded palette classes** where a semantic token exists.
  - **Zero duplicate border-motion variants** outside shared wrappers/utilities.
  - No ad hoc Haring-style one-offs leaked into feature code.
- Evidence required: grep/search audit log + checklist of migrated call sites.

## Phase Status Snapshot

- ✅ Phase 1 — Foundation
- ✅ Phase 2 — Feedback
- ✅ Phase 3 — Flow
- ✅ Phase 4 — Wayfinding
- 🟡 Phase 5 — Polish + QA

Phase 5 may include scoped consistency retrofits to outputs from Phases 1–4 without reopening architecture.

## Delivery Notes

- Identity-strengthening refinements are allowed when they satisfy compatibility gates and remain token/wrapper-first.

### Out of scope

- New feature flows
- Model changes
- Extra decision points

---

## Haring Identity Pass Checklist (Conflict-Safe)

> Guidance only: this mapping is for implementation planning and prioritization, not an architectural rewrite. Keep all updates within existing interfaces and the Compatibility Contract.

### Primary implementation targets

- **Semantic colors**
  - `app/globals.css`
  - `lib/design-tokens.ts`
  - `tailwind.config.ts`
  - `lib/entry-types.ts`
- **Shape prominence**
  - `components/icons/entry-shapes.tsx`
  - `components/ui/timeline-entry.tsx`
  - Entry create/edit pages (existing route files only)
- **Wayfinding lines**
  - `app/editor/layout.tsx`
  - `components/ui/interactive-surface.tsx`
  - `components/reactbits/spotlight-card.tsx`
- **Momentum signals**
  - `components/reactbits/radiant-pulse.tsx`
  - `components/ui/toast.tsx`

Implementation note: prefer shared wrappers/utilities and tokenized primitives over per-page class overrides.

## BLAST Checklist for This Plan

### B — Blueprint
- [ ] Changes support at least one constitution pillar.
- [ ] New decisions are logged in `blueprint/findings.md`.

### L — Link
- [ ] No external-service assumptions changed by styling updates.
- [ ] Public portfolio rendering remains deterministic.

### A — Architect
- [ ] Entry semantics remain explicit (`entryType`, shared config).
- [ ] Token sources remain centralized and reusable.

### S — Style
- [ ] Token/wrapper-first styling is preserved.
- [ ] Noir base remains dominant with semantic Haring accents.

### T — Trigger
- [ ] `pnpm lint` and `pnpm build` pass for final Phase 5 PR.
- [ ] Runtime/ISR behavior unchanged unless explicitly documented.

---

## Delivery Notes

- This rewrite remains a **blueprint-safe plan surface**; implementation stays token/wrapper-first.
- During restart execution, phase reviews are mandatory artifacts in `blueprint/findings.md`.
- Out of scope during restart: new feature flows, architecture/model changes, and extra user decision points.
