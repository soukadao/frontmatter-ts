import { parse } from "@soukadao/yaml-ts";
import type { YamlValue } from "@soukadao/yaml-ts";
import { FrontmatterError } from "../../shared/index.js";

export function parseFrontmatter(source: string): { [key: string]: YamlValue } {
  const trimmed = source.trim();
  if (trimmed === "") {
    return {};
  }

  const value = parse(trimmed);

  if (value === undefined || value === null) {
    return {};
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new FrontmatterError("Frontmatter must be a YAML mapping");
  }

  return value;
}
