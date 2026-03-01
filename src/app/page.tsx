import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-6 px-6">
      <SignedOut>
        <h1 className="text-4xl font-bold tracking-tight">Lifting Diary</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Track your workouts and hit new PRs.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-3 font-medium hover:opacity-90 transition-opacity">
            Get started
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Your workout dashboard is coming soon.
        </p>
      </SignedIn>
    </main>
  );
}
