import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [{ title: "Your activity plan — TheOfflineCo" }],
  }),
  component: Plan,
});

const STEPS = [
  {
    label: "Icebreaker",
    name: "Two Truths & A Walk",
    description: "Take a slow stroll while sharing two true things and one playful invention. Let curiosity lead the way.",
    duration: "15 min",
    icon: (
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    ),
  },
  {
    label: "Activity",
    name: "Forest Listening Circle",
    description: "Find a quiet spot together. Sit, breathe, and share what you hear. A gentle exercise in being present with each other.",
    duration: "45 min",
    icon: (
      <>
        <path d="M12 2c3 4 3 8 0 12-3-4-3-8 0-12z" />
        <path d="M12 14v8" />
      </>
    ),
  },
  {
    label: "Closing",
    name: "Gratitude Exchange",
    description: "Each person shares one moment from the day they're grateful for. End with a warm goodbye, no phones in sight.",
    duration: "10 min",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
];

function Plan() {
  return (
    <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="mx-auto max-w-2xl px-6 pt-12 pb-24">
        <div className="text-center animate-[fade-up_0.8s_ease-out]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">Saturday, 4:30 PM</p>
          <h1 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Your <span className="font-semibold text-primary">Activity Plan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base font-light text-muted-foreground">
            A simple, intentional flow designed for your group.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 space-y-5">
          {STEPS.map((step, i) => (
            <div key={step.label} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-8 top-[88px] bottom-[-20px] w-px bg-gradient-to-b from-primary/30 to-transparent" />
              )}

              <article
                className="group relative flex gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] md:p-7"
                style={{ animation: `fade-up 0.7s var(--ease-calm) ${0.2 + i * 0.15}s both` }}
              >
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 text-primary">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {step.icon}
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{step.label}</span>
                    <span className="text-xs font-medium text-muted-foreground">{step.duration}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-medium text-foreground">{step.name}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div
          className="mt-14 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-8 text-center shadow-[var(--shadow-card)]"
          style={{ animation: "fade-up 0.8s var(--ease-calm) 0.9s both" }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Premium
          </span>
          <h3 className="mt-4 font-display text-2xl font-light text-foreground">
            Unlock the <span className="font-semibold text-primary">Full Experience</span>
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm font-light text-muted-foreground">
            Personalized plans, curated venues, and lifelong access to your group.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-all duration-500 hover:scale-[1.02] hover:bg-primary">
            Unlock for ₹99
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground/70">
          Breathe in. Breathe out. We'll see you there.
        </p>
      </section>
    </main>
  );
}
