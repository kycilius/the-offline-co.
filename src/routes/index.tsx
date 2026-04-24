import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
      {/* Soft floating ambient circles */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-[float_10s_ease-in-out_infinite]" />

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

        <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl animate-[fade-up_1.1s_ease-out]">
          Step away from screens. Step into real connections.
        </p>

        <Link
          to="/questionnaire"
          className="group mt-14 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] animate-[fade-up_1.3s_ease-out]"
        >
          Start Your Journey
          <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="mt-8 text-xs text-muted-foreground/70 animate-[fade-in_1.6s_ease-out]">
          Takes about 2 minutes · No sign-up required
        </p>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-muted-foreground/60">
        A calm escape from digital overload.
      </footer>
    </main>
  );
}
