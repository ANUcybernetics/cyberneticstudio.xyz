import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const IMAGE_WIDTH = 384;
const IMAGE_HEIGHT = 128;
const BLUR_SIGMA = 1.5;
const THRESHOLDS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
const MIN_CONTOUR_POINTS = 20;
const COEFFS_PER_CURVE = 250;
const MAX_CURVES_IMAGE = 15;
const MAX_CURVES_TEXT = 50;

const FONT_PATH = resolve(import.meta.dirname, "../public/fonts/space-grotesk-latin.woff2");

type Point = [number, number];

const EDGE_TABLE: [number, number][][] = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[1, 0]],
  [[1, 0], [3, 2]],
  [[0, 2]],
  [[3, 0]],
  [[0, 3]],
  [[0, 2]],
  [[0, 1], [2, 3]],
  [[0, 1]],
  [[1, 3]],
  [[1, 2]],
  [[2, 3]],
  [],
];

const clamp = (v: number) => Math.max(0, Math.min(1, v));

function edgePoint(
  edge: number,
  row: number,
  col: number,
  tl: number,
  tr: number,
  br: number,
  bl: number,
  threshold: number,
): Point {
  switch (edge) {
    case 0: {
      const t = clamp((threshold - tl) / (tr - tl || 1e-10));
      return [col + t, row];
    }
    case 1: {
      const t = clamp((threshold - tr) / (br - tr || 1e-10));
      return [col + 1, row + t];
    }
    case 2: {
      const t = clamp((threshold - bl) / (br - bl || 1e-10));
      return [col + t, row + 1];
    }
    case 3: {
      const t = clamp((threshold - tl) / (bl - tl || 1e-10));
      return [col, row + t];
    }
    default:
      return [0, 0];
  }
}

function marchingSquares(
  pixels: Float64Array,
  w: number,
  h: number,
  threshold: number,
): Point[][] {
  const segments: [Point, Point][] = [];

  for (let row = 0; row < h - 1; row++) {
    for (let col = 0; col < w - 1; col++) {
      const tl = pixels[row * w + col];
      const tr = pixels[row * w + col + 1];
      const br = pixels[(row + 1) * w + col + 1];
      const bl = pixels[(row + 1) * w + col];

      const idx =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0);

      for (const [e1, e2] of EDGE_TABLE[idx]) {
        segments.push([
          edgePoint(e1, row, col, tl, tr, br, bl, threshold),
          edgePoint(e2, row, col, tl, tr, br, bl, threshold),
        ]);
      }
    }
  }

  return chainSegments(segments);
}

