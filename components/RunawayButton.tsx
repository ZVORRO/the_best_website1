"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_CHAIN = ["Ні", "ну ніии", "точно ні?", "подумай ще", "...ну добре"];

export default function RunawayButton() {
  // desktop = є справжній ховер + точний вказівник
  const [isDesktop, setIsDesktop] = useState(false);
  const [moved, setMoved] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function runAway() {
    if (!isDesktop) return;
    const el = ref.current;
    const w = el?.offsetWidth ?? 120;
    const h = el?.offsetHeight ?? 48;
    const margin = 16;
    const maxX = Math.max(margin, window.innerWidth - w - margin);
    const maxY = Math.max(margin, window.innerHeight - h - margin);
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    setPos({ x, y });
    setMoved(true);
  }

  // --- MOBILE / TOUCH: текстовий ланцюжок, без втечі ---
  if (!isDesktop) {
    const last = step >= MOBILE_CHAIN.length - 1;
    const scale = 1 - step * 0.13;
    const opacity = 1 - step * 0.18;

    return (
      <button
        type="button"
        disabled={last}
        onClick={() => setStep((s) => Math.min(s + 1, MOBILE_CHAIN.length - 1))}
        style={{
          transform: `scale(${scale})`,
          opacity: last ? 0 : opacity,
          transition: "transform 280ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease",
        }}
        className="rounded-full border border-line px-8 py-3 text-base text-mute"
        aria-label="Ні"
      >
        {MOBILE_CHAIN[step]}
      </button>
    );
  }

  // --- DESKTOP: втеча у випадкову точку вьюпорта ---
  return (
    <button
      ref={ref}
      type="button"
      onMouseEnter={runAway}
      onFocus={runAway}
      style={
        moved && pos
          ? {
              position: "fixed",
              left: pos.x,
              top: pos.y,
              transition: "left 320ms cubic-bezier(0.22,1,0.36,1), top 320ms cubic-bezier(0.22,1,0.36,1)",
              zIndex: 50,
            }
          : undefined
      }
      className="rounded-full border border-line px-8 py-3 text-base text-mute hover:border-ink"
    >
      Ні
    </button>
  );
}
