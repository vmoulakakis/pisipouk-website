/** Preschool-only randomization. Never change an active round during React re-render. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function nextDifferent<T>(items: readonly T[], oldValue: T): T {
  const others = items.filter((v) => v !== oldValue);
  const list = others.length ? others : items;
  return list[Math.floor(Math.random() * list.length)]!;
}
export function differentOrder<T>(items: readonly T[], oldOrder: readonly T[]): T[] {
  const next = shuffle(items);
  if (next.length > 1 && next.every((v, i) => v === oldOrder[i])) {
    [next[0], next[1]] = [next[1], next[0]];
  }
  return next;
}
