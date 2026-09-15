"use client";

import { useEffect, useRef, useState } from "react";

const PLACEHOLDER_ITEMS = ["Coming soon", "Coming soon", "Coming soon"];
const HEART_COUNT = 7;

// Small, frequent hops rather than a few long leaps: each hop covers at most
// HOP_STEP_PX, and the chain just keeps hopping until it's within reach.
const HOP_STEP_PX = 70;
const HOP_DURATION_MS = 170;
const HOP_GAP_MS = 55;
const HOP_ARC_PX = 13;
const MAX_HOPS_SAFETY = 60;

const JOY_HOP_COUNT = 7;
const JOY_HOP_DURATION_MS = 150;
const JOY_HOP_GAP_MS = 30;
const JOY_HOP_ARC_PX = 9;
const JOY_HOP_AMPLITUDE_PX = 13;
const HIGHLIGHT_LIFETIME_MS = 2200;
const RETURN_DELAY_MS = 400;
const TRAVELER_HALF_WIDTH = 24;
const TRAVELER_HALF_HEIGHT = 20;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="28" cy="42" rx="24" ry="3" fill="currentColor" opacity="0.12" />
      <path
        d="M3 40C3 22 12 8 28 8C44 8 53 22 53 40C53 41.1 52.1 42 51 42H5C3.9 42 3 41.1 3 40Z"
        fill="#8a6a48"
      />
      <path d="M28 8C31.5 8 34.5 5 34.5 2C34.5 4.5 32.5 6 28 6C23.5 6 21.5 4.5 21.5 2C21.5 5 24.5 8 28 8Z" fill="#6f8f4a" />
      <ellipse cx="28" cy="41" rx="13" ry="11" fill="#2c1d12" />
    </svg>
  );
}

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

