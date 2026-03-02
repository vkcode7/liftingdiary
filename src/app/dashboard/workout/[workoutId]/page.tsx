import { notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export const dynamic = "force-dynamic";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);

  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(id);

  if (!workout) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Edit Workout</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Update or delete this workout session.
        </p>
      </div>
      <EditWorkoutForm workout={workout} />
    </main>
  );
}
