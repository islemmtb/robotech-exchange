"use client";

import { useI18n } from "@/lib/i18n/LangProvider";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 ring-1 ring-[var(--border)]">
        <RoboMark />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-semibold tracking-tight">
            {t.appName}
          </span>
          <span className="block text-[11px] text-muted">{t.appTag}</span>
        </span>
      )}
    </div>
  );
}

function RoboMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9.5a3.5 3.5 0 0 1 3.5-3.5h5A3.5 3.5 0 0 1 18 9.5V14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9.5Z"
        stroke="url(#g)"
        strokeWidth="1.6"
      />
      <circle cx="10" cy="11.5" r="1.4" fill="url(#g)" />
      <circle cx="14" cy="11.5" r="1.4" fill="url(#g)" />
      <path d="M12 6V3.5M8 6 6.5 4M16 6 17.5 4" stroke="url(#g)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
