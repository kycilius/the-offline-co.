import React from "react";

/**
 * GrainOverlay — fixed full-viewport noise/film texture.
 * SVG noise is generated inline so we don't depend on an image asset.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      data-testid="grain-overlay"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay opacity-[0.18] animate-grain-shift"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.96 0 0 0 0 0.96 0 0 0 0 0.95 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize: "220px 220px",
      }}
    />
  );
}
