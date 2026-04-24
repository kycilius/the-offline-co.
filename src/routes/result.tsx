import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [{ title: "Your group — TheOfflineCo" }],
  }),
  component: Result,
});

const MEMBERS = [
  { name: "Aarav", initials: "AR", tone: "from-emerald-200 to-emerald-300" },
  { name: "Maya", initials: "MA", tone: "from-amber-200 to-orange-200" },
  { name: "Ishaan", initials: "IS", tone: "from-teal-200 to-emerald-200" },
  { name: "Rhea", initials: "RH", tone: "from-rose-200 to-amber-200" },
  { name: "Kabir", initials: "KA", tone: "from-lime-200 to-emerald-200" },
];

function Result() {
  const score = 82;
  // Position 5 avatars in a circle around center
  const radius = 110;
  const positions = MEMBERS.map((_, i) => {
    const angle = (i / MEMBERS.length) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });

  return (
    <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
      </header>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-12 pb-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary animate-[fade-in_0.8s_ease-out]">
          Your match
        </p>
        <h1 className="font-display text-4xl font-light text-foreground md:text-5xl animate-[fade-up_0.9s_ease-out]">
          The <span className="font-semibold text-primary">Calm Explorers</span>
        </h1>
        <p className="mt-4 max-w-md text-base font-light text-muted-foreground animate-[fade-up_1.1s_ease-out]">
          A small group of mindful souls who share your love for slow conversations and gentle adventures.
        </p>

        {/* Cluster */}
        <div className="relative mt-16 h-[320px] w-[320px] animate-[fade-in_1.3s_ease-out]">
          {/* center score */}
          <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
            <span className="font-display text-4xl font-semibold tabular-nums">{score}%</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest opacity-90">Match</span>
          </div>

          {/* orbital ring */}
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20" />

          {MEMBERS.map((m, i) => (
            <div
              key={m.name}
              className="absolute left-1/2 top-1/2 flex flex-col items-center"
              style={{
                transform: `translate(calc(-50% + ${positions[i].x}px), calc(-50% + ${positions[i].y}px))`,
                animation: `fade-up 0.7s var(--ease-calm) ${0.3 + i * 0.12}s both`,
              }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${m.tone} font-display text-sm font-semibold text-foreground/70 shadow-[var(--shadow-card)] ring-4 ring-background`}>
                {m.initials}
              </div>
              <span className="mt-2 text-xs font-medium text-muted-foreground">{m.name}</span>
            </div>
          ))}
        </div>

        <Link
          to="/plan"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] animate-[fade-up_1.6s_ease-out]"
        >
          See Your Activity Plan
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
