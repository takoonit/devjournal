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

## Phase Status Snapshot

### Phase 1 — Foundation ✅
- Semantic entry/status tokens in `globals.css`, `design-tokens.ts`, `tailwind.config.ts`
- Border weight token hierarchy introduced
- `lib/entry-types.ts` migrated to token-backed color classes
- Blueprint docs reconciled

### Phase 2 — Feedback ✅
- `RadiantPulse` primitive added
- Success feedback integrated (toast flow)
- Primary CTA border treatment standardized

### Phase 3 — Flow ✅
- Entry shape icon set created
- Entry visual semantics centralized in `ENTRY_TYPE_CONFIG`
- Timeline and entry-form selectors use shared shape language

### Phase 4 — Wayfinding ✅
- Active nav accent bar implemented
- Spotlight interaction shifted to geometric halo behavior
- Selective bold hover borders applied to key interactive cards

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

- This rewrite is a **plan-only update** to align implementation intent with blueprint constraints.
- Execution priority from this point: **Phase 5 QA + identity consistency pass**, not net-new visual feature scope.
