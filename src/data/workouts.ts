import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsByDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      exerciseName: exercises.name,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weightLbs: sets.weightLbs,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .innerJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        sql`date(${workouts.startedAt}) = ${dateStr}`
      )
    );

  const grouped = new Map<
    number,
    {
      id: number;
      name: string | null;
      startedAt: Date;
      exercises: Map<
        string,
        { sets: number; reps: number | null; weight: string | null }[]
      >;
    }
  >();

  for (const row of rows) {
    if (!grouped.has(row.workoutId)) {
      grouped.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        exercises: new Map(),
      });
    }

    const workout = grouped.get(row.workoutId)!;
    if (!workout.exercises.has(row.exerciseName)) {
      workout.exercises.set(row.exerciseName, []);
    }
    workout.exercises.get(row.exerciseName)!.push({
      sets: row.setNumber,
      reps: row.reps,
      weight: row.weightLbs,
    });
  }

  return Array.from(grouped.values()).map((w) => ({
    id: w.id,
    name: w.name,
    startedAt: w.startedAt,
    exercises: Array.from(w.exercises.entries()).map(([name, sets]) => ({
      name,
      sets: sets.length,
      topSet: sets.reduce(
        (best, s) => {
          const weight = s.weight ? parseFloat(s.weight) : 0;
          const reps = s.reps ?? 0;
          if (weight > (best.weight ?? 0)) return { weight, reps };
          return best;
        },
        { weight: 0, reps: 0 }
      ),
    })),
  }));
}

export type WorkoutByDate = Awaited<ReturnType<typeof getWorkoutsByDate>>[number];

export async function createWorkout(data: { name: string; startedAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({
    name: data.name,
    startedAt: data.startedAt,
    userId,
  });
}
