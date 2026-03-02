# UI Coding Standards

## Component Library

**ONLY shadcn/ui components are permitted in this project.**

- Do NOT create custom UI components under any circumstances
- Do NOT use raw HTML elements styled with Tailwind when a shadcn/ui component exists for the purpose
- Do NOT install or use any other component library (e.g. Radix primitives directly, Headless UI, MUI, Chakra, etc.)
- All UI must be composed exclusively from shadcn/ui components

When a shadcn/ui component does not exist for a specific need, raise it for discussion before building anything custom.

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `src/components/ui/`. Do not modify these generated files.

## Date Formatting

All dates must be formatted using **date-fns**. No other date library should be used.

### Required Format

Dates are displayed with an ordinal day suffix, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `do MMM yyyy` format token from date-fns:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

This must be used consistently everywhere a date is rendered in the UI.