function spawnHearts(x: number, y: number) {
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
    heart.style.left = `${x + (Math.random() - 0.5) * 44}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
    heart.style.animationDelay = `${i * 55}ms`;
    heart.style.fontSize = `${14 + Math.random() * 10}px`;
    container.appendChild(heart);
  }

  setTimeout(() => container.remove(), 1400 + HEART_COUNT * 55 + 100);
}

type StreamerOption = { name: string; slug: string };

export default function HedgehogMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "pick">("main");
  const [streamers, setStreamers] = useState<StreamerOption[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [peeking, setPeeking] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const travelerFlipRef = useRef<HTMLDivElement>(null);
  const travelerBodyRef = useRef<HTMLDivElement>(null);
  // Bumped on every new travel/dance run so a fresh pick invalidates any
  // still-running animation chain instead of fighting it for the same
  // traveler element.
  const runTokenRef = useRef(0);

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

  useEffect(() => {
    return () => {
      runTokenRef.current += 1;
    };
  }, []);

  function celebrateAt(row: Element, x: number, y: number) {
    row.classList.add("hedgehog-cheer-highlight");
    spawnHearts(x, y);
  }

  /** Animates the traveler in a single short arced hop from (fromX, fromY) to
   *  (toX, toY), calling onDone(toX, toY) once it lands. Aborts if `token` no
   *  longer matches the current run (a newer pick started a fresh chain). */
  function animateHop(
    token: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    duration: number,
    arcPx: number,
    onDone: (x: number, y: number) => void
  ) {
    const traveler = travelerRef.current;
    const flip = travelerFlipRef.current;
    const body = travelerBodyRef.current;
    if (!traveler || !flip || !body) return;

    flip.style.transform = `scaleX(${toX < fromX ? -1 : 1})`;
    // eslint-disable-next-line react-hooks/purity -- animation timer start, read from an event/rAF callback, never during render
    const start = performance.now();

    const step = (now: number) => {
      if (runTokenRef.current !== token) return;
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeInOutQuad(progress);
      const x = fromX + (toX - fromX) * eased;
      const y = fromY + (toY - fromY) * eased;
      const arc = Math.sin(progress * Math.PI) * arcPx;
      const squash = 1 - Math.sin(progress * Math.PI) * 0.18;

      traveler.style.transform = `translate(${x - TRAVELER_HALF_WIDTH}px, ${y - arc - TRAVELER_HALF_HEIGHT}px)`;
      body.style.transform = `scaleY(${squash}) scaleX(${1 + (1 - squash) * 0.6})`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        body.style.transform = "scaleY(1) scaleX(1)";
        onDone(toX, toY);
      }
    };

    requestAnimationFrame(step);
  }

  /** Hops in short, fixed-length steps toward a (possibly moving/scrolling)
   *  target until within reach, then calls onArrive with the landing point. */
  function hopChain(
    token: number,
    startX: number,
    startY: number,
    getTarget: () => { tx: number; ty: number },
    onArrive: (x: number, y: number) => void
  ) {
    let x = startX;
    let y = startY;
    let safety = MAX_HOPS_SAFETY;

    const step = () => {
      if (runTokenRef.current !== token) return;
      if (safety-- <= 0) {
        onArrive(x, y);
        return;
      }

      const { tx, ty } = getTarget();
      const dx = tx - x;
      const dy = ty - y;
      const dist = Math.hypot(dx, dy);

      if (dist < 2) {
        onArrive(x, y);
        return;
      }

      const hopDist = Math.min(HOP_STEP_PX, dist);
      const nx = x + (dx / dist) * hopDist;
      const ny = y + (dy / dist) * hopDist;
      const isLast = hopDist >= dist - 0.5;

      animateHop(token, x, y, nx, ny, HOP_DURATION_MS, HOP_ARC_PX, (ax, ay) => {
        x = ax;
        y = ay;
        if (isLast) {
          onArrive(x, y);
        } else {
          setTimeout(step, HOP_GAP_MS);
        }
      });
    };

    step();
  }

  /** Little happy side-to-side hop dance in place, then hops back home to the
   *  house instead of just vanishing. */
  function joyDance(token: number, row: Element, centerX: number, centerY: number) {
    let hopsLeft = JOY_HOP_COUNT;
    let x = centerX;
    let y = centerY;
    let direction = 1;

    const settle = () => {
      if (runTokenRef.current !== token) return;
      animateHop(token, x, y, centerX, centerY, JOY_HOP_DURATION_MS, JOY_HOP_ARC_PX * 0.6, () => {
        row.classList.remove("hedgehog-cheer-highlight");
        setTimeout(() => hopHome(token, centerX, centerY), RETURN_DELAY_MS);
      });
    };

    const nextJoyHop = () => {
      if (runTokenRef.current !== token) return;
      if (hopsLeft <= 0) {
        settle();
        return;
      }
      hopsLeft -= 1;
      const targetX = centerX + direction * JOY_HOP_AMPLITUDE_PX;
      direction *= -1;
      animateHop(token, x, y, targetX, centerY, JOY_HOP_DURATION_MS, JOY_HOP_ARC_PX, (nx, ny) => {
        x = nx;
        y = ny;
        setTimeout(nextJoyHop, JOY_HOP_GAP_MS);
      });
    };

    // Re-highlight for the duration of the joy dance so the celebration reads
    // as one continuous moment rather than fading right after the hearts.
    row.classList.add("hedgehog-cheer-highlight");
    nextJoyHop();
  }

  /** Hops back to the house (short hops, same as the trip out) and disappears
   *  into the doorway on arrival instead of fading in place. */
  function hopHome(token: number, fromX: number, fromY: number) {
    hopChain(token, fromX, fromY, () => {
      const btn = buttonRef.current;
      if (!btn) return { tx: fromX, ty: fromY };
      const rect = btn.getBoundingClientRect();
      return { tx: rect.left + rect.width / 2, ty: rect.top + rect.height / 2 };
    }, () => {
      if (runTokenRef.current !== token) return;
      const traveler = travelerRef.current;
      if (traveler) traveler.style.opacity = "0";
    });
  }

  function travelTo(row: Element) {
    const avatar = row.querySelector("[data-streamer-avatar]") ?? row;
    const btn = buttonRef.current;
    const traveler = travelerRef.current;
    if (!btn || !traveler) return;

    runTokenRef.current += 1;
    const token = runTokenRef.current;

    const startRect = btn.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    traveler.style.transform = `translate(${startX - TRAVELER_HALF_WIDTH}px, ${startY - TRAVELER_HALF_HEIGHT}px)`;
    traveler.style.opacity = "1";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const rect = avatar.getBoundingClientRect();
      const tx = rect.left + rect.width / 2;
      const ty = rect.top + rect.height / 2;
      traveler.style.transform = `translate(${tx - TRAVELER_HALF_WIDTH}px, ${ty - TRAVELER_HALF_HEIGHT}px)`;
      celebrateAt(row, tx, ty);
      setTimeout(() => {
        row.classList.remove("hedgehog-cheer-highlight");
        if (runTokenRef.current === token) traveler.style.opacity = "0";
      }, HIGHLIGHT_LIFETIME_MS);
      return;
    }

    hopChain(
      token,
      startX,
      startY,
      () => {
        const rect = avatar.getBoundingClientRect();
        return { tx: rect.left + rect.width / 2, ty: rect.top + rect.height / 2 };
      },
      (x, y) => {
        celebrateAt(row, x, y);
        joyDance(token, row, x, y);
      }
    );
  }

  function findStreamerRows(): StreamerOption[] {
    return Array.from(document.querySelectorAll<HTMLElement>("[data-streamer-row]")).map((el) => ({
      name: el.dataset.streamerName ?? "",
      slug: el.dataset.streamerSlug ?? "",
    }));
  }

  function goToRow(slug: string) {
    const row = document.querySelector(`[data-streamer-row][data-streamer-slug="${CSS.escape(slug)}"]`);
    if (!row) return;
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => travelTo(row), 350);
  }

  function openPicker() {
    const found = findStreamerRows();
    if (found.length === 0) {
      setOpen(false);
      setNotice("Visit the leaderboard to cheer for a streamer!");
      return;
    }
    setStreamers(found);
    setView("pick");
  }

  function handlePickRandom() {
    setOpen(false);
    const rows = Array.from(document.querySelectorAll("[data-streamer-row]"));
    if (rows.length === 0) return;
    // eslint-disable-next-line react-hooks/purity -- picking a random row from a click handler, never during render
    const row = rows[Math.floor(Math.random() * rows.length)] as HTMLElement;
    goToRow(row.dataset.streamerSlug ?? "");
  }

  function handlePickStreamer(slug: string) {
    setOpen(false);
    goToRow(slug);
  }

  function handleToggle() {
    setOpen((o) => {
      const next = !o;
      if (next) {
        setView("main");
        setPeeking(true);
        setTimeout(() => setPeeking(false), 500);
      }
      return next;
    });
  }

  return (
    <div ref={wrapperRef} className="fixed right-4 top-20 z-40">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Hedgehog house"
        className="relative block h-[46px] w-14 transition hover:brightness-95"
      >
        <HouseIcon className="h-full w-full text-foreground/40 drop-shadow" />
        <HedgehogIcon
          className={`absolute bottom-1 left-1/2 h-6 w-7 -translate-x-1/2 transition-transform duration-300 ${
            peeking ? "translate-y-0" : "translate-y-1.5"
          }`}
        />
      </button>

      {open && view === "main" && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={openPicker}
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

      {open && view === "pick" && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-lg"
        >
          <button
            type="button"
            onClick={() => setView("main")}
            className="flex w-full items-center gap-1.5 px-4 py-2 text-left text-xs text-muted transition hover:bg-surface-2"
          >
            ← Back
          </button>
          <div className="max-h-64 overflow-y-auto border-t border-border py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handlePickRandom}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-accent transition hover:bg-surface-2"
            >
              🎲 Surprise me
            </button>
            {streamers.map((s) => (
              <button
                key={s.slug}
                type="button"
                role="menuitem"
                onClick={() => handlePickStreamer(s.slug)}
                className="block w-full truncate px-4 py-2 text-left text-sm text-foreground transition hover:bg-surface-2"
              >
                {s.name}
              </button>
            ))}
          </div>
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

      <div
        ref={travelerRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      >
        <div ref={travelerFlipRef}>
          <div ref={travelerBodyRef} style={{ transformOrigin: "50% 100%" }}>
            <HedgehogIcon className="h-10 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
