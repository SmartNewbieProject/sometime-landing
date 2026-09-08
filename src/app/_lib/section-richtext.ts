import { HTMLElement, NodeType, parse, type Node } from "node-html-parser";

const omittedTags = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH", "TEMPLATE", "NOSCRIPT"]);
const blockTags = new Set(["P", "DIV", "SECTION", "ARTICLE", "BLOCKQUOTE", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "TABLE", "TR", "HR"]);

/** Return plain text with paragraph/line breaks, or null for ordinary Markdown. */
export function normalizeSectionRichText(source: string): string | null {
  // Imported rich text starts with an HTML element. Leave Markdown/code/autolinks alone.
  if (!/^\s*<[a-z][a-z\d]*(?:\s[^<>]*|\/?)>/i.test(source)) return null;

  function text(node: Node): string {
    if (node.nodeType === NodeType.TEXT_NODE) return node.text.replace(/[\s\u00a0]+/g, " ");
    if (!(node instanceof HTMLElement)) return "";
    const tag = node.tagName;
    if (omittedTags.has(tag)) return "";
    if (tag === "BR") return "\n";
    const content = node.childNodes.map(text).join("");
    if (blockTags.has(tag)) return `\n\n${content}\n\n`;
    if (tag === "TD" || tag === "TH") return `${content} `;
    return content;
  }

  // Decode text nodes only once; decoded markup must remain text in React, never HTML.
  return parse(source).childNodes.map(text).join("")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
