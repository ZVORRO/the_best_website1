"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Option } from "@/lib/options";
import { findSub, isOptionComplete, type Pick } from "@/lib/selection";
import SchedulePicker from "./SchedulePicker";
import Ornament from "./Ornament";

export default function OptionCard({
  option,
  selected,
  pick,
  onToggle,
  onPickChange,
}: {
  option: Option;
  selected: boolean;
  pick: Pick;
  onToggle: () => void;
  onPickChange: (next: Pick) => void;
}) {
  const reduce = useReducedMotion();
  const complete = selected && isOptionComplete(option, pick);
  const needsDetails = selected && !complete;

  // Афіша змінюється на обрану під-варіантом (кіно/театр/концерти),
  // інакше — дефолтна афіша картки.
  const subImage = findSub(option, pick.subId)?.image;
  const displayImage = subImage ?? option.image;

  return (
    <motion.div
      layout={!reduce}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-paper transition-colors duration-300 ${
        selected ? "border-ink shadow-[0_0_0_1px_#0a0a0a]" : "border-line hover:border-ink/50"
      }`}
    >
      {/* Клікабельна шапка картки (зображення + текст) */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className="text-left"
      >
        {/* Зображення 4:5 (крос-фейд при зміні під-варіанта) або плейсхолдер */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-faint">
          {displayImage ? (
            <Image
              key={displayImage}
              src={displayImage}
              alt={option.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-[filter] duration-500 ${
                selected ? "grayscale-0" : "grayscale group-hover:grayscale-0"
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-faint to-line/40 text-ink/20">
              <Ornament variant="field" className="h-full w-full opacity-70" />
              <span className="absolute font-display text-[0.7rem] uppercase tracking-[0.3em] text-ink/30">
                {option.title}
              </span>
            </div>
          )}

          {/* Маркер «обрано» */}
          <div
            className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-all duration-300 ${
              selected
                ? "border-paper bg-ink text-paper"
                : "border-ink/30 bg-paper/70 text-transparent"
            }`}
            aria-hidden="true"
          >
            ✓
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold leading-tight sm:text-lg">
            {option.title}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-mute">
            {option.description}
          </p>
        </div>
      </button>

      {/* Розклад розкривається всередині картки */}
      {selected && (
        <div className="px-5 pb-5">
          <SchedulePicker option={option} pick={pick} onChange={onPickChange} />
          {needsDetails && (
            <p className="mt-4 text-xs italic text-mute">
              Лишилось проставити деталі ↑
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
