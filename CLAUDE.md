# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured yet.

## Architecture

This is a **Next.js App Router** project using TypeScript and Tailwind CSS v4.

- `src/app/` — All routes and layouts using file-based routing
- `src/app/layout.tsx` — Root layout (Geist fonts, metadata, HTML shell)
- `src/app/page.tsx` — Home page (`/`)
- `src/app/globals.css` — Global styles; uses Tailwind v4 `@import` syntax and CSS custom properties for light/dark theming

Path alias `@/*` maps to `src/*`.

The project is a fresh Create Next App scaffold — no database, auth, or API routes exist yet.
