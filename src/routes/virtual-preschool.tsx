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
          "Online ζωγραφική για παιδιά 2–6 ετών στον Πισιπούκ, με σχέδια ανά ηλικία, κανονικό πινέλο, αποθήκευση και εκτύπωση.",
      },
    ],
  }),
  component: VirtualPreschool,
});

const COLORS = ["#ef4444","#f97316","#facc15","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#8b5e3c","#111827"];

type Design = {
  id: string;
  title: string;
  emoji: string;
  age: "2–3" | "4–5" | "5–6";
  level: "Εύκολο" | "Μεσαίο" | "Πιο λεπτομερές";
};

const DESIGNS: Design[] = [
  { id: "sun", title: "Ήλιος", emoji: "☀️", age: "2–3", level: "Εύκολο" },
  { id: "apple", title: "Μήλο", emoji: "🍎", age: "2–3", level: "Εύκολο" },
  { id: "balloon", title: "Μπαλόνι", emoji: "🎈", age: "2–3", level: "Εύκολο" },
  { id: "cat", title: "Γατούλα", emoji: "🐱", age: "2–3", level: "Εύκολο" },
  { id: "fish", title: "Ψαράκι", emoji: "🐠", age: "2–3", level: "Εύκολο" },
  { id: "flower", title: "Λουλούδι", emoji: "🌼", age: "2–3", level: "Εύκολο" },

  { id: "bunny", title: "Κουνελάκι", emoji: "🐰", age: "4–5", level: "Μεσαίο" },
  { id: "elephant", title: "Ελεφαντάκι", emoji: "🐘", age: "4–5", level: "Μεσαίο" },
  { id: "train", title: "Τρενάκι", emoji: "🚂", age: "4–5", level: "Μεσαίο" },
  { id: "firetruck", title: "Πυροσβεστικό", emoji: "🚒", age: "4–5", level: "Μεσαίο" },
  { id: "unicorn", title: "Μονόκερος", emoji: "🦄", age: "4–5", level: "Μεσαίο" },
  { id: "butterfly", title: "Πεταλούδα", emoji: "🦋", age: "4–5", level: "Μεσαίο" },

  { id: "dino-scene", title: "Δεινόσαυρος στο δάσος", emoji: "🦕", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "space-scene", title: "Διάστημα & πλανήτες", emoji: "🚀", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "farm-scene", title: "Αγρόκτημα", emoji: "🚜", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "ocean-scene", title: "Βυθός", emoji: "🐙", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "castle-scene", title: "Κάστρο & ουράνιο τόξο", emoji: "🏰", age: "5–6", level: "Πιο λεπτομερές" },
  { id: "garden-scene", title: "Κήπος με έντομα", emoji: "🌻", age: "5–6", level: "Πιο λεπτομερές" },
];

