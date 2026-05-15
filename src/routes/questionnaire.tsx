import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Questionnaire — TheOfflineCo" },
      { name: "description", content: "A few thoughtful questions to find your group." },
    ],
  }),
  component: Questionnaire,
});

const QUESTIONS = [
  "I feel energized after spending time with others.",
  "I prefer quiet conversations over loud gatherings.",
  "Nature helps me feel grounded.",
  "I enjoy creative activities like art or music.",
  "I'm curious about people from different walks of life.",
  "I find joy in slow, mindful moments.",
  "I'd rather walk than watch a screen.",
  "Deep conversations feel more rewarding than small talk.",
  "I'm open to trying new experiences with strangers.",
  "I value listening as much as speaking.",
  "Solitude is restorative for me.",
  "I feel comfortable sharing personal stories.",
  "Physical activity brings me peace.",
  "I'd like to make a few real friends, not many acquaintances.",
];

const SCALE = ["Disagree", "", "Neutral", "", "Agree"];

const LANDSCAPES = [
  { slug: "birbhum",   region: "Birbhum, West Bengal",     place: "Shantiniketan & the Khoai" },
  { slug: "dooars",    region: "Jalpaiguri, North Bengal", place: "The Dooars, near Gorumara" },
  { slug: "kandhamal", region: "Kandhamal, Odisha",        place: "Daringbadi pine country"   },
  { slug: "satkosia",  region: "Angul, Odisha",            place: "Satkosia gorge, Mahanadi"  },
  { slug: "open",      region: "Anywhere",                 place: "I'm open to wherever feels right" },
];

