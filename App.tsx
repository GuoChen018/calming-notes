import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Animated, View, StyleSheet } from 'react-native';
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
  
  // Animation values for fade transition
  const listOpacity = useRef(new Animated.Value(1)).current;
  const editorOpacity = useRef(new Animated.Value(0)).current;
  
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
    
    // Fade from list to editor
    Animated.parallel([
      Animated.timing(listOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(editorOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreen('editor');
    });
  };

  const handleNewNote = () => {
    // This will be handled by the NotesListScreen
  };

  const handleBack = () => {
    // Fade from editor to list
    Animated.parallel([
      Animated.timing(editorOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreen('list');
      setCurrentNoteId(null);
    });
  };

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        {/* Notes List Screen */}
        <Animated.View 
          style={{ 
            ...StyleSheet.absoluteFillObject,
            opacity: listOpacity,
            pointerEvents: currentScreen === 'list' ? 'auto' : 'none'
          }}
        >
          <NotesListScreen
            onNotePress={handleNotePress}
            onNewNote={handleNewNote}
          />
        </Animated.View>

        {/* Editor Screen */}
        {currentNoteId && (
          <Animated.View 
            style={{ 
              ...StyleSheet.absoluteFillObject,
              opacity: editorOpacity,
              pointerEvents: currentScreen === 'editor' ? 'auto' : 'none'
            }}
          >
            <NoteEditorScreen
              noteId={currentNoteId}
              onBack={handleBack}
            />
          </Animated.View>
        )}
      </View>
    </>
  );
}
