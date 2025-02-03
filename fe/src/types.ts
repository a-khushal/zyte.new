export interface FileStructure {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileStructure[];
}

export interface GeneratedWebsite {
  steps: string[];
  fileStructure: FileStructure[];
  preview: string;
}