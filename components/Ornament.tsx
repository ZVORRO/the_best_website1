/**
 * Тонкий монохромний line-art узор (гравюра/туш).
 * Дуже світлий, декоративний — мінімалізм важливіший за узори.
 * variant:
 *  - "corner": кутова віньєтка (для країв секцій)
 *  - "divider": горизонтальний роздільник по центру
 *  - "field": ледь помітна сітка-текстура за карткою
 */

type Props = {
  variant?: "corner" | "divider" | "field";
  className?: string;
  flip?: boolean;
};

export default function Ornament({
  variant = "corner",
  className = "",
  flip = false,
}: Props) {
  const stroke = "currentColor";

  if (variant === "divider") {
    return (
      <svg
        viewBox="0 0 240 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
      >
        <line x1="0" y1="12" x2="96" y2="12" strokeOpacity="0.5" />
        <line x1="144" y1="12" x2="240" y2="12" strokeOpacity="0.5" />
        <path
          d="M104 12c4-7 12-7 16 0 4 7 12 7 16 0"
          strokeOpacity="0.8"
        />
        <circle cx="120" cy="12" r="1.6" fill={stroke} stroke="none" />
      </svg>
    );
  }

  if (variant === "field") {
    return (
      <svg
        viewBox="0 0 200 250"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        className={className}
        fill="none"
        stroke={stroke}
        strokeWidth="0.6"
        strokeOpacity="0.6"
      >
        <path d="M100 10 C40 60 40 190 100 240 C160 190 160 60 100 10 Z" />
        <path d="M100 40 C60 80 60 170 100 210 C140 170 140 80 100 40 Z" />
        <path d="M100 70 C75 100 75 150 100 180 C125 150 125 100 100 70 Z" />
        <line x1="100" y1="10" x2="100" y2="240" strokeOpacity="0.3" />
      </svg>
    );
  }

  // corner vignette — витіюваті лінії
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      strokeOpacity="0.7"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M8 152 C8 80 80 8 152 8" />
      <path d="M8 132 C8 72 72 8 132 8" strokeOpacity="0.45" />
      <path d="M30 152 C30 95 95 30 152 30" strokeOpacity="0.45" />
      <path d="M8 152 C40 150 60 130 64 96 C68 64 90 42 124 38" strokeOpacity="0.5" />
      <circle cx="8" cy="152" r="2" fill={stroke} stroke="none" />
      <circle cx="152" cy="8" r="2" fill={stroke} stroke="none" />
    </svg>
  );
}
