"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import Ornament from "./Ornament";
import Poppy from "./Poppy";

const POPPY_RED = "#c8102e";

export default function SuccessScreen() {
  const reduce = useReducedMotion();

  // «Конфетті» з пелюсток маку — єдиний кольоровий акцент, лише тут
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.4,
        duration: 3.2 + Math.random() * 2.6,
        size: 6 + Math.random() * 7,
        opacity: 0.45 + Math.random() * 0.45,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0.3 : 0.7, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-paper px-6 text-center"
    >
      {!reduce &&
        petals.map((c) => (
          <span
            key={c.id}
            className="pointer-events-none absolute bottom-0"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.5,
              opacity: c.opacity,
              backgroundColor: POPPY_RED,
              // форма пелюстки маку
              borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%",
              transform: `rotate(${c.rotate}deg)`,
              animation: `drift-up ${c.duration}s ${c.delay}s ease-in forwards`,
            }}
          />
        ))}

      <Ornament
        variant="corner"
        className="pointer-events-none absolute left-6 top-6 h-24 w-24 text-ink/15"
      />
      <Ornament
        variant="corner"
        flip
        className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rotate-180 text-ink/15"
      />

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <Poppy className="mx-auto mb-6 h-20 w-20 sm:h-24 sm:w-24" />
        <p className="font-body text-xs uppercase tracking-[0.35em] text-mute">
          Status: done
        </p>
        <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">
          Епік підтверджено.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-mute sm:text-lg">
          Дякую, що не відправила в беклог. Деталі — в особистих. Кирило вже
          закриває спринт із планування.
        </p>
        <div className="mt-10 flex justify-center text-ink/25">
          <Ornament variant="divider" className="h-5 w-48" />
        </div>
      </motion.div>
    </motion.div>
  );
}
