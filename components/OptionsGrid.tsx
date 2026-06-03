"use client";

import { OPTIONS } from "@/lib/options";
import type { Pick } from "@/lib/selection";
import OptionCard from "./OptionCard";
import Reveal from "./Reveal";

export default function OptionsGrid({
  selectedIds,
  picks,
  customText,
  onToggle,
  onPickChange,
  onCustomTextChange,
}: {
  selectedIds: Set<string>;
  picks: Record<string, Pick>;
  customText: string;
  onToggle: (id: string) => void;
  onPickChange: (id: string, next: Pick) => void;
  onCustomTextChange: (value: string) => void;
}) {
  return (
    <section id="backlog" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <span className="block font-body text-xs uppercase tracking-[0.3em] text-mute">
          Backlog
        </span>
        <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
          Обери одну або кілька ініціатив
        </h2>
        <p className="mt-3 max-w-xl text-sm text-mute sm:text-base">
          Мультивибір дозволено. Натисни на картку — всередині розкриється вибір
          дня, часу й локації.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((option, i) => (
          <Reveal key={option.id} delay={Math.min(i, 5) * 0.04}>
            <OptionCard
              option={option}
              selected={selectedIds.has(option.id)}
              pick={picks[option.id] ?? {}}
              onToggle={() => onToggle(option.id)}
              onPickChange={(next) => onPickChange(option.id, next)}
            />
          </Reveal>
        ))}
      </div>

      {/* Поле «свій варіант» */}
      <Reveal delay={0.1} className="mt-10">
        <label
          htmlFor="custom"
          className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-mute"
        >
          Свій варіант (тобі видніше, ти ж тут PM)
        </label>
        <textarea
          id="custom"
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          rows={3}
          placeholder="Напиши свою ініціативу для бэклогу…"
          className="w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-ink"
        />
      </Reveal>
    </section>
  );
}
