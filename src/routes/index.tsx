import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Flame, Mountain, Users, BookOpen, MapPin, WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "@/components/site/Reveal";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/a442b8b5c46dd5c0aba75a7f85fe0c41e8bcc4d39a1b435c00a324223d2b7479.png";
const OFFLINE_RITUAL = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/4b65994cf91868d468e35ac4e28e488f09dff70c4c7489de85745a1102237673.png";
const CABIN_DINNER = "https://static.prod-images.emergentagent.com/jobs/8233dccd-e10a-45ac-93c0-5e1ff12eeb81/images/ad52708b4197fa2c641d5ec311ef1555a5b05fc0692a51bf181899fb1e1927ba.png";
const CAMPFIRE = "https://images.pexels.com/photos/36729452/pexels-photo-36729452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400";
const NATURE_DAWN = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80";
const HANDS = "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Ofline Co. — Log out. Show up." },
      { name: "description", content: "A weekend in the red-earth villages of Bengal and the quiet hills of Odisha — where strangers become real, and life feels like it used to." },
      { property: "og:title", content: "The Ofline Co. — Log out. Show up." },
      { property: "og:description", content: "48 hours offline. 12 seats. Application only." },
      { property: "og:image", content: HERO_IMG },
    ],
  }),
  component: Landing,
});

const testimonials = [
  { id: 1, quote: "I didn't realize how numb I had become until this weekend.", attribution: "Founder, 34" },
  { id: 2, quote: "I came for a break. I left with perspective.", attribution: "Designer, 29" },
  { id: 3, quote: "It felt like I met myself again after years.", attribution: "Doctor, 41" },
];

