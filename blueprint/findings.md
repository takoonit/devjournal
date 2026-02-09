# 🔍 Technical Findings: findings.md

## 🧱 Architecture & State
### Zustand Infinite Re-renders
- **Issue:** Returning new objects/arrays from selectors inside components (e.g., `.filter()`) triggers re-renders on every state change.
- **Fix:** Use `useMemo` in components or move transformation logic to specialized stable getters in the store.

### Next.js 16 Async Params
- **Issue:** `params` and `searchParams` are now Promises.
- **Fix:** Unwrap using `React.use(params)` in client components or `await params` in server components.

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
