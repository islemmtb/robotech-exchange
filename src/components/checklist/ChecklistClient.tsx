"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtDateTime } from "@/lib/format";
import type { ChecklistItemRow } from "@/lib/types";

export function ChecklistClient({ items }: { items: ChecklistItemRow[] }) {
  const { t, lang } = useI18n();
  const router = useRouter();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [eName, setEName] = useState("");
  const [eNumber, setENumber] = useState("");
  const [eNote, setENote] = useState("");

  const startEdit = (i: ChecklistItemRow) => {
    setEditingId(i.id);
    setEName(i.name ?? "");
    setENumber(i.number ?? "");
    setENote(i.note);
  };
  const saveEdit = async (id: string) => {
    if (!eNote.trim()) return;
    await createClient()
      .from("checklist_items")
      .update({
        name: eName.trim() || null,
        number: eNumber.trim() || null,
        note: eNote.trim(),
      })
      .eq("id", id);
    setEditingId(null);
    router.refresh();
  };

  const active = items.filter((i) => !i.done);
  const completed = items.filter((i) => i.done);

  const add = async () => {
    setError(null);
    if (!note.trim()) {
      setError(t.checklist.errNote);
      return;
    }
    setBusy(true);
    const { error: err } = await createClient().from("checklist_items").insert({
      name: name.trim() || null,
      number: number.trim() || null,
      note: note.trim(),
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setNumber("");
    setNote("");
    router.refresh();
  };

  const check = async (item: ChecklistItemRow) => {
    if (!confirm(t.checklist.checkConfirm)) return;
    await createClient()
      .from("checklist_items")
      .update({ done: true, done_at: new Date().toISOString() })
      .eq("id", item.id);
    router.refresh();
  };

  const restore = async (item: ChecklistItemRow) => {
    await createClient()
      .from("checklist_items")
      .update({ done: false, done_at: null })
      .eq("id", item.id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.checklist.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          {t.checklist.subtitle}
        </p>
      </header>

      {/* Add */}
      <div className="glass rounded-2xl p-4 ring-1 ring-[var(--border)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.checklist.name + " — " + t.checklist.namePh}
            className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
          />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t.checklist.number + " — " + t.checklist.numberPh}
            className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder={t.checklist.notePh}
            className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={add}
            disabled={busy || !note.trim()}
            className="shrink-0 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
          >
            {t.checklist.add}
          </button>
        </div>
        {error && (
          <p className="mt-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger ring-1 ring-danger/20">
            {error}
          </p>
        )}
      </div>

      {/* Active */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.checklist.active}
        </h2>
        {active.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-sm text-muted ring-1 ring-[var(--border)]">
            {t.checklist.empty}
          </div>
        ) : (
          <ul className="space-y-2">
            {active.map((i) =>
              editingId === i.id ? (
                <li
                  key={i.id}
                  className="glass space-y-2 rounded-xl p-3.5 ring-1 ring-accent/30"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={eName}
                      onChange={(e) => setEName(e.target.value)}
                      placeholder={t.checklist.name}
                      className="w-full rounded-lg bg-surface-2 px-3 py-2 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                    />
                    <input
                      value={eNumber}
                      onChange={(e) => setENumber(e.target.value)}
                      placeholder={t.checklist.number}
                      className="w-full rounded-lg bg-surface-2 px-3 py-2 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <input
                    value={eNote}
                    onChange={(e) => setENote(e.target.value)}
                    placeholder={t.checklist.notePh}
                    className="w-full rounded-lg bg-surface-2 px-3 py-2 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
                    >
                      {t.checklist.cancel}
                    </button>
                    <button
                      onClick={() => saveEdit(i.id)}
                      disabled={!eNote.trim()}
                      className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                    >
                      {t.checklist.save}
                    </button>
                  </div>
                </li>
              ) : (
                <li
                  key={i.id}
                  className="glass flex items-start gap-3 rounded-xl p-3.5 ring-1 ring-[var(--border)]"
                >
                  <button
                    onClick={() => check(i)}
                    aria-label="done"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md ring-1 ring-[var(--border)] transition hover:ring-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{i.note}</p>
                    {(i.name || i.number) && (
                      <p className="mt-0.5 text-xs text-muted">
                        {[i.name, i.number].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(i)}
                    className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-[var(--border)] transition hover:text-fg"
                  >
                    {t.checklist.edit}
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      {/* Completed */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.checklist.completed}
        </h2>
        {completed.length === 0 ? (
          <p className="px-1 text-sm text-muted">{t.checklist.noCompleted}</p>
        ) : (
          <ul className="space-y-2">
            {completed.map((i) => (
              <li
                key={i.id}
                className="glass flex items-start gap-3 rounded-xl p-3.5 opacity-70 ring-1 ring-[var(--border)]"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-pos/15 text-pos ring-1 ring-pos/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-9" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm line-through">{i.note}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {[i.name, i.number].filter(Boolean).join(" · ")}
                    {i.done_at
                      ? (i.name || i.number ? " · " : "") +
                        t.checklist.doneOn +
                        " " +
                        fmtDateTime(i.done_at, lang)
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => restore(i)}
                  className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-[var(--border)] transition hover:bg-surface-2"
                >
                  {t.checklist.restore}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
