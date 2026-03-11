import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { deckPreprocessor } from "astromotion";

const preprocess = deckPreprocessor();

const DECKS_DIR = resolve(import.meta.dirname, "../../src/decks");

function deckFiles(): { slug: string; file: string; path: string }[] {
  const dirs = readdirSync(DECKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "assets")
    .map((d) => d.name);

  const results: { slug: string; file: string; path: string }[] = [];
  for (const slug of dirs) {
    const dirPath = resolve(DECKS_DIR, slug);
    for (const f of readdirSync(dirPath)) {
      if (f.endsWith(".deck.svelte")) {
        results.push({ slug, file: f, path: resolve(dirPath, f) });
      }
    }
  }
  return results;
}

async function processDeckFile(deckPath: string): Promise<string> {
  const content = readFileSync(deckPath, "utf-8");
  const result = await preprocess.markup!({ content, filename: deckPath });
  return result!.code;
}

describe("deck preprocessor integration", () => {
  for (const { slug, file, path } of deckFiles()) {
    describe(`${slug}/${file}`, () => {
      let output: string;

      it("processes without error", async () => {
        output = await processDeckFile(path);
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