function Landing() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <div className="relative bg-ink text-paper min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-end pt-32 pb-20 md:pb-32">
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img src={HERO_IMG} alt="Misty forest at dawn" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/30 to-ink" />
          <div className="absolute inset-0 vignette" />
        </motion.div>

        <div className="relative container-page w-full">
          <Reveal>
            <p className="overline mb-6">
              <span className="inline-block w-8 h-px bg-ember align-middle mr-3" />
              48 hours offline · Bengal & Odisha
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight text-paper kerned text-balance">
              Log out.<br />
              <span className="italic text-paper/95">Show up.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-xl text-lg md:text-xl text-paper/80 leading-relaxed">
              A weekend in the red-earth villages of Bengal and the quiet hills of Odisha — where strangers become real, and life feels like it used to. No screens. No feeds. No performance.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/questionnaire" className="ember-button">
                Apply for the next experience
                <ArrowUpRight size={16} />
              </Link>
              <a href="#concept" className="ghost-button">
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
      <section className="relative py-32 md:py-44">
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

      {/* CONCEPT REVEAL */}
      <section id="concept" className="relative py-32 md:py-44">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <Reveal className="md:col-span-6 order-2 md:order-1">
            <p className="overline">02 — The ritual</p>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05] kerned text-balance">
              It begins when the outside world goes quiet.
            </h2>
            <div className="mt-8 space-y-5 text-paper/75 text-lg leading-relaxed">
              <p>For 48 hours, your phone stays offline.</p>
              <p>No feeds. No notifications. No performance.</p>
              <p className="text-paper">From that moment, something shifts.</p>
              <p>Attention returns. Conversations deepen. Time slows down.</p>
            </div>
            <div className="mt-10 flex items-center gap-4 text-paper/55">
              <WifiOff size={18} className="text-ember" />
              <span className="text-xs tracking-[0.24em] uppercase">One intention. Two days. A different pace.</span>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-6 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={OFFLINE_RITUAL} alt="A quiet offline moment before the weekend begins" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-paper/85">
                <p className="overline mb-2">The offline threshold</p>
                <p className="font-serif text-2xl">Noise softens. Presence begins.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE POINTS */}
      <section id="experiences" className="relative py-32 md:py-44">
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
        </div>
      </section>

      {/* EMOTIONAL ITINERARY */}
      <section id="where" className="relative py-32 md:py-44 border-t border-paper/10">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="overline">04 — The weekend arc</p>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                  A general rhythm — enough to feel it, not enough to over-plan it.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-8 text-paper/65 max-w-2xl text-lg leading-relaxed">
                  Before you reserve, we show the emotional shape of the weekend only. Exact stay details, weather, packing notes, and the specific schedule arrive after the reveal window opens.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-paper/10 pt-8">
            {[
              { day: "Day 1", items: ["Arrival", "Offline transition", "Shared dinner", "Slow introductions"] },
              { day: "Day 2", items: ["Sunrise activity", "Local experiences", "Long-table meals", "Stories under open skies"] },
              { day: "Day 3", items: ["Quiet morning", "Return journey", "Back online — differently"] },
            ].map((day, i) => (
              <Reveal key={day.day} delay={i * 0.08}>
                <article className="h-full border border-paper/10 bg-paper/[0.03] p-7 md:p-8">
                  <p className="num-display text-ember text-sm tracking-[0.18em]">{day.day}</p>
                  <ul className="mt-6 space-y-4 text-paper/70">
                    {day.items.map((item) => (
                      <li key={item} className="font-serif text-xl text-paper/85">{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-32 md:py-48">
        <div className="container-page max-w-4xl text-center">
          <Reveal>
            <p className="overline mb-10">05 — What people leave with</p>
          </Reveal>
          <div className="space-y-20 md:space-y-28">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.05}>
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
      <section className="relative py-32 md:py-44 border-t border-paper/10">
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
      <section id="how-it-works" className="relative py-32 md:py-44">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="overline">07 — The arc</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                Apply. Match. Reserve. Then let anticipation do its work.
              </h2>
            </div>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-0 border-t border-paper/10">
            {[
              { t: "Apply", d: "Choose the atmosphere you’re drawn to, then answer honestly." },
              { t: "Match", d: "Landscape preference meets emotional compatibility." },
              { t: "Curated cohort", d: "We shape the group like a calm dinner table." },
              { t: "Reserve seat", d: "Confirm the ₹14K booking only after the match feels right." },
              { t: "Reveal", d: "Exact destination details arrive 24 hours before departure." },
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

      {/* EXPERIENCE LANDSCAPES */}
      <section id="landscapes" className="relative py-32 md:py-44 border-t border-paper/10">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-20">
            <div className="md:col-span-4">
              <p className="overline">— Choose your atmosphere</p>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] kerned text-balance">
                  Which landscape feels closest to what you need <span className="italic text-paper/80">right now?</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 text-paper/65 max-w-2xl text-lg leading-relaxed">
                  Each cohort unfolds in a different atmosphere. Choose the one that quietly pulls you in.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                slug: "forest-silence",
                label: "🌲 Forest Silence",
                copy: "Quiet trails, misty mornings, slow conversations.",
                theme: "Silence · reset · stillness",
                img: "https://images.unsplash.com/photo-1542317854-5cdaee5b2548?auto=format&fit=crop&w=1600&q=80",
              },
              {
                slug: "mountains",
                label: "⛰️ Mountains",
                copy: "Cold air, sunrise stillness, emotional reset.",
                theme: "Reflection · slowness · emotional depth",
                img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
              },
              {
                slug: "coastline",
                label: "🌊 Coastline",
                copy: "Long-table dinners, sea air, slower time.",
                theme: "Creative softness · grounding · warmth",
                img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=80",
              },
              {
                slug: "rivers-wilderness",
                label: "🛶 Rivers & Wilderness",
                copy: "Boat lanterns, dark skies, deep presence.",
                theme: "Awe · detachment · immersion",
                img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
              },
            ].map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08}>
                <a
                  href={`/questionnaire?atmosphere=${c.slug}`}
                  className="group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden border border-paper/10"
                >
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                  <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-end">
                    <p className="overline text-paper/55 mb-3">Emotional landscape</p>
                    <h3 className="font-serif text-3xl md:text-4xl text-paper leading-[1.05] text-balance">{c.label}</h3>
                    <p className="mt-4 text-paper/75 text-sm md:text-base leading-relaxed max-w-md">{c.copy}</p>
                    <p className="mt-6 text-[0.65rem] tracking-[0.28em] uppercase text-ember/85">{c.theme}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <a
              href="/questionnaire?atmosphere=open"
              className="group mt-8 md:mt-10 block border border-paper/15 hover:border-ember/60 transition-colors duration-500 p-8 md:p-10 text-center"
            >
              <p className="overline text-paper/55 mb-3">— A fifth path</p>
              <h3 className="font-serif italic text-2xl md:text-3xl text-paper">
                I'm open to wherever feels right.
              </h3>
              <p className="mt-3 text-paper/55 text-sm">Let us read your answers and choose the landscape for you.</p>
            </a>
          </Reveal>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-32 md:py-44 border-t border-paper/10">
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
                ₹14<span className="text-paper/40">k</span>
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
                  "48 hours intentionally offline — no feeds, notifications, or performance",
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
                <Link to="/questionnaire" className="ember-button">
                  Apply for the next experience
                  <ArrowUpRight size={16} />
                </Link>
                <span className="text-xs text-paper/40 tracking-[0.22em] uppercase">Apply → Match → Reserve Seat → ₹14K booking.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COUNTDOWN strip */}
      <section className="relative py-24 md:py-32 border-y border-paper/10">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${NATURE_DAWN})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative container-page grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="overline mb-5">Next reveal</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-balance">
              Your exact destination is revealed 24 hours before departure.
            </h2>
            <p className="mt-5 text-paper/65 max-w-md leading-relaxed">
              After you reserve, a countdown begins. Until then, the anticipation is part of the experience.
            </p>
          </div>
          <div className="md:col-span-5 flex items-center gap-3 text-paper/55 text-xs tracking-[0.22em] uppercase">
            <MapPin size={14} className="text-ember" />
            <span>Exact destination revealed 24h before</span>
            <span className="ml-auto">12 seats remaining</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 md:py-48 overflow-hidden">
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
              <Link to="/questionnaire" className="ember-button">
                Reserve your seat
                <ArrowUpRight size={16} />
              </Link>
              <span className="text-xs text-paper/45 tracking-[0.22em] uppercase">12 seats. One weekend. No second chances this round.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ExpCard({
  img,
  icon,
  title,
  caption,
  className = "",
}: {
  img: string;
  icon: ReactNode;
  title: string;
  caption: string;
  className?: string;
}) {
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
