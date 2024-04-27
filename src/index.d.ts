export function readFile<Content>(
  filePath: string,
  options?: {
    defaultValue?: Content;
    extension?: string;
    parse?: boolean;
  },
): Promise<Content>;

export function writeFile<Content>(
  filePath: string,
  data: Content,
  options?: {
    format?: boolean;
    extension?: string;
  },
): Promise<void>;

export function fileExist(filePath: string): Promise<boolean>;
