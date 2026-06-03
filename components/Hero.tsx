"use client";

import { motion, useReducedMotion } from "motion/react";
import Ornament from "./Ornament";

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* узори по кутах, дуже світлі */}
      <Ornament
        variant="corner"
        className="pointer-events-none absolute left-4 top-4 h-28 w-28 text-ink/15 sm:h-40 sm:w-40"
      />
      <Ornament
        variant="corner"
        flip
        className="pointer-events-none absolute bottom-4 right-4 h-28 w-28 rotate-180 text-ink/15 sm:h-40 sm:w-40"
      />

      <motion.p
        {...rise(0)}
        className="mb-6 font-body text-xs uppercase tracking-[0.35em] text-mute"
      >
        Internal memo · конфіденційно
      </motion.p>

      <motion.h1
        {...rise(0.08)}
        className="mx-auto max-w-3xl text-3xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl"
      >
        Кому: Анастасії.
        <span className="mt-3 block text-xl font-semibold text-mute sm:text-2xl md:text-3xl">
          Тема: пропозиція, яку складно проіґнорувати
        </span>
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mx-auto mt-7 max-w-md text-balance text-sm leading-relaxed text-mute sm:text-base"
      >
        Один екран — один порядок денний. Без статус-мітингів, обіцяю.
      </motion.p>

      <motion.div {...rise(0.24)} className="mt-12">
        <a
          href="#intro"
          className="group inline-flex flex-col items-center gap-3 text-ink transition-opacity hover:opacity-70"
        >
          <span className="font-body text-sm uppercase tracking-[0.2em]">
            Розгорнути порядок денний
          </span>
          <motion.span
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={
              reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
            className="text-2xl leading-none"
          >
            ↓
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
}
