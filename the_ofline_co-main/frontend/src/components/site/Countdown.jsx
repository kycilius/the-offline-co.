import React, { useEffect, useState } from "react";

function pad(n) { return String(n).padStart(2, "0"); }

export default function Countdown({ targetIso, label = "Next reveal in", testId = "countdown" }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!targetIso) return null;
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const cells = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: minutes, l: "Minutes" },
    { v: seconds, l: "Seconds" },
  ];

  return (
    <div data-testid={testId} className="w-full">
      <p className="overline mb-5">{label}</p>
      <div className="grid grid-cols-4 gap-3 md:gap-8">
        {cells.map((c, i) => (
          <div key={c.l} className="border-l border-paper/10 pl-3 md:pl-6 first:border-l-0 first:pl-0">
            <div
              className="num-display text-4xl sm:text-5xl md:text-7xl text-paper kerned"
              data-testid={`countdown-${c.l.toLowerCase()}`}
            >
              {pad(c.v)}
            </div>
            <div className="mt-2 text-[0.65rem] tracking-[0.28em] uppercase text-paper/45">{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
