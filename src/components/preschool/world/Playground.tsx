import { useRef, useState } from "react";
import {
  Leaf,
  Flower2,
  TreePine,
  Bird,
  Fish,
  Carrot,
  Apple,
  Cherry,
  RotateCcw,
  Printer,
  Check,
} from "lucide-react";
import { AGES, type Age } from "./content";
import { makePdf, download } from "./export";
const ITEMS = [
  { name: "Φύλλο", kind: "Φυτά", I: Leaf },
  { name: "Πουλί", kind: "Ζώα", I: Bird },
  { name: "Λουλούδι", kind: "Φυτά", I: Flower2 },
  { name: "Ψάρι", kind: "Ζώα", I: Fish },
  { name: "Δέντρο", kind: "Φυτά", I: TreePine },
  { name: "Καρότο", kind: "Φυτά", I: Carrot },
  { name: "Μήλο", kind: "Φυτά", I: Apple },
  { name: "Κεράσι", kind: "Φυτά", I: Cherry },
];
export function Playground({
  age,
  onComplete,
}: {
  age: Age;
  onComplete: (id: string) => void;
}) {
  const [game, setGame] = useState<"sort" | "puzzle">("sort"),
    [selected, setSelected] = useState<string | null>(null),
    [sorted, setSorted] = useState<string[]>([]),
    [placed, setPlaced] = useState<number[]>([]),
    [piece, setPiece] = useState<number | null>(null),
    [message, setMessage] = useState(
      "Διάλεξε ένα αντικείμενο και μετά το καλάθι του.",
    ),
    [busy, setBusy] = useState(false);
  const bins = useRef<Record<string, HTMLButtonElement | null>>({});
  const drag = useRef<string | null>(null);
  const items = ITEMS.slice(0, [2, 4, 6, 8][age]),
    n = age < 2 ? 2 : 3,
    total = n * n;
  const solveSort = (name: string, kind: string) => {
    const item = items.find((i) => i.name === name);
    if (item?.kind === kind) {
      const next = [...sorted, name];
      setSorted(next);
      setSelected(null);
      setMessage(
        next.length === items.length
          ? "Τα ταξινόμησες όλα! Κάθε αντικείμενο βρήκε την παρέα του."
          : "Βρήκε την παρέα του! Ποιο θα βάλεις μετά;",
      );
      if (next.length === items.length) onComplete(`sort-${age}`);
    } else setMessage("Κοίτα πάλι. Το αντικείμενο είναι φυτό ή ζώο;");
  };
  const reset = () => {
    setSorted([]);
    setPlaced([]);
    setSelected(null);
    setPiece(null);
    setMessage(
      game === "sort"
        ? "Διάλεξε ένα αντικείμενο και μετά το καλάθι του."
        : "Διάλεξε ένα κομμάτι και τη θέση του. Η μικρή εικόνα σε βοηθά.",
    );
  };
  const order = Array.from({ length: total }, (_, i) => total - 1 - i);
  const tile = (i: number) => ({
    backgroundImage: "url(/preschool-world/village-mobile.webp)",
    backgroundSize: `${n * 100}% ${n * 100}%`,
    backgroundPosition: `${((i % n) / (n - 1)) * 100}% ${(Math.floor(i / n) / (n - 1)) * 100}%`,
  });
  return (
    <section className="pw-playground">
      <div className="pw-section-title">
        <small>Ο ΚΗΠΟΣ ΤΟΥ ΠΑΙΧΝΙΔΙΟΥ · {AGES[age]} ΕΤΩΝ</small>
        <h2>Παρατηρώ. Δοκιμάζω. Ανακαλύπτω.</h2>
        <p>Με επιλογή και άγγιγμα, χωρίς χρονόμετρο και χωρίς βαθμολογία.</p>
      </div>
      <div className="pw-tabs">
        <button
          aria-pressed={game === "sort"}
          onClick={() => {
            setGame("sort");
            setMessage("Διάλεξε ένα αντικείμενο και μετά το καλάθι του.");
          }}
        >
          Τα καλάθια της φύσης
        </button>
        <button
          aria-pressed={game === "puzzle"}
          onClick={() => {
            setGame("puzzle");
            setMessage(
              "Διάλεξε ένα κομμάτι και τη θέση του. Η μικρή εικόνα σε βοηθά.",
            );
          }}
        >
          Το παζλ του χωριού
        </button>
      </div>
      {game === "sort" ? (
        <div className="pw-sort">
          <h3>Φυτά ή ζώα;</h3>
          <p>
            Μπορείς να σύρεις ή να επιλέξεις ένα αντικείμενο και το καλάθι του.
          </p>
          <div className="pw-sort-items">
            {items.map(({ name, I }) => (
              <button
                key={name}
                disabled={sorted.includes(name)}
                aria-pressed={selected === name}
                onClick={() => setSelected(name)}
                onPointerDown={(e) => {
                  drag.current = name;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerUp={(e) => {
                  const name = drag.current;
                  drag.current = null;
                  if (!name) return;
                  for (const [kind, el] of Object.entries(bins.current)) {
                    const r = el?.getBoundingClientRect();
                    if (
                      r &&
                      e.clientX >= r.left &&
                      e.clientX <= r.right &&
                      e.clientY >= r.top &&
                      e.clientY <= r.bottom
                    ) {
                      solveSort(name, kind);
                      return;
                    }
                  }
                }}
              >
                <I size={45} />
                <span>{name}</span>
                {sorted.includes(name) && <Check size={17} />}
              </button>
            ))}
          </div>
          <div className="pw-bins">
            {["Φυτά", "Ζώα"].map((kind) => (
              <button
                key={kind}
                ref={(el) => {
                  bins.current[kind] = el;
                }}
                onClick={() => {
                  if (selected) solveSort(selected, kind);
                  else setMessage("Διάλεξε πρώτα ένα αντικείμενο.");
                }}
              >
                <b>{kind}</b>
                <span>
                  {sorted
                    .filter(
                      (s) => items.find((i) => i.name === s)?.kind === kind,
                    )
                    .join(" · ") || "Βάζω εδώ όσα ταιριάζουν"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pw-puzzle">
          <div>
            <h3>Φτιάχνω το χωριό μας.</h3>
            <img
              className="pw-puzzle-reference"
              src="/preschool-world/village-mobile.webp"
              alt="Η ολοκληρωμένη εικόνα του χωριού για βοήθεια"
            />
            <div
              className="pw-puzzle-board"
              style={{ gridTemplateColumns: `repeat(${n},1fr)` }}
            >
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  aria-label={`Θέση ${i + 1}`}
                  disabled={placed.includes(i)}
                  style={placed.includes(i) ? tile(i) : undefined}
                  onClick={() => {
                    if (piece === null) {
                      setMessage("Διάλεξε πρώτα ένα κομμάτι.");
                      return;
                    }
                    if (piece === i) {
                      const next = [...placed, i];
                      setPlaced(next);
                      setPiece(null);
                      setMessage(
                        next.length === total
                          ? "Το χωριό είναι έτοιμο! Το έφτιαξες βήμα βήμα."
                          : "Το κομμάτι βρήκε τη θέση του!",
                      );
                      if (next.length === total) onComplete(`puzzle-${age}`);
                    } else
                      setMessage(
                        "Δοκίμασε μια άλλη θέση. Κοίτα τα χρώματα και τις άκρες.",
                      );
                  }}
                >
                  {!placed.includes(i) && <span>{i + 1}</span>}
                </button>
              ))}
            </div>
          </div>
          <div
            className="pw-puzzle-pieces"
            style={{ gridTemplateColumns: `repeat(${n},1fr)` }}
          >
            {order.map((i) => (
              <button
                key={i}
                disabled={placed.includes(i)}
                aria-label={`Κομμάτι ${i + 1}`}
                aria-pressed={piece === i}
                style={tile(i)}
                onClick={() => setPiece(i)}
              >
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="pw-feedback" role="status">
        {message}
      </p>
      <div className="pw-tools">
        <button onClick={reset}>
          <RotateCcw />
          Παίζω ξανά
        </button>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              download(
                await makePdf(
                  game === "sort"
                    ? "Τα καλάθια της φύσης"
                    : "Το παζλ του χωριού",
                  [
                    `Ηλικία ${AGES[age]} ετών`,
                    game === "sort"
                      ? `Ζωγράφισε και ταξινόμησε: ${items.map((i) => i.name).join(", ")}. Φτιάξε δύο μεγάλους κύκλους: φυτά και ζώα.`
                      : "Ζωγράφισε ένα χωριό. Ο ενήλικος χωρίζει την εικόνα σε 4 ή 9 μεγάλα κομμάτια. Ξαναφτιάξτε την εικόνα μαζί.",
                    "Ο ενήλικος χειρίζεται το ψαλίδι. Τα μικρά παιδιά χρησιμοποιούν μεγάλα έτοιμα κομμάτια.",
                    "Συνέχεια εκτός οθόνης: παρατηρήστε φυτά και ζωάκια σε μια βόλτα.",
                  ],
                ),
                `pisipouk-${game}-A4.pdf`,
              );
              setMessage("Το PDF αποθηκεύτηκε.");
            } catch {
              setMessage("Δεν δημιουργήθηκε το PDF. Δοκίμασε ξανά.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Printer />
          Παιχνίδι σε A4 PDF
        </button>
      </div>
    </section>
  );
}
