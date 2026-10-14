import { useEffect, useRef, useState } from "react";
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
  onComplete,
}: {
  task: Task;
  onComplete: () => void;
}) {
  const [done, setDone] = useState(false),
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
  const reset = () => {
    playback.current++;
    if (memoryTimer.current) clearTimeout(memoryTimer.current);
    busy.current = false;
    setDone(false);
    setMessage("Μια νέα προσπάθεια, χωρίς βιασύνη.");
    setOrder([]);
    setOpen([]);
    setMatched([]);
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
  const seq = task.sequence || [];
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
  const deck = task.options
    .flatMap((v, i) => [
      { v, key: i * 2 },
      { v, key: i * 2 + 1 },
    ])
    .sort((a, b) => ((a.key * 7 + 3) % 11) - ((b.key * 7 + 3) % 11));
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
        if (m.length === task.options.length) finish();
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
    <div className="pw-game" data-mechanic={task.mechanic}>
      <div className="pw-game-heading">
        <div>
          <small>ΠΑΙΖΩ & ΑΝΑΚΑΛΥΠΤΩ</small>
          <h3>{task.title}</h3>
        </div>
        <button
          aria-label="Άκουσε οδηγίες"
          onClick={() => speak(task.prompt, setMessage)}
        >
          <Volume2 />
        </button>
      </div>
      <p className="pw-prompt">{task.prompt}</p>
      {task.mechanic === "count" && (
        <div className="pw-count">
          {Array.from({ length: task.target || 1 }, (_, i) => (
            <Leaf key={i} size={48} aria-label="φύλλο" />
          ))}
        </div>
      )}
      {task.mechanic === "pattern" && (
        <div className="pw-pattern">
          {seq.map((s, i) => (
            <Symbol key={i} name={s} />
          ))}
          <span>?</span>
        </div>
      )}
      {task.mechanic === "memory" ? (
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
          {task.mechanic === "rhythm" && (
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
            {(task.mechanic === "sequence"
              ? [...task.options].reverse()
              : task.options
            ).map((v, i) => (
              <button
                key={v}
                disabled={
                  done || (task.mechanic === "sequence" && order.includes(v))
                }
                onClick={() => {
                  if (
                    task.mechanic === "sequence" ||
                    task.mechanic === "rhythm"
                  ) {
                    if (busy.current) return;
                    if (task.mechanic === "rhythm") note(v);
                    select(v);
                  } else if (i === task.answer) finish();
                  else
                    setMessage(
                      "Καλή δοκιμή! Παρατήρησε ξανά και διάλεξε κάτι άλλο.",
                    );
                }}
              >
                {task.mechanic === "pattern" && <Symbol name={v} />}
                <span>{v}</span>
              </button>
            ))}
          </div>
          {seq.length > 0 && task.mechanic !== "pattern" && (
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
      <button onClick={reset}>
        <RotateCcw size={18} />
        Παίζω ξανά
      </button>
    </div>
  );
}
