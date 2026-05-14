import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/#concept", label: "The Ritual" },
  { to: "/#experiences", label: "Experiences" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/#pricing", label: "Pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? "glass" : ""}`}
    >
      <div className="container-page flex items-center justify-between py-5 md:py-6">
        <Link to="/" data-testid="nav-logo" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl md:text-2xl text-paper">The Ofline Co.</span>
          <span className="hidden md:inline overline">Est. 2025</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[0.8rem] tracking-[0.18em] uppercase text-paper/70 hover:text-ember transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/apply" className="ghost-button" data-testid="nav-apply-btn">Apply</Link>
        </div>

        <button
          className="md:hidden text-paper p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden glass border-t border-paper/10"
          >
            <div className="container-page py-6 flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.to}
                  href={l.to}
                  className="text-sm tracking-[0.18em] uppercase text-paper/80"
                  data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {l.label}
                </a>
              ))}
              <Link to="/apply" className="ember-button mt-2 self-start" data-testid="nav-mobile-apply">Apply</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
