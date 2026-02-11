# 📋 BLAST Task Plan: task_plan.md

## 🎯 Current Program: Redesign Execution (5 Phases)

**Status:** Phase 5 (Polish + QA) in progress

This plan operationalizes the redesign into explicit, sequential phases with measurable outcomes.

---

## 🟦 B: Blueprint
- [x] Keep **constitution.md** aligned with Narrative First + Noir principles
- [x] Keep **findings.md** as implementation and UX research log
- [x] Publish phased redesign plan with acceptance criteria (this document)

## 🔗 L: Link
- [ ] Confirm external integrations (Supabase/Vercel) after UX architecture stabilizes
- [ ] Validate analytics hooks for redesign success metrics (clicks-to-start, abandonment)

## 🏗️ A/S: Architect + Style Redesign Phases

### Phase 1 — Foundation ✅ In Progress
**Scope**
- Design tokens (color/motion/spacing) hardened and documented
- Theme variables finalized for supported themes
- UI preference state expanded + persisted safely
- Docs refresh (constitution/findings/task plan references)

**Deliverables**
- [x] `lib/design-tokens.ts` semantic token source of truth
- [x] `app/globals.css` theme variable mapping for token usage
- [x] `lib/store.ts` persisted UI preferences with backward-compatible migration
- [x] Blueprint docs updated to reflect redesign architecture

**Acceptance Criteria**
- Preference persistence survives reload/session restore without regressions
- Component styling references shared token system (no ad hoc constants for redesigned surfaces)
- Baseline set for clicks-to-start measurement for later comparison

---

### Phase 2 — Feedback ✅ In Progress
**Scope**
- Toast redesign for clearer, emotionally supportive system feedback
- Supportive copy module for microcopy consistency
- Reward intensity controls wired to preference state

**Deliverables**
- [x] Updated `components/ui/toast.tsx` behavior + visuals
- [x] New/updated copy utility module for encouragement + fallback messaging
- [x] Preference-controlled reward intensity reflected in feedback components

**Acceptance Criteria**
- Consistent component usage for feedback surfaces across editor flows
- User preference changes immediately affect reward/feedback intensity
- Qualitative copy pass confirms supportive tone consistency

---

### Phase 3 — Flow ✅ In Progress
**Scope**
- Step-based entry creation/edit flows
- Progress indicators in multi-step experiences
- Save-and-return behavior for interrupted journaling

**Deliverables**
- [x] Step UI primitives and updated editor entry pages
- [x] Persistent draft/save state for incomplete entries
- [x] Progress indicator components integrated in entry forms

**Acceptance Criteria**
- Reduced clicks-to-start vs Phase 1 baseline
- Fewer form abandonment points through resumable drafts
- Entry completion funnel instrumented for before/after comparison

---

### Phase 4 — Wayfinding + Capture ✅ In Progress
**Scope**
- Breadcrumbs across editor and portfolio navigation layers
- Inbox quick-capture flow
- Conversion path from inbox capture → structured entry/project update

**Deliverables**
- [x] Shared breadcrumb component applied consistently in key screens
- [x] Inbox quick-capture input + list/state model
- [x] Conversion actions from captured item to journal entry workflow

**Acceptance Criteria**
- Consistent component usage for wayfinding patterns app-wide
- Quick-capture reduces time-to-first-note and lowers abandonment for idea logging
- Capture-to-conversion path requires fewer navigation steps than current entry route

---

### Phase 5 — Polish + QA ✅ In Progress
**Scope**
- Motion tuning based on UI preference profile
- Contrast and accessibility pass
- Consistency sweep across editor and portfolio surfaces

**Deliverables**
- [x] Motion variants aligned to user preference tiers (reduced/standard/expressive)
- [x] A11y checklist results + contrast fixes
- [x] Final UI consistency audit and issue closure list

**Acceptance Criteria**
- Preference persistence verified for motion + feedback settings
- Accessibility checks pass for contrast and interaction affordances
- Editor/portfolio parity achieved for shared components and tone

---

## 🚀 T: Trigger
- [ ] Final regression pass (`pnpm lint`, `pnpm build`) at completion of each phase
- [ ] Deploy phased milestones to Vercel preview environments
- [ ] Publish phase-end changelog with metric deltas (clicks-to-start, abandonment)

## Program-Level Success Metrics
- **Reduced clicks-to-start:** Fewer interactions required to begin a new log
- **Fewer abandonment points:** More resumable flows, less forced context switching
- **Preference persistence:** UI settings reliably survive refreshes and migrations
- **Consistent component usage:** Shared primitives replace one-off UI patterns
