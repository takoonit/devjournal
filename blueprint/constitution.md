# 🟦 Project Constitution: DevJournal

## 1) North Star
- **Mission:** DevJournal is a thinking system that improves critical thinking, guides reflection, and turns lived experience into measurable progress.
- **Primary User Problem:** Reduce task paralysis (especially ADHD-related) by lowering activation energy for capturing, processing, and acting on thoughts.
- **Product Promise:** Capture fast, think deeper, and leave every session with clearer next actions.

## 2) Core Experience Pillars
1. **Capture Thoughts Without Friction**
   - Fast free-form editor with minimal setup.
   - Users should be able to start typing immediately.
   - The system must prioritize speed, clarity, and low cognitive overhead.

2. **Think Deeper With Guided Prompts**
   - Prompts and reflection templates should help when users feel stuck.
   - Prompting should uncover blind spots, patterns, assumptions, and missed learnings.
   - Guidance should support thinking, not replace it.

3. **Light AI Assistance (Non-dominant)**
   - AI can rephrase, clarify, and offer exploratory angles.
   - AI must remain assistive and optional.
   - User agency and original thinking are always the source of truth.

## 3) Canonical Domain Model

> Single source of truth for contributors. If implementation changes this model, update this file in the same PR.

```ts
interface Entry {
  id: string;
  projectId: string;
  entryType: "feature" | "fix" | "refactor" | "design" | "journal";
  title: string;
  content: string;
  templateData?: Record<string, unknown>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 4) UX & Interaction Rules
- **Activation First:** First interaction should be typing, not configuring.
- **Progressive Disclosure:** Advanced options appear only when needed.
- **Cognitive Safety:** Keep interfaces calm, predictable, and low-noise.
- **Press Proof Visual Language:** The journal is a typeset publication with warm paper (or Midnight Ink) surfaces, Newsreader serif for the written, IBM Plex Mono for the measured, hairline rules over boxes, and one red-ink accent that only annotates (see `AGENTS.md`, Design Rules: Press Proof).
- **Deterministic UI:** Use shared tokens/components before page-specific custom styling.

## 5) Data & Portability Rules
- `.devjournal` is JSON-based and additive on import.
- Import conflicts use deterministic rename + ID regeneration.
- Public portfolio rendering must remain server-readable.

## 6) BLAST Decision Order (Conflict Resolver)
1. **Blueprint correctness** (mission, pillars, domain model)
2. **Link requirements** (runtime/data integration constraints)
3. **Architect stability** (data/model correctness before style)
4. **Style consistency** (tokenized visual system)
5. **Trigger/deployment concerns** (automation + release behavior)

## 7) Non-Goals
- AI taking over author intent or replacing user judgment.
- Complex setup flows before first thought capture.
- UI patterns that increase decision fatigue or paralysis.
- Decorative color/shape usage that reduces readability, contrast, or focus clarity.
