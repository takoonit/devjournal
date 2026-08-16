# AGENTS.md

Project guidance for agent-assisted development on DevJournal.

## Project Overview

DevJournal is a "Build in Public" platform that turns daily developer logs into a professional portfolio. It serves indie hackers and engineers. The core philosophy is **Narrative First**: prefer free-form writing over rigid forms.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **UI:** React 19 and TypeScript
- **Styling:** Tailwind CSS with a web-adapted Material 3 Expressive system. All colors, shapes, states, elevation, and motion flow through CSS variable tokens in `app/globals.css`.
- **Animations:** Framer Motion for block entrance plus CSS Material state and emphasized motion
- **State:** Zustand with localStorage persistence in `lib/store.ts`
- **Icons:** Lucide React with semantic icon choices
- **Package manager:** Bun 1.3.14+

## Commands

- `bun run dev`: start the Turbopack development server
- `bun run build`: run the production build and TypeScript checks
- `bun run lint`: run ESLint

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

## Design Rules: Material 3 Expressive

`DESIGN.md` is the design-intent contract. Material 3 Expressive governs the visual system; Narrative First governs product behavior.

- **Complete color roles:** use `--md-sys-color-*` roles for primary, secondary, tertiary, error, surface containers, outlines, inverse surfaces, and their on-colors. Existing Tailwind semantic aliases map to those roles. Never add a one-off palette class or hex value inside components.
- **Two schemes:** the persisted values remain `data-theme-mode="press|ink"` for backward compatibility, but the user-facing schemes are Light and Dark. Both schemes use the same role structure.
- **Expressive type:** Google Sans Flex is the only interface and reading family. Use weight, width, optical size, grade, and roundedness to distinguish roles. Display text may be bold and rounded; prose remains calmer and highly legible.
- **Contrasting shapes:** use the Material shape scale from extra-small through full. Cards use large or extra-large corners, controls use full corners, and selected or pressed controls may shift toward medium corners when the shape change clarifies state.
- **Attention with purpose:** reserve strong color, scale, and asymmetric containment for one or two focal moments per view. Editor landing, project identity, entry-type choice, and the current primary action may be expressive. Forms, settings details, publishing, and destructive flows stay familiar.
- **Material components:** reuse `.m3-button-filled`, `.m3-button-tonal`, `.m3-button-outlined`, `.m3-icon-button`, `.m3-card`, `.m3-hero`, `.m3-navigation-rail`, `.m3-mobile-navigation`, and `.m3-top-app-bar` before adding page-local styles.
- **Accessible states:** enabled, hover, focus, pressed, selected, disabled, success, and error states need consistent visual treatment. Keep visible focus, semantic names, redundant selected/error indicators, and a 44px minimum target through `.control-target`.
- **Motion physics:** motion may use short scale, shape, position, and elevation responses around meaningful actions. Keep text static, avoid loops, blur, glow, shimmer, or decorative spinning, and honor both `data-motion-level` and `prefers-reduced-motion`.
- **Composer parity:** the entry textarea and published prose use the same `text-prose` metrics and readable measure.
- **Adaptive scaffold:** compact screens use a top app bar and bottom navigation; expanded editor screens use the navigation rail. Use `.page-frame`, `.portfolio-shell`, and `.timeline-container` for responsive composition.
- **Unit policy:** use `rem` for scalable dimensions and spacing, `ch` for reading measure, and `clamp()` for fluid type and macro spacing. Use container queries when component width determines composition. Pixels remain limited to hairlines, focus outlines, optical transforms, shadows, scrollbars, and precision geometry.

## UX Guidelines: Progressive Disclosure

Follow the Context-Aware Progressive Disclosure pattern in `blueprint/design-patterns.md`.

- **Anchored minimalism:** keep the top three to five actions visible in stable locations. Limit initial choices and use whitespace and hierarchy to guide attention.
- **Just-in-time reveal:** show what the current step needs. Put advanced options behind explicit controls and keep empty states actionable.
- **Responsive enabling:** disable or hide controls until their prerequisites are met.
- **Personalization:** distinguish beginner and power-user needs where it reduces irrelevant choices. AI assistance stays optional.
- **Friction audit:** check task completion, errors, hesitation, and backtracking during testing.

## Signature Components

The old ReactBits effects (`BlurText`, `ShinyText`, `DecryptedText`, `GradientText`, `RotatingText`, `SpotlightCard`, and `ScrollReveal`) are retired. Do not reintroduce them or equivalent effects. Material expression comes from hierarchy, roles, state, shape, and motion.

| Moment | Component or utility | Use |
|--------|----------------------|-----|
| Entrance | `Reveal` | Timeline and list items settling in; pass `index` for stagger |
| Entry types and statuses | `TypeStamp` / `StatusStamp` | Material chips with semantic status |
| Timeline | `TimelineEntry` | Contained entry cards with readable metadata |
| Focal surface | `.m3-hero` | One primary identity or next-action moment |
| Containment | `.m3-card` / `.sheet` | Cards, composer, modals, and toasts |
| Actions | `.m3-button-*` / `.m3-icon-button` | Filled, tonal, outlined, and icon actions |
| Navigation | `.m3-navigation-rail` / `.m3-mobile-navigation` | Expanded and compact editor scaffolds |
| Text links | `.link-ink` | Inline and metadata links using the primary role |
| Live count | `CountUp` | No more than once per view |

Additional rules:

1. Use plain semantic `h1` through `h3` elements with `text-display`, `text-title`, or `text-subtitle`. Do not wrap headings in animation components.
2. Use one prominent filled or extended primary action per view. Supporting actions are tonal, outlined, or icon-only.
3. Wrap list items that enter on scroll with `Reveal` and pass `index`. Do not recreate entrance motion inside a page.
4. Import from `framer-motion`, not `motion/react`.

## BLAST Framework

Use BLAST for every feature and refactor.

1. **Blueprint:** establish the goal and product fit first. Maintain `blueprint/constitution.md`, `blueprint/task_plan.md`, and `blueprint/findings.md`.
2. **Link:** connect external systems such as MCPs, Supabase, and Vercel within the requested scope.
3. **Architect:** build core behavior and data processing first. Reach a deterministic state before styling.
4. **Style:** refine the UI through live browser review, `DESIGN.md`, and the Material 3 Expressive rules in this file.
5. **Trigger:** validate deployment and automation concerns for Vercel, Modal, and GitHub Actions when the task includes them.
