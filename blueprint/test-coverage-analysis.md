# Test Coverage Analysis

> Generated 2026-02-13 — baseline audit of DevJournal test infrastructure and coverage gaps.

## Current State

**Test coverage: 0%.** The codebase has no test files, no test framework configured, no testing dependencies, and no `test` script in `package.json`. The only quality gate is `pnpm lint` (ESLint) and `pnpm build` (TypeScript type-checking).

### What exists

| Check          | Tool       | Catches                        |
|----------------|------------|--------------------------------|
| `pnpm lint`    | ESLint     | Code style, unused vars        |
| `pnpm build`   | TypeScript | Type errors, missing imports   |

### What's missing

- Unit tests for pure functions
- Integration tests for Zustand store logic
- Component render/interaction tests
- API route tests
- Data mapper tests
- Import/export round-trip tests

---

## Recommended Testing Framework

**Vitest + React Testing Library** is the best fit for this stack:

- Vitest is native to the Vite/Turbopack ecosystem, fast, and has first-class TypeScript/ESM support
- React Testing Library covers component rendering with `@testing-library/react`
- `jsdom` or `happy-dom` as the test environment for DOM APIs

### Proposed `package.json` additions

```json
{
  "devDependencies": {
    "vitest": "^3.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "happy-dom": "^17.x"
  },
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Priority Areas for Test Coverage

Ordered by risk and impact — highest priority first.

---

### P0: `lib/store.ts` — Zustand Store (403 LOC)

**Risk: High.** This is the central nervous system of the app. Every user action flows through it, and data loss bugs here are catastrophic.

#### What to test

| Area | Functions | Why |
|------|-----------|-----|
| **Project CRUD** | `addProject`, `updateProject`, `deleteProject`, `getProjectById`, `getProjectBySlug` | Core data operations; `deleteProject` also cascades to entries |
| **Entry CRUD** | `addEntry`, `updateEntry`, `deleteEntry`, `getEntriesByProjectId`, `getPublicEntriesByProjectId` | Entry filtering and sort-order (newest-first) are logic-heavy |
| **Public visibility** | `getPublicProjects` | Derived state — only projects with ≥1 public entry should appear |
| **Inbox capture** | `addInboxCapture`, `consumeInboxCapture`, `peekInboxCapture`, `deleteInboxCapture` | `consumeInboxCapture` has side effects (removes + returns item) |
| **Import/export** | `importDevJournal` | Most complex function in the codebase (~120 LOC); handles version validation, type detection, collision renaming, ID remapping, UI preference merging |
| **State migration** | `migrate` (persist middleware) | Version 3 migration must preserve `uiPreferences` defaults and `inboxCaptures` |

#### Example high-value test cases for `importDevJournal`

1. Rejects files with `version !== "1.0"`
2. Rejects global imports missing `projects` or `entries` arrays
3. Rejects files with unknown `type`
4. Renames duplicate project names with `(1)`, `(2)` suffixes
5. Remaps entry `projectId` to newly generated project IDs
6. Skips entries whose `projectId` doesn't match any imported project
7. Merges `uiPreferences` from global imports (falls back to defaults for missing keys)
8. Does not overwrite existing projects or entries (additive-only)
9. Handles malformed JSON gracefully
10. Reports correct count in success message

---

### P0: `lib/utils.ts` — Pure Utility Functions (69 LOC)

**Risk: Medium. Effort: Very low.** These are pure functions with no dependencies on React or DOM — the easiest wins.

| Function | Test cases |
|----------|------------|
| `generateSlug` | Basic text → `"my-project"`, special characters stripped, leading/trailing hyphens removed, unicode handling |
| `formatDate` | Default format, custom format string, string input vs Date input |
| `formatTimelineDate` | Returns `yyyy.MM.dd` format consistently |
| `groupEntriesByYearMonth` | Groups correctly across year boundaries, handles empty array, handles single entry |
| `generateId` | Returns string, is unique across calls, matches expected format |
| `cn` | Merges classes, resolves Tailwind conflicts (e.g., `p-2` vs `p-4`) |

---

### P1: `lib/entry-types.ts` — Entry Type Resolution (52 LOC)

**Risk: Medium.** This module handles backward compatibility between the legacy `category/subcategory` system and the new `entryType` field. Incorrect inference silently corrupts portfolio display.

| Function | Test cases |
|----------|------------|
| `inferEntryTypeFromLegacy` | All 10 subcategory → entryType mappings, category-only fallbacks (`build` → `feature`, `reflect` → `journal`), default case → `journal` |
| `extractLegacySubcategory` | Extracts from valid templateData, returns `undefined` for null/non-object/missing subcategory |
| `getEntryType` | Prefers `entry.entryType` when present, falls back to legacy inference when absent |
| `getEntryContent` | Returns `entry.content` when present, extracts from flat `templateData` fields, extracts from nested `templateData` objects, skips `subcategory` key, handles empty/null gracefully |

---

### P1: `lib/entry-templates.ts` — Template Data Builder (168 LOC)

**Risk: Medium.** `buildEntryTemplateData` constructs structured data from form inputs. Errors here cause silent data loss — fields get saved as empty strings.

| Function | Test cases |
|----------|------------|
| `formatSubcategoryLabel` | `"decision-log"` → `"Decision Log"`, `"til-snippet"` → `"Til Snippet"` |
| `buildEntryTemplateData` | All 10 category+subcategory combinations produce correct shape; missing `formData` fields default to `""` |

---

### P1: `lib/supabase/types.ts` — Data Mappers (98 LOC)

**Risk: Medium.** These mappers sit at the boundary between the database (snake_case) and the application (camelCase). A mapping bug means the portfolio silently renders wrong data.

| Function | Test cases |
|----------|------------|
| `mapProfileRowToUser` | Maps all fields correctly, handles `null` profile → returns defaults, handles `null` social link fields → `""` |
| `mapProjectRowToProject` | Maps all fields, `null` repository_link → `undefined` |
| `mapEntryRowToEntry` | Maps all fields, `null` entry_type → `"journal"`, `null` content → `""`, `null` template_data → `undefined`, `null` category → `undefined` |

---

### P1: `lib/supportive-copy.ts` — Toast Copy Resolution (87 LOC)

**Risk: Low. Effort: Very low.** Pure function with clear input/output — good for confidence.

| Function | Test cases |
|----------|------------|
| `resolveSupportiveToastCopy` | `rewardIntensity: "off"` returns plain titles (`"Error"`, `"Success"`, `"Update"`); `"subtle"` returns supportive titles; `"full"` returns full titles + emphasis on success; known `copyKey` returns keyed message; unknown/generic falls back to `fallbackMessage` |

---

### P2: Component Tests

Component tests are more expensive to write and maintain. Focus on components with non-trivial logic first.

| Component | What to test | Why |
|-----------|-------------|-----|
| `components/settings/export-import-section.tsx` (182 LOC) | File upload triggers import, export buttons trigger download, error states render | Most complex component; import flow is user-facing and error-prone |
| `components/editor/edit-project-modal.tsx` (159 LOC) | Form validation, submit creates/updates project, field population in edit mode | Data entry point — bugs here corrupt state |
| `components/portfolio/entry-timeline.tsx` (68 LOC) | Renders entries grouped by date, handles empty state | Public-facing display logic |
| `components/portfolio/project-card.tsx` (65 LOC) | Renders project data, links correctly, shows tech stack | Portfolio presentation |

### P3: API Route Tests

| Route | What to test |
|-------|-------------|
| `app/api/revalidate/route.ts` | Rejects missing/wrong secret, revalidates correct tags, returns proper status codes |

---

## Suggested Test File Structure

```
__tests__/
  lib/
    utils.test.ts
    store.test.ts
    entry-types.test.ts
    entry-templates.test.ts
    supportive-copy.test.ts
    supabase/
      types.test.ts
  components/
    settings/
      export-import-section.test.tsx
    editor/
      edit-project-modal.test.tsx
    portfolio/
      entry-timeline.test.tsx
      project-card.test.tsx
  app/
    api/
      revalidate.test.ts
