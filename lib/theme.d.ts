type ThemeColors = {
  readonly paper: string;
  readonly ink: {
    readonly DEFAULT: string;
    readonly secondary: string;
    readonly muted: string;
  };
  readonly accent: {
    readonly DEFAULT: string;
    readonly soft: string;
  };
  readonly card: {
    readonly DEFAULT: string;
    readonly muted: string;
  };
  readonly border: {
    readonly DEFAULT: string;
  };
};

export declare const theme: { readonly colors: ThemeColors };
export declare const light: ThemeColors;
export declare const dark: ThemeColors;
