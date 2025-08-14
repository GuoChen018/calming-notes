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
import TipTapEditor from '../editor/TipTapEditor';
import { useNotesStore } from '../store/notesStore';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../hooks/useTheme';
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
    updateNote,
    deleteNote,
    clearError,
  } = useNotesStore();

  const { colors, typography } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Animation for smooth fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Reset animation on mount
  useEffect(() => {
    fadeAnim.setValue(0);
  }, [fadeAnim]);

  // Debounced save function (750ms delay)
  const debouncedSave = useDebounce(async (content: string) => {
    if (!noteId) return;
    
    setIsSaving(true);
    try {
      await updateNote(noteId, content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  }, 750);

  useEffect(() => {
    if (noteId) {
      // Reset animation when loading a new note
      fadeAnim.setValue(0);
      loadNote(noteId);
    }
  }, [noteId, loadNote, fadeAnim]);

  // Fade in animation when note loads
  useEffect(() => {
    if (currentNote && currentNote.content_json && !isLoading) {
      // Small delay to ensure TipTap has initialized with correct content
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 100);
    }
  }, [currentNote, isLoading, fadeAnim]);

  const handleContentChange = async (content: string) => {
    debouncedSave(content);
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
              onBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Saved just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `Saved at ${lastSaved.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
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
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border.light }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={styles.buttonContent}>
            <Icon name="arrow-left" size={16} color={colors.accent.primary} />
            <Text style={[styles.backButtonText, { 
              fontFamily: typography.fonts.regular,
              color: colors.accent.primary 
            }]}>
              Back
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          {isSaving ? (
            <View style={styles.savingIndicator}>
              <ActivityIndicator size="small" color={colors.accent.primary} />
              <Text style={[styles.savingText, { 
                fontFamily: typography.fonts.regular,
                color: colors.accent.primary 
              }]}>
                Saving...
              </Text>
            </View>
          ) : (
            <Text style={[styles.savedText, { 
              fontFamily: typography.fonts.regular,
              color: colors.text.muted 
            }]}>
              {formatLastSaved()}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash" size={16} color={colors.accent.error} />
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <Animated.View style={[styles.editorContainer, { opacity: fadeAnim }]}>
        {currentNote && currentNote.content_json ? (
          <TipTapEditor
            content={currentNote.content_json}
            onUpdate={handleContentChange}
            dom={{
              matchContents: true,
              style: styles.editor,
            }}
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
    borderBottomWidth: 1,
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
