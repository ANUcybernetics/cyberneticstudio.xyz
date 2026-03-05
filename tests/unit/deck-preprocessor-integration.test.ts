import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { deckPreprocessor } from "../../src/lib/deck-preprocessor";

const preprocess = deckPreprocessor();

const DECKS_DIR = resolve(import.meta.dirname, "../../src/decks");

function deckDirs(): string[] {
  return readdirSync(DECKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "assets")
    .map((d) => d.name);
}

async function processDeck(slug: string): Promise<string> {
  const slidesPath = resolve(DECKS_DIR, slug, "slides.deck.svelte");
  const content = readFileSync(slidesPath, "utf-8");
  const result = await preprocess.markup!({ content, filename: slidesPath });
  return result!.code;
}

describe("deck preprocessor integration", () => {
  for (const slug of deckDirs()) {
    describe(slug, () => {
      let output: string;

      it("processes without error", async () => {
        output = await processDeck(slug);
        expect(output).toBeDefined();
      });

      it("wraps content in Presentation component", () => {
        expect(output).toContain("<Presentation");
        expect(output).toContain("</Presentation>");
      });

      it("produces at least one Slide", () => {
        const slideCount = (output.match(/<Slide/g) || []).length;
        expect(slideCount).toBeGreaterThanOrEqual(1);
      });

      it("includes a script block with auto-imports", () => {
        expect(output).toContain("<script");
        expect(output).toContain("@animotion/core");
        expect(output).toContain("@animotion/core/theme");
        expect(output).toContain("getPresentation");
      });

      it("includes the Reveal bridge", () => {
        expect(output).toContain("window.Reveal");
      });

      it("does not contain raw frontmatter", () => {
        expect(output).not.toMatch(/^---\n/m);
      });

      it("does not contain unprocessed HTML comments", () => {
        expect(output).not.toMatch(/<!--\s*_class:/);
        expect(output).not.toMatch(/<!--\s*notes:/);
      });
    });
  }
});

describe("example deck specifics", () => {
  let output: string;

  it("processes the example deck", async () => {
    output = await processDeck("example");
  });

  it("produces the expected number of slides", () => {
    const slideCount = (output.match(/<Slide/g) || []).length;
    expect(slideCount).toBe(12);
  });

  it("renders markdown content as HTML", () => {
    expect(output).toContain("<strong>Bold</strong>");
    expect(output).toContain("<em>italic</em>");
  });

  it("renders GFM tables", () => {
    expect(output).toContain("<table>");
    expect(output).toContain("<td>Supported</td>");
  });

  it("renders fenced code blocks as Code components", () => {
    expect(output).toContain('<Code code=');
    expect(output).toContain('lang="elixir"');
    expect(output).toContain("defmodule Greeter");
  });

  it("handles impact class", () => {
    expect(output).toContain('class="impact"');
  });

  it("handles banner class", () => {
    expect(output).toContain('class="banner"');
  });

  it("handles centered class", () => {
    expect(output).toContain('class="centered"');
  });

  it("generates logo slides", () => {
    expect(output).toContain('class="anu-logo"');
    expect(output).toContain('class="socy-logo"');
    expect(output).toContain('class="logo-svg"');
  });

  it("generates QR code", () => {
    expect(output).toContain('class="qr-code"');
    expect(output).toContain('href="https://cyberneticstudio.xyz/decks/example/"');
  });

  it("generates split layout for bg right image", () => {
    expect(output).toContain('class="split-layout"');
    expect(output).toContain('class="split-image"');
    expect(output).toContain('class="split-content"');
  });

  it("generates image imports for relative bg images", () => {
    expect(output).toContain("import __deckImg");
    expect(output).toContain("./assets/ben-swift.avif");
  });

  it("applies brightness filter to bg images", () => {
    expect(output).toContain("brightness(0.5)");
  });

  it("passes through animotion Action component", () => {
    expect(output).toContain("<Action");
    expect(output).toContain("<button>Increment</button>");
  });

  it("preserves user script content", () => {
    expect(output).toContain("let count = $state(0)");
  });
});

describe("llms-unplugged deck specifics", () => {
  let output: string;

  it("processes the llms-unplugged deck", async () => {
    output = await processDeck("llms-unplugged");
  });

  it("produces the expected number of slides", () => {
    const slideCount = (output.match(/<Slide/g) || []).length;
    expect(slideCount).toBe(22);
  });

  it("handles multiple bg image modifiers", () => {
    expect(output).toContain("brightness(0.3)");
  });

  it("handles bg contain images", () => {
    expect(output).toContain("background-size: contain");
  });

  it("generates imports for all relative images", () => {
    const importCount = (output.match(/import __deckImg\d+/g) || []).length;
    expect(importCount).toBeGreaterThanOrEqual(5);
  });

  it("handles blockquotes", () => {
    expect(output).toContain("<blockquote>");
  });

  it("renders the socy-logo slide", () => {
    expect(output).toContain('class="socy-logo"');
  });
});
