<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width = $state(0);
  let height = $state(0);
  let animationId: number;
  let reducedMotion = $state(false);

  const LINE_COUNT = 25;
  const FREQ1 = 1.5;
  const FREQ2 = 2.7;
  const PHASE_SPEED1 = 0.15;
  const PHASE_SPEED2 = 0.23;
  const RIBBON_SPREAD = 0.6;
  const PHASE_STAGGER = 2.0;
  const SAMPLES = 200;
  const EDGE_FADE = 0.12;

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

  function spineY(t: number, phase1: number, phase2: number): number {
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

  function draw(time: number) {
    const phase1 = reducedMotion ? 0 : time * 0.001 * PHASE_SPEED1;
    const phase2 = reducedMotion ? 0.5 : time * 0.001 * PHASE_SPEED2;

    ctx.clearRect(0, 0, width, height);

    for (let line = 0; line < LINE_COUNT; line++) {
      const normalised = (line - (LINE_COUNT - 1) / 2) / ((LINE_COUNT - 1) / 2);
      const offset = normalised * height * RIBBON_SPREAD * 0.5;
      const distFromCentre = Math.abs(normalised);

      const alpha = (1 - distFromCentre * 0.8) * 0.7;
      const lineWidth = 1.5 * (1 - distFromCentre * 0.6);

      const isCentre = distFromCentre < 0.15;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(230, 255, 68, ${alpha})`;
      ctx.lineWidth = lineWidth;

      if (isCentre) {
        ctx.shadowColor = "rgba(230, 255, 68, 0.4)";
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      const linePhase = normalised * PHASE_STAGGER;

      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const x = t * width;
        const y0 = spineY(t, phase1 + linePhase, phase2 + linePhase * 0.7);

        const dt = 0.001;
        const y1 = spineY(t + dt, phase1 + linePhase, phase2 + linePhase * 0.7);
        const dx = dt * width;
        const dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;

        const fade = edgeAlpha(t);
        const perpOffset = offset * fade;

        const px = x + nx * perpOffset;
        const py = y0 + ny * perpOffset;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.globalAlpha = 1;
      ctx.stroke();
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    if (!reducedMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      if (reducedMotion) {
        draw(0);
      }
    });
    observer.observe(canvas);

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
