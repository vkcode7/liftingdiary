"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Back Squat",
    sets: 4,
    reps: 5,
    weight: 140,
  },
  {
    id: "2",
    name: "Romanian Deadlift",
    sets: 3,
    reps: 8,
    weight: 100,
  },
  {
    id: "3",
    name: "Leg Press",
    sets: 3,
    reps: 10,
    weight: 200,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          View your logged workouts by date.
        </p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit gap-2">
            <CalendarIcon className="size-4" />
            {format(date, "do MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                setDate(d);
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {MOCK_WORKOUTS.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {MOCK_WORKOUTS.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {workout.sets} sets &times; {workout.reps} reps &mdash;{" "}
                    {workout.weight} kg
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
