"use client";

import { useEffect, useRef, useState } from "react";

const PLACEHOLDER_ITEMS = ["Coming soon", "Coming soon", "Coming soon"];
const HEART_COUNT = 7;
const HEART_LIFETIME_MS = 1400;
const HIGHLIGHT_LIFETIME_MS = 1500;

function HedgehogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
  );
}

function spawnHearts(target: Element) {
  const rect = target.getBoundingClientRect();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "60";
  document.body.appendChild(container);

  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement("span");
    heart.textContent = "❤";
    heart.className = "hedgehog-cheer-heart";
    heart.style.left = `${rect.left + rect.width * (0.15 + Math.random() * 0.7)}px`;
    heart.style.top = `${rect.top + rect.height * 0.3}px`;
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
    heart.style.animationDelay = `${i * 55}ms`;
    heart.style.fontSize = `${14 + Math.random() * 10}px`;
    container.appendChild(heart);
  }

  setTimeout(() => container.remove(), HEART_LIFETIME_MS + HEART_COUNT * 55 + 100);
}

function cheerForRandomStreamer() {
  const rows = Array.from(document.querySelectorAll("[data-streamer-row]"));
  if (rows.length === 0) return false;

  const row = rows[Math.floor(Math.random() * rows.length)];
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  row.classList.add("hedgehog-cheer-highlight");
  setTimeout(() => row.classList.remove("hedgehog-cheer-highlight"), HIGHLIGHT_LIFETIME_MS);
  window.setTimeout(() => spawnHearts(row), 250);
  return true;
}

export default function HedgehogMenu() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleCheer() {
    setOpen(false);
    const found = cheerForRandomStreamer();
    if (!found) {
      setNotice("Visit the leaderboard to cheer for a streamer!");
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Hedgehog menu"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 transition hover:brightness-95"
      >
        <HedgehogIcon className="h-6 w-6" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCheer}
            className="block w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-surface-2"
          >
            🎉 Cheer for a streamer
          </button>
          {PLACEHOLDER_ITEMS.map((label, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled
              className="block w-full cursor-not-allowed px-4 py-2 text-left text-sm text-muted"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-muted shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
