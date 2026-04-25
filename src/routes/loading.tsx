import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
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

function Loading() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  const runMatchFlow = async () => {
    setError(null);

    try {
      const savedAnswers = sessionStorage.getItem("answers");
      if (!savedAnswers) {
        throw new Error("No answers found");
      }

      const answers = JSON.parse(savedAnswers) as number[];

      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error("Submit failed");
      }

      const data = await res.json();
      localStorage.setItem("user_id", data.user_id);
      const session_id = data.session_id as string | undefined;

      if (!session_id) {
        throw new Error("Missing session_id");
      }

      setSessionId(session_id);
      sessionStorage.setItem("sessionId", session_id);

      const matchRes = await fetch(`${API_BASE}/api/match`, {
        method: "POST",
      });

      if (!matchRes.ok) {
        throw new Error("Match failed");
      }

      const resultRes = await fetch(`${API_BASE}/api/result/${session_id}`);

      if (!resultRes.ok) {
        throw new Error("Result fetch failed");
      }

      const resultData = (await resultRes.json()) as MatchResult;
      setResult(resultData);
      sessionStorage.setItem("matchResult", JSON.stringify(resultData));

      navigate({ to: "/result" });
    } catch (flowError) {
      console.error(flowError);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    if (result) {
      return;
    }

    runMatchFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

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

        <h2 className="font-display text-3xl font-light text-foreground md:text-4xl animate-[fade-up_0.8s_ease-out]">
          Finding your perfect group
          <span className="inline-flex ml-1">
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite]">.</span>
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite_0.2s]">.</span>
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite_0.4s]">.</span>
          </span>
        </h2>

        <p className="mt-6 max-w-md text-base font-light text-muted-foreground animate-[fade-up_1.1s_ease-out]">
          We're creating a meaningful experience just for you.
        </p>
        {sessionId && <p className="mt-2 text-xs text-muted-foreground/60">Session ready</p>}
      </section>
    </main>
  );
}
