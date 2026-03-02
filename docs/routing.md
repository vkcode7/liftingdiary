# Routing

## Route Structure

All application routes live under `/dashboard`. There is no standalone feature routing outside of this prefix.

- `/` — Public landing/home page
- `/dashboard` — Protected root dashboard (requires authentication)
- `/dashboard/**` — All sub-routes are also protected

## Protected Routes

The `/dashboard` route and all sub-routes are protected and only accessible by authenticated users. Route protection is enforced via Next.js middleware using Clerk.

**Do not** rely on page-level redirects or component-level auth checks as the primary protection mechanism. Middleware is the single enforcement point.

## Middleware

Route protection is implemented in `middleware.ts` at the project root using `clerkMiddleware()` from `@clerk/nextjs/server`.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
```

- Only `/` is explicitly listed as a public route.
- Every other route (including all `/dashboard/**` routes) is protected by default.
- Unauthenticated users are automatically redirected to the Clerk sign-in page.

## Adding New Routes

When adding a new page to the app:

1. Place it under `src/app/dashboard/` to ensure it falls under the protected prefix.
2. Do **not** add it to the `isPublicRoute` matcher unless it intentionally needs to be public.
3. No additional auth checks in the page component are required — middleware handles it.

## File-Based Routing Conventions

This project uses Next.js App Router conventions:

- `page.tsx` — defines a route segment's UI
- `layout.tsx` — wraps child routes with shared UI
- `[param]/` — dynamic route segments
- `(group)/` — route groups for layout organization without affecting the URL

All route files should be TypeScript (`.tsx` / `.ts`).
