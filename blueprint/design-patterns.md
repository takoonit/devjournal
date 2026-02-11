# Design Pattern: Context-Aware Progressive Disclosure

**Problem:** Users facing feature-rich environments suffer from "Context Saturation" and "Cognitive-Load Overflow," where excessive inputs overwhelm working memory (limited to roughly 7 ± 2 items), leading to decision paralysis, errors, and abandonment.

**Solution:** A tiered interface architecture that minimizes **Extraneous Load** (design noise) to maximize **Germane Load** (learning/processing). This is achieved by anchoring core features, revealing complexity only via user interaction (progressive disclosure), and utilizing AI for contextual curation.

---

## 1. Structural Foundation: The "Anchored Minimalism" Layout

To reduce immediate cognitive friction, the interface must rely on **recognition rather than recall**.

- **Visual Anchoring:** Establish fixed, prominent locations for the most critical 3-5 functions (e.g., a persistent bottom navigation bar). This leverages spatial memory, allowing users to form habits without active searching.
  - *Anti-Pattern:* Avoid hidden gesture-based navigation for core tasks. While aesthetically minimal, it forces users to rely on recall (memory), significantly increasing cognitive load and hindering discoverability.
- **Apply Hick's & Miller's Laws:** Limit initial choices to prevent decision fatigue. If a menu contains many options, chunk them into logical groups or hide secondary actions behind a "More" interface.
- **Whitespace & Hierarchy:** Use whitespace and strong visual hierarchy (size, color, contrast) to guide the user's "eye-flow" naturally from the primary action to secondary details, preventing "erratic eye-flow" and scanning fatigue.

## 2. Interaction Strategy: The "Just-in-Time" Reveal

Instead of front-loading instruction (which is often ignored), use **Progressive Disclosure** to align with the user's immediate intent.

- **Staged Disclosure:** Present only the information necessary for the current step. Secondary features should remain hidden until the user requests them (e.g., clicking "Advanced Settings" or hovering for tooltips).
- **Responsive Enabling:** Controls should be disabled or hidden until the user completes the prerequisite action (e.g., the "Next" button only activates after a form is filled). This creates a natural flow and prevents errors.
- **Contextual Onboarding (vs. Linear Tours):** Replace long, linear product tours with "contextual hotspots" or beacons. These subtle indicators draw attention to a feature only when it becomes relevant to the user's current workflow, facilitating "learning as you go."
- **Actionable Empty States:** Transform blank screens (empty states) into drivers for engagement. Instead of a blank page, provide a clear call-to-action (CTA), a micro-video, or a checklist to prompt the first step.

## 3. Personalization Engine: The "Choose Your Own Journey" Flow

To maintain **Flow State**—a state of energized focus—the system must adapt to the user's proficiency and goals to prevent boredom or anxiety.

- **Segmentation at Entry:** Use a "welcome screen microsurvey" to determine the user's "Job to be Done." Immediately tailor the interface to show only the features relevant to that specific goal (e.g., beginner vs. power user paths).
- **AI-Driven Curation:** Utilize AI to filter "extraneous tokens" (irrelevant content) from the user's view. For example, algorithms should personalize content feeds or feature suggestions based on past behavior to prevent "context saturation."
- **Monotasking Architecture:** Design workflows that encourage focusing on one task at a time. Minimize "context switching" (e.g., jumping between unrelated tabs/screens), which drains mental energy and reduces productivity by up to 40%.

## 4. Validation & Metrics: The "Friction Audit"

To ensure the pattern is effective, you must measure cognitive load using a mix of subjective and objective methods.

- **Objective Metrics:** Use **Eye Tracking** to measure fixation duration and saccades (rapid eye movements). Long fixations or erratic saccades indicate confusion and high load. Monitor **Task Completion Rates** and **Error Rates** as indirect indicators of extraneous load.
- **Subjective Metrics:** Implement the **NASA-TLX** questionnaire to assess perceived mental effort after specific tasks.
- **Friction Identification:** Watch for "hesitation" or "backtracking" during user testing, as these are clear signs of unclear navigation or poor information hierarchy.

## Summary of Implementation Steps

| Layer | Strategy | Implementation |
| :--- | :--- | :--- |
| **UI** | **Anchoring** | Place primary actions in the "thumb zone" or fixed bars. |
| **UX** | **Staged Disclosure** | Hide advanced features behind specific interaction points. |
| **Flow** | **Contextual Help** | Use tooltips/hotspots instead of long manuals. |
| **Data** | **Personalization** | Use AI to filter irrelevant options and prevent saturation. |
| **Test** | **Load Measurement** | Validate utilizing NASA-TLX and eye-tracking. |

---

## Shared Design Foundation (Noir + Calm Focus)

All new screen work should consume semantic wrappers and tokens before introducing page-specific styling.

### 1) Tokens first

- Use `lib/design-tokens.ts` as the source of truth for semantic groups:
  - `color`: `surface`, `text`, `accent`, `warning`, `destructive-soft`
  - `motion`: `subtle`, `standard`, `expressive`
  - `spacing`: `cozy`, `compact`
- Tokens map directly to CSS custom properties in `app/globals.css`.
- Avoid hardcoded hex values or ad-hoc animation timings in feature code.

### 2) Theme variants

- Default theme is `noir` (`:root` / `data-theme="noir"`).
- Secondary theme is `calm-focus` (`data-theme="calm-focus"`).
- When building theme-aware UI, reference semantic Tailwind classes (`bg-surface-*`, `text-text-*`, `border-surface-border`, `text-accent`, etc.) instead of direct palette utilities.

### 3) ReactBits wrappers only

Use wrappers in `components/ui` instead of importing raw ReactBits primitives on page-level code:

- `FocusHeading`
  - Purpose: animated headings with `blur` or `decrypt` effect presets.
  - Use for hero/section labels where scanability and focal hierarchy matter.
- `RewardLabel`
  - Purpose: semantic shimmering micro-copy for rewards, status, or momentum cues.
  - Use `tone` presets (`neutral`, `accent`, `warning`) instead of custom gradients.
- `InteractiveSurface`
  - Purpose: spotlight cards with controlled interaction energy.
  - Use intensity presets (`subtle`, `standard`, `expressive`) rather than one-off hover effects.

### 4) Page-level redesign guardrails

Before making page-specific style passes:

1. Confirm a semantic token exists.
2. Confirm a shared wrapper exists.
3. Extend wrapper presets when needed, then consume them from the page.

This keeps the system deterministic, theme-safe, and consistent with BLAST architecture goals.
