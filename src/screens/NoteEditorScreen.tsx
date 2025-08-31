import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import SimpleEditor from '../editor/SimpleEditor';
import { useNotesStore } from '../store/notesStore';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../hooks/useTheme';
import { useFonts } from '../hooks/useFonts';
import Icon from '../components/Icon';

interface NoteEditorScreenProps {
  noteId: string;
  onBack: () => void;
}

export default function NoteEditorScreen({ noteId, onBack }: NoteEditorScreenProps) {
  const {
    currentNote,
    isLoading,
    error,
    loadNote,
    loadNotes,
    updateNote,
    deleteNote,
    clearError,
  } = useNotesStore();

  const { colors, typography } = useTheme();
  const { fontsLoaded } = useFonts();
  const [editorReady, setEditorReady] = useState(false);



  const editorRef = useRef<any>(null);
  
  // Animation for smooth fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Reset animation on mount
  useEffect(() => {
    fadeAnim.setValue(0);
    setEditorReady(false);
  }, [fadeAnim]);



  // Debounced save function (750ms delay)
  const debouncedSave = useDebounce(async (content: string) => {
    if (!noteId) return;
    
    try {
      await updateNote(noteId, content);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }, 750);

  useEffect(() => {
    if (noteId) {
      // Reset animation when loading a new note
      fadeAnim.setValue(0);
      setEditorReady(false);
      loadNote(noteId);
    }
  }, [noteId, loadNote, fadeAnim]);

  // Fade in animation when editor is ready
  useEffect(() => {
    if (editorReady) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [editorReady, fadeAnim]);



  const handleEditorReady = () => {
    setEditorReady(true);
  };



  const handleContentChange = async (content: string) => {
    debouncedSave(content);
  };

  const handleBack = () => {
    // Refresh notes list to show updated previews
    loadNotes();
    onBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              handleBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };



  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Text style={[styles.loadingText, { 
          fontFamily: typography.fonts.regular,
          color: colors.text.secondary 
        }]}>
          Loading note...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { 
          fontFamily: typography.fonts.regular,
          color: colors.accent.error 
        }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent.primary }]}
          onPress={() => {
            clearError();
            loadNote(noteId);
          }}
        >
          <Text style={[styles.retryButtonText, { fontFamily: typography.fonts.regular }]}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { 
            fontFamily: typography.fonts.regular,
            color: colors.accent.primary 
          }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentNote) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { 
          fontFamily: typography.fonts.regular,
          color: colors.accent.error 
        }]}>
          Note not found
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { 
            fontFamily: typography.fonts.regular,
            color: colors.accent.primary 
          }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.buttonContent}>
            <Icon name="arrow-left" size={16} color="#4D5461" />
            <Text style={[styles.backButtonText, { 
              fontFamily: typography.fonts.regular,
              color: "#4D5461" 
            }]}>
              Back
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          {/* Removed save status display */}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash" size={16} color={colors.accent.error} />
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <Animated.View style={[styles.editorContainer, { opacity: fadeAnim }]}>
        {!fontsLoaded ? (
          <View style={styles.editorPlaceholder}>
            <ActivityIndicator size="small" color={colors.accent.primary} />
            <Text style={[styles.loadingText, { 
              fontFamily: typography.fonts.regular,
              color: colors.text.secondary 
            }]}>
              Loading fonts...
            </Text>
          </View>
        ) : currentNote && currentNote.content_json ? (
          <SimpleEditor
            content={currentNote.content_json}
            onUpdate={handleContentChange}
            onReady={handleEditorReady}
          />
        ) : (
          <View style={styles.editorPlaceholder}>
            <ActivityIndicator size="small" color={colors.accent.primary} />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  savedText: {
    fontSize: 12,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editorContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
  },
  editorPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
