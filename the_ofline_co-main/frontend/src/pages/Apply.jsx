import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const STEPS = [
  { id: "alias",            label: "Choose an anonymous alias",     desc: "We never use your real name in the cohort." },
  { id: "contact",          label: "Where can we reach you?",       desc: "Used only to confirm your selection." },
  { id: "why",              label: "Why are you applying?",          desc: "An honest paragraph beats a perfect one." },
  { id: "context",          label: "A little context",               desc: "Helps us curate the cohort." },
  { id: "review",           label: "Review",                         desc: "Send when ready. We read every one." },
];

export default function Apply() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    alias: "",
    email: "",
    phone: "",
    age_range: "",
    city: "",
    why_offline: "",
    digital_overload_score: 6,
    preferred_window: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.alias.trim().length >= 2;
    if (step === 1) return /\S+@\S+\.\S+/.test(form.email);
    if (step === 2) return form.why_offline.trim().length >= 10;
    return true;
  };

  const next = () => { if (canNext()) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post("/applications", form);
      setDone(true);
      toast.success("Application received. We'll be in touch.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20" data-testid="apply-success">
        <div className="max-w-2xl text-center">
          <p className="overline mb-6">Application received</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-balance kerned">
            We'll find you when it's time.
          </h1>
          <p className="mt-8 text-paper/70 text-lg leading-relaxed">
            We read every application personally. If you're a fit for the next cohort,
            an email will arrive — quietly, without notification sounds.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link to="/" className="ghost-button" data-testid="apply-back-home">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6" data-testid="apply-page">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="overline inline-flex items-center gap-2 mb-12 hover:text-paper">
          <ArrowLeft size={14} /> The Ofline Co.
        </Link>

        <div className="mb-12">
          <div className="flex items-center justify-between text-xs tracking-[0.22em] uppercase text-paper/45 mb-3">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step].label}</span>
          </div>
          <div className="h-px bg-paper/10 relative overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-ember" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p className="overline">{`0${step + 1}`}</p>
            <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-[1.05] text-balance">
              {STEPS[step].label}
            </h1>
            <p className="mt-3 text-paper/55">{STEPS[step].desc}</p>

            <div className="mt-12 space-y-8">
              {step === 0 && (
                <div>
                  <label className="editorial-label">Alias</label>
                  <input
                    autoFocus
                    data-testid="apply-alias-input"
                    className="editorial-input"
                    placeholder="e.g. river_walker"
                    value={form.alias}
                    onChange={(e) => set("alias", e.target.value)}
                  />
                </div>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="editorial-label">Email</label>
                    <input
                      autoFocus
                      type="email"
                      data-testid="apply-email-input"
                      className="editorial-input"
                      placeholder="you@elsewhere.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="editorial-label">Phone (optional)</label>
                    <input
                      type="tel"
                      data-testid="apply-phone-input"
                      className="editorial-input"
                      placeholder="+91 ··· ··· ····"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="editorial-label">Why offline, why now?</label>
                  <textarea
                    autoFocus
                    rows={6}
                    data-testid="apply-why-input"
                    className="editorial-input resize-none"
                    placeholder="Write the way you'd write to a friend at 2 a.m."
                    value={form.why_offline}
                    onChange={(e) => set("why_offline", e.target.value)}
                  />
                  <p className="mt-3 text-xs text-paper/40">{form.why_offline.length} characters</p>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="editorial-label">Age range</label>
                      <input
                        data-testid="apply-age-input"
                        className="editorial-input"
                        placeholder="e.g. 28–34"
                        value={form.age_range}
                        onChange={(e) => set("age_range", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="editorial-label">City</label>
                      <input
                        data-testid="apply-city-input"
                        className="editorial-input"
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="editorial-label flex items-center justify-between">
                      <span>Digital overload — how heavy?</span>
                      <span className="num-display text-ember text-sm">{form.digital_overload_score}/10</span>
                    </label>
                    <input
                      type="range"
                      min={1} max={10}
                      data-testid="apply-overload-input"
                      className="w-full mt-3 accent-ember"
                      value={form.digital_overload_score}
                      onChange={(e) => set("digital_overload_score", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="editorial-label">Preferred window (optional)</label>
                    <input
                      data-testid="apply-window-input"
                      className="editorial-input"
                      placeholder="e.g. Any weekend in Feb"
                      value={form.preferred_window}
                      onChange={(e) => set("preferred_window", e.target.value)}
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <div className="border border-paper/10 p-6 md:p-8 space-y-4 text-paper/80" data-testid="apply-review">
                  <Row k="Alias" v={form.alias} />
                  <Row k="Email" v={form.email} />
                  {form.phone && <Row k="Phone" v={form.phone} />}
                  {form.age_range && <Row k="Age" v={form.age_range} />}
                  {form.city && <Row k="City" v={form.city} />}
                  <Row k="Overload" v={`${form.digital_overload_score}/10`} />
                  {form.preferred_window && <Row k="Window" v={form.preferred_window} />}
                  <div>
                    <p className="editorial-label mb-2">Why offline</p>
                    <p className="text-paper/85 italic font-serif text-lg leading-relaxed">"{form.why_offline}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-14 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button onClick={back} className="ghost-button" data-testid="apply-back-btn">
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  disabled={!canNext()}
                  className="ember-button disabled:opacity-30 disabled:cursor-not-allowed"
                  data-testid="apply-next-btn"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="ember-button disabled:opacity-50"
                  data-testid="apply-submit-btn"
                >
                  {submitting ? "Sending…" : "Send application"} <Check size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-paper/10 pb-3">
      <span className="editorial-label">{k}</span>
      <span className="text-paper text-right">{v}</span>
    </div>
  );
}
