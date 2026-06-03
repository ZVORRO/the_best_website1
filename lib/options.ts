/**
 * Единый источник правды по «бэклогу» свиданий.
 *
 * Контекст дат: сьогодні середа, 4 червня 2026.
 * ГЛОБАЛЬНЕ ПРАВИЛО: пʼятниця 5 червня 2026 виключена ВСЮДИ.
 * Тут її просто немає в жодному списку — це гарантує дотримання правила.
 *
 * Картинки лежать у /public/photo (шляхи нижче — точні імена з розширеннями).
 * Варіанти без афіші мають image: null → рендериться монохромний плейсхолдер.
 */

export type Day = {
  /** ISO-дата для машинної обробки */
  date: string;
  /** Людська підпис (чип + лист) */
  label: string;
};

/** Слот фільму: день жорстко звʼязаний із часом сеансу */
export type FilmSlot = Day & { time: string };

export type SubVariant = {
  id: string;
  title: string;
  image: string | null;
  /** Локація показу */
  location?: string;
  /** Жанр / примітка (показується в чипі) */
  meta?: string;
  /** Одне речення-опис під-варіанта (показується після вибору) */
  blurb?: string;
  /** Якщо дата/час фіксовані (театр, дах) — один слот, без вибору дня */
  fixed?: { date: string; label: string; time: string };
  /** Якщо є вибір дня (кіно) — слоти з прив'язаним часом */
  filmSlots?: FilmSlot[];
};

export type OptionKind =
  | "schedule" // вибір дня + час (+ опц. локація)
  | "subvariants" // вибір під-варіанта (далі або фікс, або день+час усередині)
  | "range"; // фіксований діапазон часу, вибір лише дня

export type Option = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  kind: OptionKind;

  // --- kind: "schedule" ---
  days?: Day[];
  /** Погодинні слоти часу (рядки "10:00"…"23:00") */
  times?: string[];
  /** Обовʼязкова локація з варіантів */
  locations?: string[];

  // --- kind: "subvariants" ---
  subVariants?: SubVariant[];

  // --- kind: "range" (D&D) ---
  rangeDays?: Day[];
  rangeTimeLabel?: string;
};

/* ------------------------------------------------------------------ */
/* Дні (червень 2026). Пʼятниці 5 червня тут НЕМАЄ навмисно.           */
/* ------------------------------------------------------------------ */

const D = {
  thu4: { date: "2026-06-04", label: "Чт, 4 червня" },
  sat6: { date: "2026-06-06", label: "Сб, 6 червня" },
  sun7: { date: "2026-06-07", label: "Нд, 7 червня" },
  mon8: { date: "2026-06-08", label: "Пн, 8 червня" },
  tue9: { date: "2026-06-09", label: "Вт, 9 червня" },
  wed10: { date: "2026-06-10", label: "Ср, 10 червня" },
  thu11: { date: "2026-06-11", label: "Чт, 11 червня" },
} as const;

/** Будь-який день, окрім пʼятниці 5 червня. */
const ANY_DAYS: Day[] = [D.thu4, D.sat6, D.sun7, D.mon8, D.tue9, D.wed10];

/** Погодинні слоти 10:00–23:00 (крок 1 година). */
const HOURLY: string[] = Array.from({ length: 14 }, (_, i) => `${10 + i}:00`);

/* ------------------------------------------------------------------ */
/* Бэклог ініціатив                                                    */
/* ------------------------------------------------------------------ */

