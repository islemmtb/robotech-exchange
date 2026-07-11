"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import type {
  DebtBalanceRow,
  CustomerRow,
  DebtPaymentRow,
  DebtIncreaseRow,
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
  increases,
}: {
  debts: DebtBalanceRow[];
  customers: CustomerRow[];
  payments: DebtPaymentRow[];
  increases: DebtIncreaseRow[];
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
  const increasesFor = (debtId: string) =>
    increases.filter((i) => i.debt_id === debtId);

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
              increases={increasesFor(d.id)}
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
              increases={increasesFor(d.id)}
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
  increases,
  onChange,
}: {
  debt: DebtBalanceRow;
  customerName: string;
  payments: DebtPaymentRow[];
  increases: DebtIncreaseRow[];
  onChange: () => void;
}) {
  const { t, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"pay" | "add">("pay");
  const [amountInput, setAmountInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const remaining = Number(debt.remaining_amount);
  const total = Number(debt.total_amount ?? debt.original_amount);
  const paid = Number(debt.paid_amount);

  const events = [
    ...increases.map((i) => ({
      id: i.id,
      kind: "inc" as const,
      amount: Number(i.amount),
      at: i.created_at,
    })),
    ...payments.map((p) => ({
      id: p.id,
      kind: "pay" as const,
      amount: Number(p.amount),
      at: p.paid_at,
    })),
  ].sort((a, b) => (a.at < b.at ? -1 : 1));

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
      setAmountInput("");
      onChange();
    } else {
      alert(error.message);
    }
  };

  const increaseDebt = async (amount: number) => {
    if (!amount || amount <= 0) return;
    setBusy(true);
    const { error } = await createClient()
      .from("debt_increases")
      .insert({ debt_id: debt.id, amount });
    setBusy(false);
    if (!error) {
      setAmountInput("");
      onChange();
    } else {
      alert(error.message);
    }
  };

  const deleteDebt = async () => {
    setBusy(true);
    const { error } = await createClient()
      .from("debts")
      .delete()
      .eq("id", debt.id);
    setBusy(false);
    if (!error) {
      onChange();
    } else {
      alert(error.message);
    }
  };

  const submitAction = () => {
    const amt = Number(amountInput);
    if (mode === "pay") recordPayment(amt);
    else increaseDebt(amt);
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
            <p className="mt-1 truncate text-sm font-medium text-fg/90">
              {debt.reason}
            </p>
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span className="tabnum font-mono">
              {fmtMoney(paid, debt.currency, lang)} {t.debts.paid} · {t.debts.of}{" "}
              {fmtMoney(total, debt.currency, lang)}
            </span>
            <span className="shrink-0">
              {t.debts.opened} · {fmtDateTime(debt.created_at, lang)}
            </span>
          </div>

          {debt.notes && (
            <div className="mb-4 rounded-lg bg-warn/5 px-3 py-2 ring-1 ring-warn/15">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-warn/80">
                {t.debts.note}
              </p>
              <p className="mt-0.5 text-sm text-fg">{debt.notes}</p>
            </div>
          )}

          {/* Action: payment or add to debt */}
          <div className="mb-4">
            <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-surface-2/60 p-1">
              <button
                onClick={() => setMode("pay")}
                className={
                  "rounded-md px-3 py-1.5 text-xs font-medium transition " +
                  (mode === "pay"
                    ? "bg-surface text-fg ring-1 ring-[var(--border)]"
                    : "text-muted hover:text-fg")
                }
              >
                {t.debts.tabPay}
              </button>
              <button
                onClick={() => setMode("add")}
                className={
                  "rounded-md px-3 py-1.5 text-xs font-medium transition " +
                  (mode === "add"
                    ? "bg-surface text-fg ring-1 ring-[var(--border)]"
                    : "text-muted hover:text-fg")
                }
              >
                {t.debts.tabAdd}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max={mode === "pay" ? remaining : undefined}
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder={"0.00 " + debt.currency}
                className="w-full rounded-lg bg-surface-2 px-3 py-2 text-sm tabnum font-mono outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
              />
              <button
                disabled={busy || !amountInput}
                onClick={submitAction}
                className={
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-40 " +
                  (mode === "add"
                    ? "bg-warn text-white hover:opacity-90"
                    : "bg-fg text-bg hover:opacity-90")
                }
              >
                {mode === "pay" ? t.debts.record : t.debts.addBtn}
              </button>
            </div>
            {mode === "pay" && remaining > 0 && (
              <button
                disabled={busy}
                onClick={() => {
                  const msg = t.debts.settleConfirm
                    .replace("{amount}", fmtMoney(remaining, debt.currency, lang))
                    .replace("{name}", customerName);
                  if (confirm(msg)) recordPayment(remaining);
                }}
                className="mt-2 text-xs font-medium text-accent transition hover:underline disabled:opacity-40"
              >
                {t.debts.settle} ({fmtMoney(remaining, debt.currency, lang)})
              </button>
            )}
          </div>

          {/* History */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {t.debts.history}
            </p>
            {events.length === 0 ? (
              <p className="text-xs text-muted">{t.debts.noHistory}</p>
            ) : (
              <ul className="space-y-1">
                {events.map((e) => (
                  <li
                    key={e.kind + e.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted">
                      {e.kind === "inc" ? t.debts.added + " · " : ""}
                      {fmtDateTime(e.at, lang)}
                    </span>
                    <span
                      className={
                        "tabnum font-mono font-medium " +
                        (e.kind === "inc" ? "text-warn" : "text-pos")
                      }
                    >
                      {e.kind === "inc" ? "+" : "−"}
                      {fmtMoney(e.amount, debt.currency, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Danger zone: delete debt (requires typing the word) */}
          <div className="mt-4 border-t border-[var(--border)] pt-3">
            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="text-xs font-medium text-danger/80 transition hover:text-danger"
              >
                {t.debts.deleteBtn}
              </button>
            ) : (
              <div className="rounded-lg bg-danger/5 p-3 ring-1 ring-danger/20">
                <p className="text-xs text-danger">{t.debts.deleteWarn}</p>
                <p className="mt-2 text-[11px] text-muted">
                  {t.debts.deletePrompt.replace("{word}", t.debts.deleteWord)}
                </p>
                <input
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  placeholder={t.debts.deleteWord}
                  className="mt-1.5 w-full rounded-lg bg-surface-2 px-3 py-2 text-sm outline-none ring-1 ring-danger/20 transition focus:ring-2 focus:ring-danger"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteText("");
                    }}
                    className="flex-1 rounded-lg px-3 py-2 text-xs font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
                  >
                    {t.debts.form.cancel}
                  </button>
                  <button
                    disabled={
                      busy ||
                      deleteText.trim().toUpperCase() !== t.debts.deleteWord
                    }
                    onClick={deleteDebt}
                    className="flex-1 rounded-lg bg-danger px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                  >
                    {t.debts.deleteConfirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
