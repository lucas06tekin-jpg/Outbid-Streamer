"use client";

import { useEffect, useRef } from "react";

const HOP_DURATION_MS = 550;
const HOP_ARC_PX = 26;
const PAUSE_MIN_MS = 1200;
const PAUSE_MAX_MS = 3200;
const MARGIN = 40;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function CursorMascot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const wrapper = wrapperRef.current;
    const flip = flipRef.current;
    const body = bodyRef.current;
    if (!wrapper || !flip || !body) return;

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    let x = Math.random() * (window.innerWidth - 2 * MARGIN) + MARGIN;
    let y = Math.random() * (window.innerHeight - 2 * MARGIN) + MARGIN;
    wrapper.style.transform = `translate(${x}px, ${y}px)`;
    wrapper.style.opacity = "1";

    function pickTarget() {
      const nx = Math.random() * (window.innerWidth - 2 * MARGIN) + MARGIN;
      const ny = Math.random() * (window.innerHeight - 2 * MARGIN) + MARGIN;
      return { nx, ny };
    }

    function hop() {
      if (cancelled) return;
      const startX = x;
      const startY = y;
      const { nx, ny } = pickTarget();
      flip!.style.transform = `scaleX(${nx < startX ? -1 : 1})`;

      const start = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / HOP_DURATION_MS);
        const eased = easeInOutQuad(progress);

        x = startX + (nx - startX) * eased;
        y = startY + (ny - startY) * eased;
        const arc = Math.sin(progress * Math.PI) * HOP_ARC_PX;
        const squash = 1 - Math.sin(progress * Math.PI) * 0.15;

        wrapper!.style.transform = `translate(${x}px, ${y - arc}px)`;
        body!.style.transform = `scaleY(${squash}) scaleX(${1 + (1 - squash) * 0.6})`;

        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          body!.style.transform = "scaleY(1) scaleX(1)";
          timeout = setTimeout(hop, PAUSE_MIN_MS + Math.random() * (PAUSE_MAX_MS - PAUSE_MIN_MS));
        }
      };

      raf = requestAnimationFrame(step);
    }

    timeout = setTimeout(hop, 800);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 opacity-0"
      style={{ willChange: "transform" }}
    >
      <div ref={flipRef}>
        <div ref={bodyRef} style={{ transformOrigin: "50% 100%" }}>
          <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="19" cy="27" rx="4.5" ry="2.4" fill="#5b3f2e" />
            <ellipse cx="29" cy="27" rx="4.5" ry="2.4" fill="#5b3f2e" />
            <path
              d="M9 22C4 22 1 17.5 1 13.5C1 6 8 1 17 1C26.5 1 34 8 35.5 16C36.3 20.3 34 24 29 24.5C22 25.2 14 24.5 9 22Z"
              fill="#8B5E3C"
            />
            <path
              d="M10 23.5C6.5 23.5 3.8 20.5 4.5 16.5C7 19 12 21.5 19 22C24 22.4 29.5 21.8 32.5 19.5C31.5 22.7 27.5 24.7 22 24.9C17.5 25 12.8 24.4 10 23.5Z"
              fill="#F3E1C8"
            />
            <path d="M14 2L10 8L17 6.5L14 2Z" fill="#8B5E3C" />
            <path d="M20 1.5L18 8L25 7.5L20 1.5Z" fill="#8B5E3C" />
            <path d="M26 3L25.5 9.5L32 10.5L26 3Z" fill="#8B5E3C" />
            <path d="M31 6.5L32 12.5L37 14.5L31 6.5Z" fill="#8B5E3C" />
            <path d="M8 5L5.5 10.5L12 10L8 5Z" fill="#8B5E3C" />
            <circle cx="8.5" cy="13" r="1.4" fill="#241A12" />
            <circle cx="2.5" cy="14.5" r="1.6" fill="#241A12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
