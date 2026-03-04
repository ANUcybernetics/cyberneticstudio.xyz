<script lang="ts">
  import type { Component } from "svelte";

  interface Props {
    slug: string;
  }

  const { slug }: Props = $props();

  const modules = import.meta.glob<{ default: Component }>("/src/decks/*/slides.svelte");

  let Deck: Component | undefined = $state();

  const path = `/src/decks/${slug}/slides.svelte`;
  const loader = modules[path];
  if (loader) {
    loader().then((m) => {
      Deck = m.default;
    });
  }
</script>

{#if Deck}
  <Deck />
{/if}
