<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const glowing = ref(false);

function increment() {
  count.value++;
  glowing.value = true;
  setTimeout(() => {
    glowing.value = false;
  }, 300);
}
</script>

<template>
  <div class="experiment">
    <h1 :class="{ glow: glowing }">Hello World</h1>
    <p>This is a Vue SPA experiment running client-side only.</p>
    <button @click="increment">
      Count: {{ count }}
    </button>
  </div>
</template>

<style scoped>
.experiment {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--color-accent);
  transition: text-shadow 300ms ease;
}

.glow {
  text-shadow: var(--glow-accent-strong);
}

p {
  color: var(--color-fg-muted);
}

button {
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.75rem 2rem;
  border: 1px solid var(--color-accent);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  transition: box-shadow 300ms ease, background-color 300ms ease;
}

button:hover {
  box-shadow: var(--glow-accent);
  background: rgba(204, 255, 0, 0.05);
}
</style>
