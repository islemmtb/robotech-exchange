"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtDateTime } from "@/lib/format";
import { findSimilarCustomers } from "@/lib/similar";
import type { ReservationRow, CustomerRow } from "@/lib/types";

export function ReservationsClient({
  reservations,
  customers,
}: {
  reservations: ReservationRow[];
  customers: CustomerRow[];
}) {
  const { t, lang } = useI18n();
  const router = useRouter();

  const [customerId, setCustomerId] = useState("");
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = customerId === "__new__";
  const similar = isNew ? findSimilarCustomers(newName, customers) : [];

  const active = reservations.filter((r) => !r.done);
  const completed = reservations.filter((r) => r.done);

  const onSelectCustomer = (id: string) => {
    setCustomerId(id);
    if (id && id !== "__new__") {
      const c = customers.find((x) => x.id === id);
      if (c && !number) setNumber(c.whatsapp || c.phone || "");
    }
  };

  const add = async () => {
    setError(null);
    const validClient = isNew ? newName.trim().length > 0 : !!customerId;
    if (!validClient || !number.trim()) {
      setError(t.reservations.errRequired);
      return;
    }
    setBusy(true);
    const supabase = createClient();

    let finalId: string | null = customerId || null;
    let clientName = "";

    if (isNew) {
      const { data, error: cErr } = await supabase
        .from("customers")
        .insert({ full_name: newName.trim(), whatsapp: number.trim() || null })
        .select("id, full_name")
        .single();
      if (cErr || !data) {
        setBusy(false);
        setError(cErr?.message ?? "Error");
        return;
      }
      finalId = data.id;
      clientName = data.full_name;
    } else {
      clientName = customers.find((c) => c.id === customerId)?.full_name ?? "";
    }

    const { error: rErr } = await supabase.from("reservations").insert({
      customer_id: finalId,
      client_name: clientName,
      client_number: number.trim(),
      note: note.trim() || null,
    });
    setBusy(false);
    if (rErr) {
      setError(rErr.message);
      return;
    }
    setCustomerId("");
    setNewName("");
    setNumber("");
    setNote("");
    router.refresh();
  };

  const check = async (r: ReservationRow) => {
    if (!confirm(t.reservations.checkConfirm)) return;
    await createClient()
      .from("reservations")
      .update({ done: true, done_at: new Date().toISOString() })
      .eq("id", r.id);
    router.refresh();
  };

  const restore = async (r: ReservationRow) => {
    await createClient()
      .from("reservations")
      .update({ done: false, done_at: null })
      .eq("id", r.id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.reservations.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          {t.reservations.subtitle}
        </p>
      </header>

      {/* Add */}
      <div className="glass space-y-3 rounded-2xl p-4 ring-1 ring-[var(--border)]">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            {t.reservations.client}
          </label>
          <select
            value={customerId}
            onChange={(e) => onSelectCustomer(e.target.value)}
            className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
          >
            <option value="">{t.reservations.selectClient}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
            <option value="__new__">{t.reservations.addNew}</option>
          </select>
        </div>

        {isNew && (
          <div className="space-y-2 rounded-lg bg-surface-2/50 p-3 ring-1 ring-[var(--border)]">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.reservations.clientName}
              className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            />
            {similar.length > 0 && (
              <div className="rounded-lg bg-warn/10 p-2 ring-1 ring-warn/20">
                <p className="mb-1 px-1 text-[11px] font-medium text-warn">
                  {t.reservations.similarHint}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {similar.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onSelectCustomer(c.id)}
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

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {t.reservations.number}
            </label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t.reservations.numberPh}
              className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {t.reservations.note}
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.reservations.notePh}
              className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger ring-1 ring-danger/20">
            {error}
          </p>
        )}

        <button
          onClick={add}
          disabled={busy}
          className="w-full rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50 sm:w-auto"
        >
          {t.reservations.add}
        </button>
      </div>

      {/* Active */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.reservations.active}
        </h2>
        {active.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-sm text-muted ring-1 ring-[var(--border)]">
            {t.reservations.empty}
          </div>
        ) : (
          <ul className="space-y-2">
            {active.map((r) => (
              <li
                key={r.id}
                className="glass flex items-start gap-3 rounded-xl p-3.5 ring-1 ring-[var(--border)]"
              >
                <button
                  onClick={() => check(r)}
                  aria-label="delivered"
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md ring-1 ring-[var(--border)] transition hover:ring-accent"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.client_name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.client_number}
                    {r.note ? " · " + r.note : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Delivered */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.reservations.completed}
        </h2>
        {completed.length === 0 ? (
          <p className="px-1 text-sm text-muted">
            {t.reservations.noCompleted}
          </p>
        ) : (
          <ul className="space-y-2">
            {completed.map((r) => (
              <li
                key={r.id}
                className="glass flex items-start gap-3 rounded-xl p-3.5 opacity-70 ring-1 ring-[var(--border)]"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-pos/15 text-pos ring-1 ring-pos/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-9" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-through">
                    {r.client_name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {r.client_number}
                    {r.note ? " · " + r.note : ""}
                    {r.done_at
                      ? " · " +
                        t.reservations.doneOn +
                        " " +
                        fmtDateTime(r.done_at, lang)
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => restore(r)}
                  className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-[var(--border)] transition hover:bg-surface-2"
                >
                  {t.reservations.restore}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
