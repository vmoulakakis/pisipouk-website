import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Undo2, Eraser, Download, Printer, Trash2 } from "lucide-react";
import { download, makePdf } from "./export";
const COLORS = [
  "#dc6b53",
  "#e2ab31",
  "#658b67",
  "#468ca4",
  "#9c78b0",
  "#d589a0",
  "#705345",
  "#202f2b",
];
export function Drawing({
  saveData,
  grayscale = false,
  paper = "A4",
}: {
  saveData: (s: string) => void;
  grayscale?: boolean;
  paper?: "A4" | "A5";
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    drawing = useRef(false),
    history = useRef<ImageData[]>([]),
    cursor = useRef({ x: 400, y: 250 });
  const [color, setColor] = useState(COLORS[0]),
    [size, setSize] = useState(12),
    [erase, setErase] = useState(false),
    [status, setStatus] = useState(
      "Ζωγράφισε με δάχτυλο ή ποντίκι. Με πληκτρολόγιο: βελάκια και κενό.",
    ),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const c = canvas.current!;
    const x = c.getContext("2d", { willReadFrequently: true })!;
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, c.width, c.height);
  }, []);
  const ctx = () =>
    canvas.current!.getContext("2d", { willReadFrequently: true })!;
  const snapshot = () => {
    history.current.push(ctx().getImageData(0, 0, 1000, 620));
    if (history.current.length > 10) history.current.shift();
  };
  const record = () => saveData(canvas.current!.toDataURL("image/png"));
  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * 1000) / r.width,
      y: ((e.clientY - r.top) * 620) / r.height,
    };
  };
  const start = (e: PointerEvent<HTMLCanvasElement>) => {
    snapshot();
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e),
      x = ctx();
    x.beginPath();
    x.moveTo(p.x, p.y);
    x.fillStyle = erase ? "#ffffff" : color;
    x.beginPath();
    x.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.moveTo(p.x, p.y);
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const p = point(e),
      x = ctx();
    x.strokeStyle = erase ? "#ffffff" : color;
    x.lineWidth = size;
    x.lineCap = "round";
    x.lineJoin = "round";
    x.lineTo(p.x, p.y);
    x.stroke();
  };
  const stop = () => {
    drawing.current = false;
    record();
  };
  const undo = () => {
    const h = history.current.pop();
    if (h) {
      ctx().putImageData(h, 0, 0);
      record();
      setStatus("Η τελευταία πινελιά αναιρέθηκε.");
    } else setStatus("Δεν υπάρχει άλλη πινελιά για αναίρεση.");
  };
  const sheet = (kind: string) => {
    snapshot();
    const x = ctx();
    x.fillStyle = "white";
    x.fillRect(0, 0, 1000, 620);
    x.strokeStyle = "#374740";
    x.lineWidth = 5;
    x.beginPath();
    if (kind === "leaf") {
      x.moveTo(500, 100);
      x.bezierCurveTo(170, 210, 230, 470, 500, 520);
      x.bezierCurveTo(770, 470, 830, 210, 500, 100);
      x.moveTo(500, 100);
      x.lineTo(500, 550);
      for (let i = 0; i < 4; i++) {
        x.moveTo(500, 220 + i * 70);
        x.lineTo(370 - i * 5, 170 + i * 70);
        x.moveTo(500, 250 + i * 60);
        x.lineTo(625, 190 + i * 60);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5;
        x.ellipse(
          500 + Math.cos(a) * 110,
          300 + Math.sin(a) * 110,
          100,
          65,
          a,
          0,
          Math.PI * 2,
        );
      }
      x.moveTo(500, 390);
      x.lineTo(500, 570);
      x.moveTo(500, 470);
      x.quadraticCurveTo(370, 390, 370, 490);
      x.quadraticCurveTo(450, 520, 500, 470);
    }
    x.stroke();
    record();
    setStatus(
      "Το περίγραμμα είναι έτοιμο. Η αναίρεση επιστρέφει στην προηγούμενη ζωγραφιά.",
    );
  };
  const pdf = async () => {
    setBusy(true);
    try {
      download(
        await makePdf(
          "Η δική μου ζωγραφιά",
          ["Κάθε ιδέα είναι μοναδική. Πες μας την ιστορία της εικόνας σου."],
          canvas.current!.toDataURL(),
          grayscale,
          paper,
        ),
        `pisipouk-zografia-${paper}.pdf`,
      );
      setStatus("Το PDF αποθηκεύτηκε.");
    } catch {
      setStatus("Το PDF δεν δημιουργήθηκε. Δοκίμασε ξανά.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="pw-drawing">
      <div className="pw-section-title">
        <small>ΤΟ ΑΤΕΛΙΕ</small>
        <h2>Ο κόσμος σου, με τα χρώματά σου.</h2>
        <p>Κάθε γραμμή είναι μια καινούργια ιδέα.</p>
      </div>
      <div className="pw-drawing-tools">
        {COLORS.map((c) => (
          <button
            key={c}
            aria-label={`Χρώμα ${c}`}
            aria-pressed={c === color && !erase}
            style={{ background: c }}
            onClick={() => {
              setColor(c);
              setErase(false);
            }}
          />
        ))}
        <label>
          Πινέλο
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={6}>Λεπτό</option>
            <option value={12}>Μεσαίο</option>
            <option value={28}>Χοντρό</option>
          </select>
        </label>
        <button aria-pressed={erase} onClick={() => setErase(!erase)}>
          <Eraser />
          Γόμα
        </button>
        <button onClick={undo}>
          <Undo2 />
          Αναίρεση
        </button>
      </div>
      <canvas
        ref={canvas}
        width={1000}
        height={620}
        tabIndex={0}
        aria-label="Καμβάς ζωγραφικής"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if (
            !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(
              e.key,
            )
          )
            return;
          e.preventDefault();
          if (e.key === " ") {
            snapshot();
            const x = ctx();
            x.fillStyle = erase ? "white" : color;
            x.beginPath();
            x.arc(cursor.current.x, cursor.current.y, size, 0, Math.PI * 2);
            x.fill();
            record();
            setStatus("Προστέθηκε μια πινελιά.");
          } else {
            cursor.current.x = Math.max(
              0,
              Math.min(
                1000,
                cursor.current.x +
                  (e.key === "ArrowRight"
                    ? 20
                    : e.key === "ArrowLeft"
                      ? -20
                      : 0),
              ),
            );
            cursor.current.y = Math.max(
              0,
              Math.min(
                620,
                cursor.current.y +
                  (e.key === "ArrowDown" ? 20 : e.key === "ArrowUp" ? -20 : 0),
              ),
            );
            setStatus(
              `Θέση πινέλου ${cursor.current.x}, ${cursor.current.y}. Πάτησε κενό για πινελιά.`,
            );
          }
        }}
      />
      <div className="pw-tools">
        <button onClick={() => sheet("leaf")}>Περίγραμμα φύλλου</button>
        <button onClick={() => sheet("flower")}>Περίγραμμα λουλουδιού</button>
        <button
          onClick={() => {
            snapshot();
            ctx().fillStyle = "white";
            ctx().fillRect(0, 0, 1000, 620);
            record();
          }}
        >
          <Trash2 />
          Νέο χαρτί
        </button>
        <button
          onClick={() =>
            canvas.current!.toBlob((b) => {
              if (b) download(b, "pisipouk-zografia.png");
            })
          }
        >
          <Download />
          PNG
        </button>
        <button disabled={busy} onClick={pdf}>
          <Printer />
          {busy ? "Ετοιμάζεται…" : `${paper} PDF`}
        </button>
      </div>
      <p role="status">{status}</p>
    </section>
  );
}
