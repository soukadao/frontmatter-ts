import type { RawDocument } from "../../entities/document/index.js";

const DELIMITER = /^---\s*$/;

export function extract(source: string): RawDocument | null {
  const normalized = source.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  if (!DELIMITER.test(lines[0])) {
    return null;
  }

  let closingIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (DELIMITER.test(lines[i])) {
      closingIndex = i;
      break;
    }
  }

  if (closingIndex === -1) {
    return null;
  }

  const frontmatter = lines.slice(1, closingIndex).join("\n");
  const content = lines.slice(closingIndex + 1).join("\n");

  return { frontmatter, content };
}
