const CURRENCY_TOKEN: Record<string, string> = {
  EUR: "€",
  USD: "$",
  DZD: "DZD",
  USDT: "USDT",
};

export function fmtMoney(
  amount: number | null | undefined,
  currency: string,
  lang: string = "en",
): string {
  const value = Number(amount ?? 0);
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const num = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  const token = CURRENCY_TOKEN[currency] ?? currency;
  return `${num} ${token}`;
}

export function fmtDate(lang: string = "en"): string {
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function fmtDateTime(iso: string, lang: string = "en"): string {
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
