import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="TheOfflineCo home">
      <img
        src={logo}
        alt="TheOfflineCo"
        className="h-9 w-auto md:h-10 dark:invert dark:brightness-110"
        style={{ mixBlendMode: "multiply" }}
      />
    </Link>
  );
}
