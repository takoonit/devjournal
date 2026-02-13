# CLAUDE.md

Project guidelines for AI-assisted development on DevJournal.

## Project Overview

DevJournal is a "Build in Public" platform that transforms daily developer logs into an aesthetic, professional portfolio. Target users are indie hackers and engineers. The core philosophy is **Narrative First** — prioritize free-form writing over rigid forms.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS (Noir theme — zinc-950/900 backgrounds with cyan/emerald accents)
- **Animations:** Framer Motion
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
- **Next.js 16 params:** `params` and `searchParams` are Promises — use `React.use(params)` in client components or `await params` in server components
- **Zustand selectors:** Avoid returning new objects/arrays from selectors; use `useMemo` or stable store getters to prevent infinite re-renders

## Project Structure

```text
app/                  # Next.js App Router pages
  editor/             # Private editor interface
  portfolio/          # Public portfolio pages
components/
  portfolio/          # Portfolio display components
  reactbits/          # ReactBits-inspired animated components
  ui/                 # Reusable UI components
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

## Design Rules

- **Noir Aesthetic:** Dark background (zinc-950/900), subtle noise texture, minimal color
- **Accents:** Cyan/teal only
- **Effects:** Spotlight hover effects on cards
- **Typography:** Monospace for dates and metadata
- **Layout:** Resume-style timeline

## UX Guidelines — Progressive Disclosure

Follow the **Context-Aware Progressive Disclosure** pattern (see `blueprint/design-patterns.md` for full details).

- **Anchored Minimalism:** Fix the top 3-5 actions in persistent, visible locations — recognition over recall. Limit initial choices (Hick's Law) and use whitespace/hierarchy to guide eye-flow.
- **Just-in-Time Reveal:** Show only what's needed for the current step. Hide advanced features behind explicit interactions (e.g., "Advanced Settings"). Use contextual hotspots over linear tours, and make empty states actionable.
- **Responsive Enabling:** Disable or hide controls until prerequisites are met to create natural flow and prevent errors.
- **Personalization:** Segment users at entry (beginner vs. power user). Use AI to filter irrelevant content. Design for monotasking to minimize context-switching overhead.
- **Friction Audit:** Validate with task completion rates, error rates, and user hesitation/backtracking patterns during testing.

## ReactBits Design System — Signature Moments

ReactBits components live in `components/reactbits/` and are used **systematically** as page-level "signature moments" — not random effects. Every use maps to one of these roles:

| Moment | Component | When to Use | Config |
|--------|-----------|-------------|--------|
| **Page Load** | `BlurText` | Every page title / main heading | `delay={80} animateBy="letters"` |
| **Scroll Reveal** | `ScrollReveal` | Content blocks, cards, timeline entries | `delay={index * 0.08}` stagger per item |
| **Brand Touch** | `DecryptedText` | "DevJournal" branding in sidebar | `characters="01" animateOn="hover"` |
| **CTA Shimmer** | `ShinyText` | Primary action buttons (cyan accent) | `speed={3}` |
| **Live Stats** | `CountUp` | Numeric counts (projects, entries) | `duration={1.5}` |
| **Status/Role** | `GradientText` | User role in portfolio bio sidebar | Cyan→emerald gradient |
| **Cards** | `SpotlightCard` | All interactive cards | Mouse-tracking spotlight |
| **Empty States** | `RotatingText` | Cycling tips/prompts when no content | `rotationInterval={3000}` |

### Rules

1. **One moment per element** — never stack two ReactBits animations on the same element
2. **Consistent config** — use the table values above; don't customize per-page
3. **All page headings** must use `BlurText` with semantic tags (`as="h1"|"h2"|...`) or be wrapped in real heading elements
4. **All primary CTAs** (cyan accent buttons) must use `ShinyText` inside
5. **All list/grid items** that appear on scroll must wrap in `ScrollReveal` with staggered delays
6. **CountUp** accompanies any visible count that appears in a subtitle or stat line
7. **Import from `framer-motion`** (not `motion/react`) to match project convention

## BLAST Framework

Follow for every new feature or refactor:

1. **Blueprint** — Define goals in `blueprint/` docs before coding
2. **Link** — Connect external services (Supabase, Vercel, etc.)
3. **Architect** — Build core logic first, reach deterministic state before styling
4. **Style** — Refine UI/UX, maintain Noir aesthetic
5. **Trigger** — Deploy and automate
