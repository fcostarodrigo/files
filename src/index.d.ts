export function readFile<Content = unknown>(
  filePath: string,
  options?: {
    defaultValue?: Content;
    extension?: string;
    parse?: boolean;
  },
): Promise<Content>;

export function writeFile(
  filePath: string,
  data: unknown,
  options?: {
    format?: boolean;
    extension?: string;
  },
): Promise<void>;

export function fileExist(filePath: string): Promise<boolean>;
