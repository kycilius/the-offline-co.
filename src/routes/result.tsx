import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Users, HeartHandshake, PartyPopper, CheckCircle2, Share2, Check, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [{ title: "Your group — TheOfflineCo" }],
  }),
  component: Result,
});


const LANDSCAPE_COPY: Record<string, { title: string; copy: string; theme: string }> = {
  dooars: {
    title: "🌲 Forest Silence",
    copy: "Quiet trails, misty mornings, slow conversations.",
    theme: "Landscape Preference → Emotional Compatibility → Curated Cohort",
  },
  kandhamal: {
    title: "⛰️ Mountains",
    copy: "Cold air, sunrise stillness, emotional reset.",
    theme: "Landscape Preference → Emotional Compatibility → Curated Cohort",
  },
  birbhum: {
    title: "🌊 Coastline",
    copy: "Long-table dinners, sea air, slower time.",
    theme: "Landscape Preference → Emotional Compatibility → Curated Cohort",
  },
  satkosia: {
    title: "🛶 Rivers & Wilderness",
    copy: "Boat lanterns, dark skies, deep presence.",
    theme: "Landscape Preference → Emotional Compatibility → Curated Cohort",
  },
  open: {
    title: "🌾 Open to Wherever Feels Right",
    copy: "Let the experience choose you.",
    theme: "Landscape Preference → Emotional Compatibility → Curated Cohort",
  },
};

type MatchResult = {
  group_members?: string[];
  score?: number;
  group_name?: string;
  personality?: string;
  match_reasons?: string[];
  group_size?: number;
  user_display_name?: string;
  match_label?: string;
  group_label?: string;
  preferred_destination?: string;
  destination_name?: string;
  destination_place?: string;
  destination_image?: string;
  emotional_theme?: string;
  cohort_atmosphere?: string;
  activity_plan?: {
    icebreaker?: string;
    activity?: string;
    closing?: string;
  };
};

