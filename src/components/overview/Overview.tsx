"use client";

import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney, fmtDate } from "@/lib/format";
import type {
  CashSummaryRow,
  DebtSummaryRow,
  AccountBalanceRow,
} from "@/lib/types";

export function Overview({
  cash,
  debt,
  accounts,
}: {
  cash: CashSummaryRow[];
  debt: DebtSummaryRow[];
  accounts: AccountBalanceRow[];
}) {
  const { t, lang } = useI18n();

  const payable = debt.filter((d) => d.kind === "payable");
  const receivable = debt.filter((d) => d.kind === "receivable");

  const overdueTotal = payable.reduce(
    (s, d) => s + Number(d.overdue_remaining ?? 0),
    0,
  );
  const payableCount = payable.reduce((s, d) => s + (d.open_count ?? 0), 0);
  const receivableCount = receivable.reduce((s, d) => s + (d.open_count ?? 0), 0);

  const walletAccounts = accounts.filter((a) => a.type !== "cash");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.overview.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          {t.overview.subtitle}
        </p>
        <p className="mt-1 text-xs text-muted/70">
          {t.overview.asOf} {fmtDate(lang)}
        </p>
      </header>

      {/* Obligations — the thing you must never forget */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Payable */}
        <Panel
          accent={overdueTotal > 0 ? "danger" : payableCount > 0 ? "warn" : "muted"}
          eyebrow={t.overview.youOwe}
          count={payableCount}
          countLabel={t.overview.openLabel}
        >
          {payable.length === 0 ? (
            <EmptyLine>{t.overview.noPayable}</EmptyLine>
          ) : (
            <div className="space-y-1">
              {payable.map((d) => (
                <MoneyLine
                  key={"p-" + d.currency}
                  amount={Number(d.total_remaining ?? 0)}
                  currency={d.currency}
                  lang={lang}
                  size="lg"
                />
              ))}
            </div>
          )}
          {overdueTotal > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-danger/10 px-2.5 py-1.5 text-xs font-medium text-danger ring-1 ring-danger/20">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              {t.overview.overdue}: {fmtMoney(overdueTotal, payable[0].currency, lang)}
            </div>
          )}
        </Panel>

        {/* Receivable */}
        <Panel
          accent={receivableCount > 0 ? "pos" : "muted"}
          eyebrow={t.overview.owedToYou}
          count={receivableCount}
          countLabel={t.overview.openLabel}
        >
          {receivable.length === 0 ? (
            <EmptyLine>{t.overview.noReceivable}</EmptyLine>
          ) : (
            <div className="space-y-1">
              {receivable.map((d) => (
                <MoneyLine
                  key={"r-" + d.currency}
                  amount={Number(d.total_remaining ?? 0)}
                  currency={d.currency}
                  lang={lang}
                  size="lg"
                />
              ))}
            </div>
          )}
        </Panel>
      </section>

      {/* Cash on hand */}
      <section>
        <SectionTitle>{t.overview.cashOnHand}</SectionTitle>
        {cash.length === 0 ? (
          <Card>
            <EmptyLine>{t.overview.noCash}</EmptyLine>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {cash.map((c) => (
              <Card key={c.currency}>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {c.currency}
                </span>
                <div className="mt-2">
                  <MoneyLine
                    amount={Number(c.total ?? 0)}
                    currency={c.currency}
                    lang={lang}
                    size="lg"
                    bare
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Wallets & accounts */}
      <section>
        <SectionTitle>{t.overview.walletBalances}</SectionTitle>
        {walletAccounts.length === 0 ? (
          <Card>
            <EmptyLine>{t.overview.noWallets}</EmptyLine>
          </Card>
        ) : (
          <Card padded={false}>
            <ul className="divide-y divide-[var(--border)]">
              {walletAccounts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted">
                      {t.types[a.type]} · {a.currency}
                    </p>
                  </div>
                  <span className="tabnum font-mono text-sm font-medium">
                    {fmtMoney(Number(a.balance ?? 0), a.currency, lang)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}

/* ---- primitives ---- */

function Panel({
  eyebrow,
  count,
  countLabel,
  accent,
  children,
}: {
  eyebrow: string;
  count: number;
  countLabel: string;
  accent: "danger" | "warn" | "pos" | "muted";
  children: React.ReactNode;
}) {
  const ring =
    accent === "danger"
      ? "ring-danger/30"
      : accent === "warn"
        ? "ring-warn/30"
        : accent === "pos"
          ? "ring-pos/25"
          : "ring-[var(--border)]";
  const dot =
    accent === "danger"
      ? "bg-danger"
      : accent === "warn"
        ? "bg-warn"
        : accent === "pos"
          ? "bg-pos"
          : "bg-muted";
  return (
    <div className={"glass rounded-2xl p-5 ring-1 " + ring}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-muted">
          <span className={"h-2 w-2 rounded-full " + dot} />
          {eyebrow}
        </span>
        {count > 0 && (
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
            {count} {countLabel}
          </span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MoneyLine({
  amount,
  currency,
  lang,
  size = "md",
  bare = false,
}: {
  amount: number;
  currency: string;
  lang: string;
  size?: "md" | "lg";
  bare?: boolean;
}) {
  const cls =
    (size === "lg" ? "text-2xl font-semibold" : "text-base font-medium") +
    " tabnum font-mono tracking-tight";
  if (bare) return <span className={cls}>{fmtMoney(amount, currency, lang)}</span>;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={cls}>{fmtMoney(amount, currency, lang)}</span>
    </div>
  );
}

function Card({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={
        "glass rounded-2xl ring-1 ring-[var(--border)] " + (padded ? "p-5" : "")
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
      {children}
    </h2>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
