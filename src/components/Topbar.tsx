"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { ThemeToggle, LangToggle } from "./Toggles";
import { Brand } from "./Brand";

export function Topbar({
  email,
  onMenuClick,
}: {
  email: string | null;
  onMenuClick: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-bg/70 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted ring-1 ring-[var(--border)] transition hover:text-fg md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="md:hidden">
        <Brand compact />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LangToggle />
        <ThemeToggle />
        <div className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:block" />
        {email && (
          <span className="hidden max-w-[160px] truncate text-xs text-muted sm:block">
            {email}
          </span>
        )}
        <button
          onClick={signOut}
          className="rounded-lg px-3 py-2 text-xs font-medium text-muted ring-1 ring-[var(--border)] transition hover:bg-surface-2 hover:text-fg"
        >
          {t.topbar.signOut}
        </button>
      </div>
    </header>
  );
}
