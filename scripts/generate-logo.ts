import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "logo");
mkdirSync(OUT, { recursive: true });

const fontPath = join(ROOT, "public", "fonts", "space-grotesk-latin.woff2");
const fontBase64 = readFileSync(fontPath).toString("base64");

const LINE_COUNT = 25;
const FREQ1 = 1.5;
const FREQ2 = 2.7;
const RIBBON_SPREAD = 0.6;
const PHASE_STAGGER = 2.0;
const SAMPLES = 200;
const EDGE_FADE = 0.12;

const PHASE1 = 0.63;
const PHASE2 = 0.97;

interface PathData {
  d: string;
  alpha: number;
  lineWidth: number;
}

function spineY(t: number, phase1: number, phase2: number, height: number): number {
  const amp = height * 0.3;
  return (
    height / 2 +
    amp * 0.6 * Math.sin(FREQ1 * t * Math.PI * 2 + phase1) +
    amp * 0.4 * Math.sin(FREQ2 * t * Math.PI * 2 + phase2)
  );
}

function edgeAlpha(t: number): number {
  if (t < EDGE_FADE) return t / EDGE_FADE;
  if (t > 1 - EDGE_FADE) return (1 - t) / EDGE_FADE;
  return 1;
}

function generatePaths(width: number, height: number): PathData[] {
  const paths: PathData[] = [];

  for (let line = 0; line < LINE_COUNT; line++) {
    const normalised = (line - (LINE_COUNT - 1) / 2) / ((LINE_COUNT - 1) / 2);
    const offset = normalised * height * RIBBON_SPREAD * 0.5;
    const distFromCentre = Math.abs(normalised);
    const alpha = (1 - distFromCentre * 0.8) * 0.7;
    const lineWidth = 1.5 * (1 - distFromCentre * 0.6);
    const linePhase = normalised * PHASE_STAGGER;

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const x = t * width;
      const y0 = spineY(t, PHASE1 + linePhase, PHASE2 + linePhase * 0.7, height);

      const dt = 0.001;
      const y1 = spineY(t + dt, PHASE1 + linePhase, PHASE2 + linePhase * 0.7, height);
      const dx = dt * width;
      const dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;

      const fade = edgeAlpha(t);
      const perpOffset = offset * fade;

      points.push({ x: x + nx * perpOffset, y: y0 + ny * perpOffset });
    }

    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" ");
    paths.push({ d, alpha, lineWidth });
  }

  return paths;
}

function svgLissajous(width: number, height: number): string {
  const paths = generatePaths(width, height);
  return paths
    .map(
      (p) =>
        `<path d="${p.d}" fill="none" stroke="rgba(230,255,68,${p.alpha})" stroke-width="${p.lineWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("\n    ");
}

function fontStyle(): string {
  return `
    @font-face {
      font-family: 'Space Grotesk';
      src: url('data:font/woff2;base64,${fontBase64}') format('woff2');
      font-weight: 300 700;
      font-style: normal;
    }`;
}

function svgNoText(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#0d0d0d"/>
  <g>
    ${svgLissajous(size, size)}
  </g>
</svg>`;
}

function svgWithText(size: number): string {
  const fontSize = size * 0.1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <style>${fontStyle()}</style>
  </defs>
  <rect width="${size}" height="${size}" fill="#0d0d0d"/>
  <g>
    ${svgLissajous(size, size)}
  </g>
  <text x="${size / 2}" y="${size / 2}" text-anchor="middle" dominant-baseline="central"
    font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700"
    font-size="${fontSize}" fill="white"
    stroke="#0d0d0d" stroke-width="${fontSize * 0.05}" paint-order="stroke fill"
  >Cybernetic Studio</text>
</svg>`;
}

function svgTextBeside(width: number, height: number): string {
  const lissW = height;
  const textX = lissW + (width - lissW) / 2;
  const fontSize = height * 0.12;
  const lineHeight = fontSize * 1.3;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>${fontStyle()}</style>
  </defs>
  <rect width="${width}" height="${height}" fill="#0d0d0d"/>
  <g>
    ${svgLissajous(lissW, height)}
  </g>
  <text x="${textX}" y="${height / 2 - lineHeight * 0.35}" text-anchor="middle" dominant-baseline="central"
    font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700"
    font-size="${fontSize}" fill="white"
  >Cybernetic</text>
  <text x="${textX}" y="${height / 2 + lineHeight * 0.65}" text-anchor="middle" dominant-baseline="central"
    font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700"
    font-size="${fontSize}" fill="white"
  >Studio</text>
</svg>`;
}

function svgFavicon(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#0d0d0d"/>
  <g>
    ${svgLissajous(size, size)}
  </g>
</svg>`;
}

async function writeVariant(name: string, svgContent: string, pngWidth: number, pngHeight: number): Promise<void> {
  const svgPath = join(OUT, `${name}.svg`);
  writeFileSync(svgPath, svgContent);
  console.log(`wrote ${svgPath}`);

  const avifPath = join(OUT, `${name}.avif`);
  await sharp(Buffer.from(svgContent))
    .resize(pngWidth, pngHeight)
    .avif({ quality: 80 })
    .toFile(avifPath);
  console.log(`wrote ${avifPath}`);
}

const SIZE = 512;
const WIDE_W = 1024;
const WIDE_H = 512;

await writeVariant("lissajous", svgNoText(SIZE), SIZE, SIZE);
await writeVariant("lissajous-text", svgWithText(SIZE), SIZE, SIZE);
await writeVariant("lissajous-text-beside", svgTextBeside(WIDE_W, WIDE_H), WIDE_W, WIDE_H);

const faviconSvg = svgFavicon(128);
writeFileSync(join(ROOT, "public", "favicon.svg"), faviconSvg);
console.log("wrote public/favicon.svg");

const faviconPng = await sharp(Buffer.from(svgFavicon(256)))
  .resize(32, 32)
  .png()
  .toBuffer();
await sharp(faviconPng).toFile(join(ROOT, "public", "favicon.ico"));
console.log("wrote public/favicon.ico");

console.log("\ndone!");
