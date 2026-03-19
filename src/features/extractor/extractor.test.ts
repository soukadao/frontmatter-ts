import { describe, expect, it } from "vitest";
import { extract } from "./extractor.js";
import { ExtractError } from "../../shared/index.js";

describe("extract", () => {
  describe("valid frontmatter", () => {
    it("should extract frontmatter and content", () => {
      const source = "---\ntitle: Hello\n---\nBody content";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello");
      expect(result.content).toBe("Body content");
    });

    it("should handle empty content after frontmatter", () => {
      const source = "---\ntitle: Hello\n---";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello");
      expect(result.content).toBe("");
    });

    it("should handle empty frontmatter", () => {
      const source = "---\n---\nBody content";
      const result = extract(source);
      expect(result.frontmatter).toBe("");
      expect(result.content).toBe("Body content");
    });

    it("should handle multiline frontmatter", () => {
      const source = "---\ntitle: Hello\ndate: 2024-01-01\ntags:\n  - a\n  - b\n---\nContent";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello\ndate: 2024-01-01\ntags:\n  - a\n  - b");
      expect(result.content).toBe("Content");
    });

    it("should handle multiline content", () => {
      const source = "---\ntitle: Hello\n---\nLine 1\nLine 2\nLine 3";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello");
      expect(result.content).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should handle content with --- inside", () => {
      const source = "---\ntitle: Hello\n---\nSome text\n---\nMore text";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello");
      expect(result.content).toBe("Some text\n---\nMore text");
    });

    it("should strip one leading newline from content", () => {
      const source = "---\ntitle: Hello\n---\n\nBody with blank line above";
      const result = extract(source);
      expect(result.content).toBe("\nBody with blank line above");
    });

    it("should handle \\r\\n line endings", () => {
      const source = "---\r\ntitle: Hello\r\n---\r\nBody content";
      const result = extract(source);
      expect(result.frontmatter).toBe("title: Hello");
      expect(result.content).toBe("Body content");
    });
  });

  describe("no frontmatter", () => {
    it("should return null for empty string", () => {
      expect(extract("")).toBeNull();
    });

    it("should return null for content without frontmatter", () => {
      expect(extract("Just some text")).toBeNull();
    });

    it("should return null if opening --- is not at the start", () => {
      expect(extract("text\n---\ntitle: Hello\n---")).toBeNull();
    });

    it("should return null for single ---", () => {
      expect(extract("---\ntitle: Hello")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle frontmatter with only whitespace", () => {
      const source = "---\n  \n---\nContent";
      const result = extract(source);
      expect(result).not.toBeNull();
      expect(result!.frontmatter).toBe("  ");
      expect(result!.content).toBe("Content");
    });

    it("should handle --- with trailing spaces on opening delimiter", () => {
      const source = "---  \ntitle: Hello\n---\nContent";
      const result = extract(source);
      expect(result).not.toBeNull();
      expect(result!.frontmatter).toBe("title: Hello");
    });

    it("should handle --- with trailing spaces on closing delimiter", () => {
      const source = "---\ntitle: Hello\n---  \nContent";
      const result = extract(source);
      expect(result).not.toBeNull();
      expect(result!.frontmatter).toBe("title: Hello");
    });
  });
});
