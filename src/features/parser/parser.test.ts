import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./parser.js";
import { FrontmatterError } from "../../shared/index.js";

describe("parseFrontmatter", () => {
  describe("simple key-value pairs", () => {
    it("should parse a single string value", () => {
      const result = parseFrontmatter("title: Hello");
      expect(result).toEqual({ title: "Hello" });
    });

    it("should parse multiple key-value pairs", () => {
      const result = parseFrontmatter("title: Hello\nauthor: World");
      expect(result).toEqual({ title: "Hello", author: "World" });
    });

    it("should parse numeric values", () => {
      const result = parseFrontmatter("count: 42\nprice: 3.14");
      expect(result).toEqual({ count: 42, price: 3.14 });
    });

    it("should parse boolean values", () => {
      const result = parseFrontmatter("draft: true\npublished: false");
      expect(result).toEqual({ draft: true, published: false });
    });

    it("should parse null values", () => {
      const result = parseFrontmatter("value: null\nother: ~");
      expect(result).toEqual({ value: null, other: null });
    });

    it("should parse quoted string values", () => {
      const result = parseFrontmatter("title: \"Hello World\"\nauthor: 'Jane'");
      expect(result).toEqual({ title: "Hello World", author: "Jane" });
    });
  });

  describe("nested structures", () => {
    it("should parse nested mappings", () => {
      const result = parseFrontmatter("meta:\n  title: Hello\n  author: World");
      expect(result).toEqual({ meta: { title: "Hello", author: "World" } });
    });

    it("should parse arrays", () => {
      const result = parseFrontmatter("tags:\n  - foo\n  - bar\n  - baz");
      expect(result).toEqual({ tags: ["foo", "bar", "baz"] });
    });

    it("should parse inline arrays", () => {
      const result = parseFrontmatter("tags: [foo, bar, baz]");
      expect(result).toEqual({ tags: ["foo", "bar", "baz"] });
    });

    it("should parse inline objects", () => {
      const result = parseFrontmatter("meta: {title: Hello, author: World}");
      expect(result).toEqual({ meta: { title: "Hello", author: "World" } });
    });
  });

  describe("empty frontmatter", () => {
    it("should return empty object for empty string", () => {
      const result = parseFrontmatter("");
      expect(result).toEqual({});
    });

    it("should return empty object for whitespace-only string", () => {
      const result = parseFrontmatter("  ");
      expect(result).toEqual({});
    });
  });

  describe("error handling", () => {
    it("should throw FrontmatterError for non-object frontmatter", () => {
      expect(() => parseFrontmatter("just a string")).toThrow(FrontmatterError);
    });

    it("should throw FrontmatterError for array frontmatter", () => {
      expect(() => parseFrontmatter("- item1\n- item2")).toThrow(FrontmatterError);
    });

    it("should throw FrontmatterError with descriptive message for non-object", () => {
      expect(() => parseFrontmatter("just a string")).toThrow("Frontmatter must be a YAML mapping");
    });
  });
});
