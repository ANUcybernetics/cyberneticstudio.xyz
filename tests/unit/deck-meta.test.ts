import { describe, it, expect } from "vitest";
import { parseDeckFrontmatter } from "astromotion";

describe("parseDeckFrontmatter", () => {
  it("extracts title and description from frontmatter", () => {
    const raw = "---\ntitle: My Deck\ndescription: A test deck\n---\n# Slide 1";
    const { data, content } = parseDeckFrontmatter(raw);
    expect(data.title).toBe("My Deck");
    expect(data.description).toBe("A test deck");
    expect(content).toBe("# Slide 1");
  });

  it("falls back to slug when no frontmatter", () => {
    const raw = "# Just a slide";
    const { data, content } = parseDeckFrontmatter(raw, "my-deck");
    expect(data.title).toBe("my-deck");
    expect(content).toBe("# Just a slide");
  });

  it("handles missing description", () => {
    const raw = "---\ntitle: Title Only\n---\n# Content";
    const { data } = parseDeckFrontmatter(raw);
    expect(data.title).toBe("Title Only");
    expect(data.description).toBeUndefined();
  });

  it("returns content without frontmatter block", () => {
    const raw = "---\ntitle: Deck\n---\n<!-- _class: title -->\n\n# Hello";
    const { content } = parseDeckFrontmatter(raw);
    expect(content).toBe("<!-- _class: title -->\n\n# Hello");
    expect(content).not.toContain("---");
  });

  it("falls back to slug when frontmatter has no title", () => {
    const raw = "---\ndescription: No title here\n---\n# Content";
    const { data } = parseDeckFrontmatter(raw, "fallback-slug");
    expect(data.title).toBe("fallback-slug");
    expect(data.description).toBe("No title here");
  });
});
