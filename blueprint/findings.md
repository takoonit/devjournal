# 🔍 Technical Findings: findings.md

## 🧱 Architecture & State
### DevJournal Import Safety
- **Issue:** Importing malformed or partial `.devjournal` payloads can throw runtime errors or report misleading success counts.
- **Fix:** Validate payload shape before merging, normalize optional arrays, avoid in-place Zustand mutations, and report success based on valid imported projects only.

### Zustand Infinite Re-renders
- **Issue:** Returning new objects/arrays from selectors inside components (e.g., `.filter()`) triggers re-renders on every state change.
- **Fix:** Use `useMemo` in components or move transformation logic to specialized stable getters in the store.

### Next.js 16 Async Params
- **Issue:** `params` and `searchParams` are now Promises.
- **Fix:** Unwrap using `React.use(params)` in client components or `await params` in server components.

### Next.js 16 Lint Command Change
- **Issue:** `next lint` is no longer available in Next.js 16 CLI and can fail by treating `lint` as a directory argument.
- **Fix:** Migrated to ESLint flat config (`eslint.config.mjs`) and run lint via `eslint .` in `package.json`.

## 🎨 Styling & UX
### Semantic Iconography
- **Insight:** Generic arrow icons (Upload/Download) don't clearly represent "Project Portability".
- **Action:** Switched to `FolderInput` and `FolderOutput` for clearer intent.

### Unique React Keys
- **Issue:** Using string values as keys in arrays with potential duplicates (e.g., Tech Stack) causes React errors.
- **Fix:** Use `${value}-${index}` for keys and deduplicate arrays using `new Set()` at the input level.

## 🧠 Product & Philosophy
### Narrative Pivot
- **Insight:** Strict forms (e.g., "Reasoning", "Impact") create friction and feel like "filling out tax forms," discouraging daily use.
- **Action:** Shifted to a **Narrative First** approach. The core unit is now a free-form Markdown story. Subcategories (e.g., "Decision Log") act as **Prompts** to unblock writing, not mandatory fields.

### Reddit Wisdom (r/ExperiencedDevs)
- **Insight:** Experienced developers use journals for widely different things: "Rubber Ducking" (debugging), "Context Switching" (saving state), and "Brag Docs" (milestones).
- **Action:** Formalized these behaviors into the new subcategory prompts (`debugging`, `context-switch`, `milestone`).

### Persisted UI Preferences with Backward Compatibility
- **Issue:** Existing users can have persisted Zustand payloads with no UI preference keys, causing undefined values when new global behavior flags are introduced.
- **Fix:** Added typed defaults plus a `persist` migration that merges stored data with `defaultUiPreferences`, ensuring safe values after upgrade.

### Browser Tool Stability in This Environment
- **Issue:** `mcp__browser_tools__run_playwright_script` can fail when launching Chromium in this container with a SIGSEGV before navigation.
- **Fix:** Use Playwright Firefox as a fallback engine for screenshot capture. No app code or deployment environment change is required for this specific failure mode.
### Tokenized Theme Foundation
- **Insight:** Page-level redesigns become inconsistent when animation timing, color ramps, and interaction intensity are configured ad hoc.
- **Action:** Added semantic token groups (`color`, `motion`, `spacing`), mapped theme variables (`noir`, `calm-focus`) in global CSS, and introduced wrapper components (`FocusHeading`, `RewardLabel`, `InteractiveSurface`) so ReactBits usage stays system-aware.

### Phased Redesign Delivery Model
- **Insight:** Large UX overhauls ship more reliably when broken into phase-gated deliverables tied to measurable outcomes.
- **Action:** Adopted a five-phase execution plan (Foundation → Feedback → Flow → Wayfinding/Capture → Polish/QA) with explicit acceptance criteria for clicks-to-start, abandonment, persistence, and component consistency.

### Phase 1 Execution: Theme + Preference Hardening
- **Issue:** Theme and density preferences were only partially mapped to document-level attributes, leaving inconsistent token application paths and stale body-level overrides.
- **Fix:** Consolidated theme/density behavior around root dataset attributes, introduced active spacing aliases (`--space-stack-*`), expanded motion preference range to include `expressive`, and removed redundant class toggles/body overrides so token-driven styling remains deterministic.

