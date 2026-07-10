export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-44 rounded-lg bg-surface-2" />
        <div className="h-4 w-80 max-w-full rounded bg-surface-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 rounded-2xl bg-surface-2" />
        <div className="h-32 rounded-2xl bg-surface-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-2xl bg-surface-2" />
        <div className="h-24 rounded-2xl bg-surface-2" />
        <div className="h-24 rounded-2xl bg-surface-2" />
      </div>
    </div>
  );
}
