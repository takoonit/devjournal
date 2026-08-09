# 🎨 Design Patterns: Thinking-System Edition

Use this with:
- `blueprint/constitution.md` for mission and model truth
- `blueprint/task_plan.md` for BLAST execution flow

---

## 1) Pattern Hierarchy (apply in order)
1. **Cognitive Intent** → reduce paralysis, increase clarity, preserve agency.
2. **Domain & Data** → deterministic model and server-readable data flow.
3. **Interaction Flow** → frictionless capture + progressive reflection guidance.
4. **UI Composition** → tokenized calm-focus visuals with accessibility baseline.

If a change fails a higher layer, revise before implementation.

---

## 2) Core Experience Patterns

### A) Frictionless Capture Pattern
**Intent:** Get thoughts out before they disappear.

**Do**
- Default to immediate free-form writing.
- Keep setup and branching minimal.
- Maintain interruption-safe drafts.

**Avoid**
- Multi-step onboarding before first input.
- Required configuration that delays writing.

### B) Guided Reflection Pattern
**Intent:** Help users think deeper when stuck.

**Do**
- Provide short, context-aware prompts.
- Encourage pattern recognition, assumption checks, and lesson extraction.
- End with a clear “next thought” or “next step” cue.

**Avoid**
- Prompt overload.
- Generic prompts disconnected from the current entry context.

### C) Assistive AI Pattern
**Intent:** AI amplifies thinking without replacing it.

**Do**
- Offer optional actions like rephrase, clarify, expand angle.
- Keep AI outputs editable, transparent, and easy to reject.
- Preserve user-authored text as the default authority.

**Avoid**
- Auto-overwriting user content.
- AI-driven flow that takes control of the session.

---

## 3) Engineering Patterns

### A) Deterministic Contracts
- `lib/types.ts` defines app contracts.
- `lib/supabase/types.ts` defines row/transport shapes.
- Mapping functions isolate format conversion.

### B) Predictable Semantics
- `entryType` remains the entry classifier.
- Keep content extraction and rendering explicit and testable.

### C) Simplicity Over Ceremony
- Prefer minimal, explicit logic.
- Remove incidental complexity that increases contributor or user cognitive load.

---

## 4) Calm-Focus UI Patterns

### A) Token-First Styling
- Use semantic tokens (`lib/design-tokens.ts` + `app/globals.css`).
- Respect preference-based motion/spacing tiers.

### B) Wrapper-First Components
- Reuse `components/ui` wrappers before page-local styling variants.
- Extend wrapper presets rather than duplicating ad hoc effects.

### C) Accessibility Baseline
- Visible focus states and keyboard-friendly interactions.
- Reliable contrast and readable hierarchy on dark surfaces.
- Microcopy that supports progress instead of pressure.


### D) Fluid Press Proof Visual Pattern
**Intent:** Combine publication-grade reading rhythm with low-friction editor operation across every available width.

**Do**
- Use Newsreader for written material and IBM Plex Mono for measured material.
- Use semantic fluid tokens, readable measures, rules, stamps, and restrained red annotation.
- Let component width drive portfolio, timeline, and settings composition.
- Keep small print marks inside 44px touch targets.

**Avoid**
- Decorative effects that compete with writing or published work.
- Fixed viewport assumptions inside reusable content components.
- Pixel-based type or scalable spacing outside the documented rendering allowlist.

---

## 5) Contributor Checklist
- [ ] Change reduces friction, deepens reflection, or improves actionability.
- [ ] User agency is preserved (especially around AI assistance).
- [ ] Domain/data behavior remains deterministic.
- [ ] Shared token/component system used first.
- [ ] Visual treatment follows Press Proof type, rule, measure, and adaptive-layout guidance.
- [ ] Lint/build validation reported.
