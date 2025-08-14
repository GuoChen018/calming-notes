import { create } from 'zustand';
import { ColorScheme } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  colorScheme: ColorScheme;
  fontSize: number;
  isLoading: boolean;
  
  // Actions
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
  loadSettings: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const SETTINGS_KEY = 'calming-notes-settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  colorScheme: 'light',
  fontSize: 16,
  isLoading: false,

  setColorScheme: async (scheme: ColorScheme) => {
    set({ colorScheme: scheme });
    try {
      const settings = { ...get(), colorScheme: scheme };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save color scheme:', error);
    }
  },

  setFontSize: async (size: number) => {
    set({ fontSize: size });
    try {
      const settings = { ...get(), fontSize: size };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  },

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        set({
          colorScheme: settings.colorScheme || 'light',
          fontSize: settings.fontSize || 16,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTheme: async () => {
    const currentScheme = get().colorScheme;
    const newScheme = currentScheme === 'light' ? 'dark' : 'light';
    await get().setColorScheme(newScheme);
  },
}));
