import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { API_BASE } from "@/config";
import wildSilenceImg from "@/assets/landscapes/wild-silence.png";
import firstLightImg from "@/assets/landscapes/first-light.png";
import saltStillnessImg from "@/assets/landscapes/salt-stillness.png";
import unhurriedWildImg from "@/assets/landscapes/unhurried-wild.png";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Questionnaire — The Offline Co." },
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
  {
    slug: "wild-silence",
    destination: "dooars",
    title: "Wild Silence",
    subtitle: "Gorumara, North Bengal",
    description: "Forest immersion. Elephant safari. No signal zones.",
    image: wildSilenceImg,
    transitionTitle: "wild silence",
    transitionLines: [
      "Maybe you're looking for the kind of quiet only forests hold.",
      "Maybe distance from noise feels like medicine right now.",
      "Maybe you just want to slow down without explaining why.",
    ],
  },
  {
    slug: "first-light",
    destination: "kandhamal",
    title: "First Light",
    subtitle: "Lower Himalayas",
    description: "Mountain sunrise. Tea estate walks. Birds before alarms.",
    image: firstLightImg,
    transitionTitle: "first light",
    transitionLines: [
      "Maybe you're looking for a higher kind of clarity.",
      "Maybe the cold mountain air feels like a reset.",
      "Maybe you want to wake to birdsong instead of a feed.",
    ],
  },
  {
    slug: "salt-stillness",
    destination: "birbhum",
    title: "Salt & Stillness",
    subtitle: "Odisha Coast",
    description: "The sea at 5am. Fishing villages. Tide as your only notification.",
    image: saltStillnessImg,
    transitionTitle: "salt & stillness",
    transitionLines: [
      "Maybe you're drawn to softness, salt air, and slow mornings.",
      "Maybe you want meals that stretch into stories.",
      "Maybe slower time is the luxury you've been quietly craving.",
    ],
  },
  {
    slug: "unhurried-wild",
    destination: "satkosia",
    title: "The Unhurried Wild",
    subtitle: "Central India Safari",
    description: "Dawn without a feed. Forest sounds. A naturalist who reads animals better than algorithms.",
    image: unhurriedWildImg,
    transitionTitle: "the unhurried wild",
    transitionLines: [
      "Maybe you want to feel small in the best way.",
      "Maybe you'd rather hear a forest than a notification.",
      "Maybe presence feels different beside something genuinely wild.",
    ],
  },
  {
    slug: "open",
    destination: "open",
    title: "Open to Wherever Feels Right",
    subtitle: "Let the experience choose you",
    description: "Let the experience choose you.",
    image: null as string | null,
    transitionTitle: "openness",
    transitionLines: [
      "Maybe you're practicing trust.",
      "Maybe you don't need to know the shape yet.",
      "Maybe the right atmosphere can find you.",
    ],
  },
];

