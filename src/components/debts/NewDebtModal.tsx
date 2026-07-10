"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney } from "@/lib/format";
import { findSimilarCustomers } from "@/lib/similar";
import type { CustomerRow, DebtKind, DebtPriority, Currency } from "@/lib/types";

const CURRENCIES: Currency[] = ["USDT", "EUR", "USD", "DZD"];
const PRIORITIES: DebtPriority[] = ["low", "normal", "high", "urgent"];

export function NewDebtModal({
  customers,
  onClose,
  onCreated,
}: {
  customers: CustomerRow[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const { t, lang } = useI18n();

  const [step, setStep] = useState<"form" | "confirm">("form");
  const [kind, setKind] = useState<DebtKind>("payable");
  const [customerId, setCustomerId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [currency, setCurrency] = useState<Currency>("DZD");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<DebtPriority>("normal");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNewCustomer = customerId === "__new__";
  const similar = isNewCustomer
    ? findSimilarCustomers(newName, customers)
    : [];

  const displayCustomer = isNewCustomer
    ? newName.trim()
    : (customers.find((c) => c.id === customerId)?.full_name ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const amt = Number(amount);
    const validCustomer = isNewCustomer
      ? newName.trim().length > 0
      : !!customerId;
    if (!validCustomer || !amt || amt <= 0) {
      setError(t.debts.form.errRequired);
      return false;
    }
    return true;
  };

  const goConfirm = () => {
    setError(null);
    if (validate()) setStep("confirm");
  };

  const confirmCreate = async () => {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const amt = Number(amount);

    let finalCustomerId = customerId;
    if (isNewCustomer) {
      const { data, error: cErr } = await supabase
        .from("customers")
        .insert({ full_name: newName.trim(), whatsapp: newPhone.trim() || null })
        .select("id")
        .single();
      if (cErr || !data) {
        setBusy(false);
        setError(cErr?.message ?? t.debts.form.errGeneric);
        return;
      }
      finalCustomerId = data.id;
    }

    const { error: dErr } = await supabase.from("debts").insert({
      customer_id: finalCustomerId,
      kind,
      currency,
      original_amount: amt,
      reason: reason.trim() || null,
      priority,
      due_date: dueDate || null,
      notes: notes.trim() || null,
    });

    setBusy(false);
    if (dErr) {
      setError(dErr.message);
      return;
    }
    onCreated();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="glass max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl p-6 ring-1 ring-[var(--border)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {step === "confirm"
              ? t.debts.form.reviewTitle
              : t.debts.form.newTitle}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted ring-1 ring-[var(--border)] transition hover:text-fg"
            aria-label={t.debts.close}
          >
            ✕
          </button>
        </div>

        {step === "form" ? (
          <div className="space-y-4">
            {/* Kind toggle */}
            <div>
              <Label>{t.debts.form.kind}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Segment
                  active={kind === "payable"}
                  onClick={() => setKind("payable")}
                  accent="warn"
                >
                  {t.debts.form.payable}
                </Segment>
                <Segment
                  active={kind === "receivable"}
                  onClick={() => setKind("receivable")}
                  accent="pos"
                >
                  {t.debts.form.receivable}
                </Segment>
              </div>
            </div>

            {/* Customer */}
            <div>
              <Label>{t.debts.form.customer}</Label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
              >
                <option value="">{t.debts.form.selectCustomer}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
                <option value="__new__">{t.debts.form.addNew}</option>
              </select>
            </div>

            {isNewCustomer && (
              <div className="space-y-2 rounded-lg bg-surface-2/50 p-3 ring-1 ring-[var(--border)]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label={t.debts.form.customerName}
                    value={newName}
                    onChange={setNewName}
                  />
                  <Field
                    label={t.debts.form.phone}
                    value={newPhone}
                    onChange={setNewPhone}
                  />
                </div>
                {similar.length > 0 && (
                  <div className="rounded-lg bg-warn/10 p-2 ring-1 ring-warn/20">
                    <p className="mb-1 px-1 text-[11px] font-medium text-warn">
                      {t.debts.form.similarHint}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {similar.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCustomerId(c.id)}
                          className="rounded-md bg-surface px-2 py-1 text-xs font-medium ring-1 ring-[var(--border)] transition hover:ring-accent"
                        >
                          {c.full_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Amount + currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>{t.debts.form.amount}</Label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm tabnum font-mono outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <Label>{t.debts.form.currency}</Label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <Field
              label={t.debts.form.reason}
              value={reason}
              onChange={setReason}
              placeholder={t.debts.form.reasonPlaceholder}
            />

            {/* Priority + due date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.debts.form.priority}</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as DebtPriority)}
                  className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {t.debts.priorities[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>{t.debts.form.dueDate}</Label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>{t.debts.form.notes}</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
              />
            </div>

            {error && <ErrorBox>{error}</ErrorBox>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
              >
                {t.debts.form.cancel}
              </button>
              <button
                onClick={goConfirm}
                className="flex-1 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {t.debts.form.create}
              </button>
            </div>
          </div>
        ) : (
          /* CONFIRM STEP */
          <div className="space-y-4">
            <p className="text-sm text-muted">{t.debts.form.reviewHint}</p>

            <div className="divide-y divide-[var(--border)] rounded-xl bg-surface-2/40 ring-1 ring-[var(--border)]">
              <Row
                label={t.debts.form.kind}
                value={
                  kind === "payable"
                    ? t.debts.form.payable
                    : t.debts.form.receivable
                }
                dot={kind === "payable" ? "bg-warn" : "bg-pos"}
              />
              <Row label={t.debts.form.customer} value={displayCustomer} />
              <Row
                label={t.debts.form.amount}
                value={fmtMoney(Number(amount), currency, lang)}
                mono
                strong
              />
              {reason.trim() && (
                <Row label={t.debts.form.reason} value={reason.trim()} />
              )}
              <Row
                label={t.debts.form.priority}
                value={t.debts.priorities[priority]}
              />
              <Row
                label={t.debts.form.dueDate}
                value={dueDate || t.debts.noDue}
              />
              {notes.trim() && (
                <Row label={t.debts.form.notes} value={notes.trim()} />
              )}
            </div>

            {error && <ErrorBox>{error}</ErrorBox>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep("form")}
                disabled={busy}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg disabled:opacity-50"
              >
                {t.debts.form.back}
              </button>
              <button
                onClick={confirmCreate}
                disabled={busy}
                className="flex-1 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
              >
                {busy ? t.debts.form.creating : t.debts.form.confirm}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  strong,
  dot,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
  dot?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-2.5">
      <span className="text-xs text-muted">{label}</span>
      <span
        className={
          "text-right text-sm " +
          (mono ? "tabnum font-mono " : "") +
          (strong ? "font-semibold " : "")
        }
      >
        {dot && (
          <span className={"mr-1.5 inline-block h-1.5 w-1.5 rounded-full " + dot} />
        )}
        {value}
      </span>
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger ring-1 ring-danger/20">
      {children}
    </p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}

function Segment({
  active,
  onClick,
  accent,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent: "warn" | "pos";
  children: React.ReactNode;
}) {
  const activeCls =
    accent === "warn"
      ? "bg-warn/15 text-warn ring-warn/30"
      : "bg-pos/15 text-pos ring-pos/30";
  return (
    <button
      onClick={onClick}
      className={
        "rounded-lg px-3 py-2.5 text-sm font-medium ring-1 transition " +
        (active ? activeCls : "text-muted ring-[var(--border)] hover:bg-surface-2")
      }
    >
      {children}
    </button>
  );
}
