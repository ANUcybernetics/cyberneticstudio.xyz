type FrameCallback = (time: number) => void;

const callbacks = new Set<FrameCallback>();
let frameId = 0;

function tick(time: number) {
  for (const cb of callbacks) cb(time);
  if (callbacks.size > 0) {
    frameId = requestAnimationFrame(tick);
  }
}

export function onFrame(callback: FrameCallback): () => void {
  callbacks.add(callback);
  if (callbacks.size === 1) {
    frameId = requestAnimationFrame(tick);
  }
  return () => {
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      cancelAnimationFrame(frameId);
    }
  };
}
