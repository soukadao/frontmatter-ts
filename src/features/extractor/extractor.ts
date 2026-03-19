import type { RawDocument } from "../../entities/document/index.js";

const OPENING = /^---[ \t]*\r?\n/;
const CLOSING_INLINE = /^---[ \t]*(?:\r?\n|$)/;
const CLOSING_AFTER = /\r?\n---[ \t]*(?:\r?\n|$)/;

export function extract(source: string): RawDocument | null {
  const openMatch = OPENING.exec(source);
  if (!openMatch) {
    return null;
  }

  const afterOpen = openMatch[0].length;
  const rest = source.slice(afterOpen);

  let frontmatter: string;
  let contentStart: number;

  const inlineMatch = CLOSING_INLINE.exec(rest);
  if (inlineMatch && inlineMatch.index === 0) {
    frontmatter = "";
    contentStart = afterOpen + inlineMatch[0].length;
  } else {
    const closeMatch = CLOSING_AFTER.exec(rest);
    if (!closeMatch) {
      return null;
    }
    frontmatter = rest.slice(0, closeMatch.index).replace(/\r\n/g, "\n");
    contentStart = afterOpen + closeMatch.index + closeMatch[0].length;
  }

  const content = source.slice(contentStart).replace(/\r\n/g, "\n");

  return { frontmatter, content };
}
