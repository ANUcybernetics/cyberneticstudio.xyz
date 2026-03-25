<script>
  let { svg } = $props();
  let container = $state(null);
  let paths = $state([]);
  let centres = [];
  let mouse = $state({ x: -1000, y: -1000 });
  let raf = null;

  const RADIUS = 80;

  $effect(() => {
    if (!container) return;
    const wrapper = container.closest(".svg-hero-wrapper");
    const fallback = wrapper?.querySelector(".svg-hero-static");
    if (fallback) fallback.style.display = "none";

    const svgEl = container.querySelector("svg");
    if (!svgEl) return;
    const found = Array.from(svgEl.querySelectorAll("path"));
    paths = found;
    centres = found.map((p) => {
      const box = p.getBBox();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    });
    applyStyles();
  });

  function toSvgCoords(e) {
    const svgEl = container?.querySelector("svg");
    if (!svgEl) return { x: -1000, y: -1000 };
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    return { x: svgPt.x, y: svgPt.y };
  }

  function onMove(e) {
    mouse = toSvgCoords(e);
    if (!raf) {
      raf = requestAnimationFrame(() => {
        applyStyles();
        raf = null;
      });
    }
  }

  function onLeave() {
    mouse = { x: -1000, y: -1000 };
    applyStyles();
  }

  function applyStyles() {
    for (let i = 0; i < paths.length; i++) {
      const dx = centres[i].x - mouse.x;
      const dy = centres[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t = Math.max(0, 1 - dist / RADIUS);
      const opacity = 0.4 + t * 0.6;
      const scale = 1 + t * 0.8;
      const glow = t * 8;
      paths[i].style.opacity = opacity;
      paths[i].style.transform = `scale(${scale})`;
      if (glow > 0.1) {
        paths[i].style.filter = `drop-shadow(0 0 ${glow}px var(--color-accent))`;
      } else {
        paths[i].style.filter = "";
      }
    }
  }
</script>

<div
  class="svg-hero"
  role="img"
  bind:this={container}
  onmousemove={onMove}
  onmouseleave={onLeave}
>
  {@html svg}
</div>

<style>
  .svg-hero {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .svg-hero :global(svg) {
    width: 100%;
    height: 100%;
  }

  .svg-hero :global(path) {
    fill: var(--color-accent);
    opacity: 0.4;
    transform-origin: center;
    transform-box: fill-box;
    transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease;
  }
</style>
