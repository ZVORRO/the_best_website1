"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Червоний мак — єдиний кольоровий акцент на сайті.
 * Зʼявляється ЛИШЕ на SuccessScreen як емоційна розвʼязка:
 * монохромна подорож → червоний розквіт у кульмінації.
 *
 * Пелюстки «розпускаються» (scale + поворот), потім наливаються червоним.
 */

const POPPY_RED = "#c8102e";
const POPPY_RED_DARK = "#9e0b22";
// два шари широких пелюсток — повніша, упізнавана квітка маку
const BACK_PETALS = [45, 135, 225, 315];
const FRONT_PETALS = [0, 90, 180, 270];

export default function Poppy({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  const bloom = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
    : {
        initial: { scale: 0.2, opacity: 0, rotate: -25 },
        animate: { scale: 1, opacity: 1, rotate: 0 },
        transition: { duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      style={{ transformOrigin: "50% 56%" }}
      {...bloom}
    >
      {/* Задній шар пелюсток (темніший — глибина) */}
      <g>
        {BACK_PETALS.map((a, i) => (
          <motion.ellipse
            key={`b${a}`}
            cx="50"
            cy="33"
            rx="18"
            ry="22"
            transform={`rotate(${a} 50 54)`}
            fill={POPPY_RED_DARK}
            initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: reduce ? 0.4 : 0.55,
              delay: reduce ? 0 : 0.3 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "50px 54px" }}
          />
        ))}
      </g>

      {/* Передній шир широких пелюсток */}
      <g>
        {FRONT_PETALS.map((a, i) => (
          <motion.ellipse
            key={`f${a}`}
            cx="50"
            cy="31"
            rx="21"
            ry="25"
            transform={`rotate(${a} 50 54)`}
            fill={POPPY_RED}
            stroke="#0a0a0a"
            strokeOpacity="0.1"
            strokeWidth="1"
            initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: reduce ? 0.4 : 0.55,
              delay: reduce ? 0 : 0.42 + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "50px 54px" }}
          />
        ))}
      </g>

      {/* Темна серцевина + тичинки (тримає звʼязок із монохромом) */}
      <circle cx="50" cy="54" r="10" fill="#0a0a0a" />
      <g stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const ang = (i / 10) * Math.PI * 2;
          const x = 50 + Math.cos(ang) * 13;
          const y = 54 + Math.sin(ang) * 13;
          return <line key={i} x1="50" y1="54" x2={x} y2={y} />;
        })}
      </g>
      <circle cx="50" cy="54" r="4.5" fill="#0a0a0a" stroke="#fafafa" strokeWidth="0.8" />
    </motion.svg>
  );
}
