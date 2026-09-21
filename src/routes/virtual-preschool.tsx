import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Download, Eraser, Paintbrush, Printer, RotateCcw, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";

export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Εικονικός Παιδικός Σταθμός | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Online ζωγραφική για παιδιά στον Πισιπούκ με κανονικό πινέλο, καθημερινές επιλογές σχεδίων, αποθήκευση και εκτύπωση.",
      },
    ],
  }),
  component: VirtualPreschool,
});

const COLORS = [
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#8b5e3c",
  "#111827",
];

const DESIGNS = [
  { id: "cat", title: "Γατούλα", emoji: "🐱" },
  { id: "bunny", title: "Κουνελάκι", emoji: "🐰" },
  { id: "elephant", title: "Ελεφαντάκι", emoji: "🐘" },
  { id: "dinosaur", title: "Δεινόσαυρος", emoji: "🦕" },
  { id: "firetruck", title: "Πυροσβεστικό", emoji: "🚒" },
  { id: "train", title: "Τρενάκι", emoji: "🚂" },
  { id: "unicorn", title: "Μονόκερος", emoji: "🦄" },
  { id: "rocket", title: "Πύραυλος", emoji: "🚀" },
  { id: "fish", title: "Ψαράκι", emoji: "🐠" },
  { id: "butterfly", title: "Πεταλούδα", emoji: "🦋" },
  { id: "fruit", title: "Φρούτα", emoji: "🍎" },
  { id: "garden", title: "Κήπος", emoji: "🌻" },
];

