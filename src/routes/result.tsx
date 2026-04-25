import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, Users, HeartHandshake, PartyPopper, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [{ title: "Your group — TheOfflineCo" }],
  }),
  component: Result,
});

type MatchResult = {
  group_members?: string[];
  score?: number;
  group_name?: string;
  personality?: string;
  activity_plan?: {
    icebreaker?: string;
    activity?: string;
    closing?: string;
  };
};

function getMemberName(member: string | { name?: string }, idx: number) {
  return typeof member === "string" ? member : member.name || `Member ${idx + 1}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function buildPersonalityNarrative(score: number, groupName: string, activity: string) {
  const warmth = score >= 85 ? "grounded confidence" : score >= 65 ? "quiet curiosity" : "gentle openness";
  return `You carry a ${warmth} that helps people feel safe around you, and that is exactly why ${groupName} fits so naturally. You tend to notice the small details, listen before speaking, and create calm momentum in shared moments. This plan around ${activity.toLowerCase()} is designed to feel meaningful, not performative.`;
}

function buildGroupDescription(groupName: string, score: number) {
  const intensity = score >= 80 ? "intentional and warm" : "easygoing and thoughtful";
  return `${groupName} is a ${intensity} circle of people who value real conversations, emotional safety, and memorable moments over noise.`;
}

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

  const members = result?.group_members ?? [];
  const groupName = result?.group_name ?? "Your Group";
  const score = Math.max(0, Math.min(100, result?.score ?? 0));
  const activity = result?.activity_plan?.activity ?? "No activity available yet";
  const memberNames = members.map(getMemberName);
  const avatarNames = memberNames.slice(0, 5);

  const personalityNarrative = buildPersonalityNarrative(score, groupName, activity);
  const groupDescription = buildGroupDescription(groupName, score);

  const ctaLabel = score >= 85 ? "Start This Experience" : "Unlock Full Experience — ₹99";

  return (
    <main className="relative min-h-screen overflow-hidden bg-noise" style={{ background: "var(--gradient-warm)" }}>
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/8 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="relative z-10 mx-auto flex max-w-4xl flex-col px-6 pt-8 pb-20">
        {!result ? (
          <p className="mt-8 text-base text-muted-foreground">Something went wrong.</p>
        ) : (
          <>
            <div className="animate-[fade-up_650ms_var(--ease-calm)]">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/85">Your match</p>
              <h1 className="max-w-3xl font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
                You belong with the <span className="font-semibold text-primary">'{groupName}'</span>
              </h1>
            </div>

            <div
              className="mt-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm animate-[fade-up_700ms_var(--ease-calm)]"
              style={{ animationDelay: "120ms", animationFillMode: "both" }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-medium text-foreground">{score}% match with your group</p>
                  <p className="mt-1 text-sm text-muted-foreground">A strong emotional fit based on your reflections.</p>
                </div>
                <div className="relative grid h-24 w-24 place-items-center rounded-full border border-primary/25 bg-primary/5 shadow-[var(--shadow-soft)]">
                  <span className="text-xl font-semibold text-primary">{score}%</span>
                  <span className="absolute inset-0 rounded-full border-4 border-primary/20" />
                </div>
              </div>
              <Progress className="mt-5 h-2.5 rounded-full bg-primary/15" value={score} />
            </div>

            <div
              className="mt-6 grid gap-6 md:grid-cols-2 animate-[fade-up_750ms_var(--ease-calm)]"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              <article className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <h2 className="text-base font-semibold text-foreground">Your personality</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{personalityNarrative}</p>
              </article>

              <article className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" />
                  <h2 className="text-base font-semibold text-foreground">Group vibe</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{groupDescription}</p>
              </article>
            </div>

            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_800ms_var(--ease-calm)]"
              style={{ animationDelay: "260ms", animationFillMode: "both" }}
            >
              <h2 className="text-base font-semibold text-foreground">Your circle</h2>
              <div className="relative mt-5 h-48">
                {avatarNames.map((name, idx) => {
                  const positions = [
                    "left-1/2 top-0 -translate-x-1/2",
                    "left-12 top-16",
                    "right-12 top-16",
                    "left-20 bottom-0",
                    "right-20 bottom-0",
                  ];

                  return (
                    <div
                      key={`${name}-${idx}`}
                      className={`absolute ${positions[idx]} flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary shadow-[var(--shadow-soft)] transition-transform duration-500 hover:scale-105`}
                    >
                      {getInitials(name)}
                    </div>
                  );
                })}
              </div>
              {memberNames.length > 0 && (
                <p className="mt-2 text-center text-sm text-muted-foreground">{memberNames.join(" • ")}</p>
              )}
            </section>

            <section
              className="mt-6 animate-[fade-up_900ms_var(--ease-calm)]"
              style={{ animationDelay: "320ms", animationFillMode: "both" }}
            >
              <h2 className="mb-4 text-base font-semibold text-foreground">Activity plan</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Icebreaker</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.icebreaker ?? "—"}</p>
                </article>

                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <PartyPopper className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.activity ?? activity}</p>
                </article>

                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Closing</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.closing ?? "—"}</p>
                </article>
              </div>
            </section>
          </>
        )}

        <div
          className="mt-10 animate-[fade-up_950ms_var(--ease-calm)]"
          style={{ animationDelay: "420ms", animationFillMode: "both" }}
        >
          <Link
            to="/plan"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
