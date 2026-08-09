# CLAUDE.md

Project guidelines for AI-assisted development on DevJournal.

## Project Overview

DevJournal is a "Build in Public" platform that transforms daily developer logs into an aesthetic, professional portfolio. Target users are indie hackers and engineers. The core philosophy is **Narrative First** — prioritize free-form writing over rigid forms.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS ("Press Proof" design system — warm paper/ink editorial theme with a dark "Midnight Ink" twin; all colors flow through CSS-variable tokens in `app/globals.css`)
- **Animations:** Framer Motion (block-level settle only — see Design Rules)
- **State:** Zustand with localStorage persistence (`lib/store.ts`)
- **Icons:** Lucide React (semantic iconography)
- **Package Manager:** pnpm

## Commands

- `pnpm dev` — Start Turbopack dev server
- `pnpm build` — Production build with TypeScript checks
- `pnpm lint` — ESLint code quality checks

## Code Conventions

- **Imports:** Use absolute imports with `@/`
- **File naming:** kebab-case for files, PascalCase for components
- **State management:** All persistent state lives in `lib/store.ts` using Zustand
- **Keys:** Use `${value}-${index}` for React keys in arrays with potential duplicates
- **Next.js 16 params:** `params` and `searchParams` are Promises — import `use` from `'react'` and call `use(params)` in client components or `await params` in server components
- **Zustand selectors:** Avoid returning new objects/arrays from selectors; use `useMemo` or stable store getters to prevent infinite re-renders

## Project Structure

```text
app/                  # Next.js App Router pages
  editor/             # Private editor interface
  portfolio/          # Public portfolio pages
components/
  editor/             # Editor-only components (modals, project actions)
  portfolio/          # Portfolio display components
  settings/           # Settings-only components (export/import)
  ui/                 # Reusable UI components (Reveal, stamps, TimelineEntry, toast...)
lib/
  store.ts            # Zustand state management
  types.ts            # TypeScript type definitions
  utils.ts            # Utility functions
blueprint/            # Project planning documents
  constitution.md     # System rules and data schemas
  prd.md              # Product vision
  findings.md         # Technical research and fixes
  task_plan.md        # BLAST task tracking
  design-patterns.md  # UX progressive disclosure patterns
```

## Data Model

Core entry interface:

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

- Export format: `.devjournal` (JSON internally)
- Import types: `global` (full backup), `selective` (multiple projects), `project` (single)
- Imports are **additive** and non-destructive — duplicate names get a counter suffix, new IDs are generated to prevent collisions

## Design Rules — "Press Proof"

The journal is a typeset publication, not a dashboard. Every device is borrowed
from print craft: rules, margins, stamps, figures.

- **Two themes, one token set:** "Press Proof" (light, default) and "Midnight Ink"
  (dark) via `data-theme-mode="press|ink"` on `<html>`. Never hardcode palette
  classes (`zinc-*`, `cyan-*`, hex) — use the semantic tokens
  (`surface-*`, `text-*`, `rule`, `accent`, `positive`, `warning`, `destructive`).
- **Two typefaces only:** Newsreader (serif) for everything *written* — headings,
  prose, form copy; IBM Plex Mono for everything *measured* — dates, counts,
  labels, buttons, stamps. No sans-serif anywhere. Nothing serif renders below
  14px; smaller text must be mono.
- **One accent:** red ink annotates, it never decorates — links (`.link-ink`),
  active ticks, the caret, selection, and at most ONE filled accent button per view.
- **Structure from rules, not boxes:** hairlines are ink at reduced pressure
  (`border-rule/15` etc.), lists are hairline-separated rows, sections open with
  a `.keyline`. One vertical `.margin-rule` per view, max two `.rule-oxford`.
  The `.sheet` (letterpress elevation) is reserved for modals, toasts, and the composer.
- **Entry types are `.stamp`s** (two-letter code + word via `TypeStamp`), not
  colored badges: fix = destructive ink, feature = positive ink, the rest stay neutral.
- **Motion is "settle":** whole blocks fade + drift up 8px (`Reveal`), ease
  `cubic-bezier(0.2, 0, 0, 1)`, stagger 45ms capped at 6. Text never animates
  letter-by-letter; nothing blurs, glows, shimmers, or spins. `CountUp` appears
  at most once per view. Honor `data-motion-level` (reduced = opacity-only).
- **Composer parity law:** the entry textarea uses the exact published prose
  metrics (`text-prose`, 66ch) — writing is previewing.
- **Layout:** ledger rows with dotted `.leader`s, margin-rail timeline
  (`TimelineEntry`), sharp 3px radii (6px inputs), tabular numerals for all figures.

## UX Guidelines — Progressive Disclosure

Follow the **Context-Aware Progressive Disclosure** pattern (see `blueprint/design-patterns.md` for full details).

- **Anchored Minimalism:** Fix the top 3-5 actions in persistent, visible locations — recognition over recall. Limit initial choices (Hick's Law) and use whitespace/hierarchy to guide eye-flow.
- **Just-in-Time Reveal:** Show only what's needed for the current step. Hide advanced features behind explicit interactions (e.g., "Advanced Settings"). Use contextual hotspots over linear tours, and make empty states actionable.
- **Responsive Enabling:** Disable or hide controls until prerequisites are met to create natural flow and prevent errors.
- **Personalization:** Segment users at entry (beginner vs. power user). Use AI to filter irrelevant content. Design for monotasking to minimize context-switching overhead.
- **Friction Audit:** Validate with task completion rates, error rates, and user hesitation/backtracking patterns during testing.

## Signature Components — Press Proof System

The old ReactBits effect components (BlurText, ShinyText, DecryptedText,
GradientText, RotatingText, SpotlightCard, ScrollReveal) are **retired** — do not
reintroduce them or equivalent effects. The system's signature moments are
structural, and live in `components/ui/`:

| Moment | Component / Utility | When to Use |
|--------|--------------------|-------------|
| **Entrance** | `Reveal` | List/timeline items settling in; pass `index` for stagger |
| **Entry types & statuses** | `TypeStamp` / `StatusStamp` | Everywhere an entry type or project status appears |
| **Timeline** | `TimelineEntry` | Entries on the margin-rail grid (portfolio + editor) |
| **Section openers** | `.keyline` | Every labeled section |
| **Mastheads** | `.rule-oxford` | Page/project headers (max 2 per view) |
| **Elevation** | `.sheet` | Modals, toasts, the composer — nothing else |
| **Text links** | `.link-ink` | Inline and metadata links |
| **Ledger rows** | `ProjectRow` + `.leader` | Project listings |
| **Live count** | `CountUp` | At most one per view (portfolio masthead) |

### Rules

1. **Headings are plain semantic tags** (`h1`–`h3`) set in Newsreader via `text-display/title/subtitle` — no animation wrappers
2. **Primary CTAs** are solid accent-filled buttons with mono uppercase labels — one per view, no shimmer
3. **List items** that enter on scroll wrap in `Reveal` with `index` — never re-implement entrances inline
4. **Import from `framer-motion`** (not `motion/react`) to match project convention

## BLAST Framework

Follow for every new feature or refactor:

1. **Blueprint** — Define goals in `blueprint/` docs before coding
2. **Link** — Connect external services (Supabase, Vercel, etc.)
3. **Architect** — Build core logic first, reach deterministic state before styling
4. **Style** — Refine UI/UX, maintain the Press Proof aesthetic (see Design Rules)
5. **Trigger** — Deploy and automate