const common = {
  fill: "#fff",
  stroke: "#111",
  strokeWidth: 8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Outline({ id }: { id: string }) {
  if (id === "sun") return <>
    <circle {...common} cx="450" cy="325" r="130"/>
    {Array.from({length:12}).map((_,i)=>{const a=i*Math.PI/6;return <line key={i} x1={450+Math.cos(a)*180} y1={325+Math.sin(a)*180} x2={450+Math.cos(a)*245} y2={325+Math.sin(a)*245} {...common}/>})}
    <circle cx="405" cy="300" r="12" fill="#111"/><circle cx="495" cy="300" r="12" fill="#111"/>
    <path d="M400 365 Q450 410 500 365" {...common} fill="none"/>
  </>;

  if (id === "apple") return <>
    <path {...common} d="M450 185 Q335 135 265 255 Q205 390 305 515 Q380 595 450 545 Q520 595 595 515 Q695 390 635 255 Q565 135 450 185Z"/>
    <path d="M450 190 Q445 120 500 85" {...common} fill="none"/>
    <path {...common} d="M500 105 Q565 75 600 125 Q550 160 495 140Z"/>
  </>;

  if (id === "balloon") return <>
    <ellipse {...common} cx="450" cy="250" rx="170" ry="190"/>
    <path {...common} d="M420 430 L480 430 L450 475Z"/>
    <path d="M450 475 Q390 535 470 585 Q535 625 565 575" {...common} fill="none"/>
  </>;

  if (id === "cat") return <>
    <path {...common} d="M285 175 L330 105 L370 170 Q450 130 530 170 L570 105 L615 175 Q650 230 625 335 Q605 430 450 455 Q295 430 275 335 Q250 230 285 175Z"/>
    <circle cx="385" cy="275" r="10" fill="#111"/><circle cx="515" cy="275" r="10" fill="#111"/>
    <path d="M425 320 Q450 340 475 320 M450 337 Q450 370 415 380 M450 337 Q450 370 485 380" {...common} fill="none" strokeWidth={6}/>
    <path d="M300 315 L205 290 M300 340 L195 340 M600 315 L695 290 M600 340 L705 340" {...common} fill="none" strokeWidth={5}/>
    <path {...common} d="M335 455 Q270 520 330 570 Q450 620 570 570 Q630 520 565 455"/>
  </>;

  if (id === "fish") return <>
    <ellipse {...common} cx="430" cy="330" rx="220" ry="135"/>
    <path {...common} d="M640 330 L760 225 L760 435Z"/>
    <circle cx="330" cy="300" r="12" fill="#111"/>
    <path d="M285 355 Q320 380 355 355" {...common} fill="none" strokeWidth={6}/>
    <circle {...common} cx="150" cy="180" r="28"/><circle {...common} cx="105" cy="120" r="16"/>
  </>;

  if (id === "flower") return <>
    <circle {...common} cx="450" cy="260" r="70"/>
    {Array.from({length:8}).map((_,i)=>{const a=i*Math.PI/4;return <ellipse key={i} {...common} cx={450+Math.cos(a)*120} cy={260+Math.sin(a)*120} rx="48" ry="80" transform={`rotate(${i*45} ${450+Math.cos(a)*120} ${260+Math.sin(a)*120})`}/>})}
    <path {...common} d="M430 390 Q385 500 410 590 H490 Q515 500 470 390Z"/>
    <path d="M410 475 Q340 430 300 490 M490 475 Q560 430 600 490" {...common} fill="none"/>
  </>;

  if (id === "bunny") return <>
    <ellipse {...common} cx="350" cy="165" rx="55" ry="125"/><ellipse {...common} cx="550" cy="165" rx="55" ry="125"/>
    <ellipse {...common} cx="450" cy="330" rx="185" ry="165"/>
    <circle cx="385" cy="300" r="10" fill="#111"/><circle cx="515" cy="300" r="10" fill="#111"/>
    <path d="M430 350 Q450 365 470 350 M450 365 Q430 395 405 400 M450 365 Q470 395 495 400" {...common} fill="none" strokeWidth={6}/>
    <ellipse {...common} cx="450" cy="525" rx="165" ry="70"/><circle {...common} cx="660" cy="500" r="55"/>
  </>;

  if (id === "elephant") return <>
    <ellipse {...common} cx="430" cy="310" rx="230" ry="155"/><circle {...common} cx="610" cy="285" r="110"/>
    <ellipse {...common} cx="545" cy="285" rx="75" ry="95"/>
    <path d="M690 300 Q735 340 700 455 Q675 515 720 535" {...common} fill="none"/>
    <circle cx="640" cy="260" r="10" fill="#111"/>
    <path d="M260 420 L250 560 M390 450 L390 565 M520 450 L520 565" {...common} fill="none"/>
    <path d="M215 320 Q150 285 135 345" {...common} fill="none"/>
  </>;

  if (id === "train") return <>
    <rect {...common} x="180" y="250" width="300" height="220" rx="22"/><rect {...common} x="480" y="310" width="165" height="160" rx="18"/>
    <rect {...common} x="225" y="175" width="80" height="85" rx="8"/><path {...common} d="M160 250 H500 L455 180 H210Z"/>
    <circle {...common} cx="260" cy="500" r="55"/><circle {...common} cx="430" cy="500" r="55"/><circle {...common} cx="575" cy="500" r="55"/>
    <path d="M295 175 Q260 120 305 95 Q350 75 360 120" {...common} fill="none"/>
  </>;

  if (id === "firetruck") return <>
    <rect {...common} x="165" y="270" width="500" height="210" rx="25"/><path {...common} d="M500 270 L590 185 L665 185 L720 270Z"/>
    <rect {...common} x="550" y="220" width="90" height="70" rx="8"/>
    <circle {...common} cx="285" cy="500" r="62"/><circle {...common} cx="620" cy="500" r="62"/>
    <path d="M210 250 L520 120 M260 250 L570 120 M300 225 L325 185 M360 200 L385 160 M420 175 L445 135" {...common} fill="none"/>
  </>;

  if (id === "unicorn") return <>
    <ellipse {...common} cx="450" cy="345" rx="195" ry="155"/>
    <path {...common} d="M360 220 Q320 115 405 125 L450 205"/><path {...common} d="M490 205 L555 90 L590 210"/>
    <path {...common} d="M520 175 L565 65 L600 180"/>
    <circle cx="390" cy="325" r="10" fill="#111"/><circle cx="510" cy="325" r="10" fill="#111"/>
    <path d="M410 390 Q450 420 490 390" {...common} fill="none" strokeWidth={6}/>
    <path d="M335 455 Q300 535 355 565 M565 455 Q600 535 545 565" {...common} fill="none"/>
  </>;

  if (id === "butterfly") return <>
    <ellipse {...common} cx="450" cy="335" rx="38" ry="180"/>
    <path {...common} d="M405 260 Q270 125 190 220 Q150 305 285 355 Q155 420 220 520 Q315 580 405 420Z"/>
    <path {...common} d="M495 260 Q630 125 710 220 Q750 305 615 355 Q745 420 680 520 Q585 580 495 420Z"/>
    <circle {...common} cx="450" cy="135" r="42"/>
    <circle {...common} cx="285" cy="275" r="45"/><circle {...common} cx="615" cy="275" r="45"/>
    <circle {...common} cx="300" cy="445" r="35"/><circle {...common} cx="600" cy="445" r="35"/>
  </>;

  if (id === "dino-scene") return <>
    <path {...common} d="M175 480 Q155 350 235 270 Q310 195 430 215 Q505 120 620 145 Q730 170 710 255 Q690 315 610 315 L575 470 Q520 515 465 470 L425 395 Q380 450 315 465 L285 555 L215 555 L230 465Z"/>
    <circle cx="645" cy="205" r="10" fill="#111"/>
    <path d="M290 245 L330 175 L365 230 L410 160 L450 220 L500 155 L535 215" {...common} fill="none"/>
    <path {...common} d="M95 555 Q130 430 170 555Z M710 555 Q750 410 795 555Z"/>
    <circle {...common} cx="120" cy="180" r="55"/><path d="M120 90 L120 55 M45 180 L10 180 M195 180 L230 180 M65 125 L40 100 M175 125 L200 100" {...common} fill="none" strokeWidth={6}/>
    <path d="M70 575 Q220 520 370 575 Q540 520 830 575" {...common} fill="none"/>
  </>;

  if (id === "space-scene") return <>
    <path {...common} d="M450 120 Q555 195 555 340 Q555 445 450 505 Q345 445 345 340 Q345 195 450 120Z"/>
    <circle {...common} cx="450" cy="285" r="60"/>
    <path {...common} d="M345 365 L270 440 L350 445 M555 365 L630 440 L550 445"/>
    <path {...common} d="M410 495 Q450 590 490 495"/>
    <circle {...common} cx="170" cy="175" r="70"/><path {...common} d="M110 185 Q170 125 230 185"/>
    <circle {...common} cx="730" cy="210" r="55"/><path d="M665 210 Q730 175 795 210" {...common} fill="none"/>
    <path d="M120 390 L155 390 M138 372 L138 408 M720 430 L755 430 M738 412 L738 448 M250 95 L280 95 M265 80 L265 110" {...common} fill="none" strokeWidth={6}/>
  </>;

  if (id === "farm-scene") return <>
    <path {...common} d="M120 365 L300 210 L480 365Z"/><rect {...common} x="150" y="365" width="300" height="205"/>
    <rect {...common} x="245" y="430" width="110" height="140"/><rect {...common} x="185" y="395" width="70" height="65"/>
    <path {...common} d="M535 440 H735 L790 490 V565 H535Z"/><circle {...common} cx="590" cy="565" r="48"/><circle {...common} cx="720" cy="565" r="48"/>
    <circle {...common} cx="650" cy="255" r="85"/><path d="M650 340 L650 520" {...common} fill="none"/>
    <path {...common} d="M70 575 Q250 520 430 575 Q610 520 830 575"/>
    <path d="M95 500 L95 575 M125 500 L125 575 M95 525 H125" {...common} fill="none" strokeWidth={5}/>
  </>;

  if (id === "ocean-scene") return <>
    <path d="M0 140 Q110 95 220 140 Q330 185 440 140 Q550 95 660 140 Q770 185 900 140" {...common} fill="none"/>
    <ellipse {...common} cx="300" cy="325" rx="145" ry="85"/><path {...common} d="M440 325 L535 250 L535 400Z"/>
    <circle cx="250" cy="300" r="9" fill="#111"/>
    <path {...common} d="M610 280 Q690 235 745 300 Q785 350 730 410 Q655 470 595 405 Q550 340 610 280Z"/>
    <circle cx="690" cy="315" r="8" fill="#111"/>
    <path d="M620 450 Q585 505 620 560 M675 455 Q650 515 675 570 M730 445 Q770 505 735 565" {...common} fill="none"/>
    <path {...common} d="M120 560 Q150 485 185 560 M195 560 Q225 470 255 560 M780 560 Q810 470 845 560"/>
    <circle {...common} cx="120" cy="250" r="18"/><circle {...common} cx="95" cy="210" r="11"/>
  </>;

  if (id === "castle-scene") return <>
    <rect {...common} x="250" y="270" width="400" height="300"/>
    <rect {...common} x="165" y="330" width="120" height="240"/><rect {...common} x="615" y="330" width="120" height="240"/>
    <path {...common} d="M150 330 L180 270 L210 330 L240 270 L270 330Z M600 330 L630 270 L660 330 L690 270 L720 330Z"/>
    <path {...common} d="M390 570 V430 Q450 365 510 430 V570Z"/>
    <rect {...common} x="320" y="330" width="70" height="70"/><rect {...common} x="510" y="330" width="70" height="70"/>
    <path d="M115 260 Q180 135 300 170 Q450 40 600 170 Q720 135 785 260" {...common} fill="none"/>
    <circle {...common} cx="115" cy="155" r="50"/>
    <path d="M60 155 H20 M170 155 H210 M115 100 V60" {...common} fill="none" strokeWidth={6}/>
  </>;

  return <>
    <circle {...common} cx="450" cy="245" r="62"/>
    {Array.from({length:10}).map((_,i)=>{const a=i*Math.PI/5;const x=450+Math.cos(a)*115;const y=245+Math.sin(a)*115;return <ellipse key={i} {...common} cx={x} cy={y} rx="40" ry="70" transform={`rotate(${i*36} ${x} ${y})`}/>})}
    <path {...common} d="M430 355 Q390 470 410 580 H490 Q510 470 470 355Z"/>
    <path d="M410 455 Q340 410 290 475 M490 455 Q560 410 610 475" {...common} fill="none"/>
    <path {...common} d="M170 575 Q220 505 270 575 Q320 500 370 575 Q420 500 470 575 Q520 500 570 575 Q620 500 690 575Z"/>
    <circle {...common} cx="220" cy="410" r="32"/><path d="M220 378 V330 M188 410 H145 M252 410 H295" {...common} fill="none" strokeWidth={5}/>
    <path {...common} d="M670 365 Q715 320 760 365 Q785 410 740 450 Q695 465 655 430 Q625 390 670 365Z"/>
  </>;
}

function VirtualPreschool() {
  const daySeed = useMemo(() => Math.floor(Date.now() / 86400000), []);

  const dailyChoices = useMemo(() => {
    const groups = ["2–3","4–5","5–6"] as const;
    return groups.flatMap((age, groupIndex) => {
      const group = DESIGNS.filter((d) => d.age === age);
      const start = (daySeed + groupIndex * 2) % group.length;
      return [group[start], group[(start + 3) % group.length]];
    });
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
    trackEvent("game_start", { game: "freehand_coloring", drawing: designId, age: current.age });
  }, [designId, current.age]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
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
              Επιλογές για παιδιά 2–6 ετών, από πολύ απλά σχέδια μέχρι πιο λεπτομερείς σκηνές για τα μεγαλύτερα παιδιά.
            </p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_330px] xl:items-start">
            <div className="min-w-0">
              <div className="print-area rounded-[2rem] border bg-white p-3 shadow-sm sm:p-5">
                <div className="relative mx-auto aspect-[900/650] w-full max-w-4xl overflow-hidden rounded-[1.4rem] bg-white">
                  <svg ref={svgRef} viewBox="0 0 900 650" className="absolute inset-0 h-full w-full" aria-label={`Σχέδιο: ${current.title}`}>
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

              <div className="mt-5 rounded-[2rem] border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-primary">{current.age} ετών · {current.level}</p>
                    <h2 className="mt-1 text-2xl font-black">{current.emoji} {current.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-primary"/>
                    <span className="text-sm font-black">Παλέτα</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setColor(c); setErasing(false); }}
                      aria-label={"Χρώμα " + c}
                      className={"h-11 w-11 rounded-full border-2 transition-transform " + (!erasing && color === c ? "scale-110 ring-2 ring-primary ring-offset-2" : "")}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[14,26,42].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBrushSize(size)}
                      className={"flex h-12 items-center justify-center rounded-xl border bg-background " + (brushSize === size ? "ring-2 ring-primary" : "")}
                    >
                      <span className="rounded-full bg-foreground" style={{ width: Math.max(8,size/2), height: Math.max(8,size/2) }}/>
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <Button type="button" variant={erasing ? "default" : "outline"} className="rounded-full" onClick={() => setErasing(v => !v)}>
                    <Eraser className="h-4 w-4"/>{erasing ? "Γόμα ενεργή" : "Γόμα"}
                  </Button>
                  <Button type="button" variant="outline" className="rounded-full" onClick={clearCanvas}>
                    <RotateCcw className="h-4 w-4"/>Καθάρισέ το
                  </Button>
                  <Button type="button" className="rounded-full" onClick={download}>
                    <Download className="h-4 w-4"/>Αποθήκευση
                  </Button>
                  <Button type="button" variant="secondary" className="rounded-full" onClick={print}>
                    <Printer className="h-4 w-4"/>Εκτύπωση
                  </Button>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border bg-card p-5 xl:sticky xl:top-24">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary"/>
                <div>
                  <h2 className="font-black">Σημερινές ζωγραφιές</h2>
                  <p className="text-xs text-muted-foreground">2 επιλογές από κάθε ηλικιακή ομάδα</p>
                </div>
              </div>

              {(["2–3","4–5","5–6"] as const).map((age) => (
                <div key={age} className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-black">{age} ετών</h3>
                    <span className="text-xs text-muted-foreground">
                      {age === "2–3" ? "Εύκολα" : age === "4–5" ? "Μεσαία" : "Πιο λεπτομερή"}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {dailyChoices.filter((item) => item.age === age).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => pickDesign(item.id)}
                        className={
                          "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all " +
                          (designId === item.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/15"
                            : "bg-background hover:border-primary/40")
                        }
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">{item.emoji}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black">{item.title}</span>
                          <span className="block text-xs text-muted-foreground">{item.level}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                Η λίστα αλλάζει κάθε μέρα αυτόματα. Τα σχέδια για 5–6 ετών έχουν περισσότερα στοιχεία και μικρότερες περιοχές για πιο απαιτητική ζωγραφική.
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
