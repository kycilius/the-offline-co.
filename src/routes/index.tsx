import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Users, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

function CTA({ label = "Find your group" }: { label?: string }) {
  return (
    <Link
      to="/questionnaire"
      className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)] hover:bg-primary/95 active:scale-[0.98]"
    >
      {label}
      <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-noise" style={{ background: "var(--gradient-warm)" }}>
      {/* Soft floating ambient circles */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-glow/5 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs font-medium tracking-wider text-muted-foreground uppercase">Social Detox</span>
          <ThemeToggle />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-16 text-center md:pt-28">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm animate-[fade-in_0.8s_ease-out]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[pulse-soft_2s_ease-in-out_infinite]" />
          AI-guided · Made for humans
        </span>

        <h1 className="font-display text-4xl font-light leading-[1.08] tracking-tight text-foreground md:text-6xl animate-[fade-up_0.9s_ease-out]">
          Find your people.<br />
          Not online. <span className="font-semibold text-primary">In real life.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg font-light leading-[1.7] text-muted-foreground/90 md:text-xl animate-[fade-up_1.1s_ease-out]">
          Answer a few questions and get matched with a group that actually feels like you.
        </p>

        <div className="mt-12 animate-[fade-up_1.3s_ease-out]">
          <CTA />
        </div>

        <p className="mt-6 text-sm font-light text-muted-foreground/80 animate-[fade-in_1.6s_ease-out]">
          Takes 2 minutes. Everyone gets a different result.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60 animate-[fade-in_1.8s_ease-out]">
          No sign-up required
        </p>
      </section>

      {/* Sample result preview */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-primary/80">
          A peek at what you'll get
        </p>
        <div className="mx-auto max-w-md rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">Your group</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-primary">Deep Connectors</h3>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border border-primary/25 bg-primary/5">
              <span className="text-base font-semibold text-primary">82%</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            "You don't enjoy surface-level conversations — you look for depth, even in small interactions."
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-center font-display text-2xl font-light text-foreground md:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Answer a few questions", desc: "Quick, honest, and surprisingly fun." },
            { icon: Users, title: "Get matched with your group", desc: "An AI-guided match based on how you think and feel." },
            { icon: HeartHandshake, title: "Experience it offline", desc: "Meet your group in real life, not on a feed." },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{idx + 1}</span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Viral hook + final CTA */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-20 text-center">
        <div className="rounded-3xl border border-border/60 bg-card/95 p-8 shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Compare with friends</span>
          </div>
          <p className="text-base leading-7 text-foreground/90 md:text-lg">
            Everyone gets a different result. Compare yours with friends.
          </p>
          <div className="mt-8">
            <CTA />
          </div>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Takes 2 minutes. Everyone gets a different result.
          </p>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-muted-foreground/60">
        A calm escape from digital overload.
      </footer>
    </main>
  );
}
