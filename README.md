# Files

Read and write files parsing and formatting according to file extension in the file path.

## Install

```bash
npm i @fcostarodrigo/files
```

## Features

- Parse file based on extension.
- Format files using prettier.
- Create missing folders when writing files.

## Usage

```js
import { writeFile, readFile, fileExist } from "@fcostarodrigo/files";

await writeFile("user.json", { id: 123 });
const user = await readFile("user.json");
user.id; // 123

await fileExist("user.json"); // true
```

### Options

Pass an object with the following properties as the last argument.

- `extension`: Pretend the file has some extension.
- `parse`: When reading a file, boolean to indicate if file should be parsed.
- `defaultValue`: When reading a file, return default value if file doesn't exist
- `format`: When writing a file, boolean to indicate if file should be formatted.

### Available formats

- `json`
- `js`: Parsed with [recast](https://github.com/benjamn/recast).
- `ts`: Parsed with [recast](https://github.com/benjamn/recast).
- `toml`
- `yaml`

## Changelog

[Changelog](CHANGELOG.MD)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
