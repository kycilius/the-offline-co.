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
      className="group relative inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-base font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[var(--shadow-glow)] hover:bg-primary/95 active:scale-[0.98]"
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

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-24 text-center md:pt-36 md:pb-32">
        <span className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground backdrop-blur-sm animate-[fade-in_0.8s_ease-out]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[pulse-soft_2s_ease-in-out_infinite]" />
          AI-guided · Made for humans
        </span>

        <h1 className="font-display text-[2.6rem] font-normal leading-[1.05] tracking-[-0.015em] text-foreground md:text-7xl animate-[fade-up_0.9s_ease-out]">
          Find your people.<br />
          <span className="text-muted-foreground/90">Not online.</span> <em className="font-normal italic text-primary">In real life.</em>
        </h1>

        <p className="mt-10 max-w-xl text-lg font-light leading-[1.8] text-muted-foreground/90 md:text-xl animate-[fade-up_1.1s_ease-out]">
          Answer a few questions and get matched with a group that actually feels like you.
        </p>

        <div className="mt-14 animate-[fade-up_1.3s_ease-out]">
          <CTA />
        </div>

        <p className="mt-7 text-sm font-light tracking-wide text-muted-foreground/80 animate-[fade-in_1.6s_ease-out]">
          Takes 2 minutes. Everyone gets a different result.
        </p>
        <p className="mt-2 text-xs tracking-wide text-muted-foreground/60 animate-[fade-in_1.8s_ease-out]">
          No sign-up required
        </p>
      </section>

      {/* Sample result preview */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 md:pb-28">
        <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">
          A peek at what you'll get
        </p>
        <div className="group/card mx-auto max-w-md rounded-3xl border border-border/60 bg-card/95 p-7 shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
          <p className="font-display text-2xl font-normal leading-snug tracking-tight text-foreground">
            You belong with the <em className="not-italic font-medium text-primary">'Deep Connectors'</em>
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm font-medium leading-6 text-foreground/90">82% match — unusually strong alignment</p>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/5 shadow-inner">
              <span className="text-sm font-semibold text-primary">82%</span>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground italic">
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

      {/* Why this exists */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-3xl border border-border/60 bg-card/95 p-8 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl font-light text-foreground md:text-3xl">
            Why this exists
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
            <p>We've made it easier than ever to connect online — but harder to feel understood.</p>
            <p>TheOfflineCo is built to change that.</p>
            <p>We help you find people who think like you, so real conversations can happen — offline.</p>
          </div>
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
        <p>A calm escape from digital overload.</p>
        <p className="mt-2">
          Contact:{" "}
          <a href="mailto:theofflinec@gmail.com" className="text-primary hover:underline">
            theofflinec@gmail.com
          </a>
        </p>
      </footer>

    </main>
  );
}
