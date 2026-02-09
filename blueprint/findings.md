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
