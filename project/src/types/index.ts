export interface Repository {
  name: string;
  url: string;
  description?: string;
  external?: boolean;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export interface ViewState {
  currentPath: string[];
  currentRepo: string | null;
  currentFile: GitHubFile | null;
}

export type ThemeName = 
  | 'default'
  | 'monochrome'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'rose'
  | 'royal'
  | 'golden'
  | 'mint'
  | 'crimson';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}