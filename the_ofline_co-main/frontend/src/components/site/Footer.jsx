import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-paper/10 mt-12" data-testid="site-footer">
      <div className="container-page py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="overline">A premium offline experience</p>
          <h3 className="font-serif text-3xl md:text-4xl mt-3 text-balance">The Ofline Co.</h3>
          <p className="mt-3 text-xs text-paper/45 tracking-[0.24em] uppercase">Bengal × Odisha · Est. 2025</p>
          <p className="mt-5 text-paper/60 max-w-md leading-relaxed">
            We don't make content. We make weekends you remember without a single photo — held in red-earth villages, Dooars forests, and Odisha's quiet hills.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="editorial-label mb-4">Wander</p>
          <ul className="space-y-3 text-paper/70 text-sm">
            <li><a href="/#concept" className="hover:text-ember">The Ritual</a></li>
            <li><a href="/#experiences" className="hover:text-ember">Experiences</a></li>
            <li><a href="/#how-it-works" className="hover:text-ember">How It Works</a></li>
            <li><a href="/#pricing" className="hover:text-ember">Pricing</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="editorial-label mb-4">Whisper</p>
          <p className="text-paper/70 text-sm leading-relaxed">
            Locations are not announced. Cohorts are not advertised.<br />
            If you're meant to be there, the email will find you.
          </p>
          <Link to="/apply" className="ember-button mt-6" data-testid="footer-apply-btn">Apply for the next experience</Link>
        </div>
      </div>
      <div className="container-page py-6 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-paper/40">
        <p>© {new Date().getFullYear()} The Ofline Co. — All quiet rights reserved.</p>
        <p className="font-mono">Made offline. Mostly.</p>
      </div>
    </footer>
  );
}
