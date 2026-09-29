export type PreschoolAge = "2-3" | "4-5" | "5-6";

export type PreschoolProgress = {
  age: PreschoolAge;
  completedIds: string[];
  favorites: string[];
  stars: number;
  lastActiveDate: string | null;
};

const KEY = "pisipouk_preschool_progress_v1";

const DEFAULT_PROGRESS: PreschoolProgress = {
  age: "2-3",
  completedIds: [],
  favorites: [],
  stars: 0,
  lastActiveDate: null,
};

export function loadPreschoolProgress(): PreschoolProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PreschoolProgress>;
    const age = parsed.age === "4-5" || parsed.age === "5-6" ? parsed.age : "2-3";
    const completedIds = Array.isArray(parsed.completedIds)
      ? parsed.completedIds.filter((item): item is string => typeof item === "string")
      : [];
    const favorites = Array.isArray(parsed.favorites)
      ? parsed.favorites.filter((item): item is string => typeof item === "string")
      : [];
    return {
      age,
      completedIds,
      favorites,
      stars: Number.isFinite(parsed.stars) ? Math.max(0, Number(parsed.stars)) : completedIds.length,
      lastActiveDate: typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function savePreschoolProgress(progress: PreschoolProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
}

export function markPreschoolActivityComplete(activityId: string) {
  const current = loadPreschoolProgress();
  if (current.completedIds.includes(activityId)) return current;
  const next: PreschoolProgress = {
    ...current,
    completedIds: [...current.completedIds, activityId],
    stars: current.stars + 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
  };
  savePreschoolProgress(next);
  return next;
}

export function setPreschoolAge(age: PreschoolAge) {
  const current = loadPreschoolProgress();
  const next = { ...current, age };
  savePreschoolProgress(next);
  return next;
}

export function togglePreschoolFavorite(activityId: string) {
  const current = loadPreschoolProgress();
  const favorites = current.favorites.includes(activityId)
    ? current.favorites.filter((item) => item !== activityId)
    : [...current.favorites, activityId];
  const next = { ...current, favorites };
  savePreschoolProgress(next);
  return next;
}

export function preschoolBadgeLabel(stars: number) {
  if (stars >= 30) return "🏆 Μεγάλος Εξερευνητής";
  if (stars >= 15) return "🌟 Μικρός Δημιουργός";
  if (stars >= 7) return "🎨 Φίλος του Πισιπούκ";
  if (stars >= 3) return "⭐ Πρώτα Αστεράκια";
  return "🧸 Ξεκινάμε μαζί";
}