function getMemberName(member: string | { name?: string }, idx: number) {
  return typeof member === "string" ? member : member.name || `Member ${idx + 1}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const personalityLines = [
  "You don't enjoy surface-level conversations — you look for depth, even in small interactions.",
  "You notice things others miss, and that makes people feel understood around you.",
  "You tend to listen first, speak second, and bring calm into group spaces.",
];

const differenceLines = [
  "Most people enjoy casual interaction — you look for meaning.",
  "Others talk to fill silence — you observe before speaking.",
  "Many seek energy — you seek depth.",
];

function buildGroupDescription(groupName: string, atmosphere: string) {
  return `${groupName} is ${atmosphere.toLowerCase()} It is designed to feel less like a match result and more like a shared atmosphere you can step into.`;
}

function Result() {
  const [copied, setCopied] = useState(false);
  // Staggered reveal: 0=nothing, 1=hello, 2=belong-prefix, 3=group-name, 4=score, 5=rest
  const [stage, setStage] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  const result = useMemo<MatchResult | null>(() => {
    const raw = sessionStorage.getItem("matchResult");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const userName = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("user_name")?.trim() ?? "";
  }, []);

  const members = result?.group_members ?? [];
  const groupName = result?.group_name ?? "Your Group";
  const score = Math.max(0, Math.min(100, result?.score ?? 0));
  const memberNames = members.map(getMemberName);
  const groupSize = result?.group_size ?? memberNames.length;
  const preferredDestination = result?.preferred_destination ?? "open";
  const landscapeCopy = LANDSCAPE_COPY[preferredDestination] ?? LANDSCAPE_COPY.open;
  const emotionalTheme = result?.emotional_theme ?? "An intentional shared atmosphere";
  const cohortAtmosphere = result?.cohort_atmosphere ?? "A small circle shaped around presence, ease, and genuine conversation.";
  const matchReasons = result?.match_reasons?.length
    ? result.match_reasons
    : [
        "You prefer meaningful conversations",
        "You value emotional safety",
        "You listen before speaking",
      ];
  const matchLabel = result?.match_label?.trim()
    ? result.match_label
    : `${score}% match — unusually strong alignment`;
  const groupLabel = result?.group_label?.trim()
    ? result.group_label
    : groupSize > 0
      ? `${groupSize} ${groupSize === 1 ? "person" : "people"} like you`
      : "Your circle";

  const groupDescription = buildGroupDescription(groupName, cohortAtmosphere);

  // Staged reveal timeline
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStage(1), 200));   // Hello, [Name]
    timers.push(setTimeout(() => setStage(2), 1100));  // "You belong with the..."
    timers.push(setTimeout(() => setStage(3), 2000));  // Group name reveal
    timers.push(setTimeout(() => setStage(4), 2700));  // Score animation begins
    timers.push(setTimeout(() => setStage(5), 4200));  // Personality + rest
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate score 0 → score over ~1.2s once stage 4 reached
  useEffect(() => {
    if (stage < 4) return;
    const duration = 1200;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - pct, 3);
      setAnimatedScore(Math.round(score * eased));
      if (pct >= 1) clearInterval(tick);
    }, 30);
    return () => clearInterval(tick);
  }, [stage, score]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-noise" style={{ background: "var(--gradient-warm)" }}>
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/8 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="relative z-10 mx-auto flex max-w-4xl flex-col px-6 pt-8 pb-20">
        {!result ? (
          <p className="mt-8 text-base text-muted-foreground">Something went wrong.</p>
        ) : (
          <>
            <div className="min-h-[180px]">
              {stage >= 1 && (
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/85 animate-[fade-up_650ms_var(--ease-calm)]">
                  {userName ? `Hello, ${userName}` : `Hello, ${result.user_display_name ?? "You"}`}
                </p>
              )}
              <h1 className="max-w-3xl font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
                {stage >= 2 && (
                  <span className="inline-block animate-[fade-up_650ms_var(--ease-calm)]">
                    You belong with the
                  </span>
                )}
                {stage >= 3 && (
                  <>
                    {" "}
                    <span className="inline-block font-semibold text-primary animate-[fade-up_700ms_var(--ease-calm)]">
                      '{groupName}'
                    </span>
                  </>
                )}
              </h1>
              {stage >= 3 && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg animate-[fade-up_700ms_var(--ease-calm)]">
                  This is the kind of group where you won't feel like an outsider.
                </p>
              )}
            </div>

            {stage >= 4 && (
              <div className="mt-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm animate-[fade-up_700ms_var(--ease-calm)]">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-medium text-foreground">{matchLabel}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Landscape Preference → Emotional Compatibility → Curated Cohort.</p>
                  </div>
                  <div className="relative grid h-24 w-24 place-items-center rounded-full border border-primary/25 bg-primary/5 shadow-[var(--shadow-soft)]">
                    <span className="text-xl font-semibold text-primary tabular-nums">{animatedScore}%</span>
                    <span className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  </div>
                </div>
                <Progress className="mt-5 h-2.5 rounded-full bg-primary/15" value={animatedScore} />
              </div>
            )}


            {stage >= 5 && (<>
            <section
              className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-[var(--shadow-card)] animate-[fade-up_700ms_var(--ease-calm)]"
              style={{ animationDelay: "120ms", animationFillMode: "both" }}
            >
              <div className="bg-gradient-to-br from-primary/12 via-accent/10 to-card p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Landscape preference</span>
                </div>
                <h2 className="font-display text-2xl font-light text-foreground md:text-3xl">{landscapeCopy.title}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-primary/80">Exact destination revealed after booking</p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{landscapeCopy.copy}</p>
              </div>
              <div className="grid gap-3 p-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Emotional theme</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/90">{landscapeCopy.theme}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Cohort atmosphere</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/90">{cohortAtmosphere}</p>
                </div>
              </div>
            </section>

            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_720ms_var(--ease-calm)]"
              style={{ animationDelay: "160ms", animationFillMode: "both" }}
            >
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-base font-semibold text-foreground">Why this cohort feels aligned</h2>
              </div>
              <ul className="space-y-3">
                {matchReasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_740ms_var(--ease-calm)]"
              style={{ animationDelay: "180ms", animationFillMode: "both" }}
            >
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-base font-semibold text-foreground">Your personality</h2>
              </div>
              <ul className="space-y-3">
                {personalityLines.map((line) => (
                  <li key={line} className="text-sm leading-7 text-muted-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_750ms_var(--ease-calm)]"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-base font-semibold text-foreground">You're different from most people</h2>
              </div>
              <ul className="space-y-3">
                {differenceLines.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div
              className="mt-6 animate-[fade-up_760ms_var(--ease-calm)]"
              style={{ animationDelay: "220ms", animationFillMode: "both" }}
            >
              <article className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" />
                  <h2 className="text-base font-semibold text-foreground">Group vibe</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{groupDescription}</p>
              </article>
            </div>

            {/* Group members and detailed logistics are reserved for the booking flow below. */}
            </>)}
          </>
        )}

        <section
          className="mt-10 animate-[fade-up_920ms_var(--ease-calm)]"
          style={{ animationDelay: "380ms", animationFillMode: "both" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Clock className="h-4 w-4" />
              <h2 className="text-base font-semibold text-foreground">Your group (preview)</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Your cohort preview is shaped first by shared landscape, then by pace and emotional fit.
            </p>

            <div className="relative mt-6">
              <div className="flex flex-wrap items-center justify-center gap-5 select-none" style={{ filter: "blur(4px)", opacity: 0.75 }}>
                {["A***", "R***", "K***", "M***"].map((label) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[var(--shadow-soft)]">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Names shared after you reserve</span>
                </div>
              </div>
            </div>

            <div className="relative mt-4">
              <div className="grid gap-3 select-none md:grid-cols-3" style={{ filter: "blur(5px)", opacity: 0.7 }}>
                {[
                  { icon: HeartHandshake, title: "Icebreaker" },
                  { icon: PartyPopper, title: "Activity" },
                  { icon: CheckCircle2, title: "Closing" },
                ].map(({ icon: Icon, title }) => (
                  <div key={title} className="rounded-2xl border border-border/60 bg-card/80 p-4">
                    <div className="mb-2 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      ████████ ███ ████ ████████ ██████ ███ ████.
                    </p>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium text-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Detailed itinerary follows the reveal window</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-card/70 p-5">
              <p className="text-sm font-medium text-foreground">After you reserve:</p>
              <ul className="mt-3 space-y-2">
                {[
                  "Your seat is held in the curated cohort",
                  "A countdown begins for the destination reveal",
                  "Exact destination appears 24 hours before departure",
                  "Detailed stay, weather, packing, and schedule follow the reveal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mt-6 animate-[fade-up_940ms_var(--ease-calm)]"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <div className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)]">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Share2 className="h-4 w-4" />
              <h2 className="text-base font-semibold text-foreground">See what your friends get</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Everyone gets a different landscape and cohort atmosphere — compare yours.
            </p>

            <div className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-4">
              <p className="text-sm leading-6 text-foreground/90">
                I just found my '{groupName}' — a small cohort shaped around {landscapeCopy.title}. Curious where you'll land.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const shareText = `I just found my '${groupName}' on TheOfflineCo — a small cohort shaped around ${landscapeCopy.title}. Curious where you'll land.`;
                const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
                const shareData = { title: "TheOfflineCo", text: shareText, url: shareUrl };
                try {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    await navigator.share(shareData);
                    return;
                  }
                } catch {
                  // fall through to WhatsApp / clipboard
                }
                // WhatsApp fallback for mobile / desktop
                if (typeof window !== "undefined") {
                  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent ?? "");
                  if (isMobile) {
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`.trim())}`;
                    window.open(waUrl, "_blank", "noopener,noreferrer");
                    return;
                  }
                }
                try {
                  await navigator.clipboard.writeText(`${shareText} ${shareUrl}`.trim());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // ignore
                }
              }}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/15"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span>{copied ? "Link copied" : "Compare with friends"}</span>
            </button>

            <div className="mt-5 space-y-2">
              <p className="text-sm text-foreground/80">
                Your friends won't get the same result.
              </p>
              <p className="text-sm text-muted-foreground">
                People like you are already discovering their groups.
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                Send this to friends and compare your atmospheres.
              </p>
            </div>
          </div>
        </section>

        <div
          className="mt-10 animate-[fade-up_950ms_var(--ease-calm)]"
          style={{ animationDelay: "420ms", animationFillMode: "both" }}
        >
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card/95 to-accent/10 p-7 shadow-[var(--shadow-card)]">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/85">— Reserve your seat</p>
            <h3 className="mt-3 font-display text-2xl font-light text-foreground md:text-3xl">
              Apply → Match → Reserve Seat → ₹14K booking.
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              If this match feels right, continue to choose a weekend and hold your seat. The exact destination is revealed 24 hours before departure.
            </p>
            <Link
              to="/plan"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.015] hover:shadow-[var(--shadow-glow)]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Reserve seat</span>
            </Link>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Full booking is ₹14,000 per seat once payment integration is connected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
