# 🤖 AGENTS.md

Guidelines for agentic coding in DevJournal.

## 🚀 The BLAST Framework
Follow these steps for every new feature or refactor:
1.  **B**lueprint: Establish project identity and mission. Maintain `blueprint/constitution.md` (Constitution), `blueprint/task_plan.md` (Current Goals), and `blueprint/findings.md` (Research Logs).
2.  **L**ink: Connect the application to the outside world (MCPs, Supabase, Vercel).
3.  **A**rchitect: Build core functionality and data processing logic first. Reach "deterministic" state before styling.
4.  **S**tyle: Refine UI/UX. Use "UI Sniping" from premium sources and maintain the Noir Aesthetic.
5.  **T**rigger: Deployment and automation (Vercel, Modal, GitHub Actions).
## 💻 Tech Standards
- **Imports:** Absolute imports with `@/`.
- **Naming:** kebab-case for files, PascalCase for components.
- **State:** Zustand persistence pattern in `lib/store.ts`.
- **Icons:** Use Lucide React; prefer semantic icons.

## 🛠️ Commands
- `pnpm dev` - Start Turbopack dev server.
- `pnpm build` - Run production build and TS checks.
- `pnpm lint` - Check code quality.