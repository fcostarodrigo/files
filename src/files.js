import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { print as formatSource, parse as parseSource } from "recast";
import typescriptParser from "recast/parsers/typescript.js";
import { stringify as formatToml, parse as parseToml } from "smol-toml";
import { stringify as formatYaml, parse as parseYaml } from "yaml";

async function formatWithPrettier(filePath, source) {
  const options = (await prettier.resolveConfig(filePath)) ?? {};
  options.filepath = filePath;

  if (filePath.endsWith(".toml")) {
    options.plugins = [...(options.plugins ?? []), "prettier-plugin-toml"];
  }

  return prettier.format(source, options);
}

function formatSourceCode(filePath, sourceCode) {
  if (typeof sourceCode !== "string") {
    sourceCode = formatSource(sourceCode).code;
  }

  return formatWithPrettier(filePath, sourceCode);
}

const parsers = {
  ".json": (source) => JSON.parse(source),
  ".toml": (source) => parseToml(source),
  ".yaml": (source) => parseYaml(source),
  ".yml": (source) => parseYaml(source),
  ".js": (source) => parseSource(source),
  ".ts": (source) => parseSource(source, { parser: typescriptParser }),
};

const formatters = {
  ".json": (filePath, value) => formatWithPrettier(filePath, JSON.stringify(value)),
  ".toml": (filePath, value) => formatWithPrettier(filePath, formatToml(value)),
  ".yaml": (filePath, value) => formatWithPrettier(filePath, formatYaml(value)),
  ".yml": (filePath, value) => formatWithPrettier(filePath, formatYaml(value)),
  ".ts": formatSourceCode,
  ".js": formatSourceCode,
};

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
