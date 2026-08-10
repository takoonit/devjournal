# DevJournal

A private-first build journal that publishes selected entries to a public portfolio.

## Features

- **Private Editor**: Document your development journey with structured entries
- **BLAST Framework**: Special planning template for feature development
- **Confirmed Publishing**: Publish selected entries through a connected owner account
- **Press Proof Aesthetic**: Warm paper-and-ink editorial design, typeset like a printed journal
- **Entry Categories**: Feature, fix, refactor, design, and journal entries
- **Export/Import**: Move journal data in additive `.devjournal` files

## Tech Stack

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS over a CSS-variable token system ("Press Proof" light / "Midnight Ink" dark)
- **Typography**: Newsreader (everything written) + IBM Plex Mono (everything measured)
- **Animations**: Framer Motion, restrained block-level entrances
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **Package Manager**: Bun 1.3.14+

## Getting Started

### Prerequisites

- Node.js 24+ (LTS) installed in WSL environment
- Bun 1.3.14+

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### 1. Configure Your Profile

1. Open `/editor/settings`
2. Fill in your name, role, bio, and social links
3. Profile changes stay local until public work exists and a connected owner confirms the update

### 2. Create a Project

1. Click "New Project" in the editor
2. Add project name, description, tech stack, and repository link
3. Set status (In Progress / Shipped)

### 3. Document Your Journey

Choose the entry type that best fits the record: feature, fix, refactor, design, or journal.

### 4. Save or Publish

- `Save private` writes only to this browser
- `Publish entry` saves a private local copy first, then sends the entry through the authenticated owner route
- A failed publish stays private. A failed unpublish stays public until Supabase confirms the change
- `/portfolio` reads from Supabase and shows only projects with at least one confirmed public entry

## Project Structure

```
devjournal/
├── app/                      # Next.js app router
│   ├── editor/              # Private editor interface
│   ├── portfolio/           # Public portfolio
│   └── globals.css          # Global styles
├── components/
│   ├── portfolio/           # Portfolio components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── tailwind.config.ts       # Tailwind configuration
```

## Design Philosophy

DevJournal is set like a typeset publication through the "Press Proof" system:

- Warm paper surfaces with a dark "Midnight Ink" twin (`data-theme-mode="press|ink"`)
- Two typefaces: Newsreader serif for everything written, IBM Plex Mono for everything measured
- One accent: proofreader's red ink, used only to annotate (links, ticks, caret, one button per view)
- Structure from hairline rules and whitespace: ledger rows, margin-rail timeline, keyline sections
- Ink-stamp entry types (FT/FX/RF/DS/JN) instead of colored badges



## ISR + Vercel Deployment Steps (with Supabase)

1. **Configure Vercel and Supabase for Preview and Production**
   - Connect your existing Vercel project to Supabase in the Vercel Integrations dashboard.
   - Ensure these public read vars exist for ISR routes:
     - `NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon JWT>`
   - Optional compatibility aliases supported by server helpers:
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_PUBLISHABLE_KEY`
   - Runtime publishing uses the anonymous key plus the signed-in owner's access token. Do not add a service-role key to the app runtime.
   - Keep database credentials in Supabase or an admin-only migration environment.
   - Deploy region target: `ap-southeast-2`.

   > Security: never commit real Supabase/Postgres credentials to source control. If credentials were pasted/shared in plaintext, rotate **anon**, **service role**, **JWT secret**, and **database password** immediately.

2. **Apply the source-ID migration**
   - Apply `supabase/migrations/202608100001_publishing_source_ids.sql` to a preview project first.
   - Review every row returned by its read-only legacy preflight. Existing profiles require manual reconciliation. A single unclaimed project with the same slug can be adopted; ambiguous projects and legacy entries must be resolved before publishing.
   - `source_id` stores the browser-local record ID. Supabase UUID primary keys remain unchanged.

3. **Provision and connect the one owner**
   - Create the intended user through Supabase Auth, then copy its UUID from `auth.users`.
   - Insert that UUID through the Supabase SQL editor or an admin migration:

     ```sql
     insert into public.owner_settings (owner_id)
     values ('<YOUR_AUTH_USER_UUID>')
     on conflict (owner_id) do nothing;
     ```

   - The singleton index rejects a second owner. Signup order never grants publishing rights.
   - Open `/editor/settings`, expand Publishing, and request the email sign-in link. The screen shows whether the session is the configured owner.

4. **Public projection and cache invalidation**
   - Zustand and localStorage hold the private authoring state. Supabase is the server-readable public projection.
   - `POST /api/publishing` validates the action, verifies the bearer token, checks `owner_settings` through RLS, performs the mutation, and invalidates `/portfolio` plus affected project paths and tags.
   - The retired generic `/api/revalidate` endpoint and `REVALIDATE_SECRET` are no longer used.

5. **Release and rollback**
   - Validate in Vercel Preview first (soak period).
   - Confirm owner connection, cross-device reads, first publish, edit, last unpublish, delete, and cache refresh behavior.
   - Promote to Production after verification.
   - To stop writes immediately, remove the owner row through an admin connection. Local drafts remain available.
   - If the app must roll back, redeploy the previous version and keep the additive `source_id` columns and indexes in place. Export a `.devjournal` backup first. Do not drop columns or delete public rows during an emergency rollback.

## Future Enhancements

- Authentication (multi-user support)
- AI synthesis (generate case studies from entries)
- GitHub sync (auto-import commits)
- Social sharing (generate images for Twitter/LinkedIn)

## License

MIT

## Author

Built with DevJournal
