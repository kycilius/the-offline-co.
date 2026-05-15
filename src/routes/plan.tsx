import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Sparkles, ArrowRight, Check, Clock, CloudSun, Backpack } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [{ title: "Reserve your seat — TheOfflineCo" }],
  }),
  component: Plan,
});

const ATMOSPHERES: Record<string, { label: string; copy: string }> = {
  dooars: { label: "🌲 Forest Silence", copy: "Quiet trails, misty mornings, slow conversations." },
  kandhamal: { label: "⛰️ Mountains", copy: "Cold air, sunrise stillness, emotional reset." },
  birbhum: { label: "🌊 Coastline", copy: "Long-table dinners, sea air, slower time." },
  satkosia: { label: "🛶 Rivers & Wilderness", copy: "Boat lanterns, dark skies, deep presence." },
  open: { label: "🌾 Open to Wherever Feels Right", copy: "Let the experience choose you." },
};

const LANDSCAPE_DETAILS: Record<
  string,
  {
    region: string;
    place: string;
    stay: string;
    weather: string;
    pack: string[];
    img: string;
    schedule: string[];
  }
> = {
  birbhum: {
    region: "Birbhum, West Bengal",
    place: "Shantiniketan & the Khoai",
    stay: "A restored village homestay with shaded courtyards and shared long-table meals.",
    weather: "Warm afternoons, soft evenings, and dry red-earth trails.",
    pack: ["Light cotton layers", "Walking sandals", "A notebook", "One warm shawl for late dinners"],
    img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      "Arrival and offline transition at the homestay courtyard",
      "Baul-led evening meal and slow introductions",
      "Sunrise walk through the Khoai landscape",
      "Local craft table, shared lunch, and open-sky story circle",
      "Quiet morning tea before the return journey",
    ],
  },
  dooars: {
    region: "Jalpaiguri, North Bengal",
    place: "The Dooars, near Gorumara",
    stay: "A forest-edge lodge run with local guides, simple rooms, and misty morning paths.",
    weather: "Humid forest air, cooler mornings, and possible passing showers.",
    pack: ["Breathable layers", "Closed walking shoes", "Light rain shell", "Insect repellent"],
    img: "https://images.unsplash.com/photo-1542317854-5cdaee5b2548?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      "Arrival beside the forest edge and offline transition",
      "Shared dinner around tea-garden stories",
      "Pre-dawn forest stillness with a local guide",
      "Lepcha kitchen lunch and golden-hour walking circle",
      "Quiet tea before returning online differently",
    ],
  },
  kandhamal: {
    region: "Kandhamal, Odisha",
    place: "Daringbadi pine country",
    stay: "A hill-country guesthouse close to pine walks, coffee estates, and cold evening air.",
    weather: "Cool mornings, crisp evenings, and bright hill light through the day.",
    pack: ["Warm layer", "Comfortable walking shoes", "Socks for cold evenings", "Reusable water bottle"],
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      "Arrival into the hills and offline transition",
      "Pine-fire dinner with gentle first conversations",
      "Sunrise stillness and coffee-estate walk",
      "Local lunch, rest hours, and evening story circle",
      "Quiet morning reflection before departure",
    ],
  },
  satkosia: {
    region: "Angul, Odisha",
    place: "Satkosia gorge, Mahanadi",
    stay: "A riverside eco-stay with simple rooms, local meals, and dark-sky evenings.",
    weather: "Warm river days, cooler nights, and open skies after dusk.",
    pack: ["Quick-dry layers", "Sandals with grip", "A light jacket", "Torch or headlamp"],
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      "Arrival by the river and offline transition",
      "Lantern dinner and slow introductions",
      "First-light boat ride through the gorge",
      "Riverside meal, rest, and stories under open skies",
      "Quiet morning beside the water before return",
    ],
  },
  open: {
    region: "To be chosen around your cohort",
    place: "The landscape that fits the group best",
    stay: "Stay details will be matched to the final cohort and shared at the reveal window.",
    weather: "Weather notes arrive with the reveal so you can pack without overthinking.",
    pack: ["Two comfortable outfits", "Walking shoes", "A warm layer", "Any personal essentials"],
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      "Arrival and offline transition",
      "Shared dinner and slow introductions",
      "Sunrise activity chosen for the landscape",
      "Local experience, long-table meal, and open-sky stories",
      "Quiet morning and return journey",
    ],
  },
};

const DATES = [
  { label: "Fri 5 — Sun 7 Jun", departure: "2026-06-05T09:00:00+05:30" },
  { label: "Fri 19 — Sun 21 Jun", departure: "2026-06-19T09:00:00+05:30" },
  { label: "Fri 3 — Sun 5 Jul", departure: "2026-07-03T09:00:00+05:30" },
];

