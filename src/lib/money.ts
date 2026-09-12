export type Unit = "toman" | "rial";

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toEnDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 1776 && code <= 1785) return String(code - 1776);
    if (code >= 1632 && code <= 1641) return String(code - 1632);
    return ch;
  });
}

export function toFaDigits(value: string): string {
  return value.replace(/\d/g, (d) => FA[Number(d)]);
}

export function formatGrouped(n: number, fa: boolean): string {
  const abs = Math.abs(Math.round(n));
  const grouped = abs.toLocaleString("en-US").replace(/,/g, fa ? "٬" : ",");
  const signed = n < 0 ? (fa ? "−" : "-") + grouped : grouped;
  return fa ? toFaDigits(signed) : signed;
}

export function displayAmount(toman: number, unit: Unit): number {
  return unit === "rial" ? toman * 10 : toman;
}

export function toToman(input: number, unit: Unit): number {
  return unit === "rial" ? Math.round(input / 10) : Math.round(input);
}

export function unitLabel(unit: Unit): string {
  return unit === "rial" ? "ریال" : "تومان";
}

export function formatMoney(
  toman: number,
  opts: { unit: Unit; fa: boolean; withUnit?: boolean },
): string {
  const n = displayAmount(toman, opts.unit);
  const body = formatGrouped(n, opts.fa);
  if (opts.withUnit === false) return body;
  return `${body} ${unitLabel(opts.unit)}`;
}

export function parseMoneyInput(raw: string): number | null {
  const cleaned = toEnDigits(raw).replace(/[^\d]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}
