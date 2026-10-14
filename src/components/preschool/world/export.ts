import { AGES, MINUTES, type Age, type Domain } from "./content";
export function download(blob: Blob, name: string) {
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 10000);
}
export async function makePdf(
  title: string,
  lines: string[],
  drawing?: string,
  grayscale = false,
  size: "A4" | "A5" = "A4",
  template?: "leaf" | "shapes",
) {
  const [{ PDFDocument, rgb }, fontkit] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit"),
  ]);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit.default);
  const res = await fetch("/preschool-world/greek.ttf");
  if (!res.ok) throw new Error("Δεν φορτώθηκε η ελληνική γραμματοσειρά.");
  const font = await pdf.embedFont(await res.arrayBuffer(), { subset: true });
  const dimensions: [number, number] =
    size === "A4" ? [595.28, 841.89] : [419.53, 595.28];
  let page = pdf.addPage(dimensions),
    y = dimensions[1] - 45;
  const width = dimensions[0] - 80;
  const color = grayscale ? rgb(0.1, 0.1, 0.1) : rgb(0.22, 0.31, 0.28);
  const write = (line: string, sz = 12) => {
    const words = line.split(/\s+/);
    let row = "";
    for (const w of words) {
      if (font.widthOfTextAtSize(row + " " + w, sz) > width && row) {
        if (y < 55) {
          page = pdf.addPage(dimensions);
          y = dimensions[1] - 45;
        }
        page.drawText(row, { x: 40, y, font, size: sz, color });
        y -= sz * 1.6;
        row = w;
      } else row += (row ? " " : "") + w;
    }
    if (y < 55) {
      page = pdf.addPage(dimensions);
      y = dimensions[1] - 45;
    }
    page.drawText(row, { x: 40, y, font, size: sz, color });
    y -= sz * 1.6;
  };
  write("ΠΙΣΙΠΟΥΚ · Παίζω, μαθαίνω, δημιουργώ", 10);
  y -= 15;
  write(title, 20);
  y -= 10;
  for (const line of lines) {
    write(line);
    y -= 8;
  }
  if (drawing) {
    if (grayscale) {
      const source = new Image();
      source.src = drawing;
      await source.decode();
      const c = document.createElement("canvas");
      c.width = source.width;
      c.height = source.height;
      const x = c.getContext("2d")!;
      x.drawImage(source, 0, 0);
      const pixels = x.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const g = Math.round(
          pixels.data[i] * 0.2126 +
            pixels.data[i + 1] * 0.7152 +
            pixels.data[i + 2] * 0.0722,
        );
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = g;
      }
      x.putImageData(pixels, 0, 0);
      drawing = c.toDataURL("image/png");
    }
    const img = await pdf.embedPng(drawing);
    const h = Math.min(300, (width * img.height) / img.width);
    if (y - h < 45) {
      page = pdf.addPage(dimensions);
      y = dimensions[1] - 45;
    }
    page.drawImage(img, { x: 40, y: y - h, width, height: h });
  } else {
    if (y < 220) {
      page = pdf.addPage(dimensions);
      y = dimensions[1] - 45;
    }
    write("Η δική μου ιδέα — ζωγραφίζω εδώ:", 11);
    page.drawRectangle({
      x: 40,
      y: Math.max(45, y - 180),
      width,
      height: 170,
      borderWidth: 1,
      borderColor: rgb(0.5, 0.5, 0.5),
    });
  }
  if (template) {
    page = pdf.addPage(dimensions);
    y = dimensions[1] - 45;
    write(
      template === "leaf"
        ? "Πατρόν: Το μεγάλο φύλλο"
        : "Πατρόν: Σχήματα για να δημιουργήσω",
      18,
    );
    write("Χρωματίζω. Ο ενήλικος κόβει τα μεγάλα περιγράμματα.", 10);
    if (template === "leaf") {
      const scale = size === "A4" ? 1 : 0.68;
      page.drawSvgPath(
        "M 0 0 C -160 90 -135 290 0 340 C 135 290 160 90 0 0 Z M 0 0 L 0 365 M 0 120 L -95 80 M 0 190 L 90 140 M 0 260 L -85 210",
        {
          x: dimensions[0] / 2,
          y: y - 35,
          scale,
          borderWidth: 2,
          borderColor: rgb(0.2, 0.2, 0.2),
        },
      );
    } else {
      page.drawCircle({
        x: dimensions[0] / 2,
        y: y - 100,
        size: 60,
        borderWidth: 2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });
      page.drawRectangle({
        x: dimensions[0] / 2 - 60,
        y: y - 275,
        width: 120,
        height: 120,
        borderWidth: 2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });
    }
  }
  for (const p of pdf.getPages())
    p.drawText(
      "www.pisipouk.com · Με τον δικό σου ρυθμό. Με την παρουσία ενηλίκου.",
      { x: 40, y: 22, font, size: 7, color },
    );
  return new Blob([new Uint8Array(await pdf.save())], {
    type: "application/pdf",
  });
}
export function domainLines(d: Domain, age: Age) {
  const t = d.tasks[age];
  return [
    `Ηλικία: ${AGES[age]} ετών · ${MINUTES[age]} λεπτά · Παρουσία ενηλίκου`,
    `Στόχος: ${d.objective}`,
    `Αποστολή: ${t.title}`,
    t.prompt,
    ...t.options.map((v, i) => `${i + 1}. ${v}`),
    `Υλικά: ${d.supplies}`,
    ...d.steps.map((s, i) => `Βήμα ${i + 1}: ${s}`),
    `Εκτός οθόνης: ${d.offline}`,
    "Ασφάλεια: Ο ενήλικος ελέγχει τα υλικά και βοηθά. Όχι μικρά κομμάτια για μικρά παιδιά.",
    "Ενθάρρυνση: Μου άρεσε που δοκίμασες μια δική σου ιδέα!",
  ];
}
