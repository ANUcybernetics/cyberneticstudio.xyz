import { describe, it, expect } from "vitest";
import type { RootContent } from "mdast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { deckPreprocessor } from "astromotion";
import { extractBgImagesFromAst, replaceQrImagesInAst } from "astromotion/src/preprocessor.ts";

const parser = unified().use(remarkParse).use(remarkGfm);
function parseNodes(md: string): RootContent[] {
  return parser.parse(md).children;
}

const preprocess = deckPreprocessor();

async function process(content: string, filename = "/project/src/decks/test/slides.deck.svelte") {
  const result = await preprocess.markup!({ content, filename });
  return result?.code;
}

describe("deckPreprocessor", () => {
  describe("file filtering", () => {
    it("returns undefined for non-deck files", async () => {
      const result = await process("# Hello", "/project/src/components/Foo.svelte");
      expect(result).toBeUndefined();
    });

    it("returns undefined for non-deck svelte files in decks", async () => {
      const result = await process("# Hello", "/project/src/decks/test/helper.svelte");
      expect(result).toBeUndefined();
    });

    it("processes .deck.svelte files", async () => {
      const result = await process("# Hello");
      expect(result).toBeDefined();
      expect(result).toContain("<Presentation");
    });
  });

  describe("slide splitting", () => {
    it("wraps a single slide in Presentation + Slide", async () => {
      const result = await process("# Hello");
      expect(result).toContain("<Presentation");
      expect(result).toContain("<Slide>");
      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("</Slide>");
      expect(result).toContain("</Presentation>");
    });

    it("splits on --- into multiple slides", async () => {
      const result = await process("# One\n\n---\n\n# Two\n\n---\n\n# Three");
      const slideCount = (result!.match(/<Slide/g) || []).length;
      expect(slideCount).toBe(3);
    });

    it("skips empty sections", async () => {
      const result = await process("# One\n\n---\n\n---\n\n# Three");
      const slideCount = (result!.match(/<Slide/g) || []).length;
      expect(slideCount).toBe(2);
    });
  });

  describe("class extraction", () => {
    it("extracts <!-- _class: xxx --> as slide class", async () => {
      const result = await process("<!-- _class: title -->\n\n# Welcome");
      expect(result).toContain('class="title"');
    });

    it("handles multiple classes", async () => {
      const result = await process("<!-- _class: impact dark -->\n\n# Big Text");
      expect(result).toContain('class="impact dark"');
    });

    it("removes the class comment from slide content", async () => {
      const result = await process("<!-- _class: title -->\n\n# Welcome");
      expect(result).not.toContain("<!-- _class:");
    });
  });

  describe("notes extraction", () => {
    it("extracts <!-- notes: xxx --> into Notes component", async () => {
      const result = await process("# Slide\n\n<!-- notes: Speaker notes here -->");
      expect(result).toContain("<Notes>Speaker notes here</Notes>");
    });

    it("removes the notes comment from slide content", async () => {
      const result = await process("# Slide\n\n<!-- notes: Speaker notes here -->");
      expect(result).not.toContain("<!-- notes:");
    });
  });

  describe("markdown processing", () => {
    it("converts markdown to HTML", async () => {
      const result = await process("**bold** and *italic*");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
    });

    it("handles GFM tables", async () => {
      const md = "| A | B |\n| --- | --- |\n| 1 | 2 |";
      const result = await process(md);
      expect(result).toContain("<table>");
      expect(result).toContain("<td>1</td>");
    });

    it("handles GFM strikethrough", async () => {
      const result = await process("~~deleted~~");
      expect(result).toContain("<del>deleted</del>");
    });

    it("handles GFM task lists", async () => {
      const result = await process("- [x] Done\n- [ ] Todo");
      expect(result).toContain('type="checkbox"');
    });

    it("passes through inline HTML unchanged", async () => {
      const result = await process('<div class="custom">content</div>');
      expect(result).toContain('<div class="custom">content</div>');
    });

    it("handles fenced code blocks", async () => {
      const md = '## Example\n\n```python\ndef hello():\n    print("hello")\n```';
      const result = await process(md);
      expect(result).toContain("<Code");
      expect(result).toContain('lang="python"');
      expect(result).toContain('theme="poimandres"');
      expect(result).toContain("def hello()");
    });

    it("handles fenced code blocks with no language", async () => {
      const md = "```\nconst x = 1;\n```";
      const result = await process(md);
      expect(result).toContain("<Code");
      expect(result).toContain('lang="text"');
      expect(result).toContain("const x = 1;");
    });

    it("JSON-escapes code block content", async () => {
      const md = '```js\nconst x = { "key": `tmpl` };\n```';
      const result = await process(md);
      expect(result).toContain('<Code code={"const x = { \\"key\\": `tmpl` };"} lang="js"');
    });

    it("preserves order in mixed heading + code slides", async () => {
      const md = '## Title\n\n```python\nx = 1\n```\n\nSome text after';
      const result = await process(md);
      const slideContent = result!.split("<Slide>")[1]?.split("</Slide>")[0] || "";
      const h2Pos = slideContent.indexOf("<h2>");
      const codePos = slideContent.indexOf("<Code");
      const textPos = slideContent.indexOf("Some text after");
      expect(h2Pos).toBeLessThan(codePos);
      expect(codePos).toBeLessThan(textPos);
    });

    it("does not extract script tags inside fenced code blocks", async () => {
      const md = '## Example\n\n```html\n<script>\n  console.log("hi");\n</script>\n```';
      const result = await process(md);
      expect(result).toContain("<Code");
      const slideContent = result!.split("<Slide>")[1]?.split("</Slide>")[0] || "";
      expect(slideContent).toContain("console");
    });

    it("does not split slides on --- inside fenced code blocks", async () => {
      const md = '# Slide\n\n```yaml\nkey: value\n---\nother: stuff\n```';
      const result = await process(md);
      const slideCount = (result!.match(/<Slide/g) || []).length;
      expect(slideCount).toBe(1);
    });
  });

  describe("animotion component passthrough", () => {
    it("skips markdown processing for sections with <Action>", async () => {
      const content = '<Action do={() => count++}>\n  <button>Click</button>\n</Action>';
      const result = await process(content);
      expect(result).toContain("<Action");
      expect(result).toContain("<button>Click</button>");
    });

    it("skips markdown processing for sections with <Code>", async () => {
      const content = '<Code lang="ts" code={snippet} />';
      const result = await process(content);
      expect(result).toContain("<Code");
    });

    it("still processes markdown in other sections", async () => {
      const content = "# Markdown slide\n\n---\n\n<Action do={() => {}}>\n  <p>Interactive</p>\n</Action>";
      const result = await process(content);
      expect(result).toContain("<h1>Markdown slide</h1>");
      expect(result).toContain("<Action");
    });
  });

  describe("auto-imports", () => {
    it("adds imports when no script block exists", async () => {
      const result = await process("# Hello");
      expect(result).toContain('import { Presentation, Slide, Action, Code, Notes, Transition, getPresentation } from "@animotion/core"');
      expect(result).toContain('import "@animotion/core/theme"');
    });

    it("adds imports to existing script block", async () => {
      const content = '<script lang="ts">\n  let x = 1;\n</script>\n\n# Hello';
      const result = await process(content);
      expect(result).toContain("@animotion/core");
      expect(result).toContain("let x = 1;");
    });

    it("does not duplicate imports when already present", async () => {
      const content = '<script lang="ts">\n  import { Presentation, Slide } from "@animotion/core";\n  import "@animotion/core/theme";\n</script>\n\n# Hello';
      const result = await process(content);
      const coreMatches = result!.match(/@animotion\/core"/g) || [];
      expect(coreMatches.length).toBe(1);
    });
  });

  describe("bg image integration", () => {
    it("maps full-bleed bg to slide-bg div", async () => {
      const result = await process("![bg](hero.jpg)\n\n# Title");
      expect(result).toContain("{@html __bgHtml0}");
      expect(result).toContain("import __deckImg0 from './hero.jpg'");
      expect(result).toContain("const __bgHtml0 = '<div class=\"slide-bg\"");
      expect(result).toContain("background-size: cover");
    });

    it("maps bg contain to background-size on slide-bg div", async () => {
      const result = await process("![bg contain](logo.png)\n\n# Title");
      expect(result).toContain("background-size: contain");
    });

    it("creates split layout wrapper for left split", async () => {
      const result = await process("![bg left:40%](photo.jpg)\n\n# Content");
      expect(result).toContain('class="split-layout"');
      expect(result).toContain('class="split-image"');
      expect(result).toContain('class="split-content"');
    });

    it("creates split layout wrapper for right split", async () => {
      const result = await process("![bg right:60%](photo.jpg)\n\n# Content");
      expect(result).toContain('class="split-layout"');
    });

    it("maps brightness filter to inline style", async () => {
      const result = await process("![bg brightness:0.5](hero.jpg)\n\n# Title");
      expect(result).toContain("{@html __bgHtml0}");
      expect(result).toContain("import __deckImg0 from './hero.jpg'");
      expect(result).toContain("filter: brightness(0.5)");
      expect(result).not.toContain("split-layout");
    });

    it("preserves absolute URLs without generating imports", async () => {
      const result = await process("![bg](/images/hero.jpg)\n\n# Title");
      expect(result).toContain("background-image: url('/images/hero.jpg')");
      expect(result).not.toContain("__deckImg");
    });

    it("preserves external URLs without generating imports", async () => {
      const result = await process("![bg](https://example.com/hero.jpg)\n\n# Title");
      expect(result).toContain("url('https://example.com/hero.jpg')");
      expect(result).not.toContain("__deckImg");
    });

    it("deduplicates imports for repeated relative URLs", async () => {
      const result = await process("![bg](hero.jpg)\n\n# Slide 1\n\n---\n\n![bg](hero.jpg)\n\n# Slide 2");
      const importCount = (result!.match(/import __deckImg/g) || []).length;
      expect(importCount).toBe(1);
    });

    it("does not affect regular images", async () => {
      const result = await process("![alt](photo.jpg)");
      expect(result).not.toContain('class="split-layout"');
      expect(result).toContain("<img");
    });
  });

  describe("frontmatter stripping", () => {
    it("strips frontmatter without producing an extra slide", async () => {
      const content = "---\ntitle: Test\ndescription: A test\n---\n\n# First slide\n\n---\n\n# Second slide";
      const result = await process(content);
      const slideCount = (result!.match(/<Slide/g) || []).length;
      expect(slideCount).toBe(2);
      expect(result).not.toContain("title: Test");
    });
  });

  describe("script and style preservation", () => {
    it("preserves script blocks", async () => {
      const content = '<script lang="ts">\n  let count = 0;\n</script>\n\n# Hello';
      const result = await process(content);
      expect(result).toContain("let count = 0;");
    });

    it("preserves style blocks", async () => {
      const content = "# Hello\n\n<style>\n  h1 { color: red; }\n</style>";
      const result = await process(content);
      expect(result).toContain("h1 { color: red; }");
    });
  });
});

describe("logo slides", () => {
  it("generates ANU logo SVG for anu-logo class", async () => {
    const result = await process("<!-- _class: anu-logo -->");
    expect(result).toContain('class="anu-logo"');
    expect(result).toContain('viewBox="0 0 1280 720"');
    expect(result).toContain('class="logo-svg"');
    expect(result).toContain('class="logo-rule-top"');
    expect(result).toContain('class="logo-rule-bottom"');
    expect(result).toContain('class="logo-group"');
    expect(result).toContain("translate(230, 287) scale(2)");
  });

  it("generates SoCy logo SVG for socy-logo class", async () => {
    const result = await process("<!-- _class: socy-logo -->");
    expect(result).toContain('class="socy-logo"');
    expect(result).toContain('class="logo-svg"');
    expect(result).toContain('class="logo-group"');
    expect(result).toContain("scale(1.5)");
  });

  it("skips markdown processing for logo slides", async () => {
    const result = await process("<!-- _class: anu-logo -->\n\nSome text");
    expect(result).toContain('class="logo-svg"');
    expect(result).not.toContain("<p>Some text</p>");
  });

  it("preserves notes on logo slides", async () => {
    const result = await process("<!-- _class: anu-logo -->\n\n<!-- notes: Logo notes -->");
    expect(result).toContain("<Notes>Logo notes</Notes>");
    expect(result).toContain('class="logo-svg"');
  });

  it("prefixes ANU SVG classes to avoid collisions", async () => {
    const result = await process("<!-- _class: anu-logo -->");
    expect(result).toContain("anu-cls-");
    expect(result).not.toMatch(/[^-]cls-1/);
  });
});

describe("QR code generation", () => {
  it("replaces ![qr](url) with QR SVG", async () => {
    const result = await process("## Scan me\n\n![qr](https://example.com)");
    expect(result).toContain('class="qr-code"');
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain("<rect");
    expect(result).toContain("example.com");
  });

  it("does not affect ![bg] images", async () => {
    const result = await process("![bg](hero.jpg)\n\n# Title");
    expect(result).toContain('class="slide-bg"');
    expect(result).not.toContain('class="qr-code"');
  });

  it("strips protocol from display URL", async () => {
    const result = await process("![qr](https://www.example.com/path)");
    expect(result).toContain("<span>example.com/path</span>");
  });

  it("generates gold finder pattern rects", async () => {
    const result = await process("![qr](https://example.com)");
    expect(result).toContain('fill="#be830e"');
    expect(result).toContain('fill="#ffffff"');
  });

  it("includes animation styles on rects", async () => {
    const result = await process("![qr](https://example.com)");
    expect(result).toContain("animation:");
    expect(result).toContain("qr-morph");
  });
});

describe("replaceQrImagesInAst", () => {
  it("replaces QR image syntax with SVG html node", () => {
    const nodes = parseNodes("![qr](https://example.com)");
    const result = replaceQrImagesInAst(nodes);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("html");
    expect((result[0] as { value: string }).value).toContain('class="qr-code"');
    expect((result[0] as { value: string }).value).toContain("<svg");
  });

  it("leaves non-QR images unchanged", () => {
    const nodes = parseNodes("![alt](photo.jpg)");
    const result = replaceQrImagesInAst(nodes);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("paragraph");
  });

  it("replaces multiple QR images", () => {
    const nodes = parseNodes("![qr](https://a.com)\n\n![qr](https://b.com)");
    const result = replaceQrImagesInAst(nodes);
    expect(result).toHaveLength(2);
    expect((result[0] as { value: string }).value).toContain('href="https://a.com"');
    expect((result[1] as { value: string }).value).toContain('href="https://b.com"');
  });
});

describe("extractBgImagesFromAst", () => {
  it("extracts full-bleed bg image", () => {
    const nodes = parseNodes("![bg](photo.jpg)\n\n# Title");
    const { images, remaining } = extractBgImagesFromAst(nodes);
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe("photo.jpg");
    expect(images[0].position).toBeUndefined();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].type).toBe("heading");
  });

  it("extracts left split image", () => {
    const nodes = parseNodes("![bg left:40%](photo.jpg)");
    const { images } = extractBgImagesFromAst(nodes);
    expect(images[0].position).toBe("left");
    expect(images[0].splitPercent).toBe("40%");
  });

  it("extracts right split image", () => {
    const nodes = parseNodes("![bg right](photo.jpg)");
    const { images } = extractBgImagesFromAst(nodes);
    expect(images[0].position).toBe("right");
    expect(images[0].splitPercent).toBe("50%");
  });

  it("extracts contain size", () => {
    const nodes = parseNodes("![bg contain](photo.jpg)");
    const { images } = extractBgImagesFromAst(nodes);
    expect(images[0].size).toBe("contain");
  });

  it("extracts cover size", () => {
    const nodes = parseNodes("![bg cover](photo.jpg)");
    const { images } = extractBgImagesFromAst(nodes);
    expect(images[0].size).toBe("cover");
  });

  it("extracts CSS filters", () => {
    const nodes = parseNodes("![bg blur:5px brightness:0.7](photo.jpg)");
    const { images } = extractBgImagesFromAst(nodes);
    expect(images[0].filters).toBe("blur(5px) brightness(0.7)");
  });

  it("does not extract regular images", () => {
    const nodes = parseNodes("![alt text](photo.jpg)");
    const { images, remaining } = extractBgImagesFromAst(nodes);
    expect(images).toHaveLength(0);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].type).toBe("paragraph");
  });
});
