import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/loading")({
  head: () => ({
    meta: [{ title: "Finding your group — TheOfflineCo" }],
  }),
  component: Loading,
});

function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/result" }), 3800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen flex-col" style={{ background: "var(--gradient-warm)" }}>
      <header className="mx-auto w-full max-w-3xl px-6 py-6">
        <Logo />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Pulsing rings */}
        <div className="relative mb-12 h-32 w-32">
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[pulse-soft_2.4s_ease-in-out_infinite]" />
          <div className="absolute inset-3 rounded-full border border-primary/40 animate-[pulse-soft_2.4s_ease-in-out_infinite_0.3s]" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-primary-glow animate-[pulse-soft_2.4s_ease-in-out_infinite_0.6s]" />
        </div>

        <h2 className="font-display text-3xl font-light text-foreground md:text-4xl animate-[fade-up_0.8s_ease-out]">
          Finding your perfect group
          <span className="inline-flex ml-1">
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite]">.</span>
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite_0.2s]">.</span>
            <span className="animate-[pulse-soft_1.4s_ease-in-out_infinite_0.4s]">.</span>
          </span>
        </h2>

        <p className="mt-6 max-w-md text-base font-light text-muted-foreground animate-[fade-up_1.1s_ease-out]">
          We're creating a meaningful experience just for you.
        </p>
      </section>
    </main>
  );
}
