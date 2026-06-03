import type { Option, Selection, SubVariant } from "./options";

/** Стан вибору в межах однієї картки. */
export type Pick = {
  subId?: string;
  /** ISO-дата вибраного дня */
  dayDate?: string;
  time?: string;
  location?: string;
};

export function findSub(option: Option, subId?: string): SubVariant | undefined {
  return option.subVariants?.find((s) => s.id === subId);
}

/** Час кіно-сеансу залежить від обраного дня. */
export function filmTimeFor(sub: SubVariant, dayDate?: string): string | undefined {
  return sub.filmSlots?.find((s) => s.date === dayDate)?.time;
}

/** Чи заповнені всі обовʼязкові поля обраної картки. */
export function isOptionComplete(option: Option, pick: Pick): boolean {
  switch (option.kind) {
    case "schedule": {
      if (option.locations && !pick.location) return false;
      if (option.days && !pick.dayDate) return false;
      if (option.times && !pick.time) return false;
      return true;
    }
    case "range": {
      return Boolean(pick.dayDate);
    }
    case "subvariants": {
      const sub = findSub(option, pick.subId);
      if (!sub) return false;
      if (sub.fixed) return true;
      if (sub.filmSlots) return Boolean(pick.dayDate && filmTimeFor(sub, pick.dayDate));
      return true;
    }
    default:
      return false;
  }
}

/** Зібрати читабельний обʼєкт відповіді для листа. */
export function buildSelection(option: Option, pick: Pick): Selection {
  const base: Selection = {
    optionId: option.id,
    optionTitle: option.title,
  };

  if (option.kind === "subvariants") {
    const sub = findSub(option, pick.subId);
    if (sub) {
      base.subVariantTitle = sub.title;
      if (sub.location) base.location = sub.location;
      if (sub.fixed) {
        base.fixedInfo = `${sub.fixed.label}, ${sub.fixed.time}`;
      } else if (sub.filmSlots) {
        const slot = sub.filmSlots.find((s) => s.date === pick.dayDate);
        if (slot) {
          base.day = slot.label;
          base.time = slot.time;
        }
      }
    }
    return base;
  }

  if (option.kind === "range") {
    const day = option.rangeDays?.find((d) => d.date === pick.dayDate);
    if (day) base.day = day.label;
    if (option.rangeTimeLabel) base.time = option.rangeTimeLabel;
    return base;
  }

  // schedule
  const day = option.days?.find((d) => d.date === pick.dayDate);
  if (day) base.day = day.label;
  if (pick.time) base.time = pick.time;
  if (pick.location) base.location = pick.location;
  return base;
}
