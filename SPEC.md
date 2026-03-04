# Traverse — Design & Specification

## Project Overview

**Problem:** Organizations with many interconnected systems struggle to understand which systems connect in which environments, and how business transactions flow across them. This knowledge lives in people's heads or scattered docs.

**Solution:** A visual topology map. Systems as rows, stages as columns, environments as interactive nodes, integration lines connecting them. Users can select a "flow" (business transaction) to highlight just the systems and integrations involved.

## Domain Relationships

- System has many Environments
- Stage has many Environments (an Environment belongs to exactly one Stage)
- Flow has many Systems (ordered — defines the traversal path)
- Flow has many Integrations
- Integration connects two Environments (from → to) and belongs to many Flows
- Integration is always cross-system (never within the same system)

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
