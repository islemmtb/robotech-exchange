"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/LangProvider";
import { fmtMoney } from "@/lib/format";
import type {
  CustomerRow,
  DebtBalanceRow,
  Currency,
  VerificationStatus,
} from "@/lib/types";
import { CustomerModal } from "./CustomerModal";

type Exposure = {
  payable: Map<Currency, number>;
  receivable: Map<Currency, number>;
};

function buildExposure(debts: Partial<DebtBalanceRow>[]) {
  const map = new Map<string, Exposure>();
  for (const d of debts) {
    if (!d.customer_id || !d.currency) continue;
    const e =
      map.get(d.customer_id) ??
      { payable: new Map(), receivable: new Map() };
    const bucket = d.kind === "payable" ? e.payable : e.receivable;
    bucket.set(
      d.currency,
      (bucket.get(d.currency) ?? 0) + Number(d.remaining_amount ?? 0),
    );
    map.set(d.customer_id, e);
  }
  return map;
}

const VERIF_STYLE: Record<VerificationStatus, string> = {
  verified: "bg-pos/10 text-pos ring-pos/20",
  pending: "bg-warn/10 text-warn ring-warn/20",
  rejected: "bg-danger/10 text-danger ring-danger/20",
  unverified: "bg-surface-2 text-muted ring-[var(--border)]",
};

export function CustomersClient({
  customers,
  debts,
}: {
  customers: CustomerRow[];
  debts: Partial<DebtBalanceRow>[];
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerRow | null>(null);

  const exposure = useMemo(() => buildExposure(debts), [debts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q) ||
        (c.whatsapp ?? "").toLowerCase().includes(q),
    );
  }, [customers, query]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (c: CustomerRow) => {
    setEditing(c);
    setModalOpen(true);
  };
  const done = () => {
    setModalOpen(false);
    setEditing(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.customers.title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            {t.customers.subtitle}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
        >
          {t.customers.add}
        </button>
      </header>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.customers.search}
          className="w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm outline-none ring-1 ring-[var(--border)] transition focus:ring-2 focus:ring-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted ring-1 ring-[var(--border)]">
          {query ? t.customers.emptySearch : t.customers.empty}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const e = exposure.get(c.id);
            return (
              <div
                key={c.id}
                className="glass flex flex-col rounded-2xl p-4 ring-1 ring-[var(--border)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="min-w-0 text-left"
                  >
                    <p className="truncate font-medium hover:text-accent">
                      {c.full_name}
                    </p>
                  </button>
                  <span
                    className={
                      "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 " +
                      VERIF_STYLE[c.verification]
                    }
                  >
                    {t.customers.verification[c.verification]}
                  </span>
                </div>

                {/* Contact actions */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.whatsapp && (
                    <ContactChip
                      href={"https://wa.me/" + digits(c.whatsapp)}
                      label={t.customers.contact.whatsapp}
                      icon={<WhatsIcon />}
                    />
                  )}
                  {c.phone && (
                    <ContactChip
                      href={"tel:" + c.phone}
                      label={t.customers.contact.call}
                      icon={<PhoneIcon />}
                    />
                  )}
                  {c.email && (
                    <ContactChip
                      href={"mailto:" + c.email}
                      label={t.customers.contact.email}
                      icon={<MailIcon />}
                    />
                  )}
                </div>

                {/* Debt exposure */}
                {e && (e.payable.size > 0 || e.receivable.size > 0) && (
                  <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-3 text-xs">
                    {e.payable.size > 0 && (
                      <ExposureLine
                        label={t.customers.youOwe}
                        dot="bg-warn"
                        entries={e.payable}
                        lang={lang}
                      />
                    )}
                    {e.receivable.size > 0 && (
                      <ExposureLine
                        label={t.customers.owesYou}
                        dot="bg-pos"
                        entries={e.receivable}
                        lang={lang}
                      />
                    )}
                  </div>
                )}

                {c.notes && (
                  <p className="mt-3 line-clamp-2 text-xs text-muted">
                    {c.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <CustomerModal
          customer={editing}
          customers={customers}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSaved={done}
        />
      )}
    </div>
  );
}

function ExposureLine({
  label,
  dot,
  entries,
  lang,
}: {
  label: string;
  dot: string;
  entries: Map<Currency, number>;
  lang: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted">
        <span className={"h-1.5 w-1.5 rounded-full " + dot} />
        {label}
      </span>
      <span className="tabnum font-mono font-medium">
        {Array.from(entries.entries())
          .map(([cur, amt]) => fmtMoney(amt, cur, lang))
          .join(" · ")}
      </span>
    </div>
  );
}

function ContactChip({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1 text-xs text-muted ring-1 ring-[var(--border)] transition hover:text-fg"
    >
      {icon}
      {label}
    </a>
  );
}

function digits(s: string) {
  return s.replace(/[^\d]/g, "");
}

const ico = {
  width: 13,
  height: 13,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const WhatsIcon = () => (
  <svg {...ico}>
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
    <path d="M8.5 8.5c0 4 3 7 7 7 .6-1 1-1.6.4-2.2-.5-.5-1.6-1-2.2-.4-.8-.4-1.8-1.4-2.2-2.2.6-.6.1-1.7-.4-2.2-.6-.6-1.2-.2-2.2.4" />
  </svg>
);
const PhoneIcon = () => (
  <svg {...ico}>
    <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
  </svg>
);
const MailIcon = () => (
  <svg {...ico}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
