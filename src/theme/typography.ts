export const typography = {
  fonts: {
    regular: 'CommitMono',
    italic: 'CommitMono-Italic',
    bold: 'CommitMono-Bold',
    boldItalic: 'CommitMono-BoldItalic',
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