function Questionnaire() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<"name" | "age" | "gender" | "landscape">("name");
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [landscape, setLandscape] = useState<string>("");

  const AGE_OPTIONS = ["18–22", "23–27", "28–35", "35+"];
  const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ls = params.get("landscape");
    const normalizedLandscape = ls === "angul" ? "satkosia" : ls;
    if (normalizedLandscape && LANDSCAPES.some((l) => l.slug === normalizedLandscape)) {
      sessionStorage.setItem("selectedLandscape", normalizedLandscape);
      setLandscape(normalizedLandscape);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) localStorage.setItem("user_name", trimmed);
    else localStorage.removeItem("user_name");
    setStep("age");
  };

  const handleAgeSelect = (value: string) => {
    setAgeGroup(value);
    sessionStorage.setItem("selectedAge", value);
    setTimeout(() => setStep("gender"), 280);
  };

  const handleGenderSelect = (value: string) => {
    setGender(value);
    sessionStorage.setItem("selectedGender", value);
    setTimeout(() => setStep("landscape"), 280);
  };

  const handleLandscapeSelect = (slug: string) => {
    setLandscape(slug);
    sessionStorage.setItem("selectedLandscape", slug);
    setTimeout(() => setStarted(true), 320);
  };

  const skipName = () => {
    localStorage.removeItem("user_name");
    setStep("age");
  };

  const skipGender = () => {
    sessionStorage.setItem("selectedGender", "unknown");
    setStep("landscape");
  };

  const skipLandscape = () => {
    sessionStorage.setItem("selectedLandscape", "open");
    setStarted(true);
  };

  const progress = ((index + (selected !== null ? 1 : 0)) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  const handleSelect = (value: number) => {
    if (transitioning) return; // keep, but now safe due to reset
    if (selected !== null) return;
    setTransitioning(true);
    setSelected(value);
    const next = [...answers, value];
    setAnswers(next);

    setTimeout(() => {
      if (index + 1 >= QUESTIONS.length) {
        sessionStorage.setItem("answers", JSON.stringify(next));
        sessionStorage.removeItem("matchResult");
        sessionStorage.removeItem("groupId");
        navigate({ to: "/loading" });
      } else {
        setIndex((prev) => prev + 1);
        setSelected(null);
      }

      setTransitioning(false); // ALWAYS RESET
    }, 480);
  };

  const handleBack = () => {
    if (index === 0 || transitioning) return;
    setIndex(index - 1);
    setAnswers(answers.slice(0, -1));
    setSelected(null);
  };

  if (!started) {
    return (
      <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
        <header className="pointer-events-auto relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Logo />
          <ThemeToggle />
        </header>
        <section className="pointer-events-auto relative z-10 mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          {step === "name" && (
            <form key="name" onSubmit={handleNameSubmit} className="w-full">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">Before we begin</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                What should we call you?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">Optional — helps us make this feel more like yours.</p>

              <div className="mt-10 flex flex-col items-center gap-5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  maxLength={40}
                  className="w-full max-w-sm rounded-full border border-border/60 bg-background/60 px-6 py-3.5 text-center text-base text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={skipName}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === "age" && (
            <div key="age" className="w-full">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">A little about you</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                What's your age range?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">Helps us match you better.</p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {AGE_OPTIONS.map((opt) => {
                  const isSelected = ageGroup === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAgeSelect(opt)}
                      className={`rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.03] ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary-glow)_60%,transparent)]"
                          : "border-border/60 bg-background/60 text-foreground backdrop-blur-sm hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "gender" && (
            <div key="gender" className="w-full">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">One more thing</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                What's your gender?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">Optional.</p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {GENDER_OPTIONS.map((opt) => {
                  const isSelected = gender === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleGenderSelect(opt)}
                      className={`rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.03] ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary-glow)_60%,transparent)]"
                          : "border-border/60 bg-background/60 text-foreground backdrop-blur-sm hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={skipGender}
                className="mt-8 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip
              </button>
            </div>
          )}

          {step === "landscape" && (
            <div key="landscape" className="w-full animate-[fade-up_700ms_var(--ease-calm)]">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">Your atmosphere</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                Which experience calls to you most?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Choose the landscape that quietly pulls you in.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-3 text-left">
                {LANDSCAPES.map((opt) => {
                  const isSelected = landscape === opt.slug;
                  return (
                    <button
                      key={opt.slug}
                      type="button"
                      onClick={() => handleLandscapeSelect(opt.slug)}
                      className={`group rounded-2xl border px-5 py-4 transition-all duration-500 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                          : "border-border/60 bg-background/40 hover:border-primary/50 hover:bg-background/60"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary/80">{opt.region}</p>
                          <p className="mt-1 font-display text-lg text-foreground">{opt.place}</p>
                        </div>
                        <span className={`text-xs transition-opacity ${isSelected ? "opacity-100 text-primary" : "opacity-40"}`}>→</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={skipLandscape}
                className="mt-8 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="relative z-10 pointer-events-auto mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground/70 tabular-nums">
            {index + 1} <span className="text-muted-foreground/40">/ {QUESTIONS.length}</span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 pointer-events-auto mx-auto max-w-3xl px-6">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_8px_color-mix(in_oklab,var(--primary-glow)_60%,transparent)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <section className="relative z-10 pointer-events-auto mx-auto flex max-w-2xl flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32">
        <div key={index} className="w-full">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">Question {index + 1}</p>
          <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
            {QUESTIONS[index]}
          </h2>

          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 md:gap-5">
              {[1, 2, 3, 4, 5].map((n) => {
                const size =
                  n === 1 || n === 5
                    ? "h-12 w-12 md:h-14 md:w-14"
                    : n === 3
                      ? "h-10 w-10 md:h-11 md:w-11"
                      : "h-11 w-11 md:h-12 md:w-12";
                const isSelected = selected === n;
                return (
                  <button
                    key={n}
                    onClick={() => handleSelect(n)}
                    disabled={transitioning}
                    aria-label={`Rating ${n}`}
                    className={`${size} group relative rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-90 disabled:cursor-not-allowed ${
                      isSelected
                        ? "border-primary bg-primary scale-110 shadow-[0_0_24px_color-mix(in_oklab,var(--primary-glow)_70%,transparent)]"
                        : "border-primary/30 hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    <span className={`absolute inset-1.5 rounded-full bg-primary transition-opacity duration-300 ${isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex w-full max-w-md justify-between text-xs text-muted-foreground">
              <span>{SCALE[0]}</span>
              <span>{SCALE[2]}</span>
              <span>{SCALE[4]}</span>
            </div>
          </div>
        </div>

        {index > 0 && (
          <button
            onClick={handleBack}
            className="mt-16 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Previous
          </button>
        )}
      </section>
    </main>
  );
}
