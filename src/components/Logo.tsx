import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="TheOfflineCo home">
      {/* Light mode: multiply blend hides the white background */}
      <img
        src={logo}
        alt="TheOfflineCo"
        className="h-10 w-auto md:h-11 block dark:hidden"
        style={{ mixBlendMode: "multiply" }}
      />
      {/* Dark mode: invert the dark text/icon to light, screen blend hides white bg */}
      <img
        src={logo}
        alt="TheOfflineCo"
        className="h-10 w-auto md:h-11 hidden dark:block"
        style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.15)", mixBlendMode: "screen" }}
      />
    </Link>
  );
}
