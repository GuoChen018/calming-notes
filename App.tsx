import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import NotesListScreen from './src/screens/NotesListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';

type Screen = 'list' | 'editor';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

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
      <StatusBar style="auto" />
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