export const OPTIONS: Option[] = [
  {
    id: "kvartirnik",
    title: "Концерт у квартирі",
    description: "Квартирник: акустична гітара, вокал, high-trust.",
    image: "/photo/flat2.png",
    kind: "schedule",
    days: ANY_DAYS,
    times: HOURLY,
  },
  {
    id: "kayaks",
    title: "Прогулянка на каяках",
    description: "Активний тімбілдинг на воді.",
    image: "/photo/kayaki.png",
    kind: "schedule",
    days: ANY_DAYS,
    locations: ["Плавні", "Монастирський", "Перемога"],
    times: HOURLY,
  },
  {
    id: "kino",
    title: "Кіно",
    description: "Великий екран. Два фільми — обери свій.",
    image: "/photo/preasure.jpeg",
    kind: "subvariants",
    subVariants: [
      {
        id: "sumerki",
        title: "Сутінки. Сага. Молодий місяць",
        image: "/photo/sumerki.jpeg",
        location: "Дафі Аймакс",
        blurb:
          "Вампірська сага про любовний трикутник: ґотика, місячне сяйво й максимум підліткової драми.",
        filmSlots: [
          { ...D.sat6, time: "10:20" },
          { ...D.sun7, time: "10:20" },
          { ...D.mon8, time: "10:20" },
          { ...D.tue9, time: "10:20" },
          { ...D.wed10, time: "11:20" },
        ],
      },
      {
        id: "preasure",
        title: "Тиск (Pressure)",
        image: "/photo/preasure.jpeg",
        location: "Дафі",
        blurb:
          "Камерна фантастика про рішення під тиском, що змінює світ: напруга в кожному кадрі.",
        filmSlots: [
          { ...D.thu4, time: "20:00" },
          { ...D.sat6, time: "20:00" },
          { ...D.sun7, time: "20:00" },
          { ...D.mon8, time: "20:00" },
          { ...D.tue9, time: "20:00" },
          { ...D.wed10, time: "19:30" },
        ],
      },
    ],
  },
  {
    id: "theater",
    title: "Театр",
    description: "Культурний онбординг.",
    image: "/photo/theater1.jpg",
    kind: "subvariants",
    subVariants: [
      {
        id: "theater1",
        title: "Тваринні інстинкти",
        image: "/photo/theater1.jpg",
        meta: "Трилер на 1 дію",
        fixed: { date: "2026-06-04", label: "Чт, 4 червня", time: "18:00" },
      },
      {
        id: "theater2",
        title: "P.S. Кохаю тебе",
        image: "/photo/theater2.jpg",
        meta: "Романтична драма",
        fixed: { date: "2026-06-11", label: "Чт, 11 червня", time: "18:00" },
      },
    ],
  },
  {
    id: "citywalk",
    title: "Прогулянка по місту",
    description: "Walking 1-on-1, без агенди.",
    image: "/photo/walk.png",
    kind: "schedule",
    days: ANY_DAYS,
    times: HOURLY,
  },
  {
    id: "roof",
    title: "Концерт на даху Менори",
    description: "Концерт на даху, на заході сонця.",
    image: "/photo/Imagine Dragons & Maneskin.jpg",
    kind: "subvariants",
    subVariants: [
      {
        id: "imagine-maneskin",
        title: "Imagine Dragons & Måneskin",
        image: "/photo/Imagine Dragons & Maneskin.jpg",
        fixed: { date: "2026-06-04", label: "4 червня", time: "18:00" },
      },
      {
        id: "sympho-rock",
        title: "SYMPHO ROCK",
        image: "/photo/SYMPHO ROCK.jpg",
        fixed: { date: "2026-06-09", label: "9 червня", time: "18:30" },
      },
      {
        id: "rock-hits",
        title: "Симфонічні рок-хіти",
        image: "/photo/rock_hits.jpg",
        fixed: { date: "2026-06-11", label: "11 червня", time: "18:00" },
      },
    ],
  },
  {
    id: "bookstore",
    title: "Побачення в книгарні",
    description: "Обираємо одне одному книгу наосліп.",
    image: "/photo/shop.png",
    kind: "schedule",
    days: ANY_DAYS,
    times: HOURLY,
  },
  {
    id: "dnd",
    title: "Партія в D&D",
    description: "Рольова сесія з непередбачуваним аутпутом.",
    image: "/photo/dnd.png",
    kind: "range",
    rangeDays: [D.sat6, D.sun7],
    rangeTimeLabel: "14:00–20:00",
  },
];

/* ------------------------------------------------------------------ */
/* Тип однієї відповіді (клієнт → сервер)                              */
/* ------------------------------------------------------------------ */

export type Selection = {
  optionId: string;
  optionTitle: string;
  subVariantTitle?: string;
  day?: string;
  time?: string;
  location?: string;
  /** Готовий рядок для фіксованих дат/діапазонів */
  fixedInfo?: string;
};

export type SubmissionPayload = {
  selections: Selection[];
  customText?: string;
};
