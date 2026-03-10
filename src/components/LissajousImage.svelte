<script lang="ts">
  import { useAnimationTime } from "../lib/animation-time.svelte";

  interface CoeffData {
    amp: number;
    phase: number;
  }

  interface LissajousData {
    lineCount: number;
    coeffCount: number;
    resolvePeriod: number;
    lines: { coeffs: CoeffData[] }[];
  }

  let { src }: { src: string } = $props();

  let canvas: HTMLCanvasElement = null!;
  let width = $state(0);
  let height = $state(0);
  let data: LissajousData | null = $state(null);

  const time = useAnimationTime();

  const SAMPLES = 200;
  const EDGE_FADE = 0.12;
  const DISPLACEMENT_SCALE = 0.35;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $effect(() => {
    fetch(src)
      .then((r) => r.json())
      .then((d: LissajousData) => (data = d));
  });

  $effect(() => {
    if (!canvas || !width || !height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  });

  $effect(() => {
    if (!data || !canvas || !width || !height) return;

    const phase = reducedMotion ? 0 : time.current;
    const dpr = window.devicePixelRatio || 1;

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const omega = (2 * Math.PI) / (data.resolvePeriod * 1000);
    const maxCoeffs = data.coeffCount;

    const cosOmega = new Float64Array(maxCoeffs);
    const sinOmega = new Float64Array(maxCoeffs);
    for (let k = 0; k < maxCoeffs; k++) {
      const angle = (k + 1) * omega * phase;
      cosOmega[k] = Math.cos(angle);
      sinOmega[k] = Math.sin(angle);
    }

    const baseCos = new Float64Array(SAMPLES + 1);
    const baseSin = new Float64Array(SAMPLES + 1);
    const fadeArr = new Float64Array(SAMPLES + 1);
    for (let s = 0; s <= SAMPLES; s++) {
      const t = s / SAMPLES;
      baseCos[s] = Math.cos(2 * Math.PI * t);
      baseSin[s] = Math.sin(2 * Math.PI * t);
      if (t < EDGE_FADE) fadeArr[s] = t / EDGE_FADE;
      else if (t > 1 - EDGE_FADE) fadeArr[s] = (1 - t) / EDGE_FADE;
      else fadeArr[s] = 1;
    }

    const lineSpacing = height / data.lineCount;
    const maxDisplacement = lineSpacing * DISPLACEMENT_SCALE;

    for (let i = 0; i < data.lineCount; i++) {
      const baseY = ((i + 0.5) / data.lineCount) * height;
      const normalised =
        (i - (data.lineCount - 1) / 2) / ((data.lineCount - 1) / 2);
      const distFromCentre = Math.abs(normalised);
      const alpha = (1 - distFromCentre * 0.8) * 0.7;
      const lineWidth = 1.5 * (1 - distFromCentre * 0.6);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(230, 255, 68, ${alpha})`;
      ctx.lineWidth = lineWidth;

      const coeffs = data.lines[i].coeffs;

      const aCos = new Float64Array(coeffs.length);
      const aSin = new Float64Array(coeffs.length);
      for (let k = 0; k < coeffs.length; k++) {
        const { amp, phase: phi } = coeffs[k];
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        aCos[k] = amp * (cosPhi * cosOmega[k] - sinPhi * sinOmega[k]);
        aSin[k] = amp * (sinPhi * cosOmega[k] + cosPhi * sinOmega[k]);
      }

      let prevCosF = 1;
      let prevSinF = 0;

      for (let s = 0; s <= SAMPLES; s++) {
        const x = (s / SAMPLES) * width;

        let cosF: number, sinF: number;
        if (s === 0) {
          cosF = 1;
          sinF = 0;
        } else {
          cosF = prevCosF * baseCos[1] - prevSinF * baseSin[1];
          sinF = prevSinF * baseCos[1] + prevCosF * baseSin[1];
        }
        prevCosF = cosF;
        prevSinF = sinF;

        let displacement = 0;
        let cosFk = cosF;
        let sinFk = sinF;
        for (let k = 0; k < coeffs.length; k++) {
          if (k > 0) {
            const newCos = cosFk * cosF - sinFk * sinF;
            const newSin = sinFk * cosF + cosFk * sinF;
            cosFk = newCos;
            sinFk = newSin;
          }
          displacement += aCos[k] * cosFk - aSin[k] * sinFk;
        }

        const y = baseY + displacement * maxDisplacement * fadeArr[s];

        if (s === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }
  });
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
