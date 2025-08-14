import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'CommitMono': require('../../assets/fonts/CommitMono-400-Regular.otf'),
    'CommitMono-Italic': require('../../assets/fonts/CommitMono-400-Italic.otf'),
    'CommitMono-Bold': require('../../assets/fonts/CommitMono-700-Regular.otf'),
    'CommitMono-BoldItalic': require('../../assets/fonts/CommitMono-700-Italic.otf'),
  });

  return {
    fontsLoaded,
    fonts: {
      regular: 'CommitMono',
      italic: 'CommitMono-Italic',
      bold: 'CommitMono-Bold',
      boldItalic: 'CommitMono-BoldItalic',
    },
  };
}
