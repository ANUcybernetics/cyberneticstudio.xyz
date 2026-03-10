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
    if (!data || !canvas || !width || !height) return;

    const phase = reducedMotion ? 0 : time.current;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const omega = (2 * Math.PI) / (data.resolvePeriod * 1000);
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

      const line = data.lines[i];

      for (let s = 0; s <= SAMPLES; s++) {
        const t = s / SAMPLES;
        const x = t * width;

        let fade = 1;
        if (t < EDGE_FADE) fade = t / EDGE_FADE;
        else if (t > 1 - EDGE_FADE) fade = (1 - t) / EDGE_FADE;

        let displacement = 0;
        for (let k = 0; k < line.coeffs.length; k++) {
          const { amp, phase: phi } = line.coeffs[k];
          const freq = k + 1;
          displacement +=
            amp *
            Math.cos(2 * Math.PI * freq * t + phi + freq * omega * phase);
        }

        const y = baseY + displacement * maxDisplacement * fade;

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
