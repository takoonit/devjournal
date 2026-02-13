# 📋 BLAST Task Plan

## Status
- **Program State:** Thinking-system refinement for critical reflection + ADHD-friendly execution.
- **Objective:** Ensure every shipped change improves capture speed, reflection quality, and actionability.

---

## A) BLAST Operating Checklist (use every feature/refactor)

### B — Blueprint (required first)
- [ ] Confirm change supports the 3 pillars in `blueprint/constitution.md`.
- [ ] Record assumptions/decisions in `blueprint/findings.md`.
- [ ] If architecture or interaction rules change, update blueprint docs in same PR.

### L — Link
- [ ] Validate external/data constraints (Supabase, Vercel, env assumptions).
- [ ] Keep portfolio paths server-readable and deterministic.
- [ ] Ensure AI integrations (if touched) remain optional and low-friction.

### A — Architect
- [ ] Prioritize model correctness and low-friction flow.
- [ ] Keep semantics explicit (`entryType`) and predictable.
- [ ] Prefer simplification that reduces cognitive overhead.

### S — Style
- [ ] Apply token/wrapper-first styling.
- [ ] Reinforce calm focus, readability, and visible focus states.
- [ ] Apply Noir base + Keith Haring–inspired shape/color accents for energy without clutter.
- [ ] Style should reduce overwhelm, not add novelty noise.

### T — Trigger
- [ ] Validate lint/build and caching behavior.
- [ ] Document ISR/runtime implications for any data-path changes.

---

## B) Product Execution Tracks

### Track 1 — Frictionless Capture
- [ ] Keep “time-to-first-word” minimal.
- [ ] Reduce required fields/decisions before writing.
- [ ] Preserve draft reliability and interruption-safe workflows.

### Track 2 — Guided Reflection
- [ ] Improve prompt quality for blind spots/pattern recognition.
- [ ] Keep prompt UX lightweight and context-aware.
- [ ] Ensure reflection leads to concrete insights or next actions.

### Track 3 — Actionable Progress
- [ ] Convert reflections into clear next steps.
- [ ] Improve visibility of momentum and follow-through.
- [ ] Keep progress signals supportive, not judgmental.

---

## C) Definition of Done (for agentic PRs)
- [ ] Change supports at least one core experience pillar.
- [ ] Architecture/model intent remains explicit and deterministic.
- [ ] Blueprint docs updated if behavior/rules changed.
- [ ] Validation commands executed and reported.
- [ ] PR summary explains user impact on capture, reflection, or actionability.
