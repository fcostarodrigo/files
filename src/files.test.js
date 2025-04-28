import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, assert, describe, it } from "vitest";

import { readFile, writeFile } from "./files.js";

const cases = [
  { extension: "json", fileContent: '{ "id": "Jf07pV7" }\n' },
  { extension: "toml", fileContent: 'id = "Jf07pV7"\n' },
  { extension: "yaml", fileContent: "id: Jf07pV7\n" },
  { extension: "js", fileContent: 'console.log("Hello World!");\n' },
  { extension: "jsx", fileContent: "const MyComponent = () => <div>Hello World!</div>;\n" },
  { extension: "ts", fileContent: "const x: number = 1;\n" },
  {
    extension: "tsx",
    fileContent: "const MyComponent = (props: Record<string, never>) => <div>Hello World!</div>;\n",
  },
];

afterAll(async () => {
  for (const { extension } of cases) {
    const filePath = path.format({ ext: extension, name: "test" });
    await fs.unlink(filePath);
  }
});

describe("files", () => {
  it.each(cases)("should write and read $extension files", async ({ extension, fileContent }) => {
    const filePath = path.format({ ext: extension, name: "test" });
    await fs.writeFile(filePath, fileContent);

    await writeFile(filePath, await readFile(filePath));

    assert.deepStrictEqual(await fs.readFile(filePath, "utf8"), fileContent);
  });
});
