import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SAMPLE_WIDTH = 256;
const LINE_COUNT = 25;
const COEFF_COUNT = 20;

interface CoeffData {
  amp: number;
  phase: number;
}

interface LissajousImageData {
  lineCount: number;
  coeffCount: number;
  resolvePeriod: number;
  lines: { coeffs: CoeffData[] }[];
}

async function processImage(
  imagePath: string,
  outputPath: string,
): Promise<void> {
  const { data, info } = await sharp(imagePath)
    .grayscale()
    .resize(SAMPLE_WIDTH)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const lines: { coeffs: CoeffData[] }[] = [];

  for (let i = 0; i < LINE_COUNT; i++) {
    const rowY = Math.min(
      Math.round(((i + 0.5) / LINE_COUNT) * height),
      height - 1,
    );
    const row = new Float64Array(width);

    for (let x = 0; x < width; x++) {
      row[x] = (data[rowY * width + x] / 255) * 2 - 1;
    }

    const coeffs: CoeffData[] = [];
    for (let k = 1; k <= COEFF_COUNT; k++) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < width; n++) {
        const angle = (2 * Math.PI * k * n) / width;
        re += row[n] * Math.cos(angle);
        im -= row[n] * Math.sin(angle);
      }
      const amp = (2 * Math.sqrt(re * re + im * im)) / width;
      const phase = Math.atan2(im, re);
      coeffs.push({ amp: +amp.toFixed(6), phase: +phase.toFixed(4) });
    }

    lines.push({ coeffs });
  }

  const resolvePeriod = 5 + Math.random() * 5;
  const output: LissajousImageData = {
    lineCount: LINE_COUNT,
    coeffCount: COEFF_COUNT,
    resolvePeriod: +resolvePeriod.toFixed(2),
    lines,
  };
  writeFileSync(outputPath, JSON.stringify(output));
  console.log(`wrote ${outputPath} (from ${width}x${height} image)`);
}

const [imagePath, outputPath] = process.argv.slice(2);
if (!imagePath || !outputPath) {
  console.error(
    "Usage: npx tsx scripts/generate-lissajous-image.ts <image> <output.json>",
  );
  process.exit(1);
}

await processImage(imagePath, outputPath);
