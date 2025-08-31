import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from './src/hooks/useFonts';
import { useSettingsStore } from './src/store/settingsStore';
import NotesListScreen from './src/screens/NotesListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

type Screen = 'list' | 'editor';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  
  const { fontsLoaded } = useFonts();
  const { loadSettings, colorScheme } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Just wait for fonts to load, then show the app immediately
  if (!fontsLoaded) {
    return null; // Let Expo's built-in splash show
  }

  const handleNotePress = (noteId: string) => {
    setCurrentNoteId(noteId);
    setCurrentScreen('editor');
  };

  const handleNewNote = () => {
    // This will be handled by the NotesListScreen
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setCurrentNoteId(null);
  };

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {currentScreen === 'list' ? (
        <NotesListScreen
          onNotePress={handleNotePress}
          onNewNote={handleNewNote}
        />
      ) : (
        currentNoteId && (
          <NoteEditorScreen
            noteId={currentNoteId}
            onBack={handleBack}
          />
        )
      )}
    </>
  );
}
