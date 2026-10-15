import { useEffect, useMemo, useRef, useState } from "react";
import { differentOrder } from "./random";
import { PATTERNS, artworkDataUrl } from "./studioContent";
import {
  Check,
  Leaf,
  Star,
  Heart,
  Sun,
  Circle,
  Square,
  Triangle,
  Music,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { Task } from "./content";
export function speak(text: string, onUnavailable?: (s: string) => void) {
  if (!("speechSynthesis" in window)) {
    onUnavailable?.(
      "Η συσκευή δεν υποστηρίζει αφήγηση. Διαβάστε μαζί το κείμενο.",
    );
    return;
  }
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith("el"));
  if (!voice) {
    onUnavailable?.(
      "Δεν βρέθηκε ελληνική φωνή. Το κείμενο είναι διαθέσιμο για ανάγνωση με ενήλικο.",
    );
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "el-GR";
  u.voice = voice;
  u.rate = 0.85;
  speechSynthesis.speak(u);
}
export function Symbol({ name }: { name: string }) {
  const Icon =
    name === "Φύλλο"
      ? Leaf
      : name === "Άστρο"
        ? Star
        : name === "Καρδιά"
          ? Heart
          : name === "Ήλιος"
            ? Sun
            : name === "Κύκλος"
              ? Circle
              : name === "Τετράγωνο"
                ? Square
                : Triangle;
  return <Icon aria-hidden="true" size={38} />;
}
export function Game({
  task,
  pool = [],
  onComplete,
}: {
  task: Task;
  pool?: Task[];
  onComplete: () => void;
}) {
  const [activeTask, setActiveTask] = useState<Task>(task),
    [round, setRound] = useState(0),
    [done, setDone] = useState(false),
    [message, setMessage] = useState("Δοκίμασε με τον δικό σου ρυθμό."),
    [order, setOrder] = useState<string[]>([]),
    [open, setOpen] = useState<number[]>([]),
    [matched, setMatched] = useState<string[]>([]);
  const audio = useRef<AudioContext | null>(null);
  const busy = useRef(false);
  const playback = useRef(0);
  const memoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      playback.current++;
      if (memoryTimer.current) clearTimeout(memoryTimer.current);
      void audio.current?.close().catch(() => {});
      speechSynthesis?.cancel();
    },
    [],
  );
  const finish = () => {
    if (done) return;
    setDone(true);
    setMessage("Το ανακάλυψες! Μου άρεσε που προσπάθησες.");
    onComplete();
  };
  const reset = (fresh = false) => {
    playback.current++;
    if (memoryTimer.current) clearTimeout(memoryTimer.current);
    busy.current = false;
    setDone(false);
    setMessage("Μια νέα προσπάθεια, χωρίς βιασύνη.");
    setOrder([]);
    setOpen([]);
    setMatched([]);
    if (fresh) {
      const candidates = pool.filter((candidate) => candidate.title !== activeTask.title);
      if (candidates.length) {
        setActiveTask(candidates[Math.floor(Math.random() * candidates.length)]);
      }
      setRound((n) => n + 1);
      setMessage("Νέος γύρος! Νέες εικόνες και καινούργια ανακάλυψη.");
    }
  };
  const note = (name: string) => {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtor) {
      setMessage(
        "Ο ήχος δεν υποστηρίζεται. Ακολούθησε τα ονόματα των πλήκτρων.",
      );
      return;
    }
    audio.current ??= new AudioCtor();
    const ctx = audio.current!;
    void ctx.resume().catch(() => {});
    const osc = ctx.createOscillator(),
      g = ctx.createGain();
    osc.frequency.value = { Ντο: 261.63, Μι: 329.63, Σολ: 392 }[name] || 261;
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };
  const seq = activeTask.sequence || [];
  const previousChoices = useRef<string[]>([]);
  const previousDeck = useRef<number[]>([]);
  // Stable within one round; a new round is guaranteed to have a different layout.
  const displayOptions = useMemo(() => {
    const next = differentOrder(activeTask.options,previousChoices.current);
    previousChoices.current = next;
    return next;
  }, [activeTask, round]);
  const answerValue = activeTask.options[activeTask.answer];
  const select = (v: string) => {
    if (done) return;
    if (v === seq[order.length]) {
      const n = [...order, v];
      setOrder(n);
      setMessage("Το άκουσες / παρατήρησες! Συνέχισε.");
      if (n.length === seq.length) finish();
    } else {
      setOrder([]);
      setMessage("Ας το ξαναδοκιμάσουμε από την αρχή.");
    }
  };
  const deckIndices = useMemo(() => {
    const cards = activeTask.options.flatMap((_,i) => [i*2,i*2+1]);
    const next = differentOrder(cards,previousDeck.current);
    previousDeck.current = next;
    return next;
  }, [activeTask, round]);
  const deck = deckIndices.map(id => ({v:activeTask.options[Math.floor(id/2)],key:id}));
  const flip = (i: number) => {
    if (busy.current || open.includes(i) || matched.includes(deck[i].v) || done)
      return;
    const n = [...open, i];
    setOpen(n);
    if (n.length === 2) {
      if (deck[n[0]].v === deck[n[1]].v) {
        const m = [...matched, deck[i].v];
        setMatched(m);
        setOpen([]);
        if (m.length === activeTask.options.length) finish();
      } else {
        busy.current = true;
        setMessage("Κοίτα τις κάρτες. Θυμάσαι πού ήταν;");
        memoryTimer.current = setTimeout(() => {
          setOpen([]);
          busy.current = false;
        }, 900);
      }
    }
  };
  return (
    <div className="pw-game" data-mechanic={activeTask.mechanic}>
      <div className="pw-game-heading">
        <div>
          <small>ΠΑΙΖΩ & ΑΝΑΚΑΛΥΠΤΩ</small>
          <h3>{activeTask.title}</h3>
        </div>
        <button
          aria-label="Άκουσε οδηγίες"
          onClick={() => speak(activeTask.prompt, setMessage)}
        >
          <Volume2 />
        </button>
      </div>
      <p className="pw-prompt">{activeTask.prompt}</p>
      {activeTask.visual && (() => {
        const illustration = PATTERNS.find(p => p.id === activeTask.visual);
        return illustration ? <figure className="pw-game-visual">
          <img src={artworkDataUrl(illustration,2,true)} alt={"Εικονογραφημένο παράδειγμα: "+illustration.title} />
          <figcaption>Παρατήρησε το σχέδιο και διάλεξε την απάντησή σου.</figcaption>
        </figure> : null;
      })()}
      <div className="pw-game-hint"><strong>Πώς παίζουμε:</strong> 1. Παρατηρούμε την εικόνα · 2. Ακούμε ή διαβάζουμε την ερώτηση · 3. Αγγίζουμε την επιλογή μας. {activeTask.hint || "Δεν υπάρχει χρονόμετρο."}</div>
      {activeTask.mechanic === "count" && (
        <div className="pw-count">
          {Array.from({ length: activeTask.target || 1 }, (_, i) => (
            <Leaf key={i} size={48} aria-label="φύλλο" />
          ))}
        </div>
      )}
      {activeTask.mechanic === "pattern" && (
        <div className="pw-pattern">
          {seq.map((s, i) => (
            <Symbol key={i} name={s} />
          ))}
          <span>?</span>
        </div>
      )}
      {activeTask.mechanic === "memory" ? (
        <div className="pw-memory">
          {deck.map((c, i) => (
            <button
              key={c.key}
              aria-label={`Κάρτα ${i + 1}${matched.includes(c.v) ? " — ζευγάρι" : ""}`}
              disabled={matched.includes(c.v)}
              onClick={() => flip(i)}
            >
              {open.includes(i) || matched.includes(c.v) ? (
                <>
                  <Symbol name={c.v} />
                  <small>{c.v}</small>
                </>
              ) : (
                <span className="pw-card-back">Π</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <>
          {activeTask.mechanic === "rhythm" && (
            <button
              className="pw-primary"
              onClick={async () => {
                if (busy.current) return;
                busy.current = true;
                const token = ++playback.current;
                setOrder([]);
                for (const v of seq) {
                  if (token !== playback.current) return;
                  setMessage(`Ακούω: ${v}`);
                  note(v);
                  await new Promise((r) => setTimeout(r, 650));
                }
                if (token !== playback.current) return;
                busy.current = false;
                setMessage("Τώρα η δική σου σειρά!");
              }}
            >
              <Music />
              Άκουσε τη μελωδία
            </button>
          )}
          <div className="pw-answers">
            {(activeTask.mechanic === "sequence"
              ? displayOptions
              : displayOptions
            ).map((v, i) => (
              <button
                key={`${round}-${i}-${v}`}
                disabled={
                  done || (activeTask.mechanic === "sequence" && order.includes(v))
                }
                onClick={() => {
                  if (
                    activeTask.mechanic === "sequence" ||
                    activeTask.mechanic === "rhythm"
                  ) {
                    if (busy.current) return;
                    if (activeTask.mechanic === "rhythm") note(v);
                    select(v);
                  } else if (v === answerValue) finish();
                  else
                    setMessage(
                      "Καλή δοκιμή! Παρατήρησε ξανά και διάλεξε κάτι άλλο.",
                    );
                }}
              >
                {activeTask.mechanic === "pattern" && <Symbol name={v} />}
                <span>{v}</span>
              </button>
            ))}
          </div>
          {seq.length > 0 && activeTask.mechanic !== "pattern" && (
            <p aria-label="Η σειρά μου">
              Η σειρά μου: {order.join(" → ") || "…"}
            </p>
          )}
        </>
      )}
      <p className={done ? "pw-feedback success" : "pw-feedback"} role="status">
        {done && <Check />}
        {message}
      </p>
      <div className="pw-replay-actions">
        <button type="button" onClick={() => reset(true)}><RotateCcw size={18} /> Παίζω ξανά · Νέος γύρος</button>
        <button type="button" onClick={() => reset(false)}>↶ Ξανά το ίδιο</button>
      </div>
    </div>
  );
}
