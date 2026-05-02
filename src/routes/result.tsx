import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Users, HeartHandshake, PartyPopper, CheckCircle2, Lock, Share2, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [{ title: "Your group — TheOfflineCo" }],
  }),
  component: Result,
});

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

function buildGroupDescription(groupName: string, score: number) {
  const intensity = score >= 80 ? "intentional and warm" : "easygoing and thoughtful";
  return `${groupName} is a ${intensity} circle of people who value real conversations, emotional safety, and memorable moments over noise.`;
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
  const activity = result?.activity_plan?.activity ?? "No activity available yet";
  const memberNames = members.map(getMemberName);
  const avatarNames = memberNames.slice(0, 5);
  const groupSize = result?.group_size ?? avatarNames.length;
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

  const groupDescription = buildGroupDescription(groupName, score);

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
                    <p className="text-base font-medium text-foreground">{animatedScore}% match — unusually strong alignment</p>
                    <p className="mt-1 text-sm text-muted-foreground">This level of compatibility is rare.</p>
                  </div>
                  <div className="relative grid h-24 w-24 place-items-center rounded-full border border-primary/25 bg-primary/5 shadow-[var(--shadow-soft)]">
                    <span className="text-xl font-semibold text-primary tabular-nums">{animatedScore}%</span>
                    <span className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  </div>
                </div>
                <Progress className="mt-5 h-2.5 rounded-full bg-primary/15" value={animatedScore} />
              </div>
            )}


            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_720ms_var(--ease-calm)]"
              style={{ animationDelay: "160ms", animationFillMode: "both" }}
            >
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-base font-semibold text-foreground">Why this match works for you</h2>
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

            <section
              className="mt-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)] animate-[fade-up_800ms_var(--ease-calm)]"
              style={{ animationDelay: "260ms", animationFillMode: "both" }}
            >
              <h2 className="text-base font-semibold text-foreground">{groupLabel}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You're matched with people who think and feel like you.
              </p>
              <div className="relative mt-5 h-48">
                {avatarNames.map((_, idx) => {
                  const positions = [
                    "left-1/2 top-0 -translate-x-1/2",
                    "left-12 top-16",
                    "right-12 top-16",
                    "left-20 bottom-0",
                    "right-20 bottom-0",
                  ];

                  return (
                    <div
                      key={idx}
                      className={`absolute ${positions[idx]} flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[var(--shadow-soft)] transition-transform duration-500 hover:scale-105`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              className="mt-6 animate-[fade-up_900ms_var(--ease-calm)]"
              style={{ animationDelay: "320ms", animationFillMode: "both" }}
            >
              <h2 className="mb-4 text-base font-semibold text-foreground">This is how your group connects:</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Icebreaker</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.icebreaker ?? "—"}</p>
                </article>

                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <PartyPopper className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Activity</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.activity ?? activity}</p>
                </article>

                <article className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Closing</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.activity_plan?.closing ?? "—"}</p>
                </article>
              </div>
            </section>
          </>
        )}

        <section
          className="mt-10 animate-[fade-up_920ms_var(--ease-calm)]"
          style={{ animationDelay: "380ms", animationFillMode: "both" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Lock className="h-4 w-4" />
              <h2 className="text-base font-semibold text-foreground">Your group (preview)</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              You've been matched with people who align closely with you.
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
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  <span>Locked — unlock to see your group</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-card/70 p-5">
              <p className="text-sm font-medium text-foreground">You'll unlock:</p>
              <ul className="mt-3 space-y-2">
                {[
                  "Your actual group members",
                  "Your shared group dynamic",
                  "A guided first meetup plan",
                  "Real conversation prompts",
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
              Everyone gets a different group — compare yours.
            </p>

            <div className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-4">
              <p className="text-sm leading-6 text-foreground/90">
                "I just got matched with the '{groupName}' — and this is scarily accurate. Curious what you'll get 👀"
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const shareText = `I just got matched with the '${groupName}' on TheOfflineCo — and this is scarily accurate. Curious what you'll get 👀`;
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
                Send this to 3 friends and compare your groups.
              </p>
            </div>
          </div>
        </section>

        <div
          className="mt-8 animate-[fade-up_950ms_var(--ease-calm)]"
          style={{ animationDelay: "420ms", animationFillMode: "both" }}
        >
          <p className="mb-2 text-base leading-relaxed text-foreground">
            This is the kind of group where you won't feel like an outsider.
          </p>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary/80">
            This match won't stay available forever.
          </p>
          <Link
            to="/plan"
            className="inline-flex flex-col items-center gap-1 rounded-2xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            <span className="text-base font-semibold">Meet your group</span>
            <span className="text-xs font-normal text-primary-foreground/80">Start your first experience — ₹99</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
