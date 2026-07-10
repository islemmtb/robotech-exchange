"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { useI18n } from "@/lib/i18n/LangProvider";

export function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const items: { key: keyof typeof t.nav; href: string; ready: boolean; icon: React.ReactNode }[] = [
    { key: "overview", href: "/dashboard", ready: true, icon: <GridIcon /> },
    { key: "exchanges", href: "#", ready: false, icon: <SwapIcon /> },
    { key: "debts", href: "/dashboard/debts", ready: true, icon: <ScaleIcon /> },
    { key: "customers", href: "#", ready: false, icon: <UsersIcon /> },
    { key: "cash", href: "#", ready: false, icon: <CashIcon /> },
    { key: "wallets", href: "#", ready: false, icon: <WalletIcon /> },
    { key: "notifications", href: "#", ready: false, icon: <BellIcon /> },
    { key: "settings", href: "#", ready: false, icon: <CogIcon /> },
  ];

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-surface/40 px-3 py-4 md:flex">
      <div className="px-2 pb-4">
        <Brand />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {items.map((it) => {
          const active = it.ready && pathname === it.href;
          const base =
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";
          if (!it.ready) {
            return (
              <span
                key={it.key}
                className={base + " cursor-default text-muted/60"}
              >
                <span className="opacity-70">{it.icon}</span>
                <span className="flex-1">{t.nav[it.key]}</span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {t.nav.soon}
                </span>
              </span>
            );
          }
          return (
            <Link
              key={it.key}
              href={it.href}
              className={
                base +
                (active
                  ? " bg-surface-2 text-fg ring-1 ring-[var(--border)]"
                  : " text-muted hover:bg-surface-2 hover:text-fg")
              }
            >
              <span className={active ? "text-accent" : ""}>{it.icon}</span>
              <span>{t.nav[it.key]}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const GridIcon = () => (<svg {...s}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
const SwapIcon = () => (<svg {...s}><path d="M7 4 4 7l3 3" /><path d="M4 7h13" /><path d="m17 20 3-3-3-3" /><path d="M20 17H7" /></svg>);
const ScaleIcon = () => (<svg {...s}><path d="M12 3v18" /><path d="M6 8h12" /><path d="M6 8l-3 6a3 3 0 0 0 6 0Z" /><path d="M18 8l-3 6a3 3 0 0 0 6 0Z" /></svg>);
const UsersIcon = () => (<svg {...s}><circle cx="9" cy="8" r="3" /><path d="M4 20a5 5 0 0 1 10 0" /><path d="M17 8a3 3 0 0 1 0 6M20 20a5 5 0 0 0-3-4.6" /></svg>);
const CashIcon = () => (<svg {...s}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>);
const WalletIcon = () => (<svg {...s}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1" /></svg>);
const BellIcon = () => (<svg {...s}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5 2 6H4c.5-1 2-2 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>);
const CogIcon = () => (<svg {...s}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></svg>);