function Questionnaire() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<"landscape" | "transition" | "name" | "age" | "gender">("landscape");
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [atmosphere, setAtmosphere] = useState<string>("");

  const AGE_OPTIONS = ["18–22", "23–27", "28–35", "35+"];
  const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ls = params.get("landscape") ?? params.get("atmosphere");
    const aliases: Record<string, string> = {
      // legacy → new
      "forest-silence": "wild-silence",
      mountains: "first-light",
      coastline: "salt-stillness",
      "rivers-wilderness": "unhurried-wild",
      // destination → new
      angul: "unhurried-wild",
      satkosia: "unhurried-wild",
      dooars: "wild-silence",
      kandhamal: "first-light",
      birbhum: "salt-stillness",
    };
    const normalizedAtmosphere = aliases[ls ?? ""] ?? ls;
    const selectedOption = LANDSCAPES.find((l) => l.slug === normalizedAtmosphere);
    if (selectedOption) {
      sessionStorage.setItem("selectedAtmosphere", selectedOption.slug);
      sessionStorage.setItem("selectedLandscape", selectedOption.destination);
      setAtmosphere(selectedOption.slug);
      setStep("transition");
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
    setTimeout(() => setStarted(true), 280);
  };

  const handleLandscapeSelect = (slug: string) => {
    const selectedOption = LANDSCAPES.find((item) => item.slug === slug) ?? LANDSCAPES[LANDSCAPES.length - 1];
    setAtmosphere(selectedOption.slug);
    sessionStorage.setItem("selectedAtmosphere", selectedOption.slug);
    sessionStorage.setItem("selectedLandscape", selectedOption.destination);
    setTimeout(() => setStep("transition"), 320);
  };

  const skipName = () => {
    localStorage.removeItem("user_name");
    setStep("age");
  };

  const skipGender = () => {
    sessionStorage.setItem("selectedGender", "unknown");
    setStarted(true);
  };

  const skipLandscape = () => {
    handleLandscapeSelect("open");
  };

  const selectedAtmosphere = LANDSCAPES.find((item) => item.slug === atmosphere) ?? LANDSCAPES[LANDSCAPES.length - 1];

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
        setShowContact(true);
      } else {
        setIndex((prev) => prev + 1);
        setSelected(null);
      }

      setTransitioning(false); // ALWAYS RESET
    }, 480);
  };

  const [showContact, setShowContact] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    if (!/^\S+@\S+\.\S+$/.test(contactEmail) || contactWhatsapp.replace(/\D/g, "").length < 7) {
      setContactError("Please share a valid email and WhatsApp number.");
      return;
    }
    setContactSubmitting(true);
    sessionStorage.setItem("contactEmail", contactEmail.trim());
    sessionStorage.setItem("contactWhatsapp", contactWhatsapp.trim());
    try {
      await fetch(`${API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: localStorage.getItem("user_name") || null,
          email: contactEmail.trim(),
          whatsapp: contactWhatsapp.trim(),
          source: "questionnaire_reveal",
          atmosphere: sessionStorage.getItem("selectedAtmosphere") || null,
        }),
      }).catch(() => null);
    } catch {
      // best-effort
    }
    navigate({ to: "/loading" });
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
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">First, the atmosphere</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                Choose the atmosphere you're drawn to.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We'll use this quietly to shape where you may belong.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 text-left">
                {LANDSCAPES.filter((l) => l.image).map((opt) => {
                  const isSelected = atmosphere === opt.slug;
                  return (
                    <button
                      key={opt.slug}
                      type="button"
                      onClick={() => handleLandscapeSelect(opt.slug)}
                      className={`group relative block aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-xl border transition-all duration-700 ${
                        isSelected
                          ? "border-primary scale-[1.01] shadow-[0_0_40px_-8px_color-mix(in_oklab,var(--primary-glow)_70%,transparent)]"
                          : "border-border/40 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={opt.image as string}
                        alt={opt.title}
                        loading="lazy"
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out ${
                          isSelected ? "scale-[1.04]" : "group-hover:scale-[1.05]"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07110F] via-[#07110F]/60 to-[#07110F]/10" />
                      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(55,201,120,0.22),transparent_65%)] transition-opacity duration-700 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-90"}`} />
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-left">
                        <p className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.26em] uppercase text-paper/65 mb-2">
                          {opt.subtitle}
                        </p>
                        <h3 className="font-display text-2xl sm:text-3xl text-paper leading-tight">
                          {opt.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-paper/75 leading-relaxed max-w-md">
                          {opt.description}
                        </p>
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
                I'm open to wherever feels right →
              </button>
            </div>
          )}

          {step === "transition" && (
            <div key="transition" className="w-full animate-[fade-up_900ms_var(--ease-calm)]">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">You chose {selectedAtmosphere.transitionTitle}</p>
              <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
                Let’s understand you a little better.
              </h2>
              <div className="mx-auto mt-8 max-w-md space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                {selectedAtmosphere.transitionLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep("name")}
                className="mt-10 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
              >
                Continue
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (showContact) {
    return (
      <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
        <div className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
        <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Logo />
          <ThemeToggle />
        </header>
        <section className="relative z-10 mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="w-full animate-[fade-up_700ms_var(--ease-calm)]">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-primary">A quiet detail</p>
            <h2 className="font-display text-3xl font-light leading-snug text-foreground md:text-4xl">
              Where should we send your cohort reveal?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Personal. Anticipatory. Never spam.
            </p>
            <form onSubmit={submitContact} className="mt-10 space-y-5 text-left">
              <label className="block">
                <span className="block text-[0.65rem] tracking-[0.26em] uppercase text-paper/55 mb-2">Email</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="quiet@inbox.com"
                  autoComplete="email"
                  className="w-full bg-transparent border-b border-paper/15 focus:border-primary/70 outline-none py-3 text-paper text-base md:text-lg placeholder:text-paper/30 transition-colors"
                />
              </label>
              <label className="block">
                <span className="block text-[0.65rem] tracking-[0.26em] uppercase text-paper/55 mb-2">WhatsApp number</span>
                <input
                  type="tel"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+91 ·· ····· ····"
                  autoComplete="tel"
                  className="w-full bg-transparent border-b border-paper/15 focus:border-primary/70 outline-none py-3 text-paper text-base md:text-lg placeholder:text-paper/30 transition-colors"
                />
              </label>
              {contactError && (
                <p className="text-xs tracking-[0.18em] uppercase text-red-300/80">{contactError}</p>
              )}
              <div className="pt-3 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="ember-button disabled:opacity-60"
                >
                  {contactSubmitting ? "Sending…" : "Reveal my cohort"}
                </button>
                <span className="text-[0.65rem] tracking-[0.24em] uppercase text-paper/45">
                  Used only for your reveal — nothing more.
                </span>
              </div>
            </form>
          </div>
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
