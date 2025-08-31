import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'CrimsonPro-Regular': require('../../assets/fonts/CrimsonPro-Regular.ttf'),
    'CrimsonPro-Italic': require('../../assets/fonts/CrimsonPro-Italic.ttf'),
    'CrimsonPro-ExtraBold': require('../../assets/fonts/CrimsonPro-ExtraBold.ttf'),
    'CrimsonPro-ExtraBoldItalic': require('../../assets/fonts/CrimsonPro-ExtraBoldItalic.ttf'),
  });

  return {
    fontsLoaded,
    fonts: {
      regular: 'CrimsonPro-Regular',
      italic: 'CrimsonPro-Italic',
      bold: 'CrimsonPro-ExtraBold',
      boldItalic: 'CrimsonPro-ExtraBoldItalic',
    },
  };
}