function getRevealDate(departure: string) {
  return new Date(new Date(departure).getTime() - 24 * 60 * 60 * 1000);
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function Plan() {
  const [stage, setStage] = useState(0);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [now, setNow] = useState(() => Date.now());

  const landscape = useMemo(() => {
    if (typeof window === "undefined") return "open";
    return sessionStorage.getItem("selectedLandscape") || "open";
  }, []);

  const detail = LANDSCAPE_DETAILS[landscape] ?? LANDSCAPE_DETAILS.open;
  const atmosphere = ATMOSPHERES[landscape] ?? ATMOSPHERES.open;
  const revealDate = getRevealDate(selectedDate.departure);
  const countdown = formatCountdown(revealDate.getTime() - now);
  const isRevealed = now >= revealDate.getTime();

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!stage) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
      <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl animate-[float_15s_ease-in-out_infinite_2s]" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/85">— Reserve your seat</p>
          <h1 className="font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
            A cohort shaped around <span className="italic text-primary">atmosphere.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Choose your weekend, reserve the ₹14K seat, then let the exact destination reveal arrive 24 hours before departure.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-[var(--shadow-card)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={detail.img} alt={atmosphere.label} loading="eager" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary/90">Landscape preference</p>
              <h2 className="mt-2 font-display text-2xl font-light text-foreground md:text-3xl">{atmosphere.label}</h2>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground italic md:text-base">{atmosphere.copy}</p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <Users className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cohort</p>
                <p className="mt-1 text-sm font-medium text-foreground">7 people</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Duration</p>
                <p className="mt-1 text-sm font-medium text-foreground">48 hours offline</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Reveal</p>
                <p className="mt-1 text-sm font-medium text-foreground">24h before departure</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-primary/80">— General emotional itinerary</p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Day 1", "Arrival", "Offline transition", "Shared dinner", "Slow introductions"],
                  ["Day 2", "Sunrise activity", "Local experiences", "Long-table meals", "Stories under open skies"],
                  ["Day 3", "Quiet morning", "Return journey", "Back online — differently"],
                ].map(([day, ...items]) => (
                  <div key={day} className="rounded-2xl border border-border/60 bg-background/35 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/80">{day}</p>
                    <ul className="mt-3 space-y-2">
                      {items.map((item) => (
                        <li key={item} className="text-sm leading-5 text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] md:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary/80">— Available weekends</p>
          <h3 className="mt-2 font-display text-xl font-light text-foreground md:text-2xl">Choose a weekend</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DATES.map((date) => {
              const isSelected = selectedDate.label === date.label;
              return (
                <button
                  key={date.label}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground shadow-[var(--shadow-glow)]"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {date.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground/70">Limited to seven seats per cohort. Exact destination appears 24 hours before departure.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/95 to-accent/10 p-7 shadow-[var(--shadow-card)] md:p-9"
        >
          {!stage ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary/85">— Confirm your seat</p>
              <h3 className="mt-3 font-display text-2xl font-light text-foreground md:text-3xl">Reserve your place in the cohort.</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                The full experience is ₹14,000 — accommodation, meals, local facilitation, and the offline weekend rhythm included.
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
                <Check className="h-4 w-4" />
                <span>Reserve seat</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Payment integration coming soon</p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-light text-foreground md:text-3xl">Your seat is held, quietly.</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Your exact destination will be revealed 24 hours before departure. Until then, stay with the anticipation.
              </p>

              {!isRevealed ? (
                <div className="mt-6 rounded-3xl border border-border/60 bg-background/35 p-5">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.22em]">Destination reveal countdown</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      ["Days", countdown.days],
                      ["Hours", countdown.hours],
                      ["Mins", countdown.minutes],
                      ["Secs", countdown.seconds],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-border/60 bg-card/70 p-3">
                        <p className="font-display text-2xl text-foreground tabular-nums">{value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Reveal opens {revealDate.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}. Detailed itinerary stays intentionally quiet until then.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-border/60 bg-card/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary/80">— Destination revealed</p>
                  <h4 className="mt-2 font-display text-2xl text-foreground">{detail.place}</h4>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-primary/80">{detail.region}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail.stay}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <CloudSun className="h-4 w-4 text-primary" />
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail.weather}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/80"><Backpack className="h-4 w-4" /> What to pack</p>
                      <ul className="space-y-2">
                        {detail.pack.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary/80">Specific schedule</p>
                      <ul className="space-y-2">
                        {detail.schedule.map((item) => (
                          <li key={item} className="text-sm leading-6 text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-primary/80">{atmosphere.label} · {selectedDate.label}</p>
              <Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                <span>← Back to home</span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
