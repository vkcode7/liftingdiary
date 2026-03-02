"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";
import { revalidatePath } from "next/cache";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(100),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(input: {
  name: string;
  startedAt: string;
}) {
  const parsed = createWorkoutSchema.parse(input);
  const workout = await createWorkout(parsed);
  revalidatePath("/dashboard");
  return workout;
}
