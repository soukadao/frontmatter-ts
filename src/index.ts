import type { FrontmatterResult } from "./shared/index.js";
import { extract } from "./features/extractor/index.js";
import { parseFrontmatter } from "./features/parser/index.js";

export type { FrontmatterResult } from "./shared/index.js";
export { FrontmatterError, ExtractError } from "./shared/index.js";

export function parse(source: string): FrontmatterResult | null {
  const raw = extract(source);
  if (raw === null) {
    return null;
  }

  const data = parseFrontmatter(raw.frontmatter);
  return { data, content: raw.content };
}
