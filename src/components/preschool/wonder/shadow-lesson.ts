export type Light = "near" | "far";
export type Step = "intro" | "predict" | "play" | "atelier" | "finale";

// Route ages represent 2–3, 3–4, 4–5 and 5–6 years respectively.
export const challenges = [
  "Μεγάλωσε και μίκρυνε τη σκιά της Λήδας.",
  "Φτιάξε πρώτα τη μικρή σκιά και μετά τη μεγάλη.",
  "Τι σκιά θα δεις αν φέρεις το φως κοντά; Διάλεξε και δοκίμασε.",
  "Η Λήδα μπαίνει στη σκηνή. Δείξε μικρή, μεγάλη και ξανά μικρή σκιά.",
] as const;

export const sequences: ReadonlyArray<readonly Light[]> = [
  ["near", "far"],
  ["far", "near"],
  ["near"],
  ["far", "near", "far"],
];

export const shadowScale: Record<Light, number> = { near: 1.37, far: 0.62 };

export const owlOutline =
  "M80 176 Q57 176 44 158 Q16 163 14 133 Q12 113 32 96 Q25 72 38 52 L29 21 Q29 14 35 18 L63 34 Q80 25 100 34 L126 18 Q133 14 132 22 L122 53 Q135 70 129 96 Q148 111 147 134 Q146 163 119 158 Q104 176 80 176Z";
export const owlRegions = [
  { name: "Σώμα", path: owlOutline },
  { name: "Αριστερό φτερό", path: "M32 96 Q55 106 52 142 Q50 157 44 158 Q16 163 14 133 Q12 113 32 96Z" },
  { name: "Δεξί φτερό", path: "M129 96 Q105 106 109 142 Q111 156 119 158 Q146 163 147 134 Q148 111 129 96Z" },
  { name: "Κοιλιά", path: "M56 139 Q56 113 80 113 Q104 113 105 139 Q105 161 80 164 Q55 161 56 139Z" },
  { name: "Πρόσωπο", path: "M80 65 Q60 43 46 70 Q33 100 80 117 Q125 101 115 70 Q101 43 80 65Z" },
] as const;
export const owlDetails =
  "M60 82 a4 6 0 1 0 .1 0Z M101 82 a4 6 0 1 0 .1 0Z M75 91 L85 91 L80 100Z";
export const blankColors = ["#fff9eb", "#fff9eb", "#fff9eb", "#fff9eb", "#fff9eb"];
export const storageKey = "pisipouk-shadow-art-v1";

export function validSavedArt(value: string | null): value is string {
  return Boolean(value && value.length <= 600_000 && /^data:image\/png;base64,[a-z0-9+/=]+$/i.test(value));
}
