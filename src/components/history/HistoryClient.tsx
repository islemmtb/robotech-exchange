"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney } from "@/lib/format";
import type {
  CustomerRow,
  DebtBalanceRow,
  DebtPaymentRow,
  DebtStatus,
} from "@/lib/types";

const STATUS_STYLE: Record<DebtStatus, string> = {
  open: "bg-surface-2 text-muted ring-[var(--border)]",
  partially_paid: "bg-warn/10 text-warn ring-warn/20",
  settled: "bg-pos/10 text-pos ring-pos/20",
  cancelled: "bg-danger/10 text-danger ring-danger/20",
};

function fmtDay(iso: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function HistoryClient({
  customers,
  debts,
  payments,
}: {
  customers: CustomerRow[];
  debts: DebtBalanceRow[];
  payments: DebtPaymentRow[];
}) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.full_name.toLowerCase().includes(q));
  }, [customers, query]);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const customerDebts = useMemo(
    () =>
      selectedId ? debts.filter((d) => d.customer_id === selectedId) : [],
    [debts, selectedId],
  );

  const paymentsFor = (debtId: string) =>
    payments.filter((p) => p.debt_id === debtId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.history.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          {t.history.subtitle}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer picker */}
        <div className="lg:col-span-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.history.search}
            className="mb-3 w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
          />
          {filtered.length === 0 ? (
            <p className="px-1 text-sm text-muted">{t.history.noCustomers}</p>
          ) : (
            <ul className="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
              {filtered.map((c) => {
                const active = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={
                        "w-full truncate rounded-lg px-3 py-2 text-left text-sm transition " +
                        (active
                          ? "bg-surface-2 font-medium text-fg ring-1 ring-[var(--border)]"
                          : "text-muted hover:bg-surface-2 hover:text-fg")
                      }
                    >
                      {c.full_name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="glass rounded-2xl p-6 text-sm text-muted ring-1 ring-[var(--border)]">
              {t.history.selectPrompt}
            </div>
          ) : customerDebts.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-sm text-muted ring-1 ring-[var(--border)]">
              {t.history.noHistory}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{selected.full_name}</h2>
              {customerDebts.map((d) => {
                const pays = paymentsFor(d.id);
                const kindLabel =
                  d.kind === "payable" ? t.history.youOwe : t.history.owesYou;
                const kindDot = d.kind === "payable" ? "bg-warn" : "bg-pos";
                return (
                  <div
                    key={d.id}
                    className="glass rounded-2xl p-4 ring-1 ring-[var(--border)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                            <span
                              className={"h-1.5 w-1.5 rounded-full " + kindDot}
                            />
                            {kindLabel}
                          </span>
                          <span
                            className={
                              "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 " +
                              STATUS_STYLE[d.status]
                            }
                          >
                            {t.history.status[d.status]}
                          </span>
                        </div>
                        {d.reason && (
                          <p className="mt-1 truncate text-sm">{d.reason}</p>
                        )}
                        <p className="mt-0.5 text-xs text-muted">
                          {t.history.opened} · {fmtDay(d.created_at, lang)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="tabnum font-mono text-lg font-semibold tracking-tight">
                          {fmtMoney(
                            Number(d.original_amount),
                            d.currency,
                            lang,
                          )}
                        </div>
                        {d.status !== "settled" &&
                          d.status !== "cancelled" && (
                            <div className="text-[11px] text-muted">
                              {fmtMoney(
                                Number(d.remaining_amount),
                                d.currency,
                                lang,
                              )}{" "}
                              {t.history.remaining}
                            </div>
                          )}
                      </div>
                    </div>

                    {pays.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-[var(--border)] pt-3">
                        {pays.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-muted">
                              {t.history.payment} · {fmtDay(p.paid_at, lang)}
                            </span>
                            <span className="tabnum font-mono font-medium text-pos">
                              +{fmtMoney(Number(p.amount), d.currency, lang)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