const pointKey = (p: Point) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`;

function chainSegments(segments: [Point, Point][]): Point[][] {
  const adj = new Map<string, { point: Point; neighbors: string[] }>();

  for (const [p1, p2] of segments) {
    const k1 = pointKey(p1);
    const k2 = pointKey(p2);
    if (!adj.has(k1)) adj.set(k1, { point: p1, neighbors: [] });
    if (!adj.has(k2)) adj.set(k2, { point: p2, neighbors: [] });
    adj.get(k1)!.neighbors.push(k2);
    adj.get(k2)!.neighbors.push(k1);
  }

  const visited = new Set<string>();
  const contours: Point[][] = [];

  for (const [startKey] of adj) {
    if (visited.has(startKey)) continue;
    const contour: Point[] = [];
    let currentKey = startKey;

    while (!visited.has(currentKey)) {
      visited.add(currentKey);
      contour.push(adj.get(currentKey)!.point);
      const next = adj.get(currentKey)!.neighbors.find((n) => !visited.has(n));
      if (!next) break;
      currentKey = next;
    }

    if (contour.length >= MIN_CONTOUR_POINTS) {
      contours.push(contour);
    }
  }

  return contours;
}

function complexDFT(
  points: Point[],
  maxCoeffs: number,
): { k: number; re: number; im: number }[] {
  const N = points.length;
  const maxK = Math.min(Math.floor(N / 2), maxCoeffs * 2);
  const raw: { k: number; re: number; im: number; mag: number }[] = [];

  for (let k = -maxK; k <= maxK; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      re += points[n][0] * cos - points[n][1] * sin;
      im += points[n][0] * sin + points[n][1] * cos;
    }
    re /= N;
    im /= N;
    raw.push({ k, re, im, mag: Math.sqrt(re * re + im * im) });
  }

  raw.sort((a, b) => b.mag - a.mag);
  return raw.slice(0, maxCoeffs).map(({ k, re, im }) => ({
    k,
    re: +re.toFixed(6),
    im: +im.toFixed(6),
  }));
}

async function renderText(text: string): Promise<Buffer> {
  const fontData = readFileSync(FONT_PATH);
  const fontBase64 = fontData.toString("base64");

  const svgWidth = 1200;
  const svgHeight = 400;
  const fontSize = Math.min(200, Math.floor(svgWidth / (text.length * 0.55)));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
  <defs>
    <style>
      @font-face {
        font-family: "Space Grotesk";
        src: url("data:font/woff2;base64,${fontBase64}") format("woff2");
        font-weight: 700;
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="black"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="central"
        font-family="Space Grotesk" font-weight="700" font-size="${fontSize}"
        fill="white">${escapeXml(text)}</text>
</svg>`;

  return Buffer.from(svg);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function processPixels(
  pixels: Float64Array,
  width: number,
  height: number,
  outputPath: string,
  maxCurves: number,
): Promise<void> {
  const allContours: Point[][] = [];
  for (const threshold of THRESHOLDS) {
    allContours.push(...marchingSquares(pixels, width, height, threshold));
  }

  allContours.sort((a, b) => b.length - a.length);
  const selected = allContours.slice(0, maxCurves);

  const curves = selected.map((contour) => {
    const normalized: Point[] = contour.map(([x, y]) => [x / width, y / height]);
    const numCoeffs = Math.min(COEFFS_PER_CURVE, Math.floor(contour.length / 2));
    return { coeffs: complexDFT(normalized, numCoeffs) };
  });

  const resolvePeriod = 10 + Math.random() * 5;
  const output = {
    resolvePeriod: +resolvePeriod.toFixed(2),
    curves,
  };

  writeFileSync(outputPath, JSON.stringify(output));
  console.log(
    `wrote ${outputPath}: ${curves.length} curves from ${allContours.length} total (${width}x${height})`,
  );
}

async function processImage(
  imagePath: string,
  outputPath: string,
): Promise<void> {
  const { data, info } = await sharp(imagePath)
    .grayscale()
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover" })
    .blur(BLUR_SIGMA)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Float64Array(width * height);
  for (let i = 0; i < data.length; i++) {
    pixels[i] = data[i] / 255;
  }

  await processPixels(pixels, width, height, outputPath, MAX_CURVES_IMAGE);
}

async function processText(
  text: string,
  outputPath: string,
): Promise<void> {
  const svgBuffer = await renderText(text);
  const { data, info } = await sharp(svgBuffer)
    .grayscale()
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "fill" })
    .blur(BLUR_SIGMA)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Float64Array(width * height);
  for (let i = 0; i < data.length; i++) {
    pixels[i] = data[i] / 255;
  }

  await processPixels(pixels, width, height, outputPath, MAX_CURVES_TEXT);
}

const args = process.argv.slice(2);

if (args[0] === "--text") {
  const text = args[1];
  const outputPath = args[2];
  if (!text || !outputPath) {
    console.error(
      "Usage: npx tsx scripts/generate-lissajous-2d.ts --text <title> <output.json>",
    );
    process.exit(1);
  }
  await processText(text, outputPath);
} else {
  const imagePath = args[0];
  const outputPath = args[1];
  if (!imagePath || !outputPath) {
    console.error(
      "Usage: npx tsx scripts/generate-lissajous-2d.ts <image> <output.json>\n" +
      "       npx tsx scripts/generate-lissajous-2d.ts --text <title> <output.json>",
    );
    process.exit(1);
  }
  await processImage(imagePath, outputPath);
}
