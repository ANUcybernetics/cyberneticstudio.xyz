<script lang="ts">
  import { onFrame } from "../lib/animation-time";

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

  const BASE_SAMPLES = 400;
  const MAX_DRIFT = 25;
  const PHI_FRACT = 0.6180339887;

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

    const samples = Math.max(BASE_SAMPLES, Math.round(w * 0.5));
    const periodMs = d.resolvePeriod * 1000;

    const numCurves = d.curves.length;

    for (let ci = 0; ci < numCurves; ci++) {
      const curve = d.curves[ci];
      const alpha = 0.6 * (1 - (ci / numCurves) * 0.5);
      const lineWidth = 1.2 * (1 - (ci / numCurves) * 0.4);

      const curvePeriodScale = 0.7 + 0.6 * ((ci * PHI_FRACT) % 1);
      const curveCycleFrac = (phase % (periodMs * curvePeriodScale)) / (periodMs * curvePeriodScale);

      const colorT = (Math.sin(2 * Math.PI * (ci / numCurves + curveCycleFrac * 1.5)) + 1) / 2;
      const r = 230 + 10 * colorT;
      const g = 255;
      const b = 68 + 52 * colorT;

      const curveS = Math.sin(Math.PI * curveCycleFrac);
      const curveS2 = curveS * curveS;
      const curveS4 = curveS2 * curveS2;
      const curveDrift = curveS4 * curveS4;

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
        const timeAngle = Math.sign(k) * Math.sqrt(absK) * MAX_DRIFT * curveDrift;
        const cosT = Math.cos(timeAngle);
        const sinT = Math.sin(timeAngle);
        rotRe[j] = re * cosT - im * sinT;
        rotIm[j] = im * cosT + re * sinT;

        const stepAngle = (2 * Math.PI * k) / samples;
        stepCos[j] = Math.cos(stepAngle);
        stepSin[j] = Math.sin(stepAngle);
      }

      const curCos = new Float64Array(n).fill(1);
      const curSin = new Float64Array(n).fill(0);

      for (let si = 0; si <= samples; si++) {
        let px = 0;
        let py = 0;

        for (let j = 0; j < n; j++) {
          px += rotRe[j] * curCos[j] - rotIm[j] * curSin[j];
          py += rotIm[j] * curCos[j] + rotRe[j] * curSin[j];
        }

        const x = px * w;
        const y = py * h;

        if (si === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        if (si < samples) {
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
