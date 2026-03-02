# Server Components

## Next.js 15: Params and SearchParams Are Promises

In Next.js 15, `params` and `searchParams` are **asynchronous** and MUST be awaited before accessing their values. They are `Promise` objects, not plain objects.

**Never** destructure or access params synchronously — this will result in incorrect behavior or type errors.

### Page Props Types

```ts
// Dynamic route page
export default async function Page({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // ...
}

// Page with search params
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // ...
}

// Page with both
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  // ...
}
```

### What NOT to do

```ts
// WRONG — params is a Promise, not a plain object
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id; // broken in Next.js 15
}
```

---

## General Server Component Rules

- All Server Components are `async` functions — always use `await` for async operations
- Never add `"use client"` to a file that fetches data or calls `/data` helpers
- Export `dynamic = "force-dynamic"` when the page must always fetch fresh data (e.g. user-specific content)

```ts
export const dynamic = "force-dynamic";
```

- Use `notFound()` from `next/navigation` to return a 404 when a resource doesn't exist or doesn't belong to the current user

```ts
import { notFound } from "next/navigation";

const workout = await getWorkoutById(id);
if (!workout) notFound();
```

- Parse and validate route params before using them — dynamic segments are always strings

```ts
const id = parseInt(workoutId, 10);
if (isNaN(id)) notFound();
```

---

## Passing Data to Client Components

Server Components fetch data and pass it down as props to Client Components. Client Components never fetch their own data.

```ts
// page.tsx (Server Component)
const workout = await getWorkoutById(id);

return <EditWorkoutForm workout={workout} />;
```

```ts
// edit-workout-form.tsx (Client Component)
"use client";

interface Props {
  workout: { id: number; name: string | null; startedAt: Date };
}

export function EditWorkoutForm({ workout }: Props) {
  // uses props, never fetches data itself
}
```
