import { toPersianDigits } from "./formatters";

// Format Shamsi date
export function formatJalaliDate(dateInput?: Date | string | number): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return toPersianDigits(date.toLocaleDateString("fa-IR"));
  }
}

export function formatJalaliDateTime(dateInput?: Date | string | number): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return toPersianDigits(date.toLocaleString("fa-IR"));
  }
}
