# Workspace

## Overview

pnpm workspace monorepo using TypeScript. The main product is **BasisPro** — a premium SAP Basis learning platform built with React + Vite.

## BasisPro Platform (`artifacts/basispro`)

### Architecture
- React + Vite + TypeScript + Tailwind CSS
- Left-sidebar dashboard with category-based navigation
- 12 content modules via `ModuleView` + `moduleRegistry`
- TCode Library (372 TCodes)
- Career section: Roadmap, Cloud Certifications, Interview Prep

### Key Data Files
- `src/data/moduleRegistry.ts` — maps nav IDs to module content
- `src/data/tcodesData.ts` — 372 SAP TCodes
- `src/data/examPack2026.ts` — 2026 Interview Pack (52 Scenario + 51 Killer = 103 questions)
- `src/components/InterviewPrep.tsx` — 303 questions (200 classic + 103 from 2026 pack)

### Feature Summary
- **Interview Prep**: Study Mode (browse) + Exam Mode (configure → quiz → results)
  - Exam mode: category select, question count, difficulty, optional timer, reveal/hide answer, self-grade, score summary with missed Q review
  - 20 total categories including "Scenario Questions 2026" and "Killer Interview Q&A"
- **Dashboard Overview**:
  - AI Assistant hero banner at TOP of overview
  - Dynamic KPIs from real data (allNavItems.length, moduleRegistry keys, 303 questions, 372 TCodes)
  - Live clock with timezone detection using `Intl.DateTimeFormat` (updates every second)
  - Weekly activity chart + module popularity pie chart

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
