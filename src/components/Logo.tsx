import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-glow)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c3 4 3 8 0 12-3-4-3-8 0-12z" />
          <path d="M12 14v8" />
        </svg>
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        TheOffline<span className="text-primary">Co</span>
      </span>
    </Link>
  );
}
