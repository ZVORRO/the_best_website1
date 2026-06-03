"use client";

import RunawayButton from "./RunawayButton";
import Reveal from "./Reveal";

export type SubmitStatus = "idle" | "loading" | "error";

export default function FinalQuestion({
  status,
  onYes,
}: {
  status: SubmitStatus;
  onYes: () => void;
}) {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-2xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Анастасіє, ви готові піти на побачення з Кирилом?
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={onYes}
            disabled={status === "loading"}
            className="rounded-full bg-ink px-10 py-3.5 text-base font-semibold text-paper transition-transform duration-200 hover:scale-[1.03] disabled:cursor-wait disabled:opacity-60"
          >
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                Деплою…
              </span>
            ) : (
              "Так"
            )}
          </button>

          <RunawayButton />
        </div>
      </Reveal>

      {status === "error" && (
        <p className="mt-8 text-sm text-mute">
          Щось пішло не так із відправкою. Напиши Кирилу напряму — або{" "}
          <button
            type="button"
            onClick={onYes}
            className="underline underline-offset-4 hover:text-ink"
          >
            спробувати ще
          </button>
          .
        </p>
      )}
    </section>
  );
}
