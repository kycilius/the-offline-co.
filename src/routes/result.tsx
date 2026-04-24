import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [{ title: "Your group — TheOfflineCo" }],
  }),
  component: Result,
});

type MatchResult = {
  group?: Array<string | { name?: string }>;
  score?: number;
  group_name?: string;
  activity?: string;
  plan?: {
    icebreaker?: string;
    activity?: string;
    closing?: string;
  };
};

function Result() {
  const result = useMemo<MatchResult | null>(() => {
    const raw = sessionStorage.getItem("matchResult");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const members = result?.group ?? [];
  const groupName = result?.group_name ?? "Your Group";
  const score = result?.score ?? 0;
  const activity = result?.activity ?? "No activity available yet.";

  return (
    <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="mx-auto flex max-w-3xl flex-col px-6 pt-12 pb-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">Your match</p>
        <h1 className="font-display text-4xl font-light text-foreground md:text-5xl">
          <span className="font-semibold text-primary">{groupName}</span>
        </h1>

        {!result ? (
          <p className="mt-6 text-base text-muted-foreground">Something went wrong</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Score:</span> {score}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Activity:</span> {activity}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Group</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {members.map((member, idx) => (
                  <li key={idx}>{typeof member === "string" ? member : member.name || `Member ${idx + 1}`}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Plan</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Icebreaker:</span> {result.plan?.icebreaker ?? "—"}
                </li>
                <li>
                  <span className="font-semibold text-foreground">Activity:</span> {result.plan?.activity ?? "—"}
                </li>
                <li>
                  <span className="font-semibold text-foreground">Closing:</span> {result.plan?.closing ?? "—"}
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="mt-8">
          <Link
            to="/plan"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            See Your Activity Plan
          </Link>
        </div>
      </section>
    </main>
  );
}
