"use server";

import { z } from "zod";
import { updateWorkout, deleteWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(100),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  workoutId: number,
  input: { name: string; startedAt: string }
) {
  const parsed = updateWorkoutSchema.parse(input);
  await updateWorkout(workoutId, parsed);
}

export async function deleteWorkoutAction(workoutId: number) {
  await deleteWorkout(workoutId);
}
