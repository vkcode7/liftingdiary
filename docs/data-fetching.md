# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching MUST be done exclusively via React Server Components.**

The following approaches are strictly forbidden:
- Route handlers (`/app/api/` routes) for data fetching
- Client components (`"use client"`) fetching data directly
- `useEffect` + `fetch` patterns
- SWR, React Query, or any client-side data fetching library
- Any other mechanism that does not go through a Server Component

If you need data in a Client Component, fetch it in a Server Component parent and pass it down as props.

## Database Queries: `/data` Directory

All database queries MUST be encapsulated in helper functions located in the `/data` directory. These functions are the only place where the database is queried.

**Rules:**
- Every database query lives in a `/data` helper function — no inline queries elsewhere in the codebase
- All queries MUST use **Drizzle ORM** — raw SQL is strictly forbidden
- Helper functions must be called from Server Components only

### Example structure

```
/data
  exercises.ts
  workouts.ts
  sets.ts
```

## Authorization: Users Can Only Access Their Own Data

This is a hard security requirement. Every single `/data` helper function that returns user-specific data MUST scope the query to the currently authenticated user's ID.

**Never** fetch all rows and filter in application code. Always filter at the database query level.

### Pattern

Every helper function must:
1. Accept (or internally resolve) the authenticated user's ID
2. Include a `where` clause that constrains results to that user's ID
3. Never return data belonging to any other user

### Example

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getWorkouts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

Never omit the `userId` filter. A query without it is a data leak.
