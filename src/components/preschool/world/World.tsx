import { useEffect, useRef, useState } from "react";
import {
  Home,
  Palette,
  Scissors,
  BookOpen,
  Hash,
  MessageCircle,
  Leaf,
  Heart,
  Music,
  Footprints,
  Puzzle,
  House,
  Flag,
  CloudSun,
  Globe,
  Lightbulb,
  Theater,
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Printer,
  Search,
  Star,
  CalendarDays,
  Download,
  Mail,
  X,
} from "lucide-react";
const logo = "/preschool-world/bear.webp";
import {
  AGES,
  MINUTES,
  DOMAINS,
  MONTHS,
  type Age,
  type Domain,
} from "./content";
import { Game } from "./Game";
import { Playground } from "./Playground";
import { Drawing } from "./Drawing";
import { StoryBook } from "./Stories";
import { domainLines, makePdf, download } from "./export";
import "./world.css";
const ICONS = [
  Palette,
  Scissors,
  BookOpen,
  Hash,
  MessageCircle,
  Leaf,
  Heart,
  Music,
  Footprints,
  Puzzle,
  House,
  Flag,
  CloudSun,
  Globe,
  Lightbulb,
  Theater,
];
const RELEASE = "WORLD-2026.10.14-R1";
type Panel =
  | "village"
  | "domain"
  | "drawing"
  | "stories"
  | "calendar"
  | "adult"
  | "playground";