vitest.config.ts
```

---

## Implementation Roadmap

### Phase 1 — Foundation + Pure Functions
- Install Vitest + happy-dom
- Configure `vitest.config.ts` with path aliases
- Write tests for `lib/utils.ts` (6 functions, ~20 test cases)
- Write tests for `lib/entry-types.ts` (4 functions, ~25 test cases)
- Write tests for `lib/entry-templates.ts` (2 functions, ~15 test cases)
- Write tests for `lib/supportive-copy.ts` (1 function, ~10 test cases)
- Write tests for `lib/supabase/types.ts` (3 mappers, ~15 test cases)
- **Expected coverage gain: all `lib/` pure functions**

### Phase 2 — Store Integration Tests
- Write tests for Zustand store CRUD operations (~30 test cases)
- Write tests for import/export flow (~15 test cases)
- Write tests for state migration logic (~5 test cases)
- **Expected coverage gain: full `lib/store.ts`**

### Phase 3 — Component + API Tests
- Add React Testing Library + user-event
- Write component tests for editor and portfolio components
- Write API route tests for revalidation endpoint
- **Expected coverage gain: critical UI paths**

---

## Summary

| Priority | Module | LOC | Test cases (est.) | Effort |
|----------|--------|-----|-------------------|--------|
| P0 | `lib/store.ts` | 403 | ~50 | Medium |
| P0 | `lib/utils.ts` | 69 | ~20 | Low |
| P1 | `lib/entry-types.ts` | 52 | ~25 | Low |
| P1 | `lib/entry-templates.ts` | 168 | ~15 | Low |
| P1 | `lib/supabase/types.ts` | 98 | ~15 | Low |
| P1 | `lib/supportive-copy.ts` | 87 | ~10 | Low |
| P2 | Component tests | ~530 | ~30 | Medium |
| P3 | API route tests | ~30 | ~5 | Low |
| **Total** | | **~1,437** | **~170** | |

Phase 1 alone (pure functions + mappers, ~85 test cases) would cover the most bug-prone code paths with minimal setup effort.
