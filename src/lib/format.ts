export function fmtMoney(
  amount: number | null | undefined,
  currency: string,
  lang: string = "en",
): string {
  const value = Number(amount ?? 0);
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  // USDT is not an ISO currency — format as a plain number with a suffix.
  if (currency === "USDT") {
    return (
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value) + " USDT"
    );
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return new Intl.NumberFormat(locale).format(value) + " " + currency;
  }
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
