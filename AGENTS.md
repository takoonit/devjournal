# AGENTS.md

Project guidance for agent-assisted development on DevJournal.

## Project Overview

DevJournal is a "Build in Public" platform that turns daily developer logs into a professional portfolio. It serves indie hackers and engineers. The core philosophy is **Narrative First**: prefer free-form writing over rigid forms.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **UI:** React 19 and TypeScript
- **Styling:** Tailwind CSS with the Press Proof design system, a warm paper-and-ink editorial theme with a Midnight Ink twin. All colors flow through CSS variable tokens in `app/globals.css`.
- **Animations:** Framer Motion, limited to block-level settle motion described below
- **State:** Zustand with localStorage persistence in `lib/store.ts`
- **Icons:** Lucide React with semantic icon choices
- **Package manager:** pnpm

## Commands

- `pnpm dev`: start the Turbopack development server
- `pnpm build`: run the production build and TypeScript checks
- `pnpm lint`: run ESLint

## Code Conventions

- Use absolute imports with `@/`.
- Name files in kebab-case and components in PascalCase.
- Keep persistent state in `lib/store.ts` using the established Zustand pattern.
- Use `${value}-${index}` for React keys when an array may contain duplicate values.
- In Next.js 16, `params` and `searchParams` are promises. Import `use` from `react` in client components, or await the value in server components.
- Do not return new objects or arrays directly from Zustand selectors. Use `useMemo` or stable store getters to avoid render loops.
- Use Lucide React icons and prefer icons whose meaning matches the action.

## Project Structure

```text
app/                  # Next.js App Router pages
  editor/             # Private editor interface
  portfolio/          # Public portfolio pages
components/
  editor/             # Editor-only components
  portfolio/          # Portfolio display components
  settings/           # Settings-only components
  ui/                 # Shared UI components
lib/
  store.ts            # Zustand state management
  types.ts            # TypeScript contracts
  utils.ts            # Shared utilities
blueprint/
  constitution.md     # System rules and data schemas
  prd.md              # Product vision
  findings.md         # Technical research and decisions
  task_plan.md        # BLAST task tracking
  design-patterns.md  # UX and progressive-disclosure patterns
```

## Data Model

The core entry contract is:

