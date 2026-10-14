import { useEffect, useState } from "react";
import { Volume2, Square, ArrowLeft, ArrowRight } from "lucide-react";
import story from "@/assets/pisipouk-story.webp";
import exterior from "@/assets/pisipouk-exterior.webp";
import classroom from "@/assets/pisipouk-classroom.webp";
import arrival from "@/assets/pisipouk-arrival.webp";
import { speak } from "./Game";
import { makePdf, download } from "./export";
import type { Age } from "./content";
export const STORIES = [
  {
    title: "Το φύλλο που ήθελε να ταξιδέψει",
    pages: [
      "Ένα χρυσαφένιο φύλλο έπεσε στην πατούσα του Πισιπούκ. «Θέλω να γνωρίσω τον κόσμο», ψιθύρισε.",
      "Ο Πισιπούκ το πήγε στην ελιά. «Κάποτε ήμουν κι εγώ μικρό φύλλο», είπε το δέντρο. «Χρειάστηκα χρόνο και φροντίδα».",
      "Στο λιμανάκι το φύλλο συνάντησε μια βαρκούλα. Ο Πισιπούκ το κράτησε απαλά για να μην το πάρει το νερό.",
      "Στο ατελιέ, το φύλλο έγινε μέρος μιας ζωγραφιάς. «Ταξίδεψα και τώρα έχω μια ιστορία», είπε.",
    ],
    question: "Πού θα ήθελες να ταξιδέψει το φύλλο;",
    choices: ["Στον κήπο", "Στο ατελιέ"],
    endings: [
      "Στον κήπο βρήκε παρέα με άλλα φύλλα. Ο Πισιπούκ κάθισε και άκουσε τις ιστορίες τους.",
      "Στο ατελιέ έγινε μια χρυσαφένια βαρκούλα από χαρτί. Ο Πισιπούκ ζωγράφισε γύρω του μια θάλασσα.",
    ],
  },
  {
    title: "Η βαρκούλα και το μικρό βήμα",
    pages: [
      "Μια μικρή βαρκούλα περίμενε στο λιμάνι. «Φοβάμαι να ξεκινήσω», είπε στον Πισιπούκ.",
      "Ο Πισιπούκ την άκουσε. «Μπορούμε να κάνουμε ένα πολύ μικρό ταξίδι. Εσύ αποφασίζεις πότε».",
      "Η βαρκούλα δοκίμασε ως την πρώτη σημαδούρα. Έπειτα σταμάτησε και κοίταξε πίσω.",
      "Το λιμάνι ήταν ακόμη κοντά. «Μπορώ να δοκιμάσω και να ξεκουραστώ», χαμογέλασε.",
    ],
    question: "Τι χρειάζεται τώρα η βαρκούλα;",
    choices: ["Μια μικρή ανάπαυση", "Έναν φίλο δίπλα της"],
    endings: [
      "Ξεκουράστηκε στο λιμάνι. Το επόμενο ταξίδι μπορούσε να περιμένει.",
      "Ένας φίλος ταξίδεψε μαζί της. Μιλούσαν και προχωρούσαν με τον δικό τους ρυθμό.",
    ],
  },
  {
    title: "Το κουτί των ιδεών",
    pages: [
      "Στην τάξη υπήρχε ένα άδειο κουτί. «Τι μπορεί να γίνει;» ρώτησε ο Πισιπούκ.",
      "Η Άννα είπε «σπίτι». Ο Νίκος είπε «καράβι». Κανείς δεν είχε άδικο.",
      "Τα παιδιά πήραν χαρτιά και χρώματα. Έφτιαξαν παράθυρα, ένα πανί και μια πόρτα.",
      "Το κουτί έγινε ένα σπίτι που ταξίδευε! Όλες οι ιδέες είχαν βρει μια θέση.",
    ],
    question: "Τι θα πρόσθετες εσύ;",
    choices: ["Έναν κήπο", "Μια βιβλιοθήκη"],
    endings: [
      "Ένας μικρός κήπος ταξίδευε στην αυλή του σπιτιού. Κάθε φίλος φρόντιζε ένα λουλούδι.",
      "Μια βιβλιοθήκη ταξίδευε σε κάθε λιμάνι. Οι φίλοι αντάλλασσαν ιστορίες και εικόνες.",
    ],
  },
];
export function StoryBook({
  age,
  onComplete,
}: {
  age: Age;
  onComplete: () => void;
}) {
  const [book, setBook] = useState(0),
    [page, setPage] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  const b = STORIES[book],
    imgs = [story, exterior, arrival, classroom];
  const text =
    page < 4
      ? b.pages[page]
      : choice === null
        ? "Διάλεξε πώς θα συνεχιστεί η ιστορία."
        : b.endings[choice];
  const agePrompt = [
    "Δείξε τον Πισιπούκ στην εικόνα.",
    "Πες ποιος είναι ο ήρωας και τι κάνει.",
    "Πώς νιώθει ο ήρωας; Τι θα του έλεγες;",
    "Πες την ιστορία με αρχή, μέση και δικό σου τέλος.",
  ][age];
  useEffect(() => {
    speechSynthesis?.getVoices();
    return () => speechSynthesis?.cancel();
  }, []);
  return (
    <section className="pw-story">
      <div className="pw-section-title">
        <small>ΤΟ ΔΕΝΤΡΟ ΤΩΝ ΙΣΤΟΡΙΩΝ</small>
        <h2>Κάθε ιστορία αρχίζει μαζί.</h2>
      </div>
      <div className="pw-tabs">
        {STORIES.map((s, i) => (
          <button
            key={s.title}
            aria-pressed={i === book}
            onClick={() => {
              speechSynthesis.cancel();
              setBook(i);
              setPage(0);
              setChoice(null);
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
      <article className="pw-book">
        <img
          src={imgs[page % 4]}
          alt={
            [
              "Ο Πισιπούκ και οι φίλοι του διαβάζουν",
              "Το χωριό του Πισιπούκ με δέντρα",
              "Ο Πισιπούκ στο λιμανάκι",
              "Οι φίλοι δημιουργούν στην τάξη",
            ][page % 4]
          }
        />
        <div>
          <small>ΣΕΛΙΔΑ {page + 1} / 5</small>
          <h3>{b.title}</h3>
          <p>{text}</p>
          {page === 4 && (
            <div className="pw-answers">
              {b.choices.map((c, i) => (
                <button
                  key={c}
                  aria-pressed={choice === i}
                  onClick={() => {
                    setChoice(i);
                    onComplete();
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="pw-tools">
            <button onClick={() => speak(text, setStatus)}>
              <Volume2 />
              Ελληνική αφήγηση
            </button>
            <button
              onClick={() => speechSynthesis.cancel()}
              aria-label="Διακοπή αφήγησης"
            >
              <Square />
            </button>
            <button
              aria-label="Προηγούμενη σελίδα"
              disabled={page === 0}
              onClick={() => {
                speechSynthesis.cancel();
                setPage(page - 1);
              }}
            >
              <ArrowLeft />
            </button>
            <button
              aria-label="Επόμενη σελίδα"
              disabled={page === 4}
              onClick={() => {
                speechSynthesis.cancel();
                setPage(page + 1);
              }}
            >
              <ArrowRight />
            </button>
          </div>
          <p className="pw-adult-prompt">Με τον ενήλικο: {agePrompt}</p>
        </div>
      </article>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            download(
              await makePdf(b.title, [...b.pages, ...b.endings, agePrompt]),
              "pisipouk-istoria-A4.pdf",
            );
            setStatus("Η ιστορία αποθηκεύτηκε ως PDF.");
          } catch {
            setStatus("Δεν δημιουργήθηκε το PDF. Δοκίμασε ξανά.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Ετοιμάζεται…" : "Η ιστορία σε A4 PDF"}
      </button>
      <p role="status">{status}</p>
    </section>
  );
}
