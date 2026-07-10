export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function findSimilarCustomers<
  T extends { id: string; full_name: string },
>(name: string, customers: T[], excludeId?: string, limit = 3): T[] {
  const q = normalizeName(name);
  if (q.length < 2) return [];
  const scored: { c: T; score: number }[] = [];
  for (const c of customers) {
    if (excludeId && c.id === excludeId) continue;
    const n = normalizeName(c.full_name);
    if (!n) continue;
    let score = 0;
    if (n === q) score = 100;
    else if (n.includes(q) || q.includes(n)) score = 80;
    else {
      const dist = levenshtein(q, n);
      const ratio = 1 - dist / Math.max(q.length, n.length);
      if (ratio >= 0.6) score = Math.round(ratio * 70);
    }
    if (score > 0) scored.push({ c, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.c);
}
