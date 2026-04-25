import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

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

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-32 text-center md:pt-32">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm animate-[fade-in_0.8s_ease-out]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[pulse-soft_2s_ease-in-out_infinite]" />
          AI-guided · Made for humans
        </span>

        <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight text-foreground md:text-7xl animate-[fade-up_0.9s_ease-out]">
          Find Your Perfect<br />
          <span className="font-semibold text-primary">Social Group</span>
        </h1>

        <p className="mt-10 max-w-xl text-lg font-light leading-[1.7] text-muted-foreground/90 md:text-xl animate-[fade-up_1.1s_ease-out]">
          Step away from screens. Step into real connections.
        </p>

        <Link
          to="/questionnaire"
          className="group mt-14 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)] hover:bg-primary/95 active:scale-[0.98] animate-[fade-up_1.3s_ease-out] hover:animate-[glow-pulse_2.4s_ease-in-out_infinite]"
        >
          Start Your Journey
          <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="mt-6 text-sm font-light italic text-muted-foreground/80 animate-[fade-in_1.6s_ease-out]">
          Takes 2 minutes. Might change how you connect.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60 animate-[fade-in_1.8s_ease-out]">
          No sign-up required
        </p>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-muted-foreground/60">
        A calm escape from digital overload.
      </footer>
    </main>
  );
}
