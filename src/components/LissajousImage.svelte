<script lang="ts">
  import { onMount } from "svelte";

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
  let ctx: CanvasRenderingContext2D;
  let width = $state(0);
  let height = $state(0);
  let data: LissajousData | null = $state(null);
  let animationId: number;
  let reducedMotion = $state(false);

  const SAMPLES = 200;
  const EDGE_FADE = 0.12;
  const DISPLACEMENT_SCALE = 0.35;

  function edgeAlpha(t: number): number {
    if (t < EDGE_FADE) return t / EDGE_FADE;
    if (t > 1 - EDGE_FADE) return (1 - t) / EDGE_FADE;
    return 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time: number) {
    if (!data) return;

    const omega = (2 * Math.PI) / (data.resolvePeriod * 1000);
    const phase = reducedMotion ? 0 : time;

    ctx.clearRect(0, 0, width, height);

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

      if (distFromCentre < 0.15) {
        ctx.shadowColor = "rgba(230, 255, 68, 0.4)";
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      const line = data.lines[i];

      for (let s = 0; s <= SAMPLES; s++) {
        const t = s / SAMPLES;
        const x = t * width;
        const fade = edgeAlpha(t);

        let displacement = 0;
        for (let k = 0; k < line.coeffs.length; k++) {
          const { amp, phase: phi } = line.coeffs[k];
          const freq = k + 1;
          displacement +=
            amp * Math.cos(2 * Math.PI * freq * t + phi + freq * omega * phase);
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

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    if (!reducedMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  onMount(async () => {
    ctx = canvas.getContext("2d")!;
    reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (!reducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion && data) {
        draw(0);
      }
    });
    observer.observe(canvas);

    const response = await fetch(src);
    data = await response.json();

    resize();
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
