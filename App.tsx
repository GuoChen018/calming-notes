import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
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
      console.log('Fonts loaded successfully!');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
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
