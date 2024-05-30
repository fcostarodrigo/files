import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { after, test } from "node:test";
import { readFile, writeFile } from "./files.js";

const testCases = [
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

after(async () => {
  for (const testCase of testCases) {
    const filePath = path.format({ ext: testCase.extension, name: "test" });
    await fs.promises.unlink(filePath); // eslint-disable-line no-await-in-loop
  }
});

for (const testCase of testCases) {
  test(`Write and read ${testCase.extension} files`, async () => {
    const filePath = path.format({ ext: testCase.extension, name: "test" });
    await fs.promises.writeFile(filePath, testCase.fileContent);

    await writeFile(filePath, await readFile(filePath));

    assert.deepStrictEqual(await fs.promises.readFile(filePath, "utf8"), testCase.fileContent);
  });
}
