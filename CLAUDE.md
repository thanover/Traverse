# Traverse

Traverse is a web application for visualizing system-environment topology and business transaction flows. It maps how software systems connect across deployment stages and traces the path of business transactions through those systems.

## Project Overview

**Problem:** Organizations with many interconnected systems struggle to understand which systems connect in which environments, and how business transactions flow across them. This knowledge lives in people's heads or scattered docs.

**Solution:** A visual topology map. Systems as rows, stages as columns, environments as interactive nodes, integration lines connecting them. Users can select a "flow" (business transaction) to highlight just the systems and integrations involved.

## Core Terminology

These terms are the domain language. Use them consistently in code, UI, docs, and variable names:

- **System** — A software application or service (e.g., "Policy Admin", "Rating Engine")
- **Environment** — A deployed instance of a system (e.g., DEV, TEST, UAT, PROD)
- **Stage** — A lifecycle grouping of environments (e.g., Dev Stage contains DEV envs, Test Stage contains TEST and UAT envs)
- **Flow** — A business transaction path across systems (e.g., "Quoting Homeowners" traverses Policy Admin → Rating Engine → Doc Generator)
- **Integration** — A directional link between two environments across systems (e.g., Policy Admin DEV → Rating Engine TEST)

## Relationships

- System has many Environments
- Stage has many Environments (an Environment belongs to exactly one Stage)
- Flow has many Systems (ordered — defines the traversal path)
- Flow has many Integrations
- Integration connects two Environments (from → to) and belongs to many Flows
- Integration is always cross-system (never within the same system)

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Visualization:** SVG for integration lines, HTML/CSS for the grid
- **Auth:** NextAuth.js (defer — build without auth first)
- **Deployment:** Vercel (target)

## Project Structure

```
traverse/
├── CLAUDE.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main map view
│   │   └── api/                  # API routes
│   ├── components/
│   │   ├── map/                  # Grid, rows, env nodes, SVG layer
│   │   ├── sidebar/              # Flow list, flow path
│   │   ├── detail/               # Detail panel
│   │   └── ui/                   # Shared primitives
│   ├── lib/
│   │   ├── db.ts                 # Prisma client
│   │   └── types.ts              # Shared TypeScript types
│   └── hooks/                    # Custom React hooks
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Design Principles

1. **Dark mode only** — Deep navy-black palette (`#0f1117` bg, `#161921` surfaces, `#252836` borders)
2. **Minimal UI** — No legends, no glossaries, no status badges. The map speaks for itself.
3. **Information density** — Show as much topology as possible without scrolling. Keep nodes compact.
4. **Progressive disclosure** — Click an environment to see its detail panel. Select a flow to filter the map.
5. **DM Sans + DM Mono** — DM Sans for UI text, DM Mono for technical labels (env names, system subtitles)

## Color System

### Stage Colors
- Dev: `#818cf8` (indigo)
- Test: `#38bdf8` (sky blue)
- MO: `#fbbf24` (amber)
- Prod: `#34d399` (emerald)

### Flow Colors (each flow gets a unique color)
Assigned from a palette. Use stage colors as a starting point for flow colors.

### Surface Colors
- Background: `#0f1117`
- Surface: `#161921`
- Surface Alt: `#1c1f2b`
- Border: `#252836`
- Border Light: `#1e2130`
- Text: `#e2e8f0`
- Text Muted: `#64748b`
- Text Dim: `#3e4459`

## Key Interactions

1. **Select flow** → Dims non-participating systems to 15% opacity. Integration lines for active flow become solid and colored. Non-flow integrations become faint dashed lines. Numbered badges appear on participating systems.
2. **Click environment node** → Detail panel slides in below the map showing: environment identity, stage, upstream/downstream integrations, and which flows pass through it.
3. **Hover integration line** → Highlights both connected environment nodes. Other lines dim.
4. **Click flow badge in detail panel** → Switches the active flow filter.

## API Design

RESTful JSON API under `/api/`:

```
GET    /api/systems          — List all systems with their environments
GET    /api/flows            — List all flows with their system paths
GET    /api/integrations     — List all integrations (optionally filter by flow)
POST   /api/systems          — Create a system
POST   /api/systems/:id/envs — Add an environment to a system
POST   /api/flows            — Create a flow
POST   /api/integrations     — Create an integration
DELETE /api/systems/:id      — Delete a system
```

## Build Order

Phase 1 — Static map with seed data:
1. Next.js project setup with Tailwind, TypeScript, DM Sans/Mono fonts
2. Prisma schema + seed script with sample insurance domain data
3. Main page layout: header, sidebar, map area
4. Grid component: stage columns × system rows
5. Environment node components (clickable buttons)
6. SVG integration layer with curved bezier paths
7. Flow sidebar with flow list and path visualization
8. Flow filtering (dim/highlight logic)
9. Detail panel (environment info, integrations, flows)

Phase 2 — CRUD:
10. API routes for systems, environments, flows, integrations
11. Add/edit/delete UI for systems and environments
12. Flow builder UI
13. Integration drawing (click env A, click env B to create)

Phase 3 — Polish:
14. Animations and transitions
15. Keyboard navigation
16. Search/filter
17. Export (SVG/PNG of current view)

## Code Style

- Functional components only, no classes
- Named exports for components, default export for pages
- Colocate types with their component when specific, shared types in `lib/types.ts`
- Prefer `const` over `let`, never `var`
- Destructure props in function signature
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Comments only for "why", not "what"
