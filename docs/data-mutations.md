# Data Mutations

## Helper Functions: `/data` Directory

**ALL database mutations (insert, update, delete) MUST be encapsulated in helper functions within the `src/data` directory.** These functions are the only place where the database is mutated.

- Every mutation uses **Drizzle ORM** — raw SQL is strictly forbidden
- Helper functions must be called from server actions only
- Every mutation must scope to the authenticated user's ID (see `/docs/data-fetching.md`)

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function createWorkout(data: { name: string; date: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({ ...data, userId });
}

export async function deleteWorkout(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

## Server Actions: Colocated `actions.ts` Files

**ALL data mutations MUST be triggered via server actions.** Server actions are defined in colocated files named `actions.ts` next to the page or component that uses them.

- Every `actions.ts` file must begin with `"use server";`
- Do NOT define server actions inline within components
- Do NOT use route handlers (`/app/api/`) for mutations

### File structure

```
src/app/workouts/
  page.tsx
  actions.ts      ← server actions for this route
src/app/workouts/[id]/
  page.tsx
  actions.ts      ← server actions for this route
```

## Parameter Typing: No FormData

**Server action parameters MUST be explicitly typed.** The `FormData` type is strictly forbidden as a parameter type.

```ts
// ✅ Correct — typed parameters
export async function createWorkout(name: string, date: Date) {}

// ❌ Forbidden — FormData
export async function createWorkout(formData: FormData) {}
```

## Redirects: Client-Side Only

**Do NOT use `redirect()` from `next/navigation` inside server actions.** Redirects must be performed client-side after the server action call resolves.

```ts
// ❌ Forbidden — redirect inside server action
"use server";
export async function createWorkoutAction(input: { name: string }) {
  await createWorkout(input);
  redirect("/dashboard"); // Do NOT do this
}

// ✅ Correct — redirect client-side after the action resolves
const router = useRouter();
await createWorkoutAction({ name });
router.push("/dashboard");
```

## Validation: Zod Required

**ALL server actions MUST validate their arguments using Zod.** No mutation should trust incoming data without validation.

- Define Zod schemas in the same `actions.ts` file (or import from a shared schemas file if reused)
- Parse arguments at the top of every server action before calling any `/data` helper

### Full Example

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";
import { revalidatePath } from "next/cache";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(input: {
  name: string;
  date: string;
}) {
  const parsed = createWorkoutSchema.parse(input);
  await createWorkout(parsed);
  revalidatePath("/workouts");
}
```
