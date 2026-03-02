import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam + "T00:00:00") : new Date();
  const workouts = await getWorkoutsByDate(date);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          View your logged workouts by date.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <DatePicker value={date} />
        <Button asChild>
          <Link href="/dashboard/workout/new">
            <Plus className="size-4" />
            New Workout
          </Link>
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">
                    {workout.name ?? "Workout"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    {workout.exercises.map((exercise) => (
                      <p
                        key={exercise.name}
                        className="text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        {exercise.name} &mdash; {exercise.sets} sets, top set{" "}
                        {exercise.topSet.weight} lbs &times;{" "}
                        {exercise.topSet.reps} reps
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
