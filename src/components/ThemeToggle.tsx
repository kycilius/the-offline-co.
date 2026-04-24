import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "toc-theme";

function getInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:text-primary hover:border-primary/40"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
