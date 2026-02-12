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

### Phase 1 — Foundation ✅ Complete
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

### Phase 2 — Feedback ✅ Complete
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

### Phase 3 — Flow ✅ Complete
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

### Phase 4 — Wayfinding + Capture ✅ Complete
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

### Phase 5 — Polish + QA 🔄 In Progress
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


## 📦 ISR + Vercel Deployment Plan (Supabase-backed)

**Objective:** Enable true Next.js ISR for public portfolio routes by moving published data from client-only localStorage to Supabase, then deploy with controlled revalidation on Vercel.


### Decision Inputs (Confirmed)
- [x] Supabase project: `https://sgadyniobmaxlbnnltkv.supabase.co` (region: `ap-southeast-2`)
- [x] Zustand remains editor cache only; Supabase is portfolio source of truth
- [x] Single-user write/update model
- [x] ISR window: `150s`
- [x] Revalidation triggers: entry updates + slug changes
- [x] Rollout: Preview soak period, then Production verification

### Step 1 — Implement Supabase as source of truth
- [x] Create Supabase tables for `profiles`, `projects`, and `entries` with portfolio fields (`slug`, visibility, timestamps, ordering).
- [x] Add row-level security policies for public reads and authenticated editor writes.
- [x] Add server-side data access helpers (e.g., `lib/supabase/server.ts`) used by portfolio pages.
- [x] Migrate portfolio reads away from Zustand/localStorage to Supabase-backed server queries.

### Step 2 — Enable ISR on portfolio routes
- [x] Convert `app/portfolio/page.tsx` and `app/portfolio/[slug]/page.tsx` to server-first rendering paths where data is fetched on the server.
- [x] Export route `revalidate` intervals and add `generateStaticParams` for project slugs.
- [x] Add cache tags (`revalidateTag`) or path invalidation (`revalidatePath`) strategy for project + entry updates.
- [x] Keep interactive client-only behavior isolated in leaf components.

### Step 3 — Wire Vercel deployment + on-demand revalidation
- [x] Add `app/api/revalidate/route.ts` protected by `REVALIDATE_SECRET`.
- [x] Configure Vercel environment variables for Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional publishable aliases, server role key) and revalidation secret for Preview + Production.
- [x] Document publish/unpublish flows that trigger path/tag invalidation.
- [ ] Add smoke tests for deployed revalidation endpoint and portfolio cache refresh behavior.

### Step 4 — Cutover + validation checklist
- [x] `pnpm lint` and `pnpm build` clean before production promotion.
- [ ] Verify portfolio consistency across devices (confirms data is no longer localStorage-only).
- [ ] Confirm stale content refreshes after ISR window and immediately after on-demand revalidation.
- [ ] Add rollback notes (disable webhook, revert deployment, revalidate critical paths).

---
## 🚀 T: Trigger
- [x] Final regression pass (`pnpm lint`, `pnpm build`) at completion of each completed phase (Phases 1–4)
- [x] Deploy phased milestones to Vercel preview environments for completed phases (Phases 1–4)
- [x] Publish phase-end changelog with metric deltas (clicks-to-start, abandonment) for completed phases (Phases 1–4)

## Program-Level Success Metrics
- **Reduced clicks-to-start:** Fewer interactions required to begin a new log
- **Fewer abandonment points:** More resumable flows, less forced context switching
- **Preference persistence:** UI settings reliably survive refreshes and migrations
- **Consistent component usage:** Shared primitives replace one-off UI patterns

- [x] Semantic entry model migration kickoff: introduced `entry_type` + `content` in app types/schema and simplified entry authoring UI around type/title/body with optional details.
- [x] Timeline interaction refinement: semantic icon/color mapping and client-side entry-type filtering for portfolio narratives.
