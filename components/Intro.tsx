import Reveal from "./Reveal";
import Ornament from "./Ornament";

/**
 * Іронічне PM-звернення. Тексти навмисно винесені сюди й легко редагуються.
 */
export default function Intro() {
  return (
    <section
      id="intro"
      className="relative mx-auto max-w-2xl px-6 py-28 sm:py-36"
    >
      <Reveal as="span" className="mb-5 block font-body text-xs uppercase tracking-[0.3em] text-mute">
        Kickoff
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
          У нас накопився бэклог нереалізованих вихідних.
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-6 text-base leading-relaxed text-mute sm:text-lg">
          Пропоную провести грумінг і пріоритизувати, що візьмемо в спринт цього
          тижня. Нічого складного: дивишся ініціативи, відмічаєш ті, що
          відгукуються, проставляєш день і час. Естімейти беру на себе.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          У Муракамі герої п&apos;ють каву, слухають джаз і чекають, поки життя
          саме все розставить. Пропоную зробити швидше: познач те, що
          відгукується. Мультивибір дозволено.
        </p>
      </Reveal>

      <Reveal delay={0.24} className="mt-12 flex justify-center text-ink/20">
        <Ornament variant="divider" className="h-5 w-44" />
      </Reveal>
    </section>
  );
}
