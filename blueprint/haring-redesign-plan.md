# Noir × Haring UI Redesign Plan

## Governing Documents

This plan is subordinate to and must satisfy:

- `blueprint/constitution.md` — Mission, pillars, UX rules, non-goals
- `blueprint/design-patterns.md` — Pattern hierarchy, Noir × Haring visual pattern (4D)
- `blueprint/findings.md` — Guardrails on readability, tokenization, ADHD support
- `blueprint/prd.md` — Redesign program phases and success criteria
- `blueprint/task_plan.md` — BLAST execution checklist

---

## Design Principle (from Constitution §4)

> **Noir × Haring Visual Language:** Preserve dark, high-contrast base surfaces, then layer bold shape-driven accents inspired by Keith Haring (energetic outlines, simple geometry, high-contrast color cues).

This is **additive**, not substitutive. Dark surfaces stay. Haring influence enters as:

1. **Semantic accent colors** — bold, flat, high-contrast, tied to meaning
2. **Geometric shape accents** — outlines, halos, simple radiant lines at key interaction points
3. **Motion cues** — lightweight, momentum-building, never distracting
4. **Tokenized shape language** — repeatable via tokens/wrappers, not ad hoc

### What This Plan Does NOT Do

Per Constitution §7 (Non-Goals) and Design Patterns §4D (Avoid):

- No white/light canvas backgrounds — dark surfaces are the cognitive stability layer
- No dense decorative motifs (horror vacui) — writing content must remain primary
- No random color without semantic meaning — every color signals a state
- No motion bursts that distract from typing/reading flow
- No ad hoc one-off styling — everything must go through shared tokens/wrappers

---

## 1. Semantic Accent Palette (Haring Colors as Design Tokens)

### Current State

The accent system uses a single color (cyan) for almost everything. Entry types have individual colors, but the broader accent palette is monochromatic.

### Problem

Single-accent palettes under-communicate state. Users must read labels to distinguish meaning. Haring's visual language is fundamentally about **color as immediate semantic signal**.

### Change

Extend the existing token system with a set of Haring-inspired semantic accent colors. These sit alongside (not replacing) the existing `accent`, `warning`, and `destructive` tokens.

```
Token                        Hex        RGB             Semantic Role
--color-entry-feature        #00A651    0 166 81        Growth, new capability
--color-entry-fix            #E3000B    227 0 11        Urgency, correction
--color-entry-refactor       #0057B8    0 87 184        Structure, depth
--color-entry-design         #EC008C    236 0 140       Expression, creativity
--color-entry-journal        #EDD01E    237 208 30      Reflection, warmth

--color-status-shipped       #00A651    0 166 81        Completion (same as feature)
--color-status-in-progress   #FF6600    255 102 0       Active momentum
```

These are **not decorative** — each color maps to exactly one domain concept and replaces the current ad hoc hex values scattered across components.

### Guardrail Checks

