"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
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
  const { t } = useI18n();

  const [kind, setKind] = useState<DebtKind>("payable");
  const [customerId, setCustomerId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [currency, setCurrency] = useState<Currency>("USDT");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<DebtPriority>("normal");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNewCustomer = customerId === "__new__";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async () => {
    setError(null);
    const amt = Number(amount);
    const validCustomer = isNewCustomer ? newName.trim().length > 0 : !!customerId;
    if (!validCustomer || !amt || amt <= 0) {
      setError(t.debts.form.errRequired);
      return;
    }
    setBusy(true);
    const supabase = createClient();

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
          <h2 className="text-lg font-semibold">{t.debts.form.newTitle}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted ring-1 ring-[var(--border)] transition hover:text-fg"
            aria-label={t.debts.close}
          >
            ✕
          </button>
        </div>

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
            <div className="grid gap-3 rounded-lg bg-surface-2/50 p-3 ring-1 ring-[var(--border)] sm:grid-cols-2">
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

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger ring-1 ring-danger/20">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
            >
              {t.debts.form.cancel}
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="flex-1 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
            >
              {busy ? t.debts.form.creating : t.debts.form.create}
            </button>
          </div>
        </div>
      </div>
    </div>
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
