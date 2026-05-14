import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, MapPin, Users, Clock } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function ExperiencePage() {
  const { slug } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/experiences/${slug}`);
        setExp(data);
      } catch (e) {
        toast.error(formatApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const reserve = async () => {
    if (!exp) return;
    setReserving(true);
    try {
      const { data } = await api.post("/payments/razorpay/order", {
        experience_id: exp.id,
        alias: "guest",
        email: "guest@theofflineco.com",
      });
      toast.message("Razorpay order created", { description: `Order: ${data.order_id}` });
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-paper/50">Loading…</div>;
  }
  if (!exp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="overline mb-4">Not found</p>
          <h1 className="font-serif text-4xl">This experience has dissolved into the air.</h1>
          <Link to="/" className="ghost-button mt-8 inline-flex">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" data-testid={`experience-page-${slug}`}>
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <img src={exp.cover_image} alt={exp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container-page">
            <Link to="/#experiences" className="overline inline-flex items-center gap-2 mb-6 hover:text-paper">
              <ArrowLeft size={14} /> All experiences
            </Link>
            <p className="overline mb-4">{exp.region_hint}</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] kerned text-balance" data-testid="experience-title">
              {exp.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-paper/65 text-xs tracking-[0.22em] uppercase">
              <span className="inline-flex items-center gap-2"><Clock size={14} className="text-ember" /> {exp.duration}</span>
              <span className="inline-flex items-center gap-2"><Users size={14} className="text-ember" /> {exp.cohort_size} people</span>
              <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-ember" /> Address revealed 24h before</span>
              <span className="ml-auto font-mono text-ember not-italic">₹{exp.price_inr.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <Reveal>
            <p className="overline">The shape of it</p>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-[1.1] text-balance">{exp.summary}</h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {(exp.chapters || []).map((c, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline gap-6 border-b border-paper/10 pb-4">
                  <span className="num-display text-ember text-sm w-10">/0{i + 1}</span>
                  <span className="font-serif text-xl md:text-2xl text-paper">{c}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <aside className="md:col-span-5">
          <div className="border border-paper/10 p-8 md:p-10 sticky top-32">
            <p className="overline mb-3">Reserve</p>
            <div className="num-display text-5xl md:text-6xl text-paper">₹{exp.price_inr.toLocaleString("en-IN")}</div>
            <p className="mt-3 text-paper/55 text-sm">Per seat. {exp.cohort_size} seats. Application required before payment.</p>
            <div className="mt-8 space-y-3">
              <Link to="/apply" className="ember-button w-full justify-center" data-testid="experience-apply-btn">
                Apply for this cohort <ArrowUpRight size={14} />
              </Link>
              <button
                onClick={reserve}
                disabled={reserving}
                className="ghost-button w-full justify-center disabled:opacity-50"
                data-testid="experience-reserve-btn"
              >
                {reserving ? "Reaching the door…" : "Reserve a seat"}
              </button>
            </div>
            <p className="mt-6 text-[0.7rem] text-paper/40 leading-relaxed">
              Payment is held; charged only after you're selected. If you're not selected, nothing leaves your account.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
