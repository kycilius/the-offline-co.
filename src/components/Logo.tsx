import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="TheOfflineCo home"
    >
      {/* Logo mark — black bg blends in dark mode; screen blend hides it on light */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 md:h-10 md:w-10 object-contain dark:mix-blend-normal"
        style={{ mixBlendMode: "screen" }}
      />
      <span className="font-display text-lg md:text-xl tracking-tight text-foreground leading-none">
        <span className="font-light">The</span>
        <span className="font-bold text-primary">Offline</span>
        <span className="font-light">Co</span>
      </span>
    </Link>
  );
}
