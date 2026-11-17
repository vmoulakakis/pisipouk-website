import { useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Eraser, PenLine, RotateCcw } from "lucide-react";
import { GameDirections, guideText } from "../GameDirections";
import { download, makePdf } from "../world/export";
import { owlDetails, owlRegions } from "./shadow-lesson";

const swatches = [
  ["Κίτρινο", "#ffc84d"], ["Μωβ", "#a486ef"], ["Γαλάζιο", "#5fd8ec"],
  ["Ροζ", "#f591ae"], ["Πράσινο", "#88d79a"], ["Κόκκινο", "#f77c61"],
] as const;
const width = 480, height = 576;
type Tool = "marker" | "erase";

export function ShadowAtelier({ onFinish, onBack, playGuide }: {
  onFinish: (art: string) => void;
  onBack: () => void;
  playGuide: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const drawing = useRef(false);
  const [color, setColor] = useState<string>(swatches[0][1]);
  const [tool, setTool] = useState<Tool>("marker");
  const [demo, setDemo] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [notice, setNotice] = useState("");

  function remember() {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    history.current.push(context.getImageData(0, 0, width, height));
    if (history.current.length > 12) history.current.shift();
    setCanUndo(true);
  }

  function stroke(event: PointerEvent<HTMLCanvasElement>) {
    const previous = lastPoint.current;
    const context = canvas.current?.getContext("2d");
    if (!event.isPrimary || !previous || !context) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = {
      x: (event.clientX - bounds.left) * width / bounds.width,
      y: (event.clientY - bounds.top) * height / bounds.height,
    };
    if (!drawing.current) {
      if (Math.hypot(next.x - previous.x, next.y - previous.y) < 2) return;
      remember();
      drawing.current = true;
      setDemo(0);
    }
    context.save();
    context.scale(3, 3);
    context.clip(new Path2D(owlRegions[0].path));
    context.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = tool === "erase" ? 16 : 9;
    context.beginPath();
    context.moveTo(previous.x / 3, previous.y / 3);
    context.lineTo(next.x / 3, next.y / 3);
    context.stroke();
    context.restore();
    lastPoint.current = next;
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    drawing.current = false;
    lastPoint.current = {
      x: (event.clientX - bounds.left) * width / bounds.width,
      y: (event.clientY - bounds.top) * height / bounds.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function stop() {
    lastPoint.current = null;
    drawing.current = false;
  }

  function undo() {
    const snapshot = history.current.pop();
    if (!snapshot) return;
    canvas.current?.getContext("2d")?.putImageData(snapshot, 0, 0);
    setCanUndo(history.current.length > 0);
  }

  function compose() {
    const result = document.createElement("canvas");
    result.width = width;
    result.height = height;
    const context = result.getContext("2d");
    if (!context || !canvas.current) return null;
    context.scale(3, 3);
    context.fillStyle = "#fff9eb";
    context.fill(new Path2D(owlRegions[0].path));
    context.save();
    context.clip(new Path2D(owlRegions[0].path));
    context.drawImage(canvas.current, 0, 0, 160, 192);
    context.restore();
    context.strokeStyle = "#4a315d";
    context.lineWidth = 2;
    owlRegions.forEach((region) => context.stroke(new Path2D(region.path)));
    context.fillStyle = "#4a315d";
    context.fill(new Path2D(owlDetails));
    return result.toDataURL("image/png");
  }

  async function printPdf() {
    const art = compose();
    if (!art) return;
    setNotice("");
    setPrinting(true);
    try {
      const image = new Image();
      image.src = art;
      await image.decode();
      // Match the existing PDF helper's landscape illustration box without stretching the portrait.
      const printable = document.createElement("canvas");
      printable.width = 989;
      printable.height = height;
      const context = printable.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, Math.round((printable.width - width) / 2), 0);
      download(await makePdf(
        "Η Λήδα στη σκηνή",
        ["Ζωγράφισε και παίξε με τη σκιά της Λήδας."],
        printable.toDataURL("image/png"),
        false,
        "A4",
      ), "pisipouk-lida-a4.pdf");
    } catch {
      setNotice("Δεν ετοιμάστηκε το PDF. Δοκίμασε ξανά.");
    } finally {
      setPrinting(false);
    }
  }

  return (
    <section className="ps-shadow-atelier" aria-label="Ατελιέ της Λήδας">
      <div className="ps-shadow-atelier-tools">
        <button type="button" className="ps-shadow-subtle" onClick={onBack}><ArrowLeft aria-hidden="true" /> Στη σκηνή</button>
        <h3>Δώσε χρώμα στη Λήδα</h3>
        <GameDirections text={guideText.marker} listen={playGuide} show={() => { setDemo((value) => value + 1); playGuide(); }} />
        <div className="ps-shadow-swatches" aria-label="Μαρκαδόροι">
          {swatches.map(([label, hex]) => (
            <button key={hex} type="button" aria-label={label} aria-pressed={color === hex && tool === "marker"} onClick={() => { setColor(hex); setTool("marker"); }} style={{ background: hex }}><PenLine aria-hidden="true" /></button>
          ))}
        </div>
        <div className="ps-shadow-toolrow" aria-label="Εργαλεία ζωγραφικής">
          <button type="button" aria-pressed={tool === "erase"} onClick={() => setTool("erase")}><Eraser aria-hidden="true" /> Γόμα</button>
          <button type="button" disabled={!canUndo} onClick={undo}><RotateCcw aria-hidden="true" /> Αναίρεση</button>
        </div>
        {notice && <p role="status">{notice}</p>}
        <div className="ps-shadow-toolrow">
          <button type="button" onClick={() => {
            const art = compose();
            if (art) onFinish(art);
          }} className="ps-shadow-primary">Βάλε τη Λήδα στη σκηνή <ArrowRight aria-hidden="true" /></button>
          <button type="button" disabled={printing} onClick={() => void printPdf()}>PDF Α4</button>
        </div>
      </div>
      <div className="ps-shadow-paper">
        <canvas ref={canvas} width={width} height={height} aria-label="Καμβάς ζωγραφικής με μαρκαδόρο"
          onPointerDown={start} onPointerMove={stroke} onPointerUp={stop}
          onLostPointerCapture={stop} onPointerCancel={stop} />
        <svg viewBox="0 0 160 192" aria-hidden="true" className="ps-shadow-outlines">
          {owlRegions.map((region) => <path key={region.name} d={region.path} fill="none" stroke="#4a315d" strokeWidth="2" />)}
          <path d={owlDetails} fill="#4a315d" />
        </svg>
        {demo > 0 && <svg key={demo} viewBox="0 0 160 192" aria-hidden="true" className="ps-marker-demo">
          <path d="M65 143Q78 124 96 140" />
          <text x="61" y="132">✍</text>
        </svg>}
      </div>
    </section>
  );
}
