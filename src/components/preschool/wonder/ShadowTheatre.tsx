import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight, Brush, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { ShadowAtelier } from "./ShadowAtelier";
import { challenges, owlOutline, sequences, shadowScale, storageKey, validSavedArt, type Light, type Step } from "./shadow-lesson";
import type { PreschoolAge } from "./curriculum";
import "./shadow-theatre.css";

const asset = "/preschool-world/shadow";
const positions: Record<Light, number> = { near: 49, far: 29 };
const motifs = {
  begin: [330, 440, 523],
  near: [392, 523],
  far: [523, 392],
  finish: [392, 494, 587, 784],
} as const;

export function ShadowTheatre({ age }: { age: PreschoolAge }) {
  const [step, setStep] = useState<Step>("intro");
  const [location, setLocation] = useState<Light>(age === 0 || age === 2 ? "far" : "near");
  const [turn, setTurn] = useState(0);
  const [prediction, setPrediction] = useState<Light>();
  const [message, setMessage] = useState("");
  const [reaction, setReaction] = useState(0);
  const [dragX, setDragX] = useState<number>();
  const [muted, setMuted] = useState(false);
  const [art, setArt] = useState<string | null>(null);
  const [visitedAtelier, setVisitedAtelier] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const atelierRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; start: number; moved: boolean } | null>(null);
  const context = useRef<AudioContext | null>(null);
  const audioGate = useRef<GainNode | null>(null);
  const ageSequence = sequences[age];
  const complete = turn >= ageSequence.length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (validSavedArt(saved)) setArt(saved);
    } catch { /* storage can be blocked */ }
    return () => {
      void context.current?.close().catch(() => {});
      context.current = null;
      audioGate.current = null;
    };
  }, []);

  useEffect(() => {
    if (step === "atelier") atelierRef.current?.querySelector("button")?.focus();
    if (step === "predict" || step === "finale") actionRef.current?.querySelector("button")?.focus();
    if (step === "play" && turn === 0) stageRef.current?.querySelector<HTMLButtonElement>("[data-cue=true]")?.focus();
  }, [step, turn]);

  function sound(motif: keyof typeof motifs) {
    if (muted || typeof AudioContext === "undefined") return;
    try {
      if (!context.current) {
        context.current = new AudioContext();
        audioGate.current = context.current.createGain();
        audioGate.current.connect(context.current.destination);
      }
      const audio = context.current;
      const output = audioGate.current!;
      void audio.resume().catch(() => {});
      motifs[motif].forEach((frequency, index) => {
        const start = audio.currentTime + index * .115;
        const tone = audio.createOscillator();
        const envelope = audio.createGain();
        tone.type = "sine";
        tone.frequency.value = frequency;
        envelope.gain.setValueAtTime(.001, start);
        envelope.gain.exponentialRampToValueAtTime(.085, start + .025);
        envelope.gain.exponentialRampToValueAtTime(.001, start + .29);
        tone.connect(envelope).connect(output);
        tone.start(start);
        tone.stop(start + .30);
        tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
      });
    } catch { /* the scene has visual feedback in every state */ }
  }

  function toggleSound() {
    if (audioGate.current && context.current) {
      audioGate.current.gain.setValueAtTime(muted ? 1 : 0, context.current.currentTime);
    }
    setMuted(!muted);
  }

  function moveLight(next: Light) {
    if (step !== "play") return;
    setLocation(next);
    setReaction((value) => value + 1);
    if (complete) {
      sound(next);
      return;
    }
    const expected = ageSequence[turn];
    if (next !== expected) {
      setMessage("Κοίτα τη σκιά. Τι γίνεται αν δοκιμάσεις την άλλη θέση;");
      sound(next);
      return;
    }
    const done = turn + 1 === ageSequence.length;
    setTurn(turn + 1);
    setMessage(done
      ? age === 2 && prediction === "far"
        ? "Η σκιά μεγάλωσε! Τώρα είδες τι κάνει το φως όταν πλησιάζει."
        : "Η Λήδα βρήκε τη σκιά της!"
      : next === "near" ? "Να η μεγάλη σκιά! Δοκίμασε τώρα την άλλη θέση." : "Να η μικρή σκιά! Χρειαζόμαστε τώρα μεγάλη.");
    sound(done ? "finish" : next);
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (step !== "play" || event.button !== 0 || !event.isPrimary) return;
    drag.current = { pointerId: event.pointerId, start: event.clientX, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragLight(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId || !stageRef.current) return;
    if (Math.abs(event.clientX - active.start) < 5 && !active.moved) return;
    const { left, width } = stageRef.current.getBoundingClientRect();
    const percent = (event.clientX - left) * 100 / width;
    active.moved = true;
    setDragX(Math.min(positions.near, Math.max(positions.far, percent)));
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragX(undefined);
    if (!active.moved || !stageRef.current) return;
    const { left, width } = stageRef.current.getBoundingClientRect();
    moveLight(((event.clientX - left) * 100 / width) >= 39 ? "near" : "far");
  }

  function cancelDrag() {
    drag.current = null;
    setDragX(undefined);
  }

  function toAtelier() {
    setVisitedAtelier(true);
    setStep("atelier");
  }

  function saveArt(image: string) {
    setArt(image);
    try {
      if (validSavedArt(image)) localStorage.setItem(storageKey, image);
    } catch { /* painting stays available in the current lesson */ }
    sound("finish");
    setStep("finale");
  }

  function restart() {
    setTurn(0);
    setPrediction(undefined);
    setMessage("");
    setLocation(age === 0 || age === 2 ? "far" : "near");
    setStep("intro");
  }

  const lightX = dragX ?? positions[location];
  const scale = dragX === undefined ? shadowScale[location]
    : shadowScale.far + ((dragX - positions.far) / (positions.near - positions.far)) * (shadowScale.near - shadowScale.far);
  const showingScene = step !== "atelier";

  return (
    <section className="ps-shadow" aria-labelledby="ps-shadow-title">
      <div className="ps-shadow-head">
        <div>
          <p>Πισιπούκ · Θέατρο σκιών</p>
          <h2 id="ps-shadow-title">Η Λήδα έχασε τη σκιά της</h2>
        </div>
        <button type="button" className="ps-shadow-mute" aria-label="Σίγαση ήχων" aria-pressed={muted} onClick={toggleSound}>
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </div>

      <div hidden={!showingScene}>
        <div ref={stageRef} className={"ps-shadow-stage" + (step === "finale" ? " ps-shadow-stage-finale" : "")}
          data-step={step}>
          <img className="ps-shadow-backdrop" src={asset + "/theatre.webp"} alt="" fetchPriority="high" />
          <div className="ps-shadow-lights" aria-hidden="true" />
          {(step === "play" || step === "finale") && (
            <>
              <div className="ps-shadow-beam" aria-hidden="true" style={{ left: lightX + "%", width: (84 - lightX) + "%" }} />
              <img alt="" src={step === "finale" && art ? art : asset + "/lida.webp"}
                className="ps-shadow-silhouette" data-size={location} style={{ transform: "scale(" + scale + ")" }} />
              {step === "play" && (
                <>
                  <button type="button" className="ps-shadow-floor ps-shadow-floor-far" onClick={() => moveLight("far")}
                    aria-label="Φέρε το φως μακριά από τη Λήδα" data-cue={!complete && ageSequence[turn] === "far"}><span aria-hidden="true">○</span></button>
                  <button type="button" className="ps-shadow-floor ps-shadow-floor-near" onClick={() => moveLight("near")}
                    aria-label="Φέρε το φως κοντά στη Λήδα" data-cue={!complete && ageSequence[turn] === "near"}><span aria-hidden="true">●</span></button>
                  <button type="button" className="ps-shadow-lantern" style={{ left: lightX + "%" }}
                    aria-label="Φαναράκι. Σύρε το ή πάτησε Enter για αλλαγή θέσης"
                    onPointerDown={startDrag} onPointerMove={dragLight} onPointerUp={endDrag}
                    onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
                    onClick={(event) => {
                      if (event.detail === 0) moveLight(location === "near" ? "far" : "near");
                    }}>
                    <svg viewBox="0 0 64 83" aria-hidden="true">
                      <path d="M22 19V12a10 10 0 0 1 20 0v7" fill="none" stroke="#ffdc8e" strokeWidth="6" />
                      <path d="M12 20H52L46 31H18Z M10 69H54V78H10Z" fill="#794739" stroke="#f1b560" strokeWidth="3" />
                      <path d="M18 32H46L50 69H14Z" fill="#ffe797" stroke="#e39a4f" strokeWidth="3" />
                      <path d="M32 62Q20 58 33 39Q45 57 32 62Z" fill="#ffaa55" />
                    </svg>
                  </button>
                </>
              )}
            </>
          )}
          <img className="ps-shadow-bear" src={asset + "/pisipouk-point.webp"} alt="Ο Πισιπούκ" />
          <img key={reaction} className={"ps-shadow-owl" + (step === "finale" ? " ps-shadow-owl-finale" : "")}
            src={step === "finale" && art ? art : asset + "/lida.webp"} alt={step === "finale" && art ? "Η Λήδα όπως τη ζωγράφισες" : "Η Λήδα η κουκουβάγια"} />

          {step === "intro" && <button type="button" className="ps-shadow-start" onClick={() => {
            sound("begin");
            setStep(age === 2 ? "predict" : "play");
          }}><Play fill="currentColor" aria-hidden="true" /> Ξεκινάμε!</button>}
        </div>

        <div ref={actionRef} className="ps-shadow-action">
          {step === "intro" && <p>Η Λήδα βγήκε για πρόβα. Μπορείς να τη βοηθήσεις να βρει τη σκιά της;</p>}
          {step === "predict" && <>
            <p>{challenges[age]}</p>
            <div className="ps-shadow-toolrow">
              {(["far", "near"] as const).map((position) => (
                <button key={position} type="button" onClick={() => { setPrediction(position); setStep("play"); sound("begin"); }}>
                  <svg className="ps-shadow-guess" viewBox="0 0 160 192" aria-hidden="true"><path transform={position === "far" ? "translate(39 43) scale(.52)" : undefined} d={owlOutline} /></svg>
                  {position === "far" ? "Μικρή σκιά" : "Μεγάλη σκιά"}
                </button>
              ))}
            </div>
          </>}
          {step === "play" && <>
            <p role="status">{message || (age === 2 ? "Φέρε το φως κοντά και δες τι συμβαίνει." : challenges[age])}</p>
            {complete ? <button className="ps-shadow-primary" type="button" onClick={toAtelier}>
              <Brush aria-hidden="true" /> Ζωγράφισε τη Λήδα
            </button> : <div className="ps-shadow-progress" aria-label={turn + " από " + ageSequence.length + " κινήσεις"}>
              {ageSequence.map((_, index) => <span key={index} data-done={index < turn} />)}
            </div>}
          </>}
          {step === "finale" && <>
            <p role="status">Η Λήδα στη σκηνή με τα δικά σου χρώματα!</p>
            <div className="ps-shadow-toolrow">
              <button type="button" onClick={restart}><RotateCcw aria-hidden="true" /> Παίξε ξανά</button>
              <button type="button" onClick={toAtelier}>Στο ατελιέ <ArrowRight aria-hidden="true" /></button>
            </div>
          </>}
        </div>
      </div>

      {visitedAtelier && <div ref={atelierRef} hidden={step !== "atelier"}>
        <ShadowAtelier onFinish={saveArt} onBack={() => setStep(art ? "finale" : "play")} />
      </div>}
      <details className="ps-shadow-parent">
        <summary>Για γονείς και παιδαγωγούς</summary>
        <p>Με σταθερή φιγούρα και πανί, μια φωτεινή πηγή κοντά στη φιγούρα δίνει μεγαλύτερη σκιά. Δοκιμάστε το μαζί με χαρτί και φακό. Στα 2–3 παίξτε δίπλα στο παιδί και δείξτε με τα χέρια σας «μικρό» και «μεγάλο».</p>
        <a href="/book-visit">Γνωρίστε την ομάδα του Πισιπούκ</a>
      </details>
    </section>
  );
}
