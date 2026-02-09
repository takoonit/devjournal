# 🟦 Project Constitution: constitution.md

## 🌟 North Star
**Mission:** Empower developers to "Build in Public" with zero friction.
**Outcome:** A deterministic, read-only portfolio generated automatically from daily build logs—Plan, Build, Reflect.

## 📜 System Rules
- **Noir Aesthetic:** Pure dark mode $(\text{zinc-950/900})$. Cyan/Emerald accents. Spotlight effects.
- **Data First:** Define JSON schemas before any feature implementation.
- **Deterministic:** Local-first state (Zustand) with exportable portability.
- **Semantic UI:** Icons must map to actions (e.g., `FolderInput` for Project Import).

## 📊 Core Schemas

### Project
```typescript
interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  repositoryLink?: string;
  status: "in-progress" | "shipped";
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

### Entry
```typescript
interface Entry {
  id: string;
  projectId: string;
  category: "plan" | "build" | "reflect";
  title: string;
  templateData: {
    subcategory: string;
    // ... specialized fields for subcategories (blastFramework, technicalDecision, etc.)
  };
  isPublic: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

## 📂 Data Portability (.devjournal)

DevJournal uses a unified, JSON-based `.devjournal` format for all data transfers.

### 1. File Extension
- **Format:** `.devjournal` (Pure JSON internally)
- **Scope:** Can contain a full system backup or a selective project bundle.

### 2. Smart Import Logic
The system automatically detects the content type based on the `type` field:
- `global`: Full backup (User + Projects + Entries).
- `selective`: Multiple chosen projects.
- `project`: Legacy single project export.

### 3. Non-Destructive Merging
All imports are **additive**.
- **Conflict Resolution:** If a project name exists, the system appends a counter (e.g., `My Project (1)`) Windows-style.
- **ID Management:** New IDs are generated for all imported items to prevent collisions while preserving relationships.

