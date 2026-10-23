/**
 * Client-side export of existing first-party SVG artwork.
 * Rasterization preserves the Greek typography in the downloadable A4 PDF.
 */
export async function rasterizeSvg(url: string): Promise<HTMLCanvasElement> {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) throw new Error("Δεν ήταν διαθέσιμο το αρχείο εκτύπωσης.");
  const svg = await response.text();
  const file = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Δεν φορτώθηκε η εικόνα."));
      image.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || (url.includes("november") ? 3508 : 1240);
    canvas.height = image.naturalHeight || (url.includes("november") ? 2480 : 1754);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Ο browser δεν υποστηρίζει canvas.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
export async function downloadAsPng(url: string, filename: string) {
  const canvas = await rasterizeSvg(url);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Αδυναμία PNG.")), "image/png")
  );
  saveBlob(blob, filename);
}
export async function downloadAsPdf(url: string, filename: string, landscape = false) {
  const canvas = await rasterizeSvg(url);
  const { PDFDocument } = await import("pdf-lib");
  const png = canvas.toDataURL("image/png");
  const pdf = await PDFDocument.create();
  const width = landscape ? 841.89 : 595.28;
  const height = landscape ? 595.28 : 841.89;
  const page = pdf.addPage([width, height]);
  const embedded = await pdf.embedPng(png);
  page.drawImage(embedded, { x: 0, y: 0, width, height });
  const bytes = await pdf.save();
  saveBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), filename);
}