```typescript
interface Entry {
  id: string;
  projectId: string;
  entryType: EntryType; // "feature" | "fix" | "refactor" | "design" | "journal"
  title: string;
  content: string;
  templateData?: EntryTemplateData;
  isPublic: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

## Data Portability

- The export format is `.devjournal`, with JSON inside.
- Imports may be `global`, `selective`, or `project` scope.
- Imports are additive and non-destructive. Duplicate names receive a counter suffix, and imported records receive fresh IDs to prevent collisions.

## Design Rules: Press Proof

The journal is a typeset publication rather than a dashboard. Its visual devices come from print craft: rules, margins, stamps, and figures.

- **Two themes, one token set:** Press Proof is the light default. Midnight Ink is its dark twin. Apply them through `data-theme-mode="press|ink"` on `<html>`. Never hardcode palette classes such as `zinc-*`, `cyan-*`, or hex colors. Use `surface-*`, `text-*`, `rule`, `accent`, `positive`, `warning`, and `destructive`.
- **Two typefaces:** Newsreader is for written material such as headings, prose, and form copy. IBM Plex Mono is for measured material such as dates, counts, labels, buttons, and stamps. Do not add a sans-serif face. Serif text must not render below 14px; use mono for smaller text.
- **One accent:** red ink annotates through links, active ticks, the caret, and selection. Allow at most one filled accent button per view.
- **Rules provide structure:** use low-pressure ink hairlines, hairline-separated rows, and `.keyline` section openings. Allow one vertical `.margin-rule` and no more than two `.rule-oxford` elements per view. Reserve `.sheet` elevation for modals, toasts, and the composer.
- **Entry types use stamps:** use `TypeStamp` and `.stamp`, with a two-letter code and word. Fix uses destructive ink, feature uses positive ink, and other types remain neutral.
- **Motion settles:** `Reveal` may fade and move a whole block upward by 8px with `cubic-bezier(0.2, 0, 0, 1)`. Use a 45ms stagger capped at six items. Do not animate text by letter or add blur, glow, shimmer, or decorative spinning. Use `CountUp` no more than once per view. Respect `data-motion-level`; reduced motion is opacity-only.
- **Composer parity:** the entry textarea and published prose use the same `text-prose` metrics and `66ch` measure.
- **Layout language:** use ledger rows with `.leader`, the margin-rail `TimelineEntry`, 3px print radii, 6px input radii, and tabular numerals for figures.
- **Unit policy:** use `rem` for scalable component dimensions and spacing, `ch` for reading measure, and `clamp()` for fluid type and macro spacing. Use container queries when a component's own width determines its composition. Pixels are limited to hairlines, focus outlines, print radii, optical transforms, shadows, scrollbars, the 7px timeline node, half-pixel axis centering, and viewport-observer margins. A new pixel value needs a documented optical or rendering reason.
- **Adaptive frames:** use `.page-frame` for page gutters, `.portfolio-shell` and `.timeline-container` for content-driven layouts, and `.control-target` for controls that must retain a 44px interactive area.

## UX Guidelines: Progressive Disclosure

Follow the Context-Aware Progressive Disclosure pattern in `blueprint/design-patterns.md`.

- **Anchored minimalism:** keep the top three to five actions visible in stable locations. Limit initial choices and use whitespace and hierarchy to guide attention.
- **Just-in-time reveal:** show what the current step needs. Put advanced options behind explicit controls and keep empty states actionable.
- **Responsive enabling:** disable or hide controls until their prerequisites are met.
- **Personalization:** distinguish beginner and power-user needs where it reduces irrelevant choices. AI assistance stays optional.
- **Friction audit:** check task completion, errors, hesitation, and backtracking during testing.

## Signature Components

The old ReactBits effects (`BlurText`, `ShinyText`, `DecryptedText`, `GradientText`, `RotatingText`, `SpotlightCard`, and `ScrollReveal`) are retired. Do not reintroduce them or equivalent effects. Press Proof's signature moments are structural and live in `components/ui/`.

| Moment | Component or utility | Use |
|--------|----------------------|-----|
| Entrance | `Reveal` | Timeline and list items settling in; pass `index` for stagger |
| Entry types and statuses | `TypeStamp` / `StatusStamp` | Every entry type or project status |
| Timeline | `TimelineEntry` | Entries on the portfolio and editor margin rail |
| Section openers | `.keyline` | Labeled sections |
| Mastheads | `.rule-oxford` | Page and project headers, no more than two per view |
| Elevation | `.sheet` | Modals, toasts, and the composer |
| Text links | `.link-ink` | Inline and metadata links |
| Ledger rows | `ProjectRow` and `.leader` | Project listings |
| Live count | `CountUp` | No more than once per view |

Additional rules:

1. Use plain semantic `h1` through `h3` elements with `text-display`, `text-title`, or `text-subtitle`. Do not wrap headings in animation components.
2. Use a solid accent fill and mono uppercase label for the primary call to action. Allow one per view and no shimmer.
3. Wrap list items that enter on scroll with `Reveal` and pass `index`. Do not recreate entrance motion inside a page.
4. Import from `framer-motion`, not `motion/react`.

## BLAST Framework

Use BLAST for every feature and refactor.

1. **Blueprint:** establish the goal and product fit first. Maintain `blueprint/constitution.md`, `blueprint/task_plan.md`, and `blueprint/findings.md`.
2. **Link:** connect external systems such as MCPs, Supabase, and Vercel within the requested scope.
3. **Architect:** build core behavior and data processing first. Reach a deterministic state before styling.
4. **Style:** refine the UI through live browser review, premium references where useful, and the Press Proof rules in this file.
5. **Trigger:** validate deployment and automation concerns for Vercel, Modal, and GitHub Actions when the task includes them.