const AGE_COPY = [
  "Ανακαλύπτω μαζί σου",
  "Δοκιμάζω μικρά βήματα",
  "Δημιουργώ και συνδέω",
  "Σκέφτομαι και σχεδιάζω",
];
const HOTSPOTS = [
  { name: "Ατελιέ", x: 14, y: 45, icon: Palette, panel: "drawing" },
  { name: "Ιστορίες", x: 33, y: 24, icon: BookOpen, panel: "stories" },
  { name: "Κατασκευές", x: 48, y: 51, icon: Scissors, id: "craft" },
  { name: "Κήπος", x: 17, y: 71, icon: Leaf, id: "nature" },
  { name: "Μουσική", x: 76, y: 49, icon: Music, id: "music" },
  { name: "Εφευρέτες", x: 89, y: 20, icon: Lightbulb, id: "steam" },
];
export function PreschoolWorld() {
  const [age, setAge] = useState<Age>(1),
    [panel, setPanel] = useState<Panel>("village"),
    [domain, setDomain] = useState(DOMAINS[0]),
    [query, setQuery] = useState(""),
    [gate, setGate] = useState(false),
    [gateInput, setGateInput] = useState(""),
    [gateError, setGateError] = useState(""),
    [authorized, setAuthorized] = useState(false),
    [share, setShare] = useState(false),
    [email, setEmail] = useState(""),
    [consent, setConsent] = useState(false),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [gray, setGray] = useState(false),
    [paper, setPaper] = useState<"A4" | "A5">("A4"),
    [plan, setPlan] = useState<string[]>(["nature", "art", "story"]),
    [month, setMonth] = useState(1),
    [saveProgress, setSaveProgress] = useState(false),
    [profile, setProfile] = useState("Αρκουδάκι"),
    [progress, setProgress] = useState<Record<string, string[]>>({}),
    [completed, setCompleted] = useState<string[]>([]),
    [drawingData, setDrawingData] = useState("");
  const top = useRef<HTMLElement>(null),
    gateRef = useRef<HTMLInputElement>(null),
    adultButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    speechSynthesis?.getVoices();
    try {
      const p = JSON.parse(
        localStorage.getItem("pisipouk-world-progress") || "null",
      );
      if (p) {
        setProgress(p.progress || {});
        setProfile(p.profile || "Αρκουδάκι");
        setSaveProgress(true);
        setCompleted(p.progress?.[p.profile] || []);
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (saveProgress) {
      try {
        localStorage.setItem(
          "pisipouk-world-progress",
          JSON.stringify({
            profile,
            progress: { ...progress, [profile]: completed },
          }),
        );
      } catch {
        setStatus("Η αποθήκευση στη συσκευή δεν είναι διαθέσιμη.");
      }
    }
  }, [completed, saveProgress, profile, progress]);
  useEffect(() => {
    if (gate) {
      gateRef.current?.focus();
      const esc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setGate(false);
          adultButton.current?.focus();
        }
      };
      document.addEventListener("keydown", esc);
      return () => document.removeEventListener("keydown", esc);
    }
  }, [gate]);
  const go = (p: Panel) => {
    speechSynthesis?.cancel();
    setPanel(p);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const open = (d: Domain) => {
    setDomain(d);
    go("domain");
  };
  const done = (id: string) => {
    setCompleted((v) => (v.includes(id) ? v : [...v, id]));
  };
  const adult = () => {
    if (authorized) go("adult");
    else {
      setGate(true);
      setGateError("");
      setGateInput("");
    }
  };
  const pdf = async (d = domain) => {
    setBusy(true);
    setStatus("Το PDF ετοιμάζεται…");
    try {
      download(
        await makePdf(
          d.tasks[age].title,
          domainLines(d, age),
          undefined,
          gray,
          paper,
          ["art", "craft", "nature", "greece", "seasons"].includes(d.id)
            ? "leaf"
            : "shapes",
        ),
        `pisipouk-${d.id}-${AGES[age]}-${paper}.pdf`,
      );
      setStatus("Το PDF αποθηκεύτηκε. Ανοίξτε το για εκτύπωση.");
    } catch {
      setStatus(
        "Δεν δημιουργήθηκε το PDF. Ελέγξτε τη σύνδεση και δοκιμάστε ξανά.",
      );
    } finally {
      setBusy(false);
    }
  };
  const icon = (i: number) => {
    const I = ICONS[i];
    return <I aria-hidden="true" />;
  };
  return (
    <div className="pw-app">
      <a className="pw-skip" href="#pw-main">
        Στο περιεχόμενο
      </a>
      <header className="pw-header">
        <button className="pw-brand" onClick={() => go("village")}>
          <img src={logo} alt="Ο Πισιπούκ" />
          <span>
            <b>Πισιπούκ</b>
            <small>Ο μικρός μας μεγάλος κόσμος</small>
          </span>
        </button>
        <nav aria-label="Κύρια πλοήγηση">
          <button
            aria-current={panel === "village" ? "page" : undefined}
            onClick={() => go("village")}
          >
            <Home />
            Το χωριό
          </button>
          <button
            aria-current={panel === "drawing" ? "page" : undefined}
            onClick={() => go("drawing")}
          >
            <Palette />
            Ζωγραφίζω
          </button>
          <button
            aria-current={panel === "stories" ? "page" : undefined}
            onClick={() => go("stories")}
          >
            <BookOpen />
            Ιστορίες
          </button>
          <button
            aria-current={panel === "calendar" ? "page" : undefined}
            onClick={() => go("calendar")}
          >
            <CalendarDays />
            Εποχές
          </button>
        </nav>
        <button ref={adultButton} className="pw-adult-button" onClick={adult}>
          <LockKeyhole />
          <span>Για μεγάλους</span>
        </button>
      </header>
      <main ref={top} id="pw-main">
        <section className="pw-agebar" aria-label="Επιλογή ηλικίας">
          <span>Κάθε ηλικία, μια νέα περιπέτεια.</span>
          <div>
            {AGES.map((a, i) => (
              <button
                key={a}
                aria-pressed={age === i}
                onClick={() => setAge(i as Age)}
              >
                <b>{a} ετών</b>
                <small>{AGE_COPY[i]}</small>
              </button>
            ))}
          </div>
        </section>
        {panel === "village" && (
          <>
            <div className="pw-intro">
              <div>
                <small>ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟ ΧΩΡΙΟ ΜΑΣ</small>
                <h1>
                  Μικρά βήματα.
                  <br />
                  <em>Μεγάλες ανακαλύψεις.</em>
                </h1>
                <p>
                  Εδώ οι ιδέες ανθίζουν και το παιχνίδι γίνεται μάθηση.
                  <br />
                  Διάλεξε ένα σπιτάκι. Ο Πισιπούκ σε περιμένει!
                </p>
              </div>
              <div className="pw-today-note">
                <Leaf />
                <span>Η μικρή ιδέα του Οκτωβρίου</span>
                <b>Από την ελιά στο λαδάκι</b>
                <button onClick={() => open(DOMAINS[11])}>
                  Πάμε στην αυλή <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <section
              className="pw-village"
              aria-label="Διαδραστικό εικονογραφημένο χωριό"
            >
              <picture>
                <source
                  media="(max-width:600px)"
                  srcSet="/preschool-world/village-mobile.webp"
                />
                <img
                  src="/preschool-world/village.webp"
                  alt="Το χωριό του Πισιπούκ: ατελιέ, βιβλιοθήκη σε δέντρο, σπίτι κατασκευών, κήπος, μουσικό περίπτερο και παρατηρητήριο. Ο χρυσαφένιος Πισιπούκ με μπλε φόρμα μας καλωσορίζει."
                  fetchPriority="high"
                />
              </picture>
              {HOTSPOTS.map((h) => (
                <button
                  key={h.name}
                  className="pw-hotspot"
                  aria-label={h.name}
                  style={{ left: h.x + "%", top: h.y + "%" }}
                  onClick={() =>
                    h.id
                      ? open(DOMAINS.find((d) => d.id === h.id)!)
                      : go(h.panel as Panel)
                  }
                >
                  <h.icon />
                  <span>{h.name}</span>
                </button>
              ))}
              <div className="pw-map-caption">
                Πάτησε ένα σπιτάκι και ανακάλυψε τι κρύβει.
              </div>
            </section>
            <div className="pw-village-mobile-links">
              {HOTSPOTS.map((h) => (
                <button
                  key={h.name}
                  onClick={() =>
                    h.id
                      ? open(DOMAINS.find((d) => d.id === h.id)!)
                      : go(h.panel as Panel)
                  }
                >
                  <h.icon />
                  {h.name}
                </button>
              ))}
            </div>
            <section className="pw-play-invite">
              <img
                src="/preschool-world/bear.webp"
                alt="Ο χρυσαφένιος Πισιπούκ με μπλε φόρμα"
              />
              <div>
                <small>ΕΛΑ ΝΑ ΠΑΙΞΟΥΜΕ ΜΑΖΙ</small>
                <h2>Μια μικρή πρόκληση. Μια μεγάλη χαρά.</h2>
                <p>
                  Ταξινόμησε τα καλάθια της φύσης ή φτιάξε το παζλ του χωριού.
                </p>
              </div>
              <button className="pw-primary" onClick={() => go("playground")}>
                Παίζω με τον Πισιπούκ <ArrowRight />
              </button>
            </section>
            <section className="pw-domains">
              <div className="pw-section-title">
                <small>16 ΚΟΣΜΟΙ · ΑΜΕΤΡΗΤΕΣ ΙΔΕΕΣ</small>
                <h2>Τι θα εξερευνήσουμε σήμερα;</h2>
                <p>
                  Για {AGES[age]} ετών · {AGE_COPY[age]} · πάντα με έναν μεγάλο
                  δίπλα.
                </p>
              </div>
              <div className="pw-domain-grid">
                {DOMAINS.map((d, i) => (
                  <button
                    key={d.id}
                    data-testid={`domain-${d.id}`}
                    onClick={() => open(d)}
                    style={{ "--domain-color": d.color } as React.CSSProperties}
                  >
                    <span className="pw-domain-icon">{icon(i)}</span>
                    <div>
                      <h3>{d.name}</h3>
                      <small>{d.subtitle}</small>
                    </div>
                    <ArrowRight size={17} />
                  </button>
                ))}
              </div>
            </section>
            <section className="pw-offline">
              <Heart />
              <div>
                <h2>Το πιο όμορφο παιχνίδι συνεχίζεται μαζί.</h2>
                <p>
                  Μετά από μια μικρή ψηφιακή περιπέτεια, κλείνουμε την οθόνη και
                  δοκιμάζουμε στον πραγματικό κόσμο.
                </p>
              </div>
              <button onClick={() => go("calendar")}>
                Μια ιδέα για σήμερα <ArrowRight />
              </button>
            </section>
          </>
        )}
        {panel === "domain" && (
          <section className="pw-domain-page">
            <button className="pw-back" onClick={() => go("village")}>
              <ArrowLeft />
              Πίσω στο χωριό
            </button>
            <div
              className="pw-domain-header"
              style={{ "--domain-color": domain.color } as React.CSSProperties}
            >
              <span>{icon(DOMAINS.indexOf(domain))}</span>
              <div>
                <small>
                  {AGES[age]} ΕΤΩΝ · {MINUTES[age]} ΛΕΠΤΑ · ΜΑΖΙ ΜΕ ΕΝΗΛΙΚΟ
                </small>
                <h2>{domain.name}</h2>
                <p>{domain.objective}</p>
              </div>
            </div>
            <div className="pw-learning-layout">
              <Game
                key={`${domain.id}-${age}`}
                task={domain.tasks[age]}
                onComplete={() => done(`${domain.id}-${age}`)}
              />
              <aside className="pw-craft">
                <small>Η ΠΕΡΙΠΕΤΕΙΑ ΣΥΝΕΧΙΖΕΤΑΙ</small>
                <h3>Φτιάχνουμε κάτι αληθινό.</h3>
                <p>
                  <b>Υλικά:</b> {domain.supplies}
                </p>
                <ol>
                  {domain.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p>{domain.offline}</p>
                <p className="pw-safety">
                  Ο ενήλικος ελέγχει τα υλικά. Για 2–3 ετών χρησιμοποιούμε
                  μεγάλα έτοιμα κομμάτια, χωρίς ψαλίδι ή μικρά αντικείμενα.
                </p>
                <button disabled={busy} onClick={() => pdf()}>
                  <Printer />
                  {busy ? "Ετοιμάζεται…" : "Φύλλο δραστηριότητας · A4 PDF"}
                </button>
                {domain.id === "art" && (
                  <button onClick={() => go("drawing")}>
                    <Palette />
                    Στο ατελιέ
                  </button>
                )}
                {domain.id === "story" && (
                  <button onClick={() => go("stories")}>
                    <BookOpen />
                    Διαβάζω μια ιστορία
                  </button>
                )}
              </aside>
            </div>
            <p role="status">{status}</p>
            <div className="pw-gentle-reward">
              <Star />
              <span>
                {completed.includes(`${domain.id}-${age}`)
                  ? "Κράτησες μια μικρή ανακάλυψη στην καρδιά σου."
                  : "Κάθε δοκιμή έχει αξία. Εδώ δεν υπάρχουν βαθμοί ή συγκρίσεις."}
              </span>
            </div>
          </section>
        )}
        <div hidden={panel !== "drawing"}>
          <Drawing saveData={setDrawingData} grayscale={gray} paper={paper} />
        </div>
        {panel === "playground" && (
          <Playground key={age} age={age} onComplete={done} />
        )}
        {panel === "stories" && (
          <StoryBook age={age} onComplete={() => done(`story-book-${age}`)} />
        )}
        {panel === "calendar" && (
          <section className="pw-calendar">
            <div className="pw-section-title">
              <small>ΣΕΠΤΕΜΒΡΙΟΣ — ΑΥΓΟΥΣΤΟΣ</small>
              <h2>Ο κόσμος αλλάζει. Εμείς ανακαλύπτουμε.</h2>
              <p>Φύση, ελληνικές παραδόσεις και μικρές αφορμές για παιχνίδι.</p>
            </div>
            <div className="pw-months">
              {MONTHS.map((m, i) => (
                <button
                  key={m[0]}
                  aria-pressed={month === i}
                  onClick={() => setMonth(i)}
                >
                  {m[0]}
                </button>
              ))}
            </div>
            <article className="pw-season-card">
              <img
                src="/preschool-world/village.webp"
                alt="Ελαιόδεντρα και κήπος στο χωριό του Πισιπούκ"
              />
              <div>
                <small>
                  {MONTHS[month][0]} · {AGES[age]} ετών
                </small>
                <h3>{MONTHS[month][1]}</h3>
                <p>{MONTHS[month][2]}</p>
                <button
                  className="pw-primary"
                  onClick={() =>
                    open(DOMAINS.find((d) => d.id === MONTHS[month][3])!)
                  }
                >
                  Ξεκινάμε την αποστολή <ArrowRight />
                </button>
              </div>
            </article>
          </section>
        )}
        {panel === "adult" && (
          <section className="pw-adult">
            <div className="pw-section-title">
              <small>ΧΩΡΟΣ ΓΟΝΕΩΝ & ΠΑΙΔΑΓΩΓΩΝ · {RELEASE}</small>
              <h2>Δίπλα στο παιδί, σε κάθε μικρό βήμα.</h2>
              <p>
                Επιλέξτε δραστηριότητες, αποθηκεύστε υλικό και δώστε χώρο στη
                δική του ιδέα.
              </p>
            </div>
            <div className="pw-lesson-plan">
              <h3>Το μικρό μας πλάνο</h3>
              <p>
                Επιλέξτε έως τρεις κόσμους για μια σύντομη δραστηριότητα και
                συνέχεια εκτός οθόνης. Δεν χρειάζεται να ολοκληρώσετε όλους τους
                κόσμους την ίδια μέρα.
              </p>
              <div className="pw-plan-picks">
                {DOMAINS.map((d) => (
                  <label key={d.id}>
                    <input
                      type="checkbox"
                      checked={plan.includes(d.id)}
                      disabled={plan.length === 3 && !plan.includes(d.id)}
                      onChange={(e) =>
                        setPlan(
                          e.target.checked
                            ? [...plan, d.id]
                            : plan.filter((id) => id !== d.id),
                        )
                      }
                    />
                    {d.name}
                  </label>
                ))}
              </div>
              <button
                disabled={busy || !plan.length}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const { PDFDocument } = await import("pdf-lib");
                    const bundle = await PDFDocument.create();
                    for (const id of plan) {
                      const d = DOMAINS.find((d) => d.id === id)!;
                      const blob = await makePdf(
                        d.tasks[age].title,
                        domainLines(d, age),
                        undefined,
                        gray,
                        paper,
                        ["art", "craft", "nature"].includes(id)
                          ? "leaf"
                          : "shapes",
                      );
                      const doc = await PDFDocument.load(
                        await blob.arrayBuffer(),
                      );
                      for (const p of await bundle.copyPages(
                        doc,
                        doc.getPageIndices(),
                      ))
                        bundle.addPage(p);
                    }
                    download(
                      new Blob([new Uint8Array(await bundle.save())], {
                        type: "application/pdf",
                      }),
                      "pisipouk-plan.pdf",
                    );
                    setStatus("Το πλάνο με τα πατρόν αποθηκεύτηκε.");
                  } catch {
                    setStatus("Δεν δημιουργήθηκε το πλάνο. Δοκίμασε ξανά.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Download />
                {busy ? "Ετοιμάζεται…" : "Πλάνο δραστηριοτήτων & πατρόν PDF"}
              </button>
            </div>
            <div className="pw-parent-settings">
              <label>
                <input
                  type="checkbox"
                  checked={saveProgress}
                  onChange={(e) => {
                    setSaveProgress(e.target.checked);
                    if (!e.target.checked)
                      localStorage.removeItem("pisipouk-world-progress");
                  }}
                />
                Αποθήκευση προσωπικών ανακαλύψεων μόνο σε αυτή τη συσκευή
              </label>
              <label>
                Τοπικό προφίλ
                <select
                  value={profile}
                  onChange={(e) => {
                    setProgress({ ...progress, [profile]: completed });
                    setProfile(e.target.value);
                    setCompleted(progress[e.target.value] || []);
                  }}
                >
                  <option>Αρκουδάκι</option>
                  <option>Αλεπουδάκι</option>
                  <option>Σκαντζοχοιράκι</option>
                </select>
              </label>
              <label>
                Μέγεθος PDF
                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value as "A4" | "A5")}
                >
                  <option>A4</option>
                  <option>A5</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={gray}
                  onChange={(e) => setGray(e.target.checked)}
                />
                Ασπρόμαυρη εκτύπωση
              </label>
            </div>
            <p className="pw-editorial">
              Το υλικό είναι αρχική έκδοση. Εκκρεμεί έλεγχος όλων των ηλικιακών
              προσαρμογών από παιδαγωγό προσχολικής ηλικίας. Η αφήγηση απαιτεί
              διαθέσιμη ελληνική φωνή στη συσκευή.
            </p>
            <label className="pw-search">
              <Search />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Αναζήτηση δραστηριότητας"
                aria-label="Αναζήτηση δραστηριότητας"
              />
            </label>
            <div className="pw-adult-catalog">
              {DOMAINS.filter((d) =>
                (d.name + " " + d.tasks[age].title)
                  .toLocaleLowerCase("el")
                  .includes(query.toLocaleLowerCase("el")),
              ).map((d, i) => (
                <article key={d.id}>
                  <div>
                    <small>
                      {d.name} · {AGES[age]} ετών
                    </small>
                    <h3>{d.tasks[age].title}</h3>
                    <p>{d.objective}</p>
                  </div>
                  <button
                    aria-label={`Άνοιξε ${d.name}`}
                    onClick={() => open(d)}
                  >
                    <ArrowRight />
                  </button>
                  <button
                    disabled={busy}
                    aria-label={`PDF ${d.name}`}
                    onClick={() => pdf(d)}
                  >
                    <Printer />
                  </button>
                  <button
                    aria-label={`Κοινοποίησε ${d.name}`}
                    onClick={() => {
                      setDomain(d);
                      setShare(true);
                      setConsent(false);
                      setStatus("");
                    }}
                  >
                    <Mail />
                  </button>
                </article>
              ))}
            </div>
            <div className="pw-portfolio">
              <h3>
                <Star />
                Οι προσωπικές μου ανακαλύψεις
              </h3>
              <p>
                {completed.length
                  ? `${completed.length} μικρές εμπειρίες. Χωρίς βαθμολογία, χωρίς σύγκριση με άλλα παιδιά.`
                  : "Το ταξίδι αρχίζει με μια μικρή δοκιμή."}
              </p>
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    download(
                      await makePdf(
                        "Το δικό μου ταξίδι",
                        [
                          `Προφίλ συσκευής: ${profile}`,
                          ...completed.map((id) => {
                            const [d, a] = id.split("-");
                            return (
                              DOMAINS.find((x) => x.id === d)?.tasks[Number(a)]
                                ?.title || "Μια ιστορία που φτιάξαμε μαζί"
                            );
                          }),
                        ],
                        drawingData || undefined,
                      ),
                      "pisipouk-portfolio.pdf",
                    );
                    setStatus("Το portfolio αποθηκεύτηκε.");
                  } catch {
                    setStatus("Δεν δημιουργήθηκε το portfolio.");
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
              >
                <Download />
                Portfolio PDF
              </button>
              <button
                onClick={() => {
                  setCompleted([]);
                  setProgress({ ...progress, [profile]: [] });
                  setStatus("Το τοπικό προφίλ ξεκίνησε νέο ταξίδι.");
                }}
              >
                Νέο ταξίδι για αυτό το προφίλ
              </button>
            </div>
            <p role="status">{status}</p>
            <button
              onClick={() => {
                setAuthorized(false);
                go("village");
              }}
            >
              <LockKeyhole />
              Κλείδωμα χώρου ενηλίκων
            </button>
          </section>
        )}
      </main>
      <footer className="pw-footer">
        <span>Με φαντασία. Με φροντίδα. Με τον δικό σου ρυθμό.</span>
        <a href="/">Πισιπούκ · Το σχολείο μας</a>
      </footer>
      {gate && (
        <div className="pw-modal-bg">
          <section
            className="pw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adult-title"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                const els =
                  e.currentTarget.querySelectorAll<HTMLElement>("button,input");
                const first = els[0],
                  last = els[els.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="pw-close"
              aria-label="Κλείσιμο"
              onClick={() => {
                setGate(false);
                adultButton.current?.focus();
              }}
            >
              <X />
            </button>
            <LockKeyhole />
            <h2 id="adult-title">Ένα μικρό βήμα για τον μεγάλο.</h2>
            <p>Ο χώρος αυτός αφορά γονείς και παιδαγωγούς. Πόσο κάνει 7 + 5;</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (gateInput.trim() === "12") {
                  setAuthorized(true);
                  setGate(false);
                  go("adult");
                } else setGateError("Ζήτησε από έναν ενήλικο να βοηθήσει.");
              }}
            >
              <label>
                Απάντηση
                <input
                  ref={gateRef}
                  inputMode="numeric"
                  value={gateInput}
                  onChange={(e) => setGateInput(e.target.value)}
                />
              </label>
              <p role="status">{gateError}</p>
              <button className="pw-primary" type="submit">
                Είμαι ενήλικος · Συνέχεια
              </button>
            </form>
            <small>
              Η πύλη είναι υπενθύμιση επίβλεψης, όχι επαλήθευση ταυτότητας.
            </small>
          </section>
        </div>
      )}
      {share && authorized && (
        <div className="pw-modal-bg">
          <section
            className="pw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShare(false);
              if (e.key === "Tab") {
                const els = e.currentTarget.querySelectorAll<HTMLElement>(
                  "button:not([disabled]),input",
                );
                const first = els[0],
                  last = els[els.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="pw-close"
              aria-label="Κλείσιμο κοινοποίησης"
              onClick={() => setShare(false)}
            >
              <X />
            </button>
            <Mail />
            <h2 id="share-title">Μοιράζομαι μια δραστηριότητα.</h2>
            <p>{domain.tasks[age].title}</p>
            <p>
              Αποθηκεύστε το PDF και επισυνάψτε το εσείς στο email. Ανοίγουμε
              προσχέδιο στην εφαρμογή σας — δεν στέλνουμε αυτόματα email.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!consent) return;
                const subject = encodeURIComponent(
                  `Πισιπούκ: ${domain.tasks[age].title}`,
                );
                const body = encodeURIComponent(
                  `${domainLines(domain, age).join("\n\n")}\n\nhttps://www.pisipouk.com/virtual-preschool\n\nΕπισυνάψτε το PDF που αποθηκεύσατε πριν στείλετε.`,
                );
                window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
                setStatus(
                  "Ζητήθηκε άνοιγμα προσχεδίου. Η αποστολή και η επισύναψη γίνονται από εσάς στην εφαρμογή email.",
                );
              }}
            >
              <label>
                Email ενηλίκου
                <input
                  autoFocus
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="pw-check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                Είμαι ενήλικος και θέλω να ανοίξω αυτό το προσχέδιο.
              </label>
              <button type="button" disabled={busy} onClick={() => pdf()}>
                <Download />
                1. Αποθήκευση PDF
              </button>
              <button type="submit" disabled={!consent} className="pw-primary">
                <Mail />
                2. Άνοιγμα προσχεδίου email
              </button>
            </form>
            <p role="status">{status}</p>
          </section>
        </div>
      )}
    </div>
  );
}
