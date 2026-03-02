# Authentication

## Provider: Clerk

**This project uses [Clerk](https://clerk.com) as its sole authentication provider.** Do not use NextAuth, Auth.js, Supabase Auth, or any other auth solution.

## Packages

The only permitted auth packages are:

- `@clerk/nextjs` — Next.js integration (middleware, providers, hooks, components)

Do not install additional auth libraries.

## Middleware

All route protection is handled via Clerk's middleware in `middleware.ts` at the project root. Use `clerkMiddleware()` from `@clerk/nextjs/server` to define public and protected routes.

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

## ClerkProvider

`<ClerkProvider>` must wrap the application in the root layout (`src/app/layout.tsx`). Do not nest or duplicate providers.

## Getting the Current User

### Server Components / Server Code

Use `auth()` from `@clerk/nextjs/server` to retrieve the current user's ID:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

This is the pattern used inside `/data` helper functions to scope queries (see `/docs/data-fetching.md`).

### Client Components

Use Clerk's React hooks when you need user info on the client:

```ts
import { useUser } from "@clerk/nextjs";

const { user, isLoaded } = useUser();
```

## Pre-built UI Components

Use Clerk's pre-built components for all auth UI. Do not build custom sign-in/sign-up forms.

- `<SignInButton />` / `<SignUpButton />` — trigger sign-in/sign-up flows
- `<UserButton />` — user avatar with account management dropdown
- `<SignedIn>` / `<SignedOut>` — conditional rendering based on auth state

```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

<SignedOut>
  <SignInButton />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

## Environment Variables

Clerk requires the following environment variables (stored in `.env.local`):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Never commit these values to version control.