- Reduces friction? Yes — color-as-signal means faster scanning without reading labels.
- Cognitive safety? Yes — 5 semantic colors is within cognitive load limits (Miller's 7±2).
- Tokenized? Yes — defined as CSS vars, referenced through `design-tokens.ts` and Tailwind.
- Dark-surface compatible? Yes — all colors are high-saturation and meet WCAG AA contrast on zinc-950.

### Files to Modify

- `app/globals.css` — Add entry/status color vars to `:root` and both theme modes
- `lib/design-tokens.ts` — Add `entry` and `status` token groups
- `tailwind.config.ts` — Extend `colors` with `entry.*` and `status.*`
- `lib/entry-types.ts` — Replace hardcoded color classes with token-based classes

---

## 2. Geometric Accent Shapes (Bold Outlines & Halos)

### Current State

Interactive surfaces use thin 1px `border-zinc-800` borders and radial gradient glow (SpotlightCard). Visual hierarchy depends mostly on opacity shifts and blur.

### Problem

Thin borders and glow effects are ambient — they communicate "surface exists" but not "this matters." Haring's vocabulary uses **bold contour lines** to declare importance and draw the eye.

### Change

Introduce a **border weight hierarchy** as a design token, not a global override:

```
Token              Value     Use Case
--border-subtle    1px       Dividers, inactive surfaces (unchanged)
--border-standard  2px       Interactive cards, active inputs
--border-bold      3px       Primary CTA, active/focused elements only
```

Applied selectively, not universally:

| Element | Current | With Haring Accents |
|---------|---------|---------------------|
| Inactive card border | `border border-zinc-800` | Same (no change) |
| Hovered card border | `hover:border-zinc-700` | `hover:border-[2px] hover:border-entry-*` (entry type color) |
| Primary CTA button | `border border-cyan-500/30` | `border-2 border-accent` (bold, solid, no opacity) |
| Focused input | `focus:border-cyan-400` | `focus:border-2 focus:border-accent` |
| Active nav item | Background highlight | Left edge accent bar (`border-l-3 border-accent`) |

#### Halo Effect (Replaces SpotlightCard Glow)

The current radial gradient spotlight is ethereal. Replace with a **geometric halo** on hover — a solid-color ring or offset outline that appears around the card:

```css
/* Instead of radial gradient glow */
.haring-halo:hover {
  box-shadow: 0 0 0 2px rgb(var(--color-accent-base));
}
```

This is Haring's "radiant lines" reduced to a single, clean ring — semantic (shows the element is interactive) without being decorative.

### Guardrail Checks

- Dense decorative motifs? No — selective bold borders, not universal thick outlines.
- Competes with content? No — applied to containers, not text areas.
- Tokenized? Yes — `--border-subtle/standard/bold` as CSS vars.
- ADHD-safe? Yes — bold borders create clearer visual anchors, reducing scanning effort.

### Files to Modify

- `app/globals.css` — Add border-weight vars
- `lib/design-tokens.ts` — Add `border` token group
- `components/reactbits/spotlight-card.tsx` — Replace radial glow with halo variant
- Components with hover/focus states — Apply selective bold borders

---

## 3. Entry Type Shape Language (Simple Geometric Markers)

### Current State

Entry types use Lucide icons (`Sparkles`, `Bug`, `Wrench`, `Palette`, `BookOpenText`) with per-type color classes. The icons are detailed and don't form a cohesive visual system.

### Problem

Lucide icons are generic and don't create a recognizable "DevJournal visual language." Haring's pictographic system works because it's **reduced, consistent, and proprietary** — you know it's Haring from the shapes alone.

### Change

Create 5 simple geometric shapes as the entry type visual system. These are **not full Haring figure illustrations** (that would be decorative excess per the guardrails). Instead, they take the *principle* — reduce to essential geometry:

| Entry Type | Shape | Description | Haring Influence |
|------------|-------|-------------|------------------|
| Feature | Radiant dot | Filled circle with 4 short radiating lines | Energy/radiance motif |
| Fix | Bold X | Two intersecting diagonal lines, thick stroke | Urgency/action |
| Refactor | Interlocking squares | Two overlapping rotated squares | Restructuring/connection |
| Design | Diamond | 45° rotated square, filled | Creative expression |
| Journal | Open circle | Circle outline with gap at top | Introspection/openness |

Each shape:
- Is a single SVG, max 24×24px viewBox
- Uses `stroke="currentColor"` with `strokeWidth={2.5}` (bolder than Lucide's 1.5-2)
- Takes its color from the entry type semantic token (Section 1)
- Can also be used as a timeline dot replacement (currently a plain circle)

### Guardrail Checks

- Decorative? No — each shape has exactly one semantic meaning. Used where Lucide icons are used today.
- Repeatable? Yes — 5 shapes, tokenized colors, consistent stroke weight.
- Writing-content competition? No — these are small (16-24px) markers in badges and timeline dots.

### Files to Create

- `components/icons/entry-shapes.tsx` — 5 SVG shape components

### Files to Modify

- `lib/entry-types.ts` — Reference new shape components instead of Lucide icons
- `components/ui/timeline-entry.tsx` — Use entry shapes as timeline markers

---

## 4. Motion: Lightweight Radiant Pulse

### Current State

ReactBits components handle motion: BlurText, ScrollReveal, ShinyText, SpotlightCard. The existing motion-level system (reduced/standard/expressive) controls intensity.

### Problem

Current motion is mostly about *revealing* content (blur-in, scroll-reveal). There's no motion for *confirming action* — the moment after a user creates something. Haring's radiating energy lines are about that burst of creation.

### Change

Add one new motion primitive — **Radiant Pulse** — used exclusively for **action confirmation** moments:

```
Trigger                    Effect                          Duration
Entry created              4 short lines pulse outward     400ms
Project created            4 short lines pulse outward     400ms
Capture saved              4 short lines pulse outward     400ms
```

Implementation: a lightweight CSS animation on `::after` pseudo-element, applied via a wrapper component or utility class. No new framer-motion dependency — pure CSS keyframes.

```css
@keyframes radiant-pulse {
  0% { opacity: 0.8; transform: scale(0.5); }
  100% { opacity: 0; transform: scale(1.5); }
}
```

Respects motion levels:
- `reduced` — no animation, instant feedback only
- `standard` — single pulse cycle
- `expressive` — two pulse cycles with stagger

This maps directly to the existing `rewardIntensity` preference (off/subtle/full) and `motionLevel` — no new preference knobs needed.

### Guardrail Checks

- Motion bursts that distract from typing? No — only triggers on completed actions, never during writing.
- Competes with content? No — appears momentarily at the interaction point, then gone.
- Tokenized? Yes — uses existing `--motion-expressive` timing, `--easing-expressive` curve.
- ADHD-safe? Yes — provides momentum feedback ("you did something!") without sustained distraction.

### Files to Create

- `components/reactbits/radiant-pulse.tsx` — CSS-based pulse wrapper

### Files to Modify

- `app/globals.css` — Add `@keyframes radiant-pulse`
- `tailwind.config.ts` — Add `radiant-pulse` to animations
- Toast/confirmation components — Wrap success confirmations with RadiantPulse

---

## 5. Bold Border on Primary CTAs Only

### Current State

CTA buttons use `bg-cyan-500/10 border border-cyan-500/30` — translucent, soft, ambient.

### Problem

CTAs don't visually pop against the dark surface. The opacity-based styling makes them blend in. Haring's outlines are **fully opaque, solid, confident**.

### Change

Primary CTA buttons get the bold treatment:

```
Before: border border-cyan-500/30 bg-cyan-500/10
After:  border-2 border-accent bg-accent/15
```

- **Border becomes solid** (no opacity) and 2px wide
- Background remains translucent (keeps dark surface showing through)
- Hover adds a subtle `translate-y-[-1px]` lift + `shadow-[0_2px_0_0_rgb(var(--color-accent-base))]`
- Active adds `translate-y-[1px]` press + no shadow

This is Haring's bold contour principle applied to exactly one element type. Secondary buttons and ghost buttons remain unchanged.

### Guardrail Checks

- Reduces friction? Yes — clearer primary action identification.
- Calm and predictable? Yes — the solid border is stable, not animated.
- Tokenized? Yes — uses existing `--color-accent-base`, new `--border-standard` weight.

### Files to Modify

- Button/CTA instances across editor pages — Apply bold border treatment
- `app/globals.css` — Optional `.btn-primary` utility class

---

## 6. Accent Bar on Active Navigation

### Current State

Active sidebar nav items use background highlights or text color changes.

### Change

Add a left-edge accent bar to the active nav item — a 3px-wide vertical stripe in `--color-accent-base`. This is Haring's bold line used as a **wayfinding signal**:

```css
.nav-item-active {
  border-left: 3px solid rgb(var(--color-accent-base));
  padding-left: calc(var(--space-stack-sm) - 3px); /* compensate for border */
}
```

This replaces background-based active indicators with a cleaner geometric marker.

### Files to Modify

- `app/editor/layout.tsx` — Sidebar nav active state styling

---

## Implementation Phases (Aligned to PRD Redesign Program)

The PRD defines 5 phases. This plan maps onto them:

### Phase 1 — Foundation (tokens, vars, docs)
1. Add Haring semantic color tokens to `globals.css`, `design-tokens.ts`, `tailwind.config.ts`
2. Add border-weight tokens (`--border-subtle/standard/bold`)
3. Update `lib/entry-types.ts` to use new token-based color classes
4. Update blueprint docs (this file, constitution if needed)

### Phase 2 — Feedback (visual confirmation)
5. Build `RadiantPulse` component for action confirmation
6. Integrate pulse with toast/confirmation flows
7. Update primary CTA button styling (bold borders)

### Phase 3 — Flow (entry creation improvements)
8. Create `components/icons/entry-shapes.tsx` (5 geometric shapes)
9. Replace Lucide icons in entry type system with entry shapes
10. Update timeline markers to use entry shapes

### Phase 4 — Wayfinding
11. Add accent bar to active nav items
12. Update `SpotlightCard` with halo hover effect
13. Apply selective bold borders to interactive card hover states

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
- [x] Supports all 3 pillars: capture (clearer CTAs), reflection (entry type visual language), actionability (momentum feedback via radiant pulse)
- [x] Decisions recorded in this document
- [x] Follows Noir × Haring direction from constitution §4

### L — Link
- [ ] No external service changes required
- [ ] Portfolio paths remain server-readable
- [ ] Token changes are CSS-only, no runtime impact

### A — Architect
- [ ] Semantic tokens defined before component work
- [ ] Entry type shapes maintain same interface as Lucide icons (drop-in replaceable)
- [ ] No changes to data model, store structure, or routing

### S — Style
- [ ] Token-first: all colors/borders defined as CSS vars first
- [ ] Wrapper-first: RadiantPulse is a wrapper component, not inline styling
- [ ] Noir base preserved — all surfaces remain dark
- [ ] Haring accents are semantic, not decorative

### T — Trigger
- [ ] Validate lint/build after each phase
- [ ] No ISR/caching changes

---

## Files Summary

### New Files (3)
- `components/icons/entry-shapes.tsx` — 5 geometric SVG shape components
- `components/reactbits/radiant-pulse.tsx` — Action confirmation pulse wrapper

### Modified Files (8)
- `app/globals.css` — Haring color tokens, border-weight vars, radiant-pulse keyframe
- `tailwind.config.ts` — Entry/status colors, border tokens, radiant-pulse animation
- `lib/design-tokens.ts` — Entry, status, and border token groups
- `lib/entry-types.ts` — Token-based color classes + entry shape references
- `components/reactbits/spotlight-card.tsx` — Halo hover variant
- `components/ui/timeline-entry.tsx` — Entry shape markers
- `app/editor/layout.tsx` — Active nav accent bar
- CTA button instances — Bold border treatment
