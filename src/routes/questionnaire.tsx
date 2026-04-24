import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Questionnaire — TheOfflineCo" },
      { name: "description", content: "A few thoughtful questions to find your group." },
    ],
  }),
  component: Questionnaire,
});

const QUESTIONS = [
  "I feel energized after spending time with others.",
  "I prefer quiet conversations over loud gatherings.",
  "Nature helps me feel grounded.",
  "I enjoy creative activities like art or music.",
  "I'm curious about people from different walks of life.",
  "I find joy in slow, mindful moments.",
  "I'd rather walk than watch a screen.",
  "Deep conversations feel more rewarding than small talk.",
  "I'm open to trying new experiences with strangers.",
  "I value listening as much as speaking.",
  "Solitude is restorative for me.",
  "I feel comfortable sharing personal stories.",
  "Physical activity brings me peace.",
  "I'd like to make a few real friends, not many acquaintances.",
];

const SCALE = ["Disagree", "", "Neutral", "", "Agree"];

function Questionnaire() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  const progress = ((index) / QUESTIONS.length) * 100;

  const handleSelect = (value: number) => {
    if (transitioning) return;
    setTransitioning(true);
    const next = [...answers, value];
    setAnswers(next);

    setTimeout(() => {
      if (index + 1 >= QUESTIONS.length) {
        navigate({ to: "/loading" });
      } else {
        setIndex(index + 1);
        setTransitioning(false);
      }
    }, 350);
  };

  const handleBack = () => {
    if (index === 0 || transitioning) return;
    setIndex(index - 1);
    setAnswers(answers.slice(0, -1));
  };

  return (
    <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {index + 1} <span className="text-muted-foreground/50">/ {QUESTIONS.length}</span>
        </span>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-3xl px-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32">
        <div
          key={index}
          className="w-full"
          style={{ animation: "fade-up 0.6s var(--ease-calm)" }}
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Question {index + 1}
          </p>
          <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
            {QUESTIONS[index]}
          </h2>

          {/* Scale */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 md:gap-5">
              {[1, 2, 3, 4, 5].map((n) => {
                const size = n === 1 || n === 5 ? "h-12 w-12 md:h-14 md:w-14" : n === 3 ? "h-10 w-10 md:h-11 md:w-11" : "h-11 w-11 md:h-12 md:w-12";
                return (
                  <button
                    key={n}
                    onClick={() => handleSelect(n)}
                    disabled={transitioning}
                    aria-label={`Rating ${n}`}
                    className={`${size} group relative rounded-full border-2 border-primary/30 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:opacity-50`}
                  >
                    <span className="absolute inset-1.5 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex w-full max-w-md justify-between text-xs text-muted-foreground">
              <span>{SCALE[0]}</span>
              <span>{SCALE[2]}</span>
              <span>{SCALE[4]}</span>
            </div>
          </div>
        </div>

        {index > 0 && (
          <button
            onClick={handleBack}
            className="mt-16 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Previous
          </button>
        )}
      </section>
    </main>
  );
}
