import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { print as formatSource, parse as parseSource } from "recast";
import typescriptParser from "recast/parsers/babel-ts.js";
import { stringify as formatToml, parse as parseToml } from "smol-toml";
import { stringify as formatYaml, parse as parseYaml } from "yaml";

function formatSourceCode(filePath, sourceCode) {
  if (typeof sourceCode !== "string") {
    sourceCode = formatSource(sourceCode).code;
  }

  return formatWithPrettier(filePath, sourceCode);
}

async function formatWithPrettier(filePath, source) {
  const options = (await prettier.resolveConfig(filePath)) ?? {};
  options.filepath = filePath;

  if (filePath.endsWith(".toml")) {
    options.plugins = [...(options.plugins ?? []), "prettier-plugin-toml"];
  }

  return prettier.format(source, options);
}

const parsers = {
  ".js": (source) => parseSource(source),
  ".json": (source) => JSON.parse(source),
  ".jsx": (source) => parseSource(source),
  ".toml": (source) => parseToml(source),
  ".ts": (source) => parseSource(source, { parser: typescriptParser }),
  ".tsx": (source) => parseSource(source, { parser: typescriptParser }),
  ".yaml": (source) => parseYaml(source),
  ".yml": (source) => parseYaml(source),
};

const formatters = {
  ".js": formatSourceCode,
  ".json": (filePath, value) => formatWithPrettier(filePath, JSON.stringify(value)),
  ".jsx": formatSourceCode,
  ".toml": (filePath, value) => formatWithPrettier(filePath, formatToml(value)),
  ".ts": formatSourceCode,
  ".tsx": formatSourceCode,
  ".yaml": (filePath, value) => formatWithPrettier(filePath, formatYaml(value)),
  ".yml": (filePath, value) => formatWithPrettier(filePath, formatYaml(value)),
};

export async function fileExist(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

export async function readFile(filePath, options = {}) {
  const { defaultValue, extension = path.extname(filePath), parse = true } = options;

  if (!(await fileExist(filePath)) && "defaultValue" in options) {
    return defaultValue;
  }

  const content = await fs.promises.readFile(filePath, "utf8");

  if (parse && extension in parsers) {
    return parsers[extension](content);
  }

  return content;
}

export async function writeFile(filePath, text, options = {}) {
  const { extension = path.extname(filePath), format = true } = options;

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  if (format && extension in formatters) {
    text = await formatters[extension](filePath, text);
  }

  await fs.promises.writeFile(filePath, text);
}
