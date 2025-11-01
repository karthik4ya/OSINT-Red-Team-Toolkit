export interface OsintTool {
  id: number;
  name: string;
  category: string;
  description: string;
  commandTemplate?: string;
  commandPlaceholder?: string;
  url?: string;
  inputType?: 'text' | 'file';
  accept?: string;
  allowFileUpload?: boolean;
}
