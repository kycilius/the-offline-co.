import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor — desktop only. An amber dot that hugs the mouse and a larger
 * ring that trails behind with spring physics. Disabled on touch devices.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const t = e.target;
      if (t && t.closest && t.closest("a, button, input, textarea, select, [data-cursor-hover]")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[80] rounded-full"
        style={{
          x, y,
          width: hovering ? 14 : 8,
          height: hovering ? 14 : 8,
          translateX: "-50%",
          translateY: "-50%",
          background: "#D97706",
          mixBlendMode: "screen",
          transition: "width 200ms ease, height 200ms ease",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[80] rounded-full"
        style={{
          x: ringX, y: ringY,
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          translateX: "-50%",
          translateY: "-50%",
          border: "1px solid #D97706",
          opacity: hovering ? 0.7 : 0.45,
          transition: "width 200ms ease, height 200ms ease, opacity 200ms ease",
        }}
      />
    </>
  );
}
