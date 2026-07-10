"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney } from "@/lib/format";
import type {
  DebtBalanceRow,
  CustomerRow,
  DebtPaymentRow,
  DebtPriority,
  Currency,
} from "@/lib/types";
import { NewDebtModal } from "./NewDebtModal";

const PRIORITY_RANK: Record<DebtPriority, number> = {
  urgent: 3,
  high: 2,
  normal: 1,
  low: 0,
};

function sortDebts(a: DebtBalanceRow, b: DebtBalanceRow) {
  if (a.is_overdue !== b.is_overdue) return a.is_overdue ? -1 : 1;
  if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority])
    return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
  if (a.due_date && b.due_date) return a.due_date < b.due_date ? -1 : 1;
  if (a.due_date) return -1;
  if (b.due_date) return 1;
  return a.created_at < b.created_at ? 1 : -1;
}

function totalsByCurrency(rows: DebtBalanceRow[]) {
  const map = new Map<Currency, number>();
  for (const r of rows) {
    map.set(r.currency, (map.get(r.currency) ?? 0) + Number(r.remaining_amount));
  }
  return Array.from(map.entries()).filter(([, v]) => v > 0.0001);
}

export function DebtsClient({
  debts,
  customers,
  payments,
}: {
  debts: DebtBalanceRow[];
  customers: CustomerRow[];
  payments: DebtPaymentRow[];
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const open = debts.filter(
    (d) => d.status === "open" || d.status === "partially_paid",
  );
  const payable = useMemo(
    () => open.filter((d) => d.kind === "payable").sort(sortDebts),
    [open],
  );
  const receivable = useMemo(
    () => open.filter((d) => d.kind === "receivable").sort(sortDebts),
    [open],
  );

  const custName = (id: string) =>
    customers.find((c) => c.id === id)?.full_name ?? "—";
  const paymentsFor = (debtId: string) =>
    payments.filter((p) => p.debt_id === debtId);

  const refresh = () => router.refresh();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.debts.title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            {t.debts.subtitle}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
        >
          {t.debts.newDebt}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Column
          title={t.debts.youOwe}
          accent="warn"
          totals={totalsByCurrency(payable)}
          empty={t.debts.emptyPayable}
          lang={lang}
        >
          {payable.map((d) => (
            <DebtCard
              key={d.id}
              debt={d}
              customerName={custName(d.customer_id)}
              payments={paymentsFor(d.id)}
              onChange={refresh}
            />
          ))}
        </Column>

        <Column
          title={t.debts.owedToYou}
          accent="pos"
          totals={totalsByCurrency(receivable)}
          empty={t.debts.emptyReceivable}
          lang={lang}
        >
          {receivable.map((d) => (
            <DebtCard
              key={d.id}
              debt={d}
              customerName={custName(d.customer_id)}
              payments={paymentsFor(d.id)}
              onChange={refresh}
            />
          ))}
        </Column>
      </div>

      {modalOpen && (
        <NewDebtModal
          customers={customers}
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function Column({
  title,
  accent,
  totals,
  empty,
  lang,
  children,
}: {
  title: string;
  accent: "warn" | "pos";
  totals: [Currency, number][];
  empty: string;
  lang: string;
  children: React.ReactNode;
}) {
  const dot = accent === "warn" ? "bg-warn" : "bg-pos";
  const hasItems = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className={"h-2 w-2 rounded-full " + dot} />
          {title}
        </h2>
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 tabnum font-mono text-sm font-medium">
          {totals.map(([cur, val]) => (
            <span key={cur}>{fmtMoney(val, cur, lang)}</span>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {hasItems ? (
          children
        ) : (
          <div className="glass rounded-2xl p-5 text-sm text-muted ring-1 ring-[var(--border)]">
            {empty}
          </div>
        )}
      </div>
    </section>
  );
}

function DebtCard({
  debt,
  customerName,
  payments,
  onChange,
}: {
  debt: DebtBalanceRow;
  customerName: string;
  payments: DebtPaymentRow[];
  onChange: () => void;
}) {
  const { t, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const remaining = Number(debt.remaining_amount);
  const original = Number(debt.original_amount);
  const paid = Number(debt.paid_amount);

  const priorityStyle: Record<DebtPriority, string> = {
    urgent: "bg-danger/10 text-danger ring-danger/20",
    high: "bg-warn/10 text-warn ring-warn/20",
    normal: "bg-surface-2 text-muted ring-[var(--border)]",
    low: "bg-surface-2 text-muted/70 ring-[var(--border)]",
  };

  const recordPayment = async (amount: number) => {
    if (!amount || amount <= 0) return;
    setBusy(true);
    const { error } = await createClient()
      .from("debt_payments")
      .insert({ debt_id: debt.id, amount });
    setBusy(false);
    if (!error) {
      setPayAmount("");
      onChange();
    } else {
      alert(t.debts.form.errGeneric);
    }
  };

  const dueLabel = debt.due_date
    ? new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(debt.due_date))
    : t.debts.noDue;

  return (
    <div
      className={
        "glass rounded-2xl ring-1 " +
        (debt.is_overdue ? "ring-danger/30" : "ring-[var(--border)]")
      }
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{customerName}</span>
            <span
              className={
                "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 " +
                priorityStyle[debt.priority]
              }
            >
              {t.debts.priorities[debt.priority]}
            </span>
          </div>
          {debt.reason && (
            <p className="mt-0.5 truncate text-xs text-muted">{debt.reason}</p>
          )}
          <p
            className={
              "mt-1 text-xs " + (debt.is_overdue ? "text-danger" : "text-muted")
            }
          >
            {debt.is_overdue ? t.debts.overdue + " · " : t.debts.due + " "}
            {dueLabel}
          </p>
        </div>
        <div className="text-right">
          <div className="tabnum font-mono text-lg font-semibold tracking-tight">
            {fmtMoney(remaining, debt.currency, lang)}
          </div>
          <div className="text-[11px] text-muted">{t.debts.remaining}</div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] p-4">
          <div className="mb-4 flex items-center justify-between text-xs text-muted">
            <span className="tabnum font-mono">
              {fmtMoney(paid, debt.currency, lang)} {t.debts.paid} · {t.debts.of}{" "}
              {fmtMoney(original, debt.currency, lang)}
            </span>
          </div>

          {/* Record payment */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {t.debts.recordPayment}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max={remaining}
                step="any"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder={"0.00 " + debt.currency}
                className="w-full rounded-lg bg-surface-2 px-3 py-2 text-sm tabnum font-mono outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
              />
              <button
                disabled={busy || !payAmount}
                onClick={() => recordPayment(Number(payAmount))}
                className="shrink-0 rounded-lg bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-40"
              >
                {t.debts.record}
              </button>
            </div>
            <button
              disabled={busy}
              onClick={() => recordPayment(remaining)}
              className="mt-2 text-xs font-medium text-accent transition hover:underline disabled:opacity-40"
            >
              {t.debts.settle} ({fmtMoney(remaining, debt.currency, lang)})
            </button>
          </div>

          {/* History */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {t.debts.history}
            </p>
            {payments.length === 0 ? (
              <p className="text-xs text-muted">{t.debts.noHistory}</p>
            ) : (
              <ul className="space-y-1">
                {payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted">
                      {new Intl.DateTimeFormat(
                        lang === "fr" ? "fr-FR" : "en-US",
                        { day: "numeric", month: "short", year: "numeric" },
                      ).format(new Date(p.paid_at))}
                    </span>
                    <span className="tabnum font-mono font-medium">
                      {fmtMoney(Number(p.amount), debt.currency, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
