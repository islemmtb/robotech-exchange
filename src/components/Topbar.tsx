"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LangProvider";
import { ThemeToggle, LangToggle } from "./Toggles";
import { Brand } from "./Brand";

export function Topbar({ email }: { email: string | null }) {
  const { t } = useI18n();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-bg/70 px-4 backdrop-blur-md md:px-6">
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
