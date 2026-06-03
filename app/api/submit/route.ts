import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { Selection, SubmissionPayload } from "@/lib/options";

// Resend потребує Node-рантайм (не edge).
export const runtime = "nodejs";

function kyivTimestamp(): string {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

/** Один рядок вибору у людському вигляді. */
function lineFor(s: Selection): string {
  const parts: string[] = [s.optionTitle];
  if (s.subVariantTitle) parts.push(`«${s.subVariantTitle}»`);
  const details: string[] = [];
  if (s.fixedInfo) details.push(s.fixedInfo);
  if (s.day) details.push(s.day);
  if (s.time) details.push(s.time);
  if (s.location) details.push(s.location);
  const tail = details.length ? ` — ${details.join(", ")}` : "";
  return parts.join(" ") + tail;
}

function buildText(payload: SubmissionPayload, ts: string): string {
  const lines: string[] = ["Анастасія сказала ТАК 🎉", ""];

  if (payload.selections.length) {
    lines.push("Обрані ініціативи:");
    for (const s of payload.selections) lines.push(`• ${lineFor(s)}`);
  } else {
    lines.push("Конкретні варіанти не відмічені — деталі за домовленістю.");
  }

  if (payload.customText) {
    lines.push("", `Свій варіант: ${payload.customText}`);
  }

  lines.push("", `Час відповіді (Київ): ${ts}`);
  return lines.join("\n");
}

function buildHtml(payload: SubmissionPayload, ts: string): string {
  const items = payload.selections.length
    ? `<ul style="margin:0;padding-left:18px;line-height:1.6">${payload.selections
        .map((s) => `<li>${escapeHtml(lineFor(s))}</li>`)
        .join("")}</ul>`
    : `<p style="color:#6b6b6b">Конкретні варіанти не відмічені — деталі за домовленістю.</p>`;

  const custom = payload.customText
    ? `<p style="margin-top:16px"><strong>Свій варіант:</strong> ${escapeHtml(
        payload.customText
      )}</p>`
    : "";

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0a0a0a;max-width:560px">
    <h2 style="margin:0 0 4px">Анастасія сказала ТАК 🎉</h2>
    <p style="color:#6b6b6b;margin:0 0 20px">Епік підтверджено.</p>
    <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.08em">Обрані ініціативи</h3>
    ${items}
    ${custom}
    <p style="color:#6b6b6b;margin-top:24px;font-size:13px">Час відповіді (Київ): ${escapeHtml(
      ts
    )}</p>
  </div>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // немає env — мовчки пропускаємо

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
  } catch {
    // Telegram — лише бонус, помилку не піднімаємо
  }
}

export async function POST(req: Request) {
  let payload: SubmissionPayload;
  try {
    payload = (await req.json()) as SubmissionPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  if (!payload || !Array.isArray(payload.selections)) {
    return NextResponse.json({ ok: false, error: "bad payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TO_EMAIL;
  const from = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    return NextResponse.json(
      { ok: false, error: "email not configured" },
      { status: 500 }
    );
  }

  const ts = kyivTimestamp();
  const text = buildText(payload, ts);
  const html = buildHtml(payload, ts);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "Анастасія відповіла 🎉",
      text,
      html,
    });
    if (error) {
      return NextResponse.json({ ok: false, error: "send failed" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "send failed" }, { status: 502 });
  }

  // Дублювання в Telegram (опційно, не блокує успіх)
  await notifyTelegram(text);

  return NextResponse.json({ ok: true });
}
