"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Option } from "@/lib/options";
import { filmTimeFor, findSub, type Pick } from "@/lib/selection";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-body text-[0.7rem] uppercase tracking-[0.2em] text-mute">
      {children}
    </p>
  );
}

export default function SchedulePicker({
  option,
  pick,
  onChange,
}: {
  option: Option;
  pick: Pick;
  onChange: (next: Pick) => void;
}) {
  const reduce = useReducedMotion();
  const set = (patch: Partial<Pick>) => onChange({ ...pick, ...patch });

  const wrap = (
    <div className="space-y-5 text-left">
      {/* --- ПІД-ВАРІАНТИ (кіно, театр, дах) --- */}
      {option.kind === "subvariants" && option.subVariants && (
        <div>
          <FieldLabel>Оберіть варіант</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {option.subVariants.map((sub) => (
              <Chip
                key={sub.id}
                active={pick.subId === sub.id}
                onClick={() =>
                  set({ subId: sub.id, dayDate: undefined, time: undefined })
                }
              >
                {sub.title}
                {sub.meta ? ` · ${sub.meta}` : ""}
              </Chip>
            ))}
          </div>

          {/* Опис обраного під-варіанта (одне речення) */}
          {(() => {
            const sub = findSub(option, pick.subId);
            return sub?.blurb ? (
              <p className="mt-3 text-sm italic leading-snug text-mute">
                {sub.blurb}
              </p>
            ) : null;
          })()}

          {/* Після вибору під-варіанта */}
          {(() => {
            const sub = findSub(option, pick.subId);
            if (!sub) return null;

            // фіксована дата (театр / дах)
            if (sub.fixed) {
              return (
                <p className="mt-4 text-sm text-ink">
                  {sub.location ? `${sub.location} · ` : ""}
                  {sub.fixed.label}, {sub.fixed.time}
                </p>
              );
            }

            // кіно: вибір дня → час підставляється
            if (sub.filmSlots) {
              const time = filmTimeFor(sub, pick.dayDate);
              return (
                <div className="mt-4 space-y-4">
                  {sub.location && (
                    <p className="text-sm text-mute">Локація: {sub.location}</p>
                  )}
                  <div>
                    <FieldLabel>День</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {sub.filmSlots.map((slot) => (
                        <Chip
                          key={slot.date}
                          active={pick.dayDate === slot.date}
                          onClick={() => set({ dayDate: slot.date })}
                        >
                          {slot.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  {time && (
                    <p className="text-sm text-ink">Сеанс о {time}</p>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* --- ЛОКАЦІЯ (каяки) --- */}
      {option.locations && (
        <div>
          <FieldLabel>Локація</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {option.locations.map((loc) => (
              <Chip
                key={loc}
                active={pick.location === loc}
                onClick={() => set({ location: loc })}
              >
                {loc}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* --- ДЕНЬ (schedule) --- */}
      {option.days && (
        <div>
          <FieldLabel>День</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {option.days.map((d) => (
              <Chip
                key={d.date}
                active={pick.dayDate === d.date}
                onClick={() => set({ dayDate: d.date })}
              >
                {d.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* --- ЧАС (schedule) --- */}
      {option.times && (
        <div>
          <FieldLabel>Час початку</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {option.times.map((t) => (
              <Chip
                key={t}
                active={pick.time === t}
                onClick={() => set({ time: t })}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* --- ДІАПАЗОН (D&D) --- */}
      {option.kind === "range" && option.rangeDays && (
        <div className="space-y-4">
          <div>
            <FieldLabel>День</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {option.rangeDays.map((d) => (
                <Chip
                  key={d.date}
                  active={pick.dayDate === d.date}
                  onClick={() => set({ dayDate: d.date })}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>
          {option.rangeTimeLabel && (
            <p className="text-sm text-ink">Час: {option.rangeTimeLabel}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="border-t border-line/70 pt-5">{wrap}</div>
      </motion.div>
    </AnimatePresence>
  );
}
