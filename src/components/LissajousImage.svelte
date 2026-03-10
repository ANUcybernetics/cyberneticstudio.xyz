<script lang="ts">
  import { onFrame } from "../lib/animation-time.svelte";

  interface Coeff {
    k: number;
    re: number;
    im: number;
  }

  interface LissajousData {
    resolvePeriod: number;
    curves: { coeffs: Coeff[] }[];
  }

  let { src }: { src: string } = $props();

  let canvas: HTMLCanvasElement = null!;
  let width = $state(0);
  let height = $state(0);
  let data: LissajousData | null = $state(null);

  const SAMPLES = 400;
  const MAX_DRIFT = 25;

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
    const d = data;
    const c = canvas;
    const w = width;
    const h = height;
    if (!d || !c || !w || !h) return;

    if (reducedMotion) {
      draw(c, w, h, d, 0);
      return;
    }

    return onFrame((time) => draw(c, w, h, d, time));
  });

  function draw(
    c: HTMLCanvasElement,
    w: number,
    h: number,
    d: LissajousData,
    phase: number,
  ) {
    const dpr = window.devicePixelRatio || 1;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const periodMs = d.resolvePeriod * 1000;
    const cycleFrac = (phase % periodMs) / periodMs;
    const s = Math.sin(Math.PI * cycleFrac);
    const s2 = s * s;
    const s4 = s2 * s2;
    const driftAmount = s4 * s4;

    const numCurves = d.curves.length;

    for (let ci = 0; ci < numCurves; ci++) {
      const curve = d.curves[ci];
      const alpha = 0.6 * (1 - (ci / numCurves) * 0.5);
      const lineWidth = 1.2 * (1 - (ci / numCurves) * 0.4);
      const colorT = (Math.sin(2 * Math.PI * (ci / numCurves + cycleFrac * 1.5)) + 1) / 2;
      const r = 230 + 25 * colorT;
      const g = 255;
      const b = 68 + 187 * colorT;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = lineWidth;

      const coeffs = curve.coeffs;
      const n = coeffs.length;

      const rotRe = new Float64Array(n);
      const rotIm = new Float64Array(n);
      const stepCos = new Float64Array(n);
      const stepSin = new Float64Array(n);

      for (let j = 0; j < n; j++) {
        const { k, re, im } = coeffs[j];
        const absK = Math.abs(k);
        const timeAngle = Math.sign(k) * Math.sqrt(absK) * MAX_DRIFT * driftAmount;
        const cosT = Math.cos(timeAngle);
        const sinT = Math.sin(timeAngle);
        rotRe[j] = re * cosT - im * sinT;
        rotIm[j] = im * cosT + re * sinT;

        const stepAngle = (2 * Math.PI * k) / SAMPLES;
        stepCos[j] = Math.cos(stepAngle);
        stepSin[j] = Math.sin(stepAngle);
      }

      const curCos = new Float64Array(n).fill(1);
      const curSin = new Float64Array(n).fill(0);

      for (let s = 0; s <= SAMPLES; s++) {
        let px = 0;
        let py = 0;

        for (let j = 0; j < n; j++) {
          px += rotRe[j] * curCos[j] - rotIm[j] * curSin[j];
          py += rotIm[j] * curCos[j] + rotRe[j] * curSin[j];
        }

        const x = px * w;
        const y = py * h;

        if (s === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        if (s < SAMPLES) {
          for (let j = 0; j < n; j++) {
            const newCos = curCos[j] * stepCos[j] - curSin[j] * stepSin[j];
            const newSin = curSin[j] * stepCos[j] + curCos[j] * stepSin[j];
            curCos[j] = newCos;
            curSin[j] = newSin;
          }
        }
      }

      ctx.stroke();
    }
  }
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
