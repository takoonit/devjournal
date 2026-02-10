# CLAUDE.md

Project guidelines for AI-assisted development on DevJournal.

## Project Overview

DevJournal is a "Build in Public" platform that transforms daily developer logs into an aesthetic, professional portfolio. Target users are indie hackers and engineers. The core philosophy is **Narrative First** — prioritize free-form writing over rigid forms.

## Tech Stack

- **Framework:** Next.js 16 with App Router and Turbopack
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS (Noir theme — zinc-950/900 backgrounds, cyan/emerald accents)
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

```
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
```

## Data Model

Core entry interface:

```typescript
interface Entry {
  id: string;
  projectId: string;
  category: "plan-change" | "build" | "reflect";
  title: string;
  templateData: {
    subcategory: string;
    content: string;       // Markdown
  };
  isPublic: boolean;
  createdAt: string;       // ISO
  updatedAt: string;       // ISO
}
```

## Data Portability

- Export format: `.devjournal` (JSON internally)
- Import types: `global` (full backup), `selective` (multiple projects), `project` (single)
- Imports are **additive** and non-destructive — duplicate names get a counter suffix, new IDs are generated to prevent collisions

## Design Rules

- **Noir Aesthetic:** Dark background (#060010), subtle noise texture, minimal color
- **Accents:** Cyan/teal only
- **Effects:** Spotlight hover effects on cards
- **Typography:** Monospace for dates and metadata
- **Layout:** Resume-style timeline

## BLAST Framework

Follow for every new feature or refactor:

1. **Blueprint** — Define goals in `blueprint/` docs before coding
2. **Link** — Connect external services (Supabase, Vercel, etc.)
3. **Architect** — Build core logic first, reach deterministic state before styling
4. **Style** — Refine UI/UX, maintain Noir aesthetic
5. **Trigger** — Deploy and automate
