# Traverse

A web application for visualizing system-environment topology and business transaction flows.

See [SPEC.md](SPEC.md) for design details, color system, interactions, API design, and build order.

## Core Terminology

Use these terms consistently in code, UI, and variable names:

- **System** — A software application or service (e.g., "Policy Admin", "Rating Engine")
- **Environment** — A deployed instance of a system (e.g., DEV, TEST, UAT, PROD)
- **Stage** — A lifecycle grouping of environments (e.g., Dev Stage contains DEV envs, Test Stage contains TEST and UAT envs)
- **Flow** — A business transaction path across systems (e.g., "Quoting Homeowners" traverses Policy Admin → Rating Engine → Doc Generator)
- **Integration** — A directional link between two environments across systems (e.g., Policy Admin DEV → Rating Engine TEST)

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Visualization:** SVG for integration lines, HTML/CSS for the grid

## Project Structure

```
traverse/
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

## Branching

- Never commit directly to `main`. If on `main`, create a feature branch before making changes.

## Code Style

- Functional components only, no classes
- Named exports for components, default export for pages
- Colocate types with their component when specific, shared types in `lib/types.ts`
- Prefer `const` over `let`, never `var`
- Destructure props in function signature
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Comments only for "why", not "what"
