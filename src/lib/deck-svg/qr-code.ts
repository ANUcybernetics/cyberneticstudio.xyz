import { QR } from "@qrgrid/core";

const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
const MODULE_SIZE = 10;
const MARGIN = 40;

export function generateQrCode(url: string): string {
  const qr = new QR(url, { errorCorrection: "H" });
  const totalSize = qr.gridSize * MODULE_SIZE + MARGIN * 2;

  const rects: string[] = [];

  qr.data.forEach((bit: number, i: number) => {
    if (!bit) return;

    const row = Math.floor(i / qr.gridSize);
    const col = i % qr.gridSize;
    const x = col * MODULE_SIZE + MARGIN;
    const y = row * MODULE_SIZE + MARGIN;

    const isFinderPattern =
      (row < 7 && col < 7) ||
      (row < 7 && col >= qr.gridSize - 7) ||
      (row >= qr.gridSize - 7 && col < 7);

    const fill = isFinderPattern ? "#be830e" : "#ffffff";

    const baseDelay = ((i * PRIMES[i % PRIMES.length]) % 5000) / 1000;
    const interval = 8 + ((i * PRIMES[(i + 7) % PRIMES.length]) % 4000) / 1000;

    const colorName = isFinderPattern ? "qr-color-gold" : "qr-color-light";
    const colorDuration = isFinderPattern ? 8 : 10;
    const colorDelay = baseDelay + 1;

    const animation = [
      `qr-pulse ${interval}s cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay}s infinite`,
      `${colorName} ${colorDuration}s ease-in-out ${colorDelay}s infinite`,
    ].join(", ");

    rects.push(
      `<rect x="${x}" y="${y}" width="${MODULE_SIZE}" height="${MODULE_SIZE}" fill="${fill}" rx="5" ry="5" style="animation: ${animation}"/>`,
    );
  });

  const displayUrl = url.replace(/^https?:\/\/(www\.)?/, "");

  return `<div class="qr-code"><a href="${url}"><svg viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">\n${rects.join("\n")}\n</svg><span>${displayUrl}</span></a></div>`;
}
