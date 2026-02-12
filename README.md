# DevJournal

A premium web application for developers to document their build process and automatically generate a public portfolio.

## Features

- **Private Editor**: Document your development journey with structured entries
- **BLAST Framework**: Special planning template for feature development
- **Public Portfolio**: Automatically generated portfolio showcasing your build logs
- **Noir Aesthetic**: Premium editorial design with spotlight effects
- **Entry Categories**: Plan, Build, and Reflect with multiple subcategories
- **Export/Import**: Backup and restore your journal data as JSON files

## Tech Stack

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom noir theme
- **Animations**: Framer Motion, ReactBits-inspired components
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 24+ (LTS) installed in WSL environment
- pnpm (corepack enabled)

### Installation

```bash
# Enable corepack for pnpm
corepack enable
corepack prepare pnpm@latest --activate

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### 1. Configure Your Profile

1. Navigate to `/editor/settings`
2. Fill in your name, role, bio, and social links
3. These will appear on your public portfolio

### 2. Create a Project

1. Click "New Project" in the editor
2. Add project name, description, tech stack, and repository link
3. Set status (In Progress / Shipped)

### 3. Document Your Journey

Create entries in three categories:

**Plan**
- BLAST Framework (Blueprint, Link, Architect, Style, Trigger)
- Feature Concept

**Build**
- Technical Decision (Context, Decision, Rationale)
- Bug Fix (Root Cause, Solution, Prevention)
- Progress Update

**Reflect**
- Learning Note
- Retrospective (What went well, didn't work, to improve)
- General Note

### 4. Toggle Visibility

- Mark entries as public to display them on your portfolio
- Private entries remain in the editor only
- Portfolio at `/portfolio` shows only public entries

## Project Structure

```
devjournal/
├── app/                      # Next.js app router
│   ├── editor/              # Private editor interface
│   ├── portfolio/           # Public portfolio
│   └── globals.css          # Global styles
├── components/
│   ├── portfolio/           # Portfolio components
│   ├── reactbits/           # ReactBits-inspired components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── tailwind.config.ts       # Tailwind configuration
```

## Design Philosophy

DevJournal uses a "Noir" aesthetic inspired by Oscar Hernandez's editorial portfolio style:

- Dark background (#060010) with subtle noise texture
- Minimal color usage (cyan/teal accents)
- Spotlight hover effects on cards
- Monospace typography for dates and metadata
- Resume-style timeline layout



## ISR + Vercel Deployment Steps (with Supabase)

1. **Configure Vercel + Supabase integration envs (Preview + Production)**
   - Connect your existing Vercel project to Supabase in the Vercel Integrations dashboard.
   - Ensure these public read vars exist for ISR routes:
     - `NEXT_PUBLIC_SUPABASE_URL=https://sgadyniobmaxlbnnltkv.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon JWT>`
   - Optional compatibility aliases supported by server helpers:
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_PUBLISHABLE_KEY`
   - Keep privileged vars for admin/migrations only (not required for public portfolio reads):
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `POSTGRES_URL` / `POSTGRES_PRISMA_URL`
   - Set `REVALIDATE_SECRET=<strong random token>` for on-demand ISR invalidation.
   - Deploy region target: `ap-southeast-2`.

   > Security: never commit real Supabase/Postgres credentials to source control. If credentials were pasted/shared in plaintext, rotate **anon**, **service role**, **JWT secret**, and **database password** immediately.

2. **Supabase as source of truth**
   - Keep Zustand as editor-side cache only.
   - Use Supabase tables (`profiles`, `projects`, `entries`) for portfolio reads and ISR output.
   - Use single-user write/update policy with public read access for portfolio data.

3. **ISR strategy in Next.js**
   - Portfolio routes use `revalidate = 150` seconds.
   - Use on-demand revalidation endpoint at `POST /api/revalidate?secret=...`.
   - Trigger path/tag invalidation for entry updates and slug changes (invalidate old/new slug paths).

4. **Release flow**
   - Validate in Vercel Preview first (soak period).
   - Confirm cross-device consistency and ISR refresh behavior.
   - Promote to Production after verification.

## Future Enhancements

- Authentication (multi-user support)
- AI synthesis (generate case studies from entries)
- GitHub sync (auto-import commits)
- Social sharing (generate images for Twitter/LinkedIn)

## License

MIT

## Author

Built with DevJournal
