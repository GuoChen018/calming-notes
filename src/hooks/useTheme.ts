import { useSettingsStore } from '../store/settingsStore';
import { colors, ColorScheme } from '../theme/colors';
import { typography } from '../theme/typography';

export function useTheme() {
  const { colorScheme, fontSize } = useSettingsStore();
  
  const currentColors = colors[colorScheme];
  
  return {
    colors: currentColors,
    typography,
    fontSize,
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}
