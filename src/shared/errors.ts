export class FrontmatterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FrontmatterError";
  }
}

export class ExtractError extends FrontmatterError {
  constructor(message: string) {
    super(message);
    this.name = "ExtractError";
  }
}
