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