function Outline({ id }: { id: string }) {
  const common = { fill: "#fff", stroke: "#111", strokeWidth: 8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (id === "cat")
    return (
      <>
        <path {...common} d="M285 175 L330 105 L370 170 Q450 130 530 170 L570 105 L615 175 Q650 230 625 335 Q605 430 450 455 Q295 430 275 335 Q250 230 285 175Z" />
        <circle cx="385" cy="275" r="10" fill="#111" />
        <circle cx="515" cy="275" r="10" fill="#111" />
        <path d="M425 320 Q450 340 475 320 M450 337 Q450 370 415 380 M450 337 Q450 370 485 380" {...common} fill="none" strokeWidth={6} />
        <path d="M300 315 L205 290 M300 340 L195 340 M600 315 L695 290 M600 340 L705 340" {...common} fill="none" strokeWidth={5} />
        <path {...common} d="M335 455 Q270 520 330 570 Q450 620 570 570 Q630 520 565 455" />
        <path d="M570 500 Q690 470 690 565 Q675 610 630 585" {...common} fill="none" />
      </>
    );

  if (id === "bunny")
    return (
      <>
        <ellipse {...common} cx="350" cy="165" rx="55" ry="125" />
        <ellipse {...common} cx="550" cy="165" rx="55" ry="125" />
        <ellipse {...common} cx="450" cy="330" rx="185" ry="165" />
        <circle cx="385" cy="300" r="10" fill="#111" />
        <circle cx="515" cy="300" r="10" fill="#111" />
        <path d="M430 350 Q450 365 470 350 M450 365 Q430 395 405 400 M450 365 Q470 395 495 400" {...common} fill="none" strokeWidth={6} />
        <ellipse {...common} cx="450" cy="525" rx="165" ry="70" />
        <circle {...common} cx="660" cy="500" r="55" />
      </>
    );

  if (id === "elephant")
    return (
      <>
        <ellipse {...common} cx="430" cy="310" rx="230" ry="155" />
        <circle {...common} cx="610" cy="285" r="110" />
        <ellipse {...common} cx="545" cy="285" rx="75" ry="95" />
        <path d="M690 300 Q735 340 700 455 Q675 515 720 535" {...common} fill="none" />
        <circle cx="640" cy="260" r="10" fill="#111" />
        <path d="M260 420 L250 560 M390 450 L390 565 M520 450 L520 565" {...common} fill="none" />
        <path d="M215 320 Q150 285 135 345" {...common} fill="none" />
        <path d="M700 410 Q730 390 745 420" {...common} fill="none" strokeWidth={5} />
      </>
    );

  if (id === "dinosaur")
    return (
      <>
        <path {...common} d="M190 460 Q170 330 245 255 Q315 185 430 205 Q520 95 655 135 Q755 165 730 250 Q710 305 630 305 L590 470 Q535 510 470 470 L430 390 Q385 440 320 455 L290 555 L220 555 L235 455Z" />
        <circle cx="660" cy="200" r="10" fill="#111" />
        <path d="M675 245 Q705 255 720 235" {...common} fill="none" strokeWidth={5} />
        <path d="M300 235 L330 175 L370 220 L410 155 L450 210 L495 150 L530 205" {...common} fill="none" />
      </>
    );

  if (id === "firetruck")
    return (
      <>
        <rect {...common} x="165" y="270" width="500" height="210" rx="25" />
        <path {...common} d="M500 270 L590 185 L665 185 L720 270Z" />
        <rect {...common} x="550" y="220" width="90" height="70" rx="8" />
        <circle {...common} cx="285" cy="500" r="62" />
        <circle {...common} cx="620" cy="500" r="62" />
        <circle cx="285" cy="500" r="25" fill="#fff" stroke="#111" strokeWidth="8" />
        <circle cx="620" cy="500" r="25" fill="#fff" stroke="#111" strokeWidth="8" />
        <path d="M210 250 L520 120 M260 250 L570 120 M300 225 L325 185 M360 200 L385 160 M420 175 L445 135" {...common} fill="none" />
        <rect {...common} x="220" y="320" width="190" height="85" rx="10" />
      </>
    );

  if (id === "train")
    return (
      <>
        <rect {...common} x="180" y="250" width="300" height="220" rx="22" />
        <rect {...common} x="480" y="310" width="165" height="160" rx="18" />
        <rect {...common} x="225" y="175" width="80" height="85" rx="8" />
        <path {...common} d="M160 250 H500 L455 180 H210Z" />
        <circle {...common} cx="260" cy="500" r="55" />
        <circle {...common} cx="430" cy="500" r="55" />
        <circle {...common} cx="575" cy="500" r="55" />
        <path d="M295 175 Q260 120 305 95 Q350 75 360 120" {...common} fill="none" />
        <path d="M645 405 L720 455 L645 455Z" {...common} />
      </>
    );

  if (id === "unicorn")
    return (
      <>
        <ellipse {...common} cx="450" cy="345" rx="195" ry="155" />
        <path {...common} d="M360 220 Q320 115 405 125 L450 205" />
        <path {...common} d="M490 205 L555 90 L590 210" />
        <path {...common} d="M520 175 L565 65 L600 180" />
        <circle cx="390" cy="325" r="10" fill="#111" />
        <circle cx="510" cy="325" r="10" fill="#111" />
        <path d="M410 390 Q450 420 490 390" {...common} fill="none" strokeWidth={6} />
        <path d="M285 290 Q210 330 235 420 Q250 465 300 455 M615 290 Q690 330 665 420 Q650 465 600 455" {...common} fill="none" />
        <path d="M335 455 Q300 535 355 565 M565 455 Q600 535 545 565" {...common} fill="none" />
      </>
    );

  if (id === "rocket")
    return (
      <>
        <path {...common} d="M450 90 Q560 170 560 340 Q560 460 450 525 Q340 460 340 340 Q340 170 450 90Z" />
        <circle {...common} cx="450" cy="280" r="65" />
        <path {...common} d="M340 365 L255 450 L345 455 M560 365 L645 450 L555 455" />
        <path {...common} d="M405 510 Q450 600 495 510" />
        <path d="M410 555 Q450 625 490 555" {...common} fill="none" />
        <circle {...common} cx="210" cy="150" r="18" />
        <circle {...common} cx="700" cy="205" r="14" />
        <path d="M165 330 L195 330 M180 315 L180 345 M675 115 L705 115 M690 100 L690 130" {...common} fill="none" strokeWidth={5} />
      </>
    );

  if (id === "fish")
    return (
      <>
        <ellipse {...common} cx="430" cy="330" rx="220" ry="135" />
        <path {...common} d="M640 330 L760 225 L760 435Z" />
        <circle cx="330" cy="300" r="12" fill="#111" />
        <path d="M285 355 Q320 380 355 355" {...common} fill="none" strokeWidth={6} />
        <path {...common} d="M430 200 Q475 120 535 205 M430 460 Q475 540 535 455" />
        <path d="M390 230 Q435 330 390 430 M485 215 Q535 330 485 445 M580 245 Q620 330 580 415" {...common} fill="none" strokeWidth={5} />
        <circle {...common} cx="160" cy="190" r="25" />
        <circle {...common} cx="115" cy="130" r="15" />
      </>
    );

  if (id === "butterfly")
    return (
      <>
        <ellipse {...common} cx="450" cy="335" rx="38" ry="180" />
        <path {...common} d="M405 260 Q270 125 190 220 Q150 305 285 355 Q155 420 220 520 Q315 580 405 420Z" />
        <path {...common} d="M495 260 Q630 125 710 220 Q750 305 615 355 Q745 420 680 520 Q585 580 495 420Z" />
        <circle {...common} cx="450" cy="135" r="42" />
        <path d="M430 105 Q390 55 350 70 M470 105 Q510 55 550 70" {...common} fill="none" strokeWidth={5} />
        <circle {...common} cx="285" cy="275" r="45" />
        <circle {...common} cx="615" cy="275" r="45" />
        <circle {...common} cx="300" cy="445" r="35" />
        <circle {...common} cx="600" cy="445" r="35" />
      </>
    );

  if (id === "fruit")
    return (
      <>
        <circle {...common} cx="315" cy="350" r="125" />
        <path d="M315 220 Q300 145 350 125 M330 185 Q385 150 415 195" {...common} fill="none" />
        <path {...common} d="M520 235 Q650 190 690 320 Q725 455 595 520 Q470 500 470 370 Q470 275 520 235Z" />
        <path d="M555 230 Q545 155 600 130 M590 170 Q650 135 680 185" {...common} fill="none" />
        <path {...common} d="M190 520 Q330 455 455 525 Q565 470 715 520 L690 585 H215Z" />
      </>
    );

  return (
    <>
      <circle {...common} cx="450" cy="255" r="70" />
      <circle {...common} cx="450" cy="255" r="30" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a=(Math.PI*2*i)/10;
        const x=450+Math.cos(a)*130;
        const y=255+Math.sin(a)*130;
        return <ellipse key={i} {...common} cx={x} cy={y} rx="45" ry="80" transform={`rotate(${i*36} ${x} ${y})`} />;
      })}
      <path {...common} d="M430 390 Q380 500 410 585 H490 Q520 500 470 390Z" />
      <path d="M410 455 Q330 410 280 470 M490 455 Q570 410 620 470" {...common} fill="none" />
      <path {...common} d="M220 520 Q280 450 340 520 Q400 450 460 520 Q520 450 580 520 Q640 450 700 520 L700 590 H220Z" />
    </>
  );
}

