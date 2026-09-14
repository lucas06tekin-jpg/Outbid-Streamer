"use client";

import { useEffect, useRef } from "react";

const EASE = 0.14;
const OFFSET_X = 18;
const OFFSET_Y = 22;

export default function CursorMascot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarsePointer || reducedMotion) return;

    const wrapper = wrapperRef.current;
    const flip = flipRef.current;
    if (!wrapper || !flip) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let facing = 1;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        visible = true;
        wrapper.style.opacity = "1";
      }
    };

    const tick = () => {
      const dx = targetX - x;
      x += dx * EASE;
      y += (targetY - y) * EASE;

      if (Math.abs(dx) > 0.5) {
        facing = dx < 0 ? -1 : 1;
        flip.style.transform = `scaleX(${facing})`;
      }

      wrapper.style.transform = `translate(${x + OFFSET_X}px, ${y + OFFSET_Y}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-300"
      style={{ willChange: "transform" }}
    >
      <div ref={flipRef}>
        <div className="animate-mascot-bob">
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
