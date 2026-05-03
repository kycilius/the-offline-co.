import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_MODE, type AppMode } from "@/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Ofline Co. — Log out. Show up." },
      { name: "description", content: "A premium 48-hour offline experience for burned-out urban professionals. No smartphones. No feeds. Just real people, real places." },
      { property: "og:title", content: "The Ofline Co. — Log out. Show up." },
      { property: "og:description", content: "A premium 48-hour offline experience. No smartphones. No feeds." },
    ],
  }),
  component: Landing,
});

/* ---------- Tokens (mapped to one-pager palette) ---------- */
const ink = "text-foreground";
const cream = "text-background";
const gold = "text-accent";
const goldBorder = "border-accent/40";
const warmBorder = "border-border";
const muted = "text-muted-foreground";
const forestBg = "bg-primary";
const inkBg = "bg-foreground";

/* ---------- Reusable bits ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className={`pb-2 text-[10px] font-medium uppercase tracking-[0.22em] ${gold} border-b ${warmBorder}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-semibold leading-[1.2] text-foreground md:text-[1.7rem]">
      {children}
    </h2>
  );
}

function Landing() {
  const initialMode: AppMode =
    typeof window !== "undefined"
      ? ((new URLSearchParams(window.location.search).get("mode") as AppMode) || APP_MODE)
      : APP_MODE;
  const [mode, setMode] = useState<AppMode>(initialMode);
  const navigate = useNavigate();

  const heroCta = mode === "application" ? "Apply for the next cohort" : "Find your people";
  const finalCta = mode === "application" ? "Apply for the next cohort" : "Start your experience";

  const handleCta = () => {
    if (mode === "application") {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate({ to: "/questionnaire" });
    }
  };

  return (
    <main className="min-h-screen bg-[#2a2520] py-0 md:py-10">
      <div className="mx-auto w-full max-w-[860px] overflow-hidden bg-background shadow-[0_40px_80px_rgba(0,0,0,0.5)] md:rounded-sm">
        {/* ============== HEADER (Forest band) ============== */}
        <header className={`relative ${forestBg} px-6 pb-8 pt-8 md:px-12 md:pb-10 md:pt-10`}>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent via-accent/70 to-accent" />

          {/* top row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className={`text-[10px] font-medium uppercase tracking-[0.25em] ${gold}`}>
                The Ofline Co. · Premium offline experiences
              </span>
              <div className="font-display text-[2.2rem] font-light leading-none tracking-tight text-background md:text-[2.6rem]">
                The Ofline Co.
              </div>
              <div className="font-display text-base italic text-accent/90 md:text-lg">
                Log out. Show up.
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <ThemeToggle />
              {/* mode toggle */}
              <div className="hidden sm:flex items-center gap-1 rounded-full border border-accent/30 bg-white/5 p-1 text-[10px] font-medium uppercase tracking-[0.18em] text-background/80 backdrop-blur-sm">
                <button
                  onClick={() => setMode("application")}
                  className={`rounded-full px-3 py-1 transition-colors ${mode === "application" ? "bg-accent text-foreground" : "hover:text-background"}`}
                >
                  Apply
                </button>
                <button
                  onClick={() => setMode("questionnaire")}
                  className={`rounded-full px-3 py-1 transition-colors ${mode === "questionnaire" ? "bg-accent text-foreground" : "hover:text-background"}`}
                >
                  Quiz
                </button>
              </div>
            </div>
          </div>

          {/* hero */}
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <h1 className="font-display text-[1.6rem] font-light leading-[1.25] text-background md:text-[2rem]">
                Friday evening you check out.<br />
                <em className="not-italic italic text-accent/90">Monday morning you show up differently.</em>
              </h1>
              <p className={`mt-4 max-w-md text-sm leading-[1.7] text-background/70`}>
                A premium 48-hour offline experience for burned-out urban professionals. No smartphones. No feeds. No performance. Just real people, real places, and the feeling that something has shifted.
              </p>

              <div className="mt-6">
                <button
                  onClick={handleCta}
                  className="group inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-accent/90"
                >
                  {heroCta}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            </div>

            {/* stat strip */}
            <div className="flex shrink-0 gap-2">
              {[
                { num: "48", label: "Hours offline" },
                { num: "7", label: "Per cohort" },
                { num: "₹0", label: "Competitors" },
              ].map((s) => (
                <div key={s.label} className="rounded-md border border-accent/25 bg-white/5 px-4 py-3 text-center">
                  <span className={`block font-display text-2xl font-semibold leading-none ${gold}`}>{s.num}</span>
                  <span className="mt-1.5 block text-[9px] uppercase tracking-[0.12em] text-background/50">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ============== BODY (cream, two-column grid) ============== */}
        <div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 md:gap-6 md:px-12 md:py-10">

          {/* PROBLEM */}
          <section className="flex flex-col gap-3">
            <SectionLabel>The Problem</SectionLabel>
            <SectionTitle>The most connected generation feels the most alone.</SectionTitle>
            <ul className="mt-1 flex flex-col gap-2.5">
              {[
                "7+ hours average daily screen time. We scroll more than we speak.",
                "Gen Z reports loneliness despite being permanently \u201cconnected.\u201d",
                "Existing wellness retreats are passive, solitary, clinical.",
                "India's experience economy is growing fast. Premium offline is untouched.",
              ].map((t) => (
                <li key={t} className={`flex items-start gap-2.5 text-[13px] leading-[1.55] ${muted}`}>
                  <span className={`mt-0.5 font-semibold ${gold}`}>—</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SOLUTION */}
          <section className="flex flex-col gap-3">
            <SectionLabel>The Solution</SectionLabel>
            <SectionTitle>Hand over your phone. Receive a button phone. Begin.</SectionTitle>
            <div className={`relative overflow-hidden rounded-md ${forestBg} px-5 py-5`}>
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent to-transparent" />
              <p className="font-display text-[1.05rem] italic leading-[1.5] text-accent/90">
                "Happy people are genuinely happy — not poor. They are teachers. This is a happiness exchange."
              </p>
              <p className="mt-3 text-[12.5px] leading-[1.55] text-background/65">
                Strangers apply anonymously. Location revealed 24hrs before arrival. Smartphones collected at meetpoint. 48 hours with local teachers — fishermen, farmers, musicians.
              </p>
            </div>
          </section>

          {/* EXPERIENCES (full width) */}
          <section className="md:col-span-2 flex flex-col gap-3">
            <SectionLabel>Pilot Experiences — North &amp; East India First</SectionLabel>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {[
                { loc: "Gorumara · North Bengal", name: "Wild Silence", desc: "Forest immersion. Elephant safari at dawn. No-signal zones. Local tribal community as teachers.", price: "₹15,000 · 48hrs · 7 people" },
                { loc: "Lower Himalayas", name: "First Light", desc: "Mountain sunrise. Tea estate walks. Campfire folk music. Birds before alarms.", price: "₹14,000 · 48hrs · 7 people" },
                { loc: "Konkan Coast", name: "Long Table", desc: "Cook with strangers who become friends. A slow flame. Someone's grandmother's recipe.", price: "₹16,000 · 48hrs · 7 people" },
              ].map((e) => (
                <article key={e.name} className={`relative overflow-hidden rounded-md border ${warmBorder} bg-card p-3.5`}>
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
                  <p className={`text-[10px] font-medium uppercase tracking-[0.15em] ${gold}`}>{e.loc}</p>
                  <h3 className="mt-1.5 font-display text-[1rem] font-semibold text-foreground">{e.name}</h3>
                  <p className={`mt-1.5 text-[11.5px] leading-[1.55] ${muted}`}>{e.desc}</p>
                  <p className="mt-2.5 text-[12px] font-medium text-primary">{e.price}</p>
                </article>
              ))}
            </div>
          </section>

          {/* CUSTOMER JOURNEY (full width) */}
          <section className="md:col-span-2 flex flex-col gap-4">
            <SectionLabel>Customer Journey</SectionLabel>
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-0">
              {[
                "Apply online anonymously. Tell us why you want to unplug.",
                "Application reviewed. Cohort curated. Confirmation arrives quietly.",
                "Location revealed 24hrs before. Pack light. Travel to meetpoint.",
                "Phone swap at meetpoint. Button phone received. 48hrs begins.",
                "Friday evening to Sunday afternoon. Back to office Monday. Different.",
              ].map((t, i, arr) => (
                <li key={i} className="relative flex flex-1 flex-col items-center px-1 text-center">
                  <div className={`grid h-7 w-7 place-items-center rounded-full ${forestBg} text-[11px] font-semibold ${gold}`}>
                    {i + 1}
                  </div>
                  <p className={`mt-2 text-[11px] leading-[1.45] ${muted}`}>{t}</p>
                  {i < arr.length - 1 && (
                    <span className={`hidden sm:block absolute right-[-6px] top-3 text-sm ${gold}`}>→</span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* SCARCITY + MOAT row */}
          <section className="flex flex-col gap-3">
            <SectionLabel>Scarcity</SectionLabel>
            <SectionTitle>Only 7 people per cohort. Not everyone gets in.</SectionTitle>
            <p className={`text-[13px] leading-[1.65] ${muted}`}>
              Anonymous application. Curated cohort. Secret location revealed 24 hours before arrival. Designed for the people who actually need it most — and rarely give themselves permission to take the time.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <SectionLabel>Competitive Moat</SectionLabel>
            <ul className="flex flex-col gap-3">
              {[
                { icon: "📱", title: "The Phone Ritual", desc: "Not just \u201cno phones\u201d — a physical, symbolic swap. People talk about it for years." },
                { icon: "🤝", title: "Local Teacher Relationships", desc: "Fishermen, farmers, musicians — not performers. Genuine human bonds, built slowly." },
                { icon: "🔐", title: "Anonymous Application + Secret Location", desc: "Exclusivity and mystery are engineered in. Hard to copy with a booking form." },
              ].map((m) => (
                <li key={m.title} className="flex items-start gap-3">
                  <span className="text-base leading-none">{m.icon}</span>
                  <div>
                    <div className="text-[12.5px] font-medium text-foreground">{m.title}</div>
                    <div className={`mt-0.5 text-[11.5px] leading-[1.5] ${muted}`}>{m.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ============== FINAL CTA ============== */}
        <section id="apply" className="scroll-mt-6 px-6 pb-10 md:px-12">
          {mode === "application" ? (
            <ApplicationCard ctaLabel={finalCta} />
          ) : (
            <QuestionnaireCard ctaLabel={finalCta} onCta={handleCta} />
          )}
        </section>

        {/* ============== FOOTER (ink band) ============== */}
        <footer className={`flex flex-col items-center justify-between gap-4 ${inkBg} px-6 py-5 text-background sm:flex-row md:px-12`}>
          <div className="flex flex-col gap-0.5">
            <div className="font-display text-base font-light text-background">The Ofline Co.</div>
            <a href="mailto:theofflinec@gmail.com" className={`text-[11px] tracking-wide ${gold} hover:underline`}>
              theofflinec@gmail.com
            </a>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-background/40">
              {mode === "application" ? "Apply now" : "Find your people"}
            </div>
            <div className="font-display text-[0.95rem] italic text-accent/90">"Log out. Show up."</div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="sm:text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-background/40">A calm escape</div>
            <div className="text-[12px] font-medium text-background">From digital overload</div>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ---------- CTA cards ---------- */
function QuestionnaireCard({ ctaLabel, onCta }: { ctaLabel: string; onCta: () => void }) {
  return (
    <div className={`rounded-md border ${warmBorder} bg-card px-6 py-8 text-center md:px-10 md:py-10`}>
      <p className={`text-[10px] font-medium uppercase tracking-[0.25em] ${gold}`}>Begin</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
        Find the cohort that thinks like you.
      </h2>
      <p className={`mx-auto mt-3 max-w-md text-[13px] leading-[1.65] ${muted}`}>
        A short, honest set of questions. Two minutes. Everyone gets a different result.
      </p>
      <button
        onClick={onCta}
        className="mt-6 inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-accent/90"
      >
        {ctaLabel} →
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

  const toggleLooking = (opt: string) =>
    setLooking((p) => (p.includes(opt) ? p.filter((o) => o !== opt) : [...p, opt]));

  if (submitted) {
    return (
      <div className={`rounded-md border ${warmBorder} bg-card px-6 py-12 text-center md:px-12 md:py-16`}>
        <p className={`text-[10px] font-medium uppercase tracking-[0.25em] ${gold}`}>Received</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.2] text-foreground md:text-4xl">
          Application received.
        </h2>
        <p className={`mx-auto mt-4 max-w-md text-[14px] leading-[1.75] ${muted}`}>
          If it feels right, you'll hear from us quietly.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${warmBorder} bg-card px-6 py-7 md:px-10 md:py-9`}>
      <SectionLabel>Apply</SectionLabel>
      <h2 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-[1.7rem]">
        Apply for the next cohort.
      </h2>
      <p className={`mt-2 text-[13px] leading-[1.6] ${muted}`}>
        Anonymous. Thoughtful. Reviewed by humans, not algorithms.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <Field label="Name (optional)">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-sm border ${warmBorder} bg-background/60 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40`}
            placeholder="Your name"
          />
        </Field>

        <Field label="City">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className={`w-full rounded-sm border ${warmBorder} bg-background/60 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40`}
            placeholder="Where are you based?"
          />
        </Field>

        <Field label="Age group" full>
          <div className="flex flex-wrap gap-2">
            {["18–24", "25–32", "33–40", "40+"].map((opt) => (
              <Chip key={opt} active={age === opt} onClick={() => setAge(opt)}>{opt}</Chip>
            ))}
          </div>
        </Field>

        <Field label="Why do you want to unplug?" full>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            required
            rows={3}
            className={`w-full rounded-sm border ${warmBorder} bg-background/60 px-3 py-2.5 text-[13px] leading-6 text-foreground placeholder:text-muted-foreground/50 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40`}
            placeholder="Be honest. There are no wrong answers."
          />
        </Field>

        <Field label="What are you looking for?" full>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((opt) => (
              <Chip key={opt} active={looking.includes(opt)} onClick={() => toggleLooking(opt)}>{opt}</Chip>
            ))}
          </div>
        </Field>

        <Field label="Are you okay with 48 hours offline?" full>
          <div className="flex gap-2">
            {["Yes", "No"].map((opt) => (
              <Chip key={opt} active={okOffline === opt} onClick={() => setOkOffline(opt)} className="flex-1">
                {opt}
              </Chip>
            ))}
          </div>
        </Field>

        <div className="md:col-span-2 mt-2 flex flex-col items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-accent/90"
          >
            {ctaLabel === "Apply for the next cohort" ? "Submit application" : ctaLabel} →
          </button>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Reviewed quietly · Limited cohort
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className={`mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] ${muted}`}>{label}</span>
      {children}
    </label>
  );
}

function Chip({
  active, onClick, children, className = "",
}: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-all ${
        active
          ? "border-accent bg-accent text-foreground"
          : `${warmBorder} bg-background/40 text-foreground/75 hover:border-accent/50`
      } ${className}`}
    >
      {children}
    </button>
  );
}
