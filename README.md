# @soukdao/frontmatter-ts

A frontmatter parser for TypeScript. Parses YAML frontmatter delimited by `---` from text content.

Built on top of [@soukadao/yaml-ts](https://www.npmjs.com/package/@soukadao/yaml-ts).

## Installation

```bash
bun add @soukdao/frontmatter-ts
```

## Usage

```typescript
import { parse } from "@soukdao/frontmatter-ts";

const source = `---
title: Hello World
tags:
  - typescript
  - yaml
draft: false
---
# Hello World

This is the body content.`;

const result = parse(source);
// result.data  => { title: "Hello World", tags: ["typescript", "yaml"], draft: false }
// result.content => "# Hello World\n\nThis is the body content."
```

`parse` returns `null` if the input has no frontmatter.

```typescript
parse("No frontmatter here"); // => null
```

## API

### `parse(source: string): FrontmatterResult | null`

Parses a string containing YAML frontmatter.

- Returns `{ data, content }` if frontmatter is found
- Returns `null` if no frontmatter is detected

### Types

```typescript
interface FrontmatterResult {
  data: { [key: string]: YamlValue };
  content: string;
}
```

### Errors

- `FrontmatterError` — base error class
- `ExtractError` — thrown on extraction failures

## License

MIT
