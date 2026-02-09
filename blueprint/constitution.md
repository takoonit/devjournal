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
  type: "plan" | "build" | "reflect";
  content: string; // Markdown
  isPublic: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

## 🔗 Link Layer (Integrations)
- **Framework:** Next.js 16 (Turbopack)
- **State:** Zustand + Persistence
- **Styling:** Tailwind CSS + Lucide React
- **Hosting:** Vercel (Planned)
