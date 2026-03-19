import { describe, expect, it } from "vitest";
import { FrontmatterError, ExtractError } from "./errors.js";

describe("FrontmatterError", () => {
  it("should have the correct name and message", () => {
    const error = new FrontmatterError("test error");
    expect(error.name).toBe("FrontmatterError");
    expect(error.message).toBe("test error");
    expect(error).toBeInstanceOf(Error);
  });
});

describe("ExtractError", () => {
  it("should have the correct name and message", () => {
    const error = new ExtractError("extract error");
    expect(error.name).toBe("ExtractError");
    expect(error.message).toBe("extract error");
    expect(error).toBeInstanceOf(FrontmatterError);
    expect(error).toBeInstanceOf(Error);
  });
});
