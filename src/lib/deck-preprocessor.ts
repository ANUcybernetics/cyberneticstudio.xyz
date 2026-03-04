import type { PreprocessorGroup } from "svelte/compiler";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { generateLogoSlide } from "./deck-svg/logo-slide.js";
import { generateQrCode } from "./deck-svg/qr-code.js";

const DECK_FILE_PATTERN = /\.deck\.svelte$/;
const SCRIPT_RE = /(<script[\s\S]*?<\/script>)/gi;
const STYLE_RE = /(<style[\s\S]*?<\/style>)/gi;
const CLASS_COMMENT_RE = /<!--\s*_class:\s*([\w\s-]+?)\s*-->/;
const NOTES_COMMENT_RE = /<!--\s*notes:\s*([\s\S]*?)\s*-->/;
const ANIMOTION_COMPONENT_RE =
  /<(?:Action|Code|Transition|Embed|Recorder|Slides)\b/;
const BG_IMAGE_RE = /!\[bg([^\]]*)\]\(([^)]+)\)/g;
const QR_IMAGE_RE = /!\[qr\]\(([^)]+)\)/g;
const LOGO_CLASS_RE = /^(anu-logo|socy-logo)$/;

const AUTO_IMPORTS = [
  'import { Presentation, Slide, Action, Code, Notes, Transition, getPresentation } from "@animotion/core";',
  'import "@animotion/core/theme";',
];

const REVEAL_BRIDGE = '  const __p = getPresentation(); $effect(() => { if (__p.slides) window.Reveal = __p.slides; });';

interface BgImage {
  url: string;
  position?: "left" | "right";
  size?: string;
  splitPercent?: string;
  filters?: string;
}

function parseBgModifiers(modifiers: string): Omit<BgImage, "url"> {
  const trimmed = modifiers.trim();
  const result: Omit<BgImage, "url"> = {};

  const leftMatch = trimmed.match(/\bleft(?::(\d+%))?/);
  if (leftMatch) {
    result.position = "left";
    result.splitPercent = leftMatch[1] || "50%";
  }

  const rightMatch = trimmed.match(/\bright(?::(\d+%))?/);
  if (rightMatch) {
    result.position = "right";
    result.splitPercent = rightMatch[1] || "50%";
  }

  if (/\bcontain\b/.test(trimmed)) {
    result.size = "contain";
  } else if (/\bcover\b/.test(trimmed)) {
    result.size = "cover";
  }

  const filterParts: string[] = [];
  const blurMatch = trimmed.match(/blur:(\S+)/);
  if (blurMatch) filterParts.push(`blur(${blurMatch[1]})`);
  const brightnessMatch = trimmed.match(/brightness:(\S+)/);
  if (brightnessMatch) filterParts.push(`brightness(${brightnessMatch[1]})`);
  const saturateMatch = trimmed.match(/saturate:(\S+)/);
  if (saturateMatch) filterParts.push(`saturate(${saturateMatch[1]})`);
  if (filterParts.length > 0) result.filters = filterParts.join(" ");

  return result;
}

export function replaceQrImages(content: string): string {
  return content.replace(QR_IMAGE_RE, (_, url) => generateQrCode(url));
}

export function extractBgImages(content: string): {
  images: BgImage[];
  cleaned: string;
} {
  const images: BgImage[] = [];
  const cleaned = content.replace(BG_IMAGE_RE, (_, modifiers, url) => {
    images.push({ url, ...parseBgModifiers(modifiers) });
    return "";
  });
  return { images, cleaned };
}

function buildSlideAttrs(
  slideClass: string | null,
): string {
  if (slideClass) {
    return ` class="${slideClass}"`;
  }
  return "";
}

function buildBgDiv(images: BgImage[]): string {
  const fullBleed = images.find((img) => !img.position);
  if (!fullBleed) return "";

  const styleParts = [
    `background-image: url('${fullBleed.url}')`,
    `background-size: ${fullBleed.size || "cover"}`,
    "background-position: center",
  ];
  if (fullBleed.filters) {
    styleParts.push(`filter: ${fullBleed.filters}`);
  }
  return `<div class="slide-bg" style="${styleParts.join("; ")}"></div>`;
}

