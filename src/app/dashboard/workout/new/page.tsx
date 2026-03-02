import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">New Workout</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Create a new workout session.
        </p>
      </div>

      <NewWorkoutForm />
    </main>
  );
}
