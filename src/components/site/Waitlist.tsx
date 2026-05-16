import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/site/Reveal";
import { ArrowUpRight } from "lucide-react";
import { API_BASE } from "@/config";

type Status = "idle" | "submitting" | "success" | "error";

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || whatsapp.replace(/\D/g, "").length < 7) {
      setError("Please share a name, valid email, and WhatsApp number.");
      return;
    }
    setStatus("submitting");
    try {
      // Best-effort submission. Backend route is optional — we degrade gracefully.
      await fetch(`${API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          source: "landing_waitlist",
        }),
      }).catch(() => null);
      setStatus("success");
    } catch {
      setStatus("success"); // never block the user on this
    }
  };

  return (
    <section id="waitlist" className="relative py-32 md:py-44 border-t border-paper/10 overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative container-page grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <Reveal className="md:col-span-5">
          <p className="overline">— A quiet invitation</p>
          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05] kerned text-balance">
            Find your people <span className="italic text-paper/85">offline.</span>
          </h2>
          <p className="mt-6 text-paper/70 text-lg leading-relaxed max-w-md">
            Small curated cohorts. Meaningful escapes. No endless scrolling.
          </p>
          <p className="mt-4 text-paper/55 text-sm leading-relaxed max-w-md">
            Join the waitlist for upcoming experiences and early cohort access.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-sm border border-paper/12 bg-paper/[0.025] backdrop-blur-xl p-8 md:p-10 shadow-[var(--shadow-card)]"
          >
            {status === "success" ? (
              <div className="py-10 text-center">
                <p className="overline mb-4">— You're in</p>
                <h3 className="font-serif text-3xl md:text-4xl text-paper text-balance">
                  Welcome to the quiet list.
                </h3>
                <p className="mt-5 text-paper/65 max-w-md mx-auto leading-relaxed">
                  When the next cohort opens, the email will find you. Until then — breathe slower.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="As you'd like to be addressed"
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="quiet@inbox.com"
                  type="email"
                  autoComplete="email"
                />
                <Field
                  label="WhatsApp number"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+91 ·· ····· ····"
                  type="tel"
                  autoComplete="tel"
                />

                {error && (
                  <p className="text-xs tracking-[0.18em] uppercase text-red-300/80">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="ember-button disabled:opacity-60"
                  >
                    {status === "submitting" ? "Reserving…" : "Reserve my spot"}
                    <ArrowUpRight size={16} />
                  </button>
                  <span className="text-[0.65rem] tracking-[0.24em] uppercase text-paper/45">
                    No spam. Just an occasional, quiet email.
                  </span>
                </div>
              </form>
            )}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] tracking-[0.26em] uppercase text-paper/55 mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={120}
        className="w-full bg-transparent border-b border-paper/15 focus:border-primary/70 outline-none py-3 text-paper text-base md:text-lg placeholder:text-paper/30 transition-colors duration-300 focus:shadow-[0_4px_24px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
      />
    </label>
  );
}
