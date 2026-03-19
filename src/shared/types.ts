import type { YamlValue } from "@soukadao/yaml-ts";

export interface FrontmatterResult {
  data: { [key: string]: YamlValue };
  content: string;
}
