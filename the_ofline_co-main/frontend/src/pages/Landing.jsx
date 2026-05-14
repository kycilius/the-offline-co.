import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Phone, Flame, Mountain, Users, BookOpen, MapPin } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import Countdown from "@/components/site/Countdown";
import { api } from "@/lib/api";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/a442b8b5c46dd5c0aba75a7f85fe0c41e8bcc4d39a1b435c00a324223d2b7479.png";
const PHONE_RITUAL = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/4b65994cf91868d468e35ac4e28e488f09dff70c4c7489de85745a1102237673.png";
const CABIN_DINNER = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/ad52708b4197fa2c641d5ec311ef1555a5b05fc0692a51bf181899fb1e1927ba.png";
const CAMPFIRE = "https://images.pexels.com/photos/36729452/pexels-photo-36729452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400";
const NATURE_DAWN = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80";
const HANDS = "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=80";

export default function Landing() {
  const [countdown, setCountdown] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [c, e, t] = await Promise.all([
          api.get("/countdown"),
          api.get("/experiences"),
          api.get("/testimonials"),
        ]);
        setCountdown(c.data);
        setExperiences(e.data || []);
        setTestimonials(t.data || []);
      } catch {/* ignore */}
    })();
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <div className="relative">
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative min-h-screen w-full overflow-hidden flex items-end pt-32 pb-20 md:pb-32"
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img
            src={HERO_IMG}
            alt="Misty forest at dawn"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/30 to-ink" />
          <div className="absolute inset-0 vignette" />
        </motion.div>

        <div className="relative container-page w-full">
          <Reveal>
            <p className="overline mb-6" data-testid="hero-overline">
              <span className="inline-block w-8 h-px bg-ember align-middle mr-3" />
              48 hours offline · Bengal & Odisha
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1
              data-testid="hero-headline"
              className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight text-paper kerned text-balance"
            >
              Log out.<br />
              <span className="italic text-paper/95">Show up.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-xl text-lg md:text-xl text-paper/80 leading-relaxed">
              A weekend in the red-earth villages of Bengal and the quiet hills of Odisha — where strangers become real, and life feels like it used to.
              No screens. No feeds. No performance.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/apply" className="ember-button" data-testid="hero-apply-btn">
                Apply for the next experience
                <ArrowUpRight size={16} />
              </Link>
              <a href="#concept" className="ghost-button" data-testid="hero-learn-more">
                What this is
                <ArrowDown size={14} />
              </a>
            </div>
          </Reveal>

          <div className="mt-20 md:mt-28 flex items-end justify-between gap-6 flex-wrap">
            <div className="text-paper/45 text-xs tracking-[0.28em] uppercase">
              Cohort 03 · 12 seats · Application only
            </div>
            <div className="hidden md:block text-paper/40 text-xs tracking-[0.28em] uppercase">
              Scroll, slowly ↓
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative py-32 md:py-44" data-testid="problem-section">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="overline">01 — The quiet ache</p>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-6xl text-paper leading-[1.05] kerned text-balance">
                The most connected generation feels the most alone.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-paper/70 text-lg leading-relaxed">
                <p>You scroll more than you speak.</p>
                <p>You document more than you experience.</p>
                <p>You're always reachable — but rarely known.</p>
                <p>You have everything — except the feeling that it matters.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-page hairline" />

      {/* CONCEPT REVEAL — phone exchange */}
      <section id="concept" className="relative py-32 md:py-44" data-testid="concept-section">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <Reveal className="md:col-span-6 order-2 md:order-1">
            <p className="overline">02 — The ritual</p>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05] kerned text-balance">
              It begins with a simple exchange.
            </h2>
            <div className="mt-8 space-y-5 text-paper/75 text-lg leading-relaxed">
              <p>You hand over your smartphone.</p>
              <p>You receive a button phone.</p>
              <p className="text-paper">From that moment, something shifts.</p>
              <p>Attention returns. Conversations deepen. Time slows down.</p>
            </div>
            <div className="mt-10 flex items-center gap-4 text-paper/55">
              <Phone size={18} className="text-ember" />
              <span className="text-xs tracking-[0.24em] uppercase">One ritual. Two days. A different person.</span>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-6 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={PHONE_RITUAL} alt="Smartphone being exchanged for a button phone" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-paper/85">
                <p className="overline mb-2">The exchange</p>
                <p className="font-serif text-2xl">Glass for plastic. Noise for silence.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE POINTS */}
      <section id="experiences" className="relative py-32 md:py-44" data-testid="experience-section">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24">
            <div className="md:col-span-4">
              <p className="overline">03 — When nothing competes</p>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                  What happens when nothing is competing for your attention?
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <ExpCard className="md:col-span-7 aspect-[16/10]" img={CABIN_DINNER} icon={<Users size={18} />} title="Cook with strangers who become friends." caption="A long table. A slow flame. Someone's grandmother's recipe." />
            <ExpCard className="md:col-span-5 aspect-[4/5]" img={NATURE_DAWN} icon={<Mountain size={18} />} title="Wake to nature, not notifications." caption="Birds before alarms. Mist before the inbox." />
            <ExpCard className="md:col-span-5 aspect-[4/5]" img={CAMPFIRE} icon={<Flame size={18} />} title="Share stories without documenting them." caption="The kind of stories that only get told once." />
            <ExpCard className="md:col-span-7 aspect-[16/10]" img={HANDS} icon={<BookOpen size={18} />} title="Learn from people who live differently." caption="A potter. A farmer. A grandfather. Each carries an answer." />
          </div>

          {experiences.length > 0 && (
            <div className="mt-24 md:mt-32">
              <Reveal>
                <p className="overline mb-6">Upcoming editions</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.slice(0, 4).map((e) => (
                  <Link
                    key={e.id || e.slug}
                    to={`/experiences/${e.slug}`}
                    data-testid={`experience-card-${e.slug}`}
                    className="group relative block aspect-[16/10] overflow-hidden border border-paper/10 hover:border-ember transition-colors"
                  >
                    <img src={e.cover_image} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                      <p className="overline">{e.region_hint}</p>
                      <h3 className="font-serif text-2xl md:text-3xl mt-2 text-paper">{e.title}</h3>
                      <div className="mt-3 flex items-center justify-between text-xs text-paper/60 tracking-[0.18em] uppercase">
                        <span>{e.duration} · {e.cohort_size} people</span>
                        <span className="font-mono text-ember">₹{e.price_inr.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHERE WE GO — Bengal × Odisha */}
      <section id="where" className="relative py-32 md:py-44 border-t border-paper/10" data-testid="where-section">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="overline">04 — Where we go</p>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                  Two states. Four villages. <span className="italic text-paper/80">Zero signal.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-8 text-paper/65 max-w-2xl text-lg leading-relaxed">
                  We work only in places we've walked ourselves — partnered with the families, the singers, the boatmen, the potters who already live the unhurried life. No resorts. No staged authenticity.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 border-t border-paper/10">
            {[
              { region: "Birbhum, West Bengal", place: "Shantiniketan & the Khoai", note: "Red earth, Baul singers, mud-floor suppers." },
              { region: "Jalpaiguri, North Bengal", place: "The Dooars, near Gorumara", note: "Sal forests, tea-garden silence, Lepcha kitchens." },
              { region: "Kandhamal, Odisha", place: "Daringbadi pine country", note: "Pine smoke, coffee estates, Kondh folk song." },
              { region: "Angul, Odisha", place: "Satkosia gorge, Mahanadi", note: "Dugout boats, gorge shadows, stars without lamps." },
            ].map((row, i) => (
              <Reveal key={row.place} delay={i * 0.06}>
                <div className="flex items-baseline gap-6 md:gap-8 border-b border-paper/10 py-7 md:py-8">
                  <span className="num-display text-ember text-sm pt-1 w-10 shrink-0">/0{i + 1}</span>
                  <div className="flex-1">
                    <p className="overline text-paper/50">{row.region}</p>
                    <h3 className="font-serif text-2xl md:text-3xl mt-2 text-paper text-balance">{row.place}</h3>
                    <p className="mt-2 text-paper/60 text-sm md:text-base leading-relaxed">{row.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 text-xs tracking-[0.28em] uppercase text-paper/40 max-w-xl leading-relaxed">
              Specific villages and addresses are sealed until 24 hours before your weekend begins. The waiting is part of the weekend.
            </p>
          </Reveal>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative py-24 md:py-32 border-y border-paper/10" data-testid="countdown-section">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${NATURE_DAWN})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative container-page grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-5">
            <p className="overline mb-5">Next reveal</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-balance">
              The location is sealed until 24 hours before.
            </h2>
            <p className="mt-5 text-paper/65 max-w-md leading-relaxed">
              When the clock hits zero, twelve people receive the address. Until then, all you have is the wait — and the wait is part of it.
            </p>
          </div>
          <div className="md:col-span-7">
            <Countdown targetIso={countdown?.next_reveal_at} label="Reveal in" />
            <div className="mt-6 flex items-center gap-3 text-paper/55 text-xs tracking-[0.22em] uppercase">
              <MapPin size={14} className="text-ember" />
              <span>{countdown?.location_label || "Location revealed 24h before"}</span>
              <span className="ml-auto">{countdown?.seats_remaining ?? 12} seats remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-32 md:py-48" data-testid="testimonials-section">
        <div className="container-page max-w-4xl text-center">
          <Reveal>
            <p className="overline mb-10">05 — What people leave with</p>
          </Reveal>
          <div className="space-y-20 md:space-y-28">
            {(testimonials.length ? testimonials : [
              { id: 1, quote: "I didn't realize how numb I had become until this weekend.", attribution: "Founder, 34" },
              { id: 2, quote: "I came for a break. I left with perspective.", attribution: "Designer, 29" },
              { id: 3, quote: "It felt like I met myself again after years.", attribution: "Doctor, 41" },
            ]).map((t, i) => (
              <Reveal key={t.id || i} delay={i * 0.05}>
                <blockquote className="font-serif italic text-3xl md:text-5xl leading-[1.15] text-paper text-balance">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-6 text-xs tracking-[0.28em] uppercase text-paper/45">— {t.attribution}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION */}
      <section className="relative py-32 md:py-44 border-t border-paper/10" data-testid="differentiation-section">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="overline">06 — What this isn't</p>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05] kerned text-balance">
              This is not a retreat.
            </h2>
            <p className="mt-6 text-paper/65 max-w-md leading-relaxed">
              We don't sell silence. We don't promise transformation. We hand you a different kind of weekend — and let it do its work.
            </p>
          </div>
          <div className="md:col-span-7 space-y-6">
            {[
              ["Not passive.", "Fully immersive."],
              ["Not solitary.", "Deeply social."],
              ["Not curated for comfort.", "Curated for connection."],
              ["Not consumption.", "Participation."],
            ].map(([no, yes], i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline gap-6 md:gap-10 border-b border-paper/10 pb-5">
                  <span className="num-display text-paper/30 text-sm md:text-base w-8">0{i + 1}</span>
                  <span className="font-serif text-xl md:text-2xl text-paper/40 line-through decoration-paper/30">{no}</span>
                  <span className="font-serif italic text-2xl md:text-3xl text-paper">{yes}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative py-32 md:py-44" data-testid="how-it-works-section">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="overline">07 — The arc</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                Five steps. Most of them, you don't decide.
              </h2>
            </div>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-0 border-t border-paper/10">
            {[
              { t: "Apply anonymously", d: "An honest paragraph. No résumé." },
              { t: "Get selected", d: "We curate the cohort like a dinner party." },
              { t: "Location reveal", d: "Address arrives 24 hours before." },
              { t: "Phone swap", d: "Glass for plastic at the meetpoint." },
              { t: "48 hours of real", d: "What happens, stays unphotographed." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <li className="border-b md:border-b-0 md:border-r border-paper/10 last:border-r-0 p-6 md:p-8 h-full">
                  <span className="num-display text-ember text-sm tracking-[0.18em]">/0{i + 1}</span>
                  <h3 className="font-serif text-2xl md:text-[1.7rem] mt-4 leading-tight text-balance">{s.t}</h3>
                  <p className="mt-3 text-paper/55 text-sm leading-relaxed">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-32 md:py-44 border-t border-paper/10" data-testid="pricing-section">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="overline">08 — Pricing</p>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05] kerned text-balance">
              Premium by design — because intention matters.
            </h2>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <div className="num-display text-7xl md:text-9xl text-paper kerned">
                ₹12<span className="text-paper/40">k</span>
                <span className="text-paper/30 mx-3">—</span>
                ₹18<span className="text-paper/40">k</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-paper/70 text-lg max-w-lg leading-relaxed">
                Twelve seats per cohort. Curated experiences. Local partnerships. A weekend you'll think about for years.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-3 text-paper/70">
                {[
                  "All accommodation, food, and travel within the experience",
                  "A button phone for 48 hours (yours to keep)",
                  "Hand-written letter from a fellow participant",
                  "Locally-led workshop — Baul song, dokra craft, or river cooking",
                ].map((x, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="num-display text-ember text-sm pt-1">+</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/apply" className="ember-button" data-testid="pricing-apply-btn">
                  Apply for the next experience
                  <ArrowUpRight size={16} />
                </Link>
                <span className="text-xs text-paper/40 tracking-[0.22em] uppercase">No deposit until you're selected.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 md:py-48 overflow-hidden" data-testid="final-cta-section">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${CAMPFIRE})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        <div className="relative container-page max-w-4xl text-center">
          <Reveal>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.05] text-balance kerned">
              You don't need another app.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-2xl md:text-3xl font-serif italic text-paper/80">
              You need a different experience.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/apply" className="ember-button" data-testid="final-cta-btn">
                Reserve your spot
                <ArrowUpRight size={16} />
              </Link>
              <span className="text-xs text-paper/45 tracking-[0.22em] uppercase">12 seats. One weekend. No second chances this round.</span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ExpCard({ img, icon, title, caption, className = "" }) {
  return (
    <Reveal className={className}>
      <div className="group relative w-full h-full overflow-hidden border border-paper/5">
        <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
          <span className="text-ember mb-3 inline-flex">{icon}</span>
          <h3 className="font-serif text-2xl md:text-3xl text-paper leading-tight text-balance">{title}</h3>
          <p className="mt-3 text-paper/65 text-sm md:text-base max-w-md">{caption}</p>
        </div>
      </div>
    </Reveal>
  );
}
