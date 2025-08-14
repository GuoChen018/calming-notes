import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'CommitMono-Regular': require('../../assets/fonts/CommitMono-Regular.ttf'),
  });

  return {
    fontsLoaded,
    fonts: {
      regular: 'CommitMono-Regular',
      // Add more font variants here if needed
    },
  };
}
