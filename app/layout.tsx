import type { Metadata, Viewport } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";

// Крупний гротеск для заголовків (підтримує кирилицю/українську)
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  variable: "--font-display",
  display: "swap",
});

// Спокійний текстовий шрифт
const body = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Кому: Анастасії",
  description: "Пропозиція, яку складно проіґнорувати.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper text-ink font-body antialiased selection:bg-ink selection:text-paper">
        {children}
      </body>
    </html>
  );
}
