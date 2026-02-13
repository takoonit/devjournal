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
