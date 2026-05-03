import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_MODE, type AppMode } from "@/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TheOfflineCo — Log out. Show up." },
      { name: "description", content: "A 48-hour offline experience for burned-out urban professionals. No phones. No feeds. Just real people, real places." },
      { property: "og:title", content: "TheOfflineCo — Log out. Show up." },
      { property: "og:description", content: "A 48-hour offline experience for burned-out urban professionals." },
    ],
  }),
  component: Landing,
});

function Landing() {
  // Allow runtime override via ?mode= for previewing both flows
  const initialMode: AppMode =
    typeof window !== "undefined"
      ? ((new URLSearchParams(window.location.search).get("mode") as AppMode) || APP_MODE)
      : APP_MODE;
  const [mode, setMode] = useState<AppMode>(initialMode);

  const navigate = useNavigate();

  const heroCtaLabel = mode === "application" ? "Apply for the next cohort" : "Find your people";
  const finalCtaLabel = mode === "application" ? "Apply for the next cohort" : "Start your experience";

  const handleCta = () => {
    if (mode === "application") {
      const el = document.getElementById("apply");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate({ to: "/questionnaire" });
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-noise"
      style={{ background: "var(--gradient-warm)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[60vh] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <Logo />
        <div className="flex items-center gap-3">
          {/* Tiny mode toggle — useful while both flows coexist */}
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm">
            <button
              onClick={() => setMode("application")}
              className={`rounded-full px-3 py-1 transition-colors ${mode === "application" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Apply
            </button>
            <button
              onClick={() => setMode("questionnaire")}
              className={`rounded-full px-3 py-1 transition-colors ${mode === "questionnaire" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Quiz
            </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-28 text-center md:pt-32 md:pb-36">
        <span className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-sm animate-[fade-in_0.8s_ease-out]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[pulse-soft_2.4s_ease-in-out_infinite]" />
          A premium offline experience
        </span>

        <h1 className="font-display text-[2.8rem] font-normal leading-[1.02] tracking-[-0.02em] text-foreground md:text-7xl animate-[fade-up_0.9s_ease-out]">
          Log out. <em className="not-italic text-primary">Show up.</em>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-[1.7] text-foreground/85 md:text-xl animate-[fade-up_1.1s_ease-out]">
          A 48-hour offline experience for burned-out urban professionals.
        </p>

        <p className="mx-auto mt-5 max-w-xl text-base font-light leading-[1.85] text-muted-foreground animate-[fade-up_1.2s_ease-out]">
          No smartphones. No feeds. No performance.<br className="hidden sm:inline" /> Just real people, real places, and something shifts.
        </p>

        <div className="mt-12 animate-[fade-up_1.3s_ease-out]">
          <button
            onClick={handleCta}
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            {heroCtaLabel}
            <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-10 animate-[fade-up_1.5s_ease-out]">
          {[
            { value: "48", label: "hours offline" },
            { value: "7", label: "people per cohort" },
            { value: "₹0", label: "competitors" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-normal text-foreground md:text-4xl">{s.value}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28 md:pb-32">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">The problem</p>
        <h2 className="mt-5 text-center font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl">
          The most connected generation feels the most alone.
        </h2>

        <ul className="mx-auto mt-14 max-w-xl space-y-5">
          {[
            "7+ hours daily screen time",
            "Gen Z loneliness despite being connected",
            "Existing retreats are passive",
            "Premium offline space is untouched",
          ].map((point) => (
            <li key={point} className="flex items-start gap-4 border-b border-border/50 pb-5 text-base font-light leading-7 text-foreground/85">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 3 — THE SOLUTION */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28 md:pb-32">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">The solution</p>
        <h2 className="mt-5 text-center font-display text-3xl font-normal leading-[1.15] tracking-tight text-foreground md:text-5xl">
          Hand over your phone.<br />
          Receive a button phone. <em className="not-italic text-primary">Begin.</em>
        </h2>

        <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-border/60 bg-card/95 p-8 shadow-[var(--shadow-card)] backdrop-blur-md md:p-10">
          <ul className="space-y-5">
            {[
              "Anonymous application",
              "Secret location revealed 24 hours before",
              "Local teachers — fishermen, farmers, musicians",
              "Real human connection",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base font-light leading-7 text-foreground/90">
                <span className="mt-2 h-1 w-6 shrink-0 rounded-full bg-primary/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 4 — EXPERIENCES */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28 md:pb-32">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">The experiences</p>
        <h2 className="mt-5 text-center font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl">
          Three places. One quiet promise.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { title: "Wild Silence", place: "North Bengal", desc: "Forest immersion among ancient trees and slow rivers.", price: "₹14,000" },
            { title: "First Light", place: "Himalayas", desc: "Mountain sunrise rituals, thin air, thick stillness.", price: "₹16,000" },
            { title: "Long Table", place: "Konkan", desc: "Coastal cooking with fishermen and shared candlelit meals.", price: "₹15,000" },
          ].map((card) => (
            <article
              key={card.title}
              className="group flex flex-col rounded-3xl border border-border/60 bg-card/95 p-7 shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/80">{card.place}</p>
              <h3 className="mt-3 font-display text-2xl font-normal tracking-tight text-foreground">{card.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{card.desc}</p>
              <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-5">
                <p className="font-display text-xl font-normal text-foreground">{card.price}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">48 hrs · 7 people</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5 — CUSTOMER JOURNEY */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28 md:pb-32">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">The journey</p>
        <h2 className="mt-5 text-center font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl">
          Five steps. One return.
        </h2>

        <ol className="mx-auto mt-14 max-w-xl space-y-6">
          {[
            "Apply anonymously",
            "Get selected",
            "Location revealed",
            "Phone swap",
            "48 hours offline → return different",
          ].map((step, idx) => (
            <li key={step} className="flex items-start gap-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/5 font-display text-sm text-primary">
                {idx + 1}
              </span>
              <p className="pt-1.5 text-base font-light leading-7 text-foreground/90">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SECTION 6 — SCARCITY */}
      <section className="relative z-10 mx-auto max-w-2xl px-6 pb-28 text-center md:pb-32">
        <h2 className="font-display text-3xl font-normal leading-[1.2] tracking-tight text-foreground md:text-5xl">
          Only 7 people per cohort.<br />
          <em className="not-italic text-primary">Not everyone gets in.</em>
        </h2>
      </section>

      {/* FINAL CTA */}
      <section id="apply" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 pb-24 md:pb-28">
        {mode === "application" ? (
          <ApplicationCard ctaLabel={finalCtaLabel} />
        ) : (
          <QuestionnaireCard ctaLabel={finalCtaLabel} onCta={handleCta} />
        )}
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-4 text-center text-xs tracking-wide text-muted-foreground/70">
        <p className="italic">A calm escape from digital overload.</p>
        <p className="mt-3">
          Contact:{" "}
          <a href="mailto:theofflinec@gmail.com" className="text-primary hover:underline">
            theofflinec@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}

function QuestionnaireCard({ ctaLabel, onCta }: { ctaLabel: string; onCta: () => void }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/95 p-10 text-center shadow-[var(--shadow-card)] backdrop-blur-md md:p-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">Begin</p>
      <h2 className="mt-5 font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">
        Find the cohort that thinks like you.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground">
        A short, honest set of questions. Two minutes. Everyone gets a different result.
      </p>
      <button
        onClick={onCta}
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

const LOOKING_FOR_OPTIONS = [
  "Real conversations",
  "Stillness",
  "Nature",
  "New friendships",
  "Reset from work",
  "Creative spark",
];

function ApplicationCard({ ctaLabel }: { ctaLabel: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [why, setWhy] = useState("");
  const [looking, setLooking] = useState<string[]>([]);
  const [okOffline, setOkOffline] = useState<string>("");

  const toggleLooking = (opt: string) => {
    setLooking((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual-only submission for now
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/95 p-12 text-center shadow-[var(--shadow-card)] backdrop-blur-md animate-[fade-up_0.7s_ease-out] md:p-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">Received</p>
        <h2 className="mt-6 font-display text-3xl font-normal leading-[1.2] tracking-tight text-foreground md:text-4xl">
          Application received.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base font-light leading-[1.8] text-muted-foreground">
          If it feels right, you'll hear from us quietly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card/95 p-8 shadow-[var(--shadow-card)] backdrop-blur-md md:p-12">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">Apply</p>
      <h2 className="mt-5 text-center font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">
        Apply for the next cohort.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-muted-foreground">
        Anonymous. Thoughtful. Reviewed by humans, not algorithms.
      </p>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-lg space-y-7">
        <Field label="Name (optional)">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Your name"
          />
        </Field>

        <Field label="City">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Where are you based?"
          />
        </Field>

        <Field label="Age group">
          <div className="flex flex-wrap gap-2">
            {["18–24", "25–32", "33–40", "40+"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAge(opt)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  age === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/40 text-foreground/80 hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Why do you want to unplug?">
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Be honest. There are no wrong answers."
          />
        </Field>

        <Field label="What are you looking for?">
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((opt) => {
              const active = looking.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleLooking(opt)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-background/40 text-foreground/80 hover:border-primary/40"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Are you okay with 48 hours offline?">
          <div className="flex gap-2">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOkOffline(opt)}
                className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                  okOffline === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/40 text-foreground/80 hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>

        <div className="pt-2 text-center">
          <button
            type="submit"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-base font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            {ctaLabel === "Apply for the next cohort" ? "Submit application" : ctaLabel}
          </button>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Reviewed quietly · Limited cohort
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
