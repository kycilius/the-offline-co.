import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Sparkles, Users, MapPin, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TheOfflineCo — Find your people. Not online. In real life." },
      { name: "description", content: "Answer a few questions and get matched with a group that actually feels like you." },
      { property: "og:title", content: "TheOfflineCo — Find your people" },
      { property: "og:description", content: "Answer a few questions and get matched with a group that actually feels like you." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const start = () => navigate({ to: "/questionnaire" });

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <ThemeToggle />
      </nav>

      {/* HERO */}
      <section className="relative mx-auto w-full max-w-3xl px-6 pb-20 pt-10 text-center md:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          Group matching · 2 min quiz
        </div>
        <h1 className="mt-6 font-display text-[2.4rem] font-medium leading-[1.05] tracking-tight md:text-[3.6rem]">
          Find your people.
          <br />
          <span className="italic text-accent">Not online. In real life.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-muted-foreground md:text-base">
          Answer a few questions and get matched with a group that actually feels like you.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={start}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90"
          >
            Start your experience
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Free · Takes 2 minutes
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">Three simple steps</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Answer a few questions", desc: "A short, honest quiz. Two minutes, fourteen questions." },
            { icon: Users, title: "Get matched with your group", desc: "We find the people who think and feel like you." },
            { icon: MapPin, title: "Experience it offline", desc: "Meet your group in real life. No screens. Just presence." },
          ].map((s, i) => (
            <div key={s.title} className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-2xl text-muted-foreground/60">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE RESULT */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">A peek inside</p>
          <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">Here's what a result looks like</h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 px-7 py-8 md:px-10 md:py-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Your group</p>
            <h3 className="mt-2 font-display text-3xl font-medium md:text-4xl">
              The <span className="italic text-accent">Deep Connectors</span>
            </h3>

            <div className="mt-6 flex items-end gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Match score</p>
                <p className="font-display text-5xl font-medium text-primary md:text-6xl">82%</p>
              </div>
              <div className="mb-2 flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
                  <div className="h-full rounded-full bg-primary" style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            <p className="mt-6 text-[14px] leading-[1.75] text-foreground/80">
              You don't enjoy surface-level conversations — you look for depth, even in small interactions. You notice things others miss, and that makes people feel understood around you.
            </p>
          </div>
          <div className="border-t border-border bg-background/50 px-7 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:px-10">
            Sample preview · Yours will be different
          </div>
        </div>
      </section>

      {/* VIRAL HOOK */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <div className="rounded-3xl border border-dashed border-accent/40 bg-accent/5 px-6 py-10 md:px-12 md:py-14">
          <p className="font-display text-2xl italic leading-snug md:text-3xl">
            "Everyone gets a different result.
            <br />
            <span className="text-accent">Compare yours with friends.</span>"
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 text-center">
        <h2 className="font-display text-3xl font-medium md:text-4xl">Ready to meet your people?</h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.7] text-muted-foreground">
          Two minutes. Fourteen questions. One group that feels like home.
        </p>
        <button
          onClick={start}
          className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90"
        >
          Start your experience
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-[12px] text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} TheOfflineCo · Find your people.</p>
          <Link to="/questionnaire" className="hover:text-foreground">Take the quiz →</Link>
        </div>
      </footer>
    </main>
  );
}
