import { describe, expect, it } from "vitest";
import { parse, FrontmatterError, ExtractError } from "./index.js";

describe("parse", () => {
  describe("basic frontmatter", () => {
    it("should parse frontmatter with string values", () => {
      const source = "---\ntitle: Hello World\nauthor: Jane Doe\n---\nBody content";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: "Hello World", author: "Jane Doe" });
      expect(result!.content).toBe("Body content");
    });

    it("should parse frontmatter with various YAML types", () => {
      const source = "---\ntitle: My Post\ncount: 42\ndraft: true\nprice: 9.99\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        title: "My Post",
        count: 42,
        draft: true,
        price: 9.99,
      });
      expect(result!.content).toBe("Content");
    });

    it("should parse frontmatter with nested structures", () => {
      const source = "---\nmeta:\n  title: Hello\n  tags:\n    - a\n    - b\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        meta: { title: "Hello", tags: ["a", "b"] },
      });
    });

    it("should parse frontmatter with inline flow collections", () => {
      const source = "---\ntags: [foo, bar]\nmeta: {key: value}\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        tags: ["foo", "bar"],
        meta: { key: "value" },
      });
    });

    it("should parse frontmatter with quoted strings", () => {
      const source = "---\ntitle: \"Hello: World\"\nauthor: 'Jane Doe'\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: "Hello: World", author: "Jane Doe" });
    });

    it("should parse frontmatter with null values", () => {
      const source = "---\na: null\nb: ~\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ a: null, b: null });
    });
  });

  describe("content handling", () => {
    it("should preserve content exactly", () => {
      const source = "---\ntitle: Test\n---\nLine 1\nLine 2\n\nLine 4";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.content).toBe("Line 1\nLine 2\n\nLine 4");
    });

    it("should handle empty content", () => {
      const source = "---\ntitle: Test\n---";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: "Test" });
      expect(result!.content).toBe("");
    });

    it("should handle content with --- inside", () => {
      const source = "---\ntitle: Test\n---\nHello\n---\nWorld";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.content).toBe("Hello\n---\nWorld");
    });

    it("should handle content with markdown", () => {
      const source = "---\ntitle: Test\n---\n# Heading\n\nParagraph\n\n- Item 1\n- Item 2";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.content).toBe("# Heading\n\nParagraph\n\n- Item 1\n- Item 2");
    });
  });

  describe("no frontmatter", () => {
    it("should return null for empty string", () => {
      expect(parse("")).toBeNull();
    });

    it("should return null for plain text", () => {
      expect(parse("Just some text content")).toBeNull();
    });

    it("should return null for text with --- not at start", () => {
      expect(parse("Hello\n---\ntitle: Test\n---")).toBeNull();
    });

    it("should return null for unclosed frontmatter", () => {
      expect(parse("---\ntitle: Test\nNo closing")).toBeNull();
    });
  });

  describe("empty frontmatter", () => {
    it("should return empty data for empty frontmatter block", () => {
      const source = "---\n---\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({});
      expect(result!.content).toBe("Content");
    });
  });

  describe("error handling", () => {
    it("should throw FrontmatterError for non-mapping YAML", () => {
      const source = "---\n- item1\n- item2\n---\nContent";
      expect(() => parse(source)).toThrow(FrontmatterError);
    });

    it("should throw FrontmatterError for scalar-only YAML", () => {
      const source = "---\njust a string\n---\nContent";
      expect(() => parse(source)).toThrow(FrontmatterError);
    });
  });

  describe("CRLF line endings", () => {
    it("should handle \\r\\n line endings", () => {
      const source = "---\r\ntitle: Hello\r\n---\r\nContent";
      const result = parse(source);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: "Hello" });
      expect(result!.content).toBe("Content");
    });
  });

  describe("exports", () => {
    it("should export FrontmatterError", () => {
      expect(FrontmatterError).toBeDefined();
      expect(new FrontmatterError("test")).toBeInstanceOf(Error);
    });

    it("should export ExtractError", () => {
      expect(ExtractError).toBeDefined();
      expect(new ExtractError("test")).toBeInstanceOf(FrontmatterError);
    });
  });
});