function VirtualPreschool() {
  const daySeed = useMemo(() => Math.floor(Date.now() / 86400000), []);
  const dailyChoices = useMemo(() => {
    const start = daySeed % DESIGNS.length;
    return Array.from({ length: 6 }, (_, i) => DESIGNS[(start + i * 2) % DESIGNS.length]);
  }, [daySeed]);

  const [designId, setDesignId] = useState(dailyChoices[0].id);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(24);
  const [erasing, setErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const current = DESIGNS.find((d) => d.id === designId) ?? DESIGNS[0];

  useEffect(() => {
    trackEvent("game_start", { game: "freehand_coloring", drawing: designId });
  }, [designId]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const pickDesign = (id: string) => {
    setDesignId(id);
    clearCanvas();
    setErasing(false);
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    lastRef.current = point(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
    lastRef.current = p;
  };

  const stopDraw = () => {
    if (drawingRef.current) {
      trackEvent("color_selected", { game: "freehand_coloring", drawing: designId });
    }
    drawingRef.current = false;
    lastRef.current = null;
  };

  const download = () => {
    const paint = canvasRef.current;
    const svg = svgRef.current;
    if (!paint || !svg) return;

    const out = document.createElement("canvas");
    out.width = 1200;
    out.height = 930;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);

    const svgText = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const bg = new Image();

    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, 1200, 867);
      ctx.drawImage(paint, 0, 0, 1200, 867);
      ctx.fillStyle = "#333";
      ctx.font = "26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app", 600, 910);
      const a = document.createElement("a");
      a.href = out.toDataURL("image/png");
      a.download = `pisipouk-${designId}.png`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("share_click", { game: "freehand_coloring", action: "download", drawing: designId });
    };
    bg.src = url;
  };

  const print = () => {
    trackEvent("share_click", { game: "freehand_coloring", action: "print", drawing: designId });
    window.print();
  };

  return (
    <SiteLayout>
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <p className="section-kicker">Εικονικός Παιδικός Σταθμός</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Ζωγράφισε με το δάχτυλό σου</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Διάλεξε σχέδιο, χρώμα και μέγεθος πινέλου. Μετά ζωγράφισε ελεύθερα πάνω στην εικόνα.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-black">Οι σημερινές επιλογές</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {dailyChoices.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => pickDesign(item.id)}
                  className={
                    "rounded-[1.4rem] border p-4 text-left transition-all " +
                    (designId === item.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "bg-card hover:border-primary/40")
                  }
                >
                  <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                  <span className="mt-2 block text-sm font-black">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
            <div className="print-area rounded-[2rem] border bg-white p-3 shadow-sm sm:p-5">
              <div className="relative mx-auto aspect-[900/650] w-full max-w-4xl overflow-hidden rounded-[1.4rem] bg-white">
                <svg
                  ref={svgRef}
                  viewBox="0 0 900 650"
                  className="absolute inset-0 h-full w-full"
                  aria-label={`Σχέδιο: ${current.title}`}
                >
                  <rect width="900" height="650" fill="#fff" />
                  <Outline id={designId} />
                </svg>
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={650}
                  onPointerDown={startDraw}
                  onPointerMove={draw}
                  onPointerUp={stopDraw}
                  onPointerCancel={stopDraw}
                  onPointerLeave={stopDraw}
                  className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
                  aria-label="Καμβάς ζωγραφικής"
                />
              </div>
              <div className="hidden print:block pt-3 text-center text-sm font-bold text-gray-700">
                Η ζωγραφιά μου στον Πισιπούκ - pisipouk.vercel.app
              </div>
            </div>

            <aside className="rounded-[2rem] border bg-card p-5">
              <div className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-primary" />
                <h2 className="font-black">Παλέτα ζωγραφικής</h2>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setColor(c);
                      setErasing(false);
                    }}
                    aria-label={"Χρώμα " + c}
                    className={
                      "h-11 w-11 rounded-full border-2 transition-transform " +
                      (!erasing && color === c ? "scale-110 ring-2 ring-primary ring-offset-2" : "")
                    }
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm font-black">Μέγεθος πινέλου</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[14, 26, 42].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBrushSize(size)}
                      className={
                        "flex h-12 items-center justify-center rounded-xl border bg-background " +
                        (brushSize === size ? "ring-2 ring-primary" : "")
                      }
                      aria-label={`Πινέλο ${size}`}
                    >
                      <span
                        className="rounded-full bg-foreground"
                        style={{ width: Math.max(8, size / 2), height: Math.max(8, size / 2) }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Button
                  type="button"
                  variant={erasing ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setErasing((v) => !v)}
                >
                  <Eraser className="h-4 w-4" />
                  {erasing ? "Γόμα ενεργή" : "Γόμα"}
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={clearCanvas}>
                  <RotateCcw className="h-4 w-4" />
                  Καθάρισέ το
                </Button>
                <Button type="button" className="rounded-full" onClick={download}>
                  <Download className="h-4 w-4" />
                  Αποθήκευση PNG
                </Button>
                <Button type="button" variant="secondary" className="rounded-full" onClick={print}>
                  <Printer className="h-4 w-4" />
                  Εκτύπωση
                </Button>
              </div>

              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                Τα σχέδια είναι πρωτότυπα line-art του Πισιπούκ, βασισμένα σε δημοφιλείς preschool θεματικές.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <style>{`@media print {
        body * { visibility:hidden !important; }
        .print-area, .print-area * { visibility:visible !important; }
        .print-area { position:absolute !important; inset:0 !important; width:100% !important; border:0 !important; box-shadow:none !important; }
        header, footer { display:none !important; }
      }`}</style>
    </SiteLayout>
  );
}
