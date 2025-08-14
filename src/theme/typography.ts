export const typography = {
  fonts: {
    regular: 'CommitMono-400-Regular',
    italic: 'CommitMono-400-Italic',
    bold: 'CommitMono-700-Regular',
    boldItalic: 'CommitMono-700-Italic',
    system: 'System', // Fallback to system font
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

export type FontFamily = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes;