function buildSplitWrapper(
  images: BgImage[],
  innerHtml: string,
): string {
  const splitImage = images.find((img) => img.position);
  if (!splitImage) return innerHtml;

  const imagePercent = splitImage.splitPercent || "50%";
  const contentPercent = `calc(100% - ${imagePercent})`;
  const filterPart = splitImage.filters
    ? `; filter: ${splitImage.filters}`
    : "";

  const imageDiv = `<div class="split-image" style="background-image: url('${splitImage.url}'); width: ${imagePercent}${filterPart}"></div>`;
  const contentDiv = `<div class="split-content" style="width: ${contentPercent}">${innerHtml}</div>`;

  if (splitImage.position === "left") {
    return `<div class="split-layout">${imageDiv}${contentDiv}</div>`;
  }
  return `<div class="split-layout">${contentDiv}${imageDiv}</div>`;
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

async function markdownToHtml(md: string): Promise<string> {
  const result = await markdownProcessor.process(md);
  return String(result);
}

function hasAnimotionComponents(content: string): boolean {
  return ANIMOTION_COMPONENT_RE.test(content);
}

function addAutoImports(scriptContent: string): string {
  let result = scriptContent;
  for (const imp of AUTO_IMPORTS) {
    const modPath = imp.match(/from\s+"([^"]+)"/)?.[1] || imp.match(/import\s+"([^"]+)"/)?.[1];
    if (modPath && !result.includes(modPath)) {
      result = result.replace(
        /(<script[^>]*>)/i,
        `$1\n  ${imp}`,
      );
    }
  }
  return result;
}

export function deckPreprocessor(): PreprocessorGroup {
  return {
    name: "deck-preprocessor",
    async markup({ content, filename }) {
      if (!filename || !DECK_FILE_PATTERN.test(filename)) {
        return undefined;
      }

      const scripts: string[] = [];
      const styles: string[] = [];

      let template = content;

      template = template.replace(SCRIPT_RE, (match) => {
        scripts.push(match);
        return "";
      });

      template = template.replace(STYLE_RE, (match) => {
        styles.push(match);
        return "";
      });

      template = template.trim();
      template = template.replace(/^---\n[\s\S]*?\n---\n/, "");

      if (!template) {
        return undefined;
      }

      const sections = template.split(/\n---\n/);
      const slideOutputs: string[] = [];

      for (const section of sections) {
        let sectionContent = section.trim();
        if (!sectionContent) continue;

        const classMatch = sectionContent.match(CLASS_COMMENT_RE);
        const slideClass = classMatch ? classMatch[1].trim() : null;
        if (classMatch) {
          sectionContent = sectionContent.replace(CLASS_COMMENT_RE, "").trim();
        }

        const notesMatch = sectionContent.match(NOTES_COMMENT_RE);
        const notesContent = notesMatch ? notesMatch[1].trim() : null;
        if (notesMatch) {
          sectionContent = sectionContent.replace(NOTES_COMMENT_RE, "").trim();
        }

        const logoMatch = slideClass?.match(LOGO_CLASS_RE);
        if (logoMatch) {
          const variant = logoMatch[1] === "anu-logo" ? "anu" as const : "socy" as const;
          const logoSvg = generateLogoSlide(variant);
          const slideAttrs = buildSlideAttrs(slideClass);
          const notesTag = notesContent
            ? `\n    <Notes>${notesContent}</Notes>`
            : "";
          slideOutputs.push(
            `  <Slide${slideAttrs}>\n    ${logoSvg}${notesTag}\n  </Slide>`,
          );
          continue;
        }

        const { images, cleaned } = extractBgImages(sectionContent);
        sectionContent = cleaned.trim();

        sectionContent = replaceQrImages(sectionContent);

        let innerHtml: string;
        if (hasAnimotionComponents(sectionContent)) {
          innerHtml = sectionContent;
        } else {
          innerHtml = await markdownToHtml(sectionContent);
        }

        innerHtml = buildSplitWrapper(images, innerHtml);

        const slideAttrs = buildSlideAttrs(slideClass);
        const bgDiv = buildBgDiv(images);
        const notesTag = notesContent
          ? `\n    <Notes>${notesContent}</Notes>`
          : "";

        slideOutputs.push(
          `  <Slide${slideAttrs}>\n    ${bgDiv}${innerHtml}${notesTag}\n  </Slide>`,
        );
      }

      let scriptBlock =
        scripts.length > 0 ? scripts.join("\n") : '<script lang="ts">\n</script>';
      scriptBlock = addAutoImports(scriptBlock);
      scriptBlock = scriptBlock.replace(/<\/script>/i, `\n${REVEAL_BRIDGE}\n</script>`);

      const presentationContent = slideOutputs.join("\n\n");
      const styleBlock = styles.length > 0 ? "\n" + styles.join("\n") : "";

      const code = `${scriptBlock}\n\n<Presentation options={{ width: 1280, height: 720, transition: "none" }}>\n${presentationContent}\n</Presentation>${styleBlock}\n`;

      return { code };
    },
  };
}