### Phase 1 Motion Preference Calibration
- **Issue:** Adding an `expressive` preference without calibrating downstream animation primitives makes it behave like `standard`, reducing user-perceived control.
- **Fix:** Tuned ReactBits wrappers (`BlurText`, `ShinyText`, `GradientText`, `DecryptedText`, `RotatingText`, `CountUp`, `SpotlightCard`) so `reduced`, `standard`, and `expressive` each have distinct timing/intensity behavior.


### Phase 2 Feedback System Alignment
- **Issue:** Feedback surfaces were functional but emotionally flat, and reward intensity preferences were not shaping tone/animation outcomes.
- **Fix:** Redesigned toast presentation, introduced a supportive copy module, and wired feedback intensity + motion behavior to persisted UI preferences so responses feel consistent and user-controlled.


### Phase 3 Flow Friction Reduction
- **Issue:** Single-screen entry forms increased cognitive load and raised abandonment risk when users were interrupted mid-entry.
- **Fix:** Reworked entry creation into a 3-step flow (track selection → writing → review), added visible progress, and introduced persistent draft save-and-return behavior tied to project-scoped local storage.


### Phase 4 Wayfinding + Capture Enablement
- **Issue:** Navigation context was shallow across editor/portfolio routes, and idea capture required entering full entry flows immediately, increasing drop-off risk.
- **Fix:** Added shared breadcrumbs across main surfaces, introduced an editor inbox quick-capture model in store state, and added capture-to-entry conversion that preloads the new-entry flow for structured follow-through.


### Phase 5 Polish + QA Pass
- **Issue:** Wayfinding links and empty-state surfaces had minor contrast/focus inconsistencies, and motion preference tiers needed CSS-level timing alignment for shared transitions.
- **Fix:** Improved breadcrumb/link focus affordances, raised contrast on empty states, added motion-duration variable tuning for reduced/standard/expressive modes, and aligned editor/portfolio surface treatments for consistency.


### ISR Blocker: Client-only Portfolio Data
- **Issue:** Portfolio pages currently depend on Zustand `persist` state in localStorage, which cannot be accessed during server rendering/revalidation.
- **Fix:** Move published portfolio records to Supabase and use server-side queries in App Router routes so ISR can generate cacheable HTML and revalidate predictably on Vercel.


### ISR Implementation Strategy (Supabase + On-demand Revalidation)
- **Decision:** Use Supabase as server-readable source of truth and keep Zustand local persistence as editor UX cache only.
- **Operational Choice:** Use `revalidate = 150` for portfolio pages, with on-demand `revalidatePath`/`revalidateTag` for entry updates and slug changes to avoid stale public pages.


### Vercel Supabase Integration Hardening
- **Issue:** Mixed environment variable naming across Vercel/Supabase integrations can cause brittle runtime config, and shared plaintext credentials create avoidable security risk.
- **Fix:** Standardized public-read key precedence around `NEXT_PUBLIC_SUPABASE_ANON_KEY` + publishable aliases, documented Vercel integration mapping, and added explicit key-rotation guidance for any leaked credentials.

### Semantic Entry Type Migration (feature/fix/refactor/design/journal)
- **Issue:** Legacy entry model coupled authoring to visual/category-specific templates, increasing cognitive load and hindering fast journaling.
- **Fix:** Added semantic `entry_type` + `content` pipeline (types, Supabase row mapping, schema + migration SQL), with legacy fallback inference for existing records.

### No-Decision Entry Form + Progressive Disclosure
- **Issue:** Multi-step category/subcategory templating forced unnecessary decisions before writing.
- **Fix:** Replaced new/edit forms with defaulted entry-type segmented controls plus direct title/body inputs and a collapsed “More Details” section for optional metadata.

### Timeline Semantics + Filtering
- **Issue:** Entry visual treatment was tied to mixed category/subcategory badges and lacked straightforward type filtering.
- **Fix:** Rebuilt timeline card/node styling around fixed entry-type icon/color semantics and added client-side filter chips in portfolio project timelines.
