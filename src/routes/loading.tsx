import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";
import { API_BASE } from "../config";

export const Route = createFileRoute("/loading")({
  head: () => ({
    meta: [{ title: "Finding your group — TheOfflineCo" }],
  }),
  component: Loading,
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

const ROTATING_MESSAGES = [
  "Finding people who think like you...",
  "Analyzing your responses...",
  "Looking for your kind of people...",
  "Matching energy and intent...",
  "Almost there...",
];

const MIN_DURATION_MS = 3200;

function Loading() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const resultRef = useRef<MatchResult | null>(null);
  const [ready, setReady] = useState(false);

  const runMatchFlow = async () => {
    setError(null);
    startedAt.current = Date.now();

    try {
      const savedAnswers = sessionStorage.getItem("answers");
      if (!savedAnswers) throw new Error("No answers found");

      const answers = JSON.parse(savedAnswers) as number[];
      const age_group = sessionStorage.getItem("selectedAge") ?? "unknown";
      const gender = sessionStorage.getItem("selectedGender") ?? "unknown";

      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, age_group, gender }),
      });
      if (!res.ok) throw new Error("Submit failed");

      const data = await res.json();
      localStorage.setItem("user_id", data.user_id);
      const session_id = data.session_id as string | undefined;
      if (!session_id) throw new Error("Missing session_id");
      sessionStorage.setItem("sessionId", session_id);

      const matchRes = await fetch(`${API_BASE}/api/match`, { method: "POST" });
      if (!matchRes.ok) throw new Error("Match failed");

      const resultRes = await fetch(`${API_BASE}/api/result/${session_id}`);
      if (!resultRes.ok) throw new Error("Result fetch failed");

      const resultData = (await resultRes.json()) as MatchResult;
      resultRef.current = resultData;
      sessionStorage.setItem("matchResult", JSON.stringify(resultData));
      setReady(true);
    } catch (flowError) {
      console.error(flowError);
      setError("Something went wrong");
    }
  };

  // Kick off backend flow + intentional delay
  useEffect(() => {
    runMatchFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate messages every ~700ms
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  // Fake progress 0 → 100 over 3s
  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 50);
    return () => clearInterval(tick);
  }, []);

  // Navigate when both ready and minimum duration passed
  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_DURATION_MS - elapsed);
    const t = setTimeout(() => navigate({ to: "/result" }), wait);
    return () => clearTimeout(t);
  }, [ready, navigate]);

  if (error) {
    return (
      <main className="relative flex min-h-screen flex-col" style={{ background: "var(--gradient-warm)" }}>
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
          <Logo />
          <ThemeToggle />
        </header>
        <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-3xl font-light text-foreground md:text-4xl">{error}</h2>
          <div className="mt-8 flex gap-3">
            <button
              onClick={runMatchFlow}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
            <button
              onClick={() => navigate({ to: "/questionnaire" })}
              className="rounded-full border border-border bg-background px-6 py-3 text-sm font-medium"
            >
              Back
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-12 h-32 w-32">
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[pulse-soft_2.4s_ease-in-out_infinite]" />
          <div className="absolute inset-3 rounded-full border border-primary/40 animate-[pulse-soft_2.4s_ease-in-out_infinite_0.3s]" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-primary-glow animate-[pulse-soft_2.4s_ease-in-out_infinite_0.6s]" />
        </div>

        <h2
          key={messageIndex}
          className="font-display text-2xl font-light text-foreground md:text-4xl animate-[fade-up_0.6s_ease-out] min-h-[3rem]"
        >
          {ROTATING_MESSAGES[messageIndex]}
        </h2>

        <div className="mt-10 w-full max-w-xs">
          <Progress value={progress} className="h-1.5 bg-primary/15" />
          <p className="mt-3 text-xs font-light tracking-wide text-muted-foreground/70">
            {progress}%
          </p>
        </div>

        <p className="mt-8 max-w-md text-sm font-light text-muted-foreground">
          Crafting something meaningful, just for you.
        </p>
      </section>
    </main>
  );
}
