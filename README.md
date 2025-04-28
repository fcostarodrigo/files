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

The last argument is an object with extra options.

- `extension`: Treat the file as if it has a specific extension.
- `parse`: Boolean that indicates if the file should be parsed when reading a file.
- `defaultValue`: Return default value if file doesn't exist When reading a file.
- `format`: Boolean that indicates if the file should be formatted when writing a file.

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
