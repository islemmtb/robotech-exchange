"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { findSimilarCustomers } from "@/lib/similar";
import type { CustomerRow, VerificationStatus } from "@/lib/types";

const VERIFS: VerificationStatus[] = [
  "unverified",
  "pending",
  "verified",
  "rejected",
];

export function CustomerModal({
  customer,
  customers,
  hasLiveDebt,
  onClose,
  onSaved,
}: {
  customer: CustomerRow | null;
  customers: CustomerRow[];
  hasLiveDebt: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();

  const [pickedId, setPickedId] = useState<string | null>(null);
  const targetId = customer?.id ?? pickedId;
  const isEdit = !!targetId;

  const [name, setName] = useState(customer?.full_name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(customer?.whatsapp ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [notes, setNotes] = useState(customer?.notes ?? "");
  const [verification, setVerification] = useState<VerificationStatus>(
    customer?.verification ?? "unverified",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    setError(null);
    if (!name.trim()) {
      setError(t.customers.form.errName);
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = {
      full_name: name.trim(),
      phone: phone.trim() || null,
      whatsapp: whatsapp.trim() || null,
      email: email.trim() || null,
      notes: notes.trim() || null,
      verification,
    };
    const { error: err } = isEdit
      ? await supabase.from("customers").update(payload).eq("id", targetId!)
      : await supabase.from("customers").insert(payload);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved();
  };

  // Only suggest when creating fresh (not editing, not already linked to an existing one)
  const suggestions =
    !customer && !pickedId ? findSimilarCustomers(name, customers) : [];

  const pickExisting = (c: CustomerRow) => {
    setPickedId(c.id);
    setName(c.full_name);
    setPhone(c.phone ?? "");
    setWhatsapp(c.whatsapp ?? "");
    setEmail(c.email ?? "");
    setNotes(c.notes ?? "");
    setVerification(c.verification);
  };

  const archive = async () => {
    if (!customer) return;
    if (hasLiveDebt) {
      setError(t.customers.form.liveDebtBlock);
      return;
    }
    if (!confirm(t.customers.form.removeConfirm)) return;
    setBusy(true);
    const { error: err } = await createClient()
      .from("customers")
      .update({ archived: true })
      .eq("id", customer.id);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved();
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
            {isEdit ? t.customers.form.editTitle : t.customers.form.addTitle}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted ring-1 ring-[var(--border)] transition hover:text-fg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>{t.customers.form.name}</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            />
            {pickedId && (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs text-accent ring-1 ring-accent/20">
                <span>{t.customers.duplicates.usingExisting}</span>
                <button
                  onClick={() => setPickedId(null)}
                  className="shrink-0 font-medium underline"
                >
                  {t.customers.duplicates.unlink}
                </button>
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="mt-2 rounded-lg bg-warn/10 p-2 ring-1 ring-warn/20">
                <p className="mb-1 px-1 text-[11px] font-medium text-warn">
                  {t.customers.duplicates.hint}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => pickExisting(c)}
                      className="rounded-md bg-surface px-2 py-1 text-xs font-medium ring-1 ring-[var(--border)] transition hover:ring-accent"
                    >
                      {c.full_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={t.customers.form.phone}
              value={phone}
              onChange={setPhone}
            />
            <Field
              label={t.customers.form.whatsapp}
              value={whatsapp}
              onChange={setWhatsapp}
            />
          </div>
          <Field
            label={t.customers.form.email}
            value={email}
            onChange={setEmail}
          />

          <div>
            <Label>{t.customers.form.verification}</Label>
            <select
              value={verification}
              onChange={(e) =>
                setVerification(e.target.value as VerificationStatus)
              }
              className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            >
              {VERIFS.map((v) => (
                <option key={v} value={v}>
                  {t.customers.verification[v]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t.customers.form.notes}</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger ring-1 ring-danger/20">
              {error}
            </p>
          )}

          {customer && (
            <div className="mb-1">
              {hasLiveDebt && (
                <p className="mb-2 rounded-lg bg-surface-2 px-3 py-2 text-[11px] text-muted ring-1 ring-[var(--border)]">
                  {t.customers.form.liveDebtBlock}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {customer && (
              <button
                onClick={archive}
                disabled={busy || hasLiveDebt}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-danger ring-1 ring-danger/20 transition hover:bg-danger/10 disabled:opacity-40"
              >
                {t.customers.form.remove}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
            >
              {t.customers.form.cancel}
            </button>
            <button
              onClick={save}
              disabled={busy}
              className="flex-1 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
            >
              {busy ? t.customers.form.saving : t.customers.form.save}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
