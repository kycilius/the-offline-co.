import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Sparkles, ArrowRight, Check, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [{ title: "Your cohort — TheOfflineCo" }],
  }),
  component: Plan,
});

const LANDSCAPE_DETAILS: Record<
  string,
  {
    region: string;
    place: string;
    atmosphere: string;
    img: string;
    highlights: string[];
  }
> = {
  birbhum: {
    region: "Birbhum, West Bengal",
    place: "Shantiniketan & the Khoai",
    atmosphere: "Red earth paths. Baul songs after dusk. Long conversations under sal trees.",
    img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Two evenings with a Baul singing family",
      "Mud-floor suppers in a village home",
      "A morning walk through the Khoai badlands",
    ],
  },
  dooars: {
    region: "Jalpaiguri, North Bengal",
    place: "The Dooars, near Gorumara",
    atmosphere: "Tea-garden silence. Morning mist. Forest air that slows your thoughts down.",
    img: "https://images.unsplash.com/photo-1542317854-5cdaee5b2548?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Pre-dawn forest stillness with a local guide",
      "A Lepcha kitchen, a slow lunch",
      "Tea-garden walks at golden hour",
    ],
  },
  kandhamal: {
    region: "Kandhamal, Odisha",
    place: "Daringbadi pine country",
    atmosphere: "Pine smoke. Coffee estates. Cold evenings and stories that linger.",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Coffee estate walk with the family who farms it",
      "Pine-fire conversations after sunset",
      "Kondh folk song under cold stars",
    ],
  },
  angul: {
    region: "Angul, Odisha",
    place: "Satkosia gorge, Mahanadi",
    atmosphere: "River shadows. Boat lanterns. A sky untouched by city light.",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Dugout boat through the gorge at first light",
      "Lantern dinner on a quiet sandbank",
      "A starlit sleep under the Mahanadi sky",
    ],
  },
  open: {
    region: "Curated for you",
    place: "We'll choose the landscape",
    atmosphere: "Based on your answers, we'll match you with the cohort whose atmosphere fits you best.",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "A landscape chosen with your answers in mind",
      "A cohort of seven, hand-picked",
      "All experience details revealed once confirmed",
    ],
  },
};

const DATES = [
  "Fri 14 — Sun 16 Mar",
  "Fri 28 — Sun 30 Mar",
  "Fri 11 — Sun 13 Apr",
];

function Plan() {
  const [stage, setStage] = useState(0); // 0=cohort reveal, 1=confirmed
  const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);

  const landscape = useMemo(() => {
    if (typeof window === "undefined") return "open";
    return sessionStorage.getItem("selectedLandscape") || "open";
  }, []);

  const detail = LANDSCAPE_DETAILS[landscape] ?? LANDSCAPE_DETAILS.open;

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
      <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl animate-[float_15s_ease-in-out_infinite_2s]" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/85">— Your cohort</p>
          <h1 className="font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
            A landscape, <span className="italic text-primary">quietly chosen.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Seven people. One shared experience. Not everyone chooses to continue.
          </p>
        </motion.div>

        {/* Destination card */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-[var(--shadow-card)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={detail.img}
              alt={detail.place}
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary/90">{detail.region}</p>
              <h2 className="mt-2 font-display text-2xl font-light text-foreground md:text-3xl">{detail.place}</h2>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground italic md:text-base">
              {detail.atmosphere}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <Users className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cohort</p>
                <p className="mt-1 text-sm font-medium text-foreground">7 people</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Duration</p>
                <p className="mt-1 text-sm font-medium text-foreground">48 hours, offline</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Reveal</p>
                <p className="mt-1 text-sm font-medium text-foreground">24h before</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-primary/80">— Highlights</p>
              <ul className="space-y-2">
                {detail.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.article>

        {/* Available dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] md:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary/80">— Available weekends</p>
          <h3 className="mt-2 font-display text-xl font-light text-foreground md:text-2xl">Choose a weekend</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DATES.map((d) => {
              const isSelected = selectedDate === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground shadow-[var(--shadow-glow)]"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Limited to seven seats per cohort. Two already taken on most weekends.
          </p>
        </motion.div>

        {/* Confirm experience */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/95 to-accent/10 p-7 shadow-[var(--shadow-card)] md:p-9"
        >
          {!stage ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary/85">— Confirm your seat</p>
              <h3 className="mt-3 font-display text-2xl font-light text-foreground md:text-3xl">
                Reserve your place in the cohort.
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                The full experience is ₹14,000 — all accommodation, food, local guides and a button phone for the weekend, included.
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-5xl font-light text-foreground tabular-nums">₹14,000</span>
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">per seat · all-inclusive</span>
              </div>

              <button
                type="button"
                onClick={() => setStage(1)}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.015] hover:shadow-[var(--shadow-glow)]"
              >
                <Lock className="h-4 w-4" />
                <span>Confirm my experience</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                Visual flow · payment integration coming soon
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-light text-foreground md:text-3xl">
                Your seat is held, quietly.
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                We'll write to you within 48 hours with the next step. The exact location is sealed
                until 24 hours before the weekend begins. The waiting is part of it.
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-primary/80">
                {detail.place} · {selectedDate}
              </p>
              <Link
                to="/"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                <span>← Back to home</span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
