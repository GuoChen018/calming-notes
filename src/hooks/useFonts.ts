import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'CommitMono-400-Regular': require('../../assets/fonts/CommitMono-400-Regular.otf'),
    'CommitMono-400-Italic': require('../../assets/fonts/CommitMono-400-Italic.otf'),
    'CommitMono-700-Regular': require('../../assets/fonts/CommitMono-700-Regular.otf'),
    'CommitMono-700-Italic': require('../../assets/fonts/CommitMono-700-Italic.otf'),
  });

  return {
    fontsLoaded,
    fonts: {
      regular: 'CommitMono-400-Regular',
      italic: 'CommitMono-400-Italic',
      bold: 'CommitMono-700-Regular',
      boldItalic: 'CommitMono-700-Italic',
    },
  };
}
