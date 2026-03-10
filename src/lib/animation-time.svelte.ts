let current = $state(0);
let subscribers = 0;
let frameId = 0;

function tick(time: number) {
  current = time;
  frameId = requestAnimationFrame(tick);
}

export function useAnimationTime(): { readonly current: number } {
  $effect(() => {
    subscribers++;
    if (subscribers === 1) {
      frameId = requestAnimationFrame(tick);
    }
    return () => {
      subscribers--;
      if (subscribers === 0) {
        cancelAnimationFrame(frameId);
      }
    };
  });

  return {
    get current() {
      return current;
    },
  };
}
