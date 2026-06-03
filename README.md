# Сайт-запрошення на побачення

Персональний одноразовий проєкт: стильна «гугл-форма» з чорно-білим мінімалізмом,
PM-іронією та надсиланням відповіді на пошту. Стек: **Next.js (App Router) +
Tailwind + Framer Motion (motion) + Resend**. Бюджет — 0, усе на безкоштовних тарифах.

## 1. Встановлення

```bash
npm install
```

## 2. Resend (обовʼязково для пошти)

1. Зареєструйся на [resend.com](https://resend.com) (безкоштовно, 100 листів/добу).
2. **API Keys → Create API Key**, скопіюй ключ (виду `re_...`).
3. Встав його у файл `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
TO_EMAIL=vertical.xleb@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

- `TO_EMAIL` — куди приходить відповідь (твоя пошта).
- `FROM_EMAIL` — відправник.

## 3. Про FROM_EMAIL (важливо)

Без верифікованого домену Resend **надійно доставляє лише на твою власну адресу**
(ту, на яку реєструвався), а як відправника треба брати службову
`onboarding@resend.dev`. Для тесту цього достатньо:

```
FROM_EMAIL=onboarding@resend.dev
```

Хочеш гарного відправника (`kyrylo@твій-домен`) — додай і підтверди домен у Resend
(**Domains → Add Domain**, прописати DNS-записи), потім зміни `FROM_EMAIL`.

## 4. Telegram (опційно, дублювання відповіді)

Якщо хочеш отримувати відповідь ще й у Telegram:

1. Напиши [@BotFather](https://t.me/BotFather) → `/newbot` → отримаєш `TELEGRAM_BOT_TOKEN`.
2. Дізнайся свій `chat_id`: напиши боту будь-що, потім відкрий
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` і знайди `chat.id`
   (або скористайся [@userinfobot](https://t.me/userinfobot)).
3. Додай у `.env.local`:

```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
```

Немає цих змінних — функція мовчки пропускає Telegram, пошта працює як завжди.

## 5. Локальний запуск

```bash
npm run dev
```

Відкрий <http://localhost:3000>.

## 6. Деплой на Vercel

1. Залий код у GitHub-репозиторій.
2. На [vercel.com](https://vercel.com) → **Add New… → Project** → імпортуй репо.
3. **Project Settings → Environment Variables** — додай ті самі змінні, що в
   `.env.local` (`RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`, опційно Telegram).
4. **Deploy**. Vercel сам визначить Next.js.

> `.env.local` у git **не потрапляє** (див. `.gitignore`) — секрети задаються лише
> в налаштуваннях Vercel.

## 7. Картинки

Афіші лежать у `public/photo/`. Імена/розширення та звʼязок із варіантами —
у `lib/options.ts` (єдине джерело правди: варіанти, дні, час, локації).
Варіанти без афіші рендеряться з монохромним плейсхолдером.

## 8. Де що правити

- **Тексти, дати, час, локації, під-варіанти** → `lib/options.ts`.
- **Вступні тексти (Hero/Intro/Final/Success)** → відповідні файли в `components/`.
- **Лист (тема, формат)** → `app/api/submit/route.ts`.

> Глобальне правило: пʼятниця 5 червня 2026 виключена всюди (її просто немає в
> списках у `lib/options.ts`).
