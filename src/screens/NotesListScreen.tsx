import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { useNotesStore } from '../store/notesStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../hooks/useTheme';
import { useDebounce } from '../hooks/useDebounce';
import { NotePreview } from '../services/db';
import Icon from '../components/Icon';
import Toast from '../components/Toast';

interface NotesListScreenProps {
  onNotePress: (noteId: string) => void;
  onNewNote: () => void;
}

export default function NotesListScreen({ onNotePress, onNewNote }: NotesListScreenProps) {
  const {
    notes,
    isLoading,
    error,
    selectedNotes,
    isSelectionMode,
    loadNotes,
    createNote,
    deleteNote,
    searchNotes,
    clearError,
    toggleNoteSelection,
    selectNote,
    clearSelection,
    deleteSelectedNotes,
    undoDelete,
  } = useNotesStore();

  const { toggleTheme } = useSettingsStore();
  const { colors, typography, fontSize, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletedNotes, setDeletedNotes] = useState<NotePreview[]>([]);
  const searchInputRef = useRef<TextInput>(null);
  const selectionBarOpacity = useRef(new Animated.Value(0)).current;
  
  // Derive search mode from query - no separate state needed
  const isInSearchMode = searchQuery.trim().length > 0;

  const handleSearchBlur = () => {
    searchInputRef.current?.blur();
  };

  useEffect(() => {
    loadNotes().finally(() => {
      // Mark initial load as complete after the first load
      setInitialLoad(false);
    });
  }, [loadNotes]);

  // Animate selection bar
  useEffect(() => {
    Animated.timing(selectionBarOpacity, {
      toValue: isSelectionMode ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isSelectionMode, selectionBarOpacity]);



  // Debounced search function
  const debouncedSearch = useDebounce(async (query: string) => {
    await searchNotes(query);
  }, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleNewNote = async () => {
    try {
      const noteId = await createNote();
      onNotePress(noteId);
    } catch (error) {
      Alert.alert('Error', 'Failed to create new note');
    }
  };

  const handleNoteLongPress = (noteId: string) => {
    selectNote(noteId);
  };

  const handleNotePress = (noteId: string) => {
    if (isSelectionMode) {
      toggleNoteSelection(noteId);
    } else {
      onNotePress(noteId);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Store deleted notes for undo functionality
      const notesToDelete = notes.filter(note => selectedNotes.includes(note.id));
      setDeletedNotes(notesToDelete);
      
      const deletedCount = await deleteSelectedNotes();
      
      // Show toast with undo option
      const message = `${deletedCount} note${deletedCount !== 1 ? 's' : ''} deleted`;
      setToastMessage(message);
      setToastVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete notes');
    }
  };

  const handleUndoDelete = async () => {
    try {
      const noteIds = deletedNotes.map(note => note.id);
      await undoDelete(noteIds);
      setToastVisible(false);
      setDeletedNotes([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to undo deletion');
    }
  };

  const handleToastDismiss = () => {
    setToastVisible(false);
    setDeletedNotes([]);
  };

  const handleDeleteNote = (noteId: string, notePreview: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${notePreview}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(noteId),
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };



  if (error && !isLoading) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { 
          fontFamily: typography.fonts.regular,
          color: colors.accent.error 
        }]}>
          {error}
        </Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.accent.primary }]} onPress={() => {
          clearError();
          loadNotes();
        }}>
          <Text style={[styles.retryButtonText, { fontFamily: typography.fonts.regular }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && !initialLoad) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  // During initial load while loading, show nothing (transparent)
  if (isLoading && initialLoad) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Normal Header */}
        <Animated.View style={[
          styles.header, 
          { 
            backgroundColor: colors.background,
            opacity: Animated.subtract(1, selectionBarOpacity)
          }
        ]}>
          <Text style={[styles.title, { 
            fontFamily: typography.fonts.regular, 
            color: colors.text.primary 
          }]}>
            Notes
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Icon 
              name={isDark ? 'sun' : 'moon'} 
              size={20} 
              color={colors.text.secondary} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Selection Header */}
        <Animated.View style={[
          styles.selectionHeader,
          { 
            backgroundColor: colors.background,
            opacity: selectionBarOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: isSelectionMode ? 'auto' : 'none', // Key fix!
          }
        ]}>
          <TouchableOpacity onPress={clearSelection} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={[styles.selectionCount, { 
            fontFamily: typography.fonts.regular, 
            color: colors.text.primary 
          }]}>
            {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
          </Text>
          
          <TouchableOpacity onPress={handleDeleteSelected} style={styles.deleteButton}>
            <Icon name="trash" size={20} color={colors.accent.error} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Search and Notes Container - only show if there are notes or search query */}
      {(notes.length > 0 || searchQuery) && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.contentContainer, { 
            backgroundColor: colors.background,
            borderColor: colors.border.light 
          }]}>
            {/* Search */}
            <TouchableWithoutFeedback onPress={handleSearchBlur}>
              <View style={styles.searchContainer}>
                <TouchableWithoutFeedback onPress={() => searchInputRef.current?.focus()}>
                  <View style={[styles.searchInputContainer, { borderBottomColor: colors.border.light }]}>
                    <View style={styles.searchIcon}>
                      <Icon 
                        name="search" 
                        size={16} 
                        color="#A2ADC2" 
                      />
                    </View>
                    <TextInput
                      ref={searchInputRef}
                      style={[styles.searchInput, { 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        fontFamily: typography.fonts.regular,
                        fontSize: fontSize,
                      }]}
                      placeholder="Search note"
                      value={searchQuery}
                      onChangeText={handleSearch}
                      placeholderTextColor="#A2ADC2"
                      cursorColor={isDark ? '#ffffff' : '#121212'}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>

            {/* Notes List */}
            {notes.map((item, index) => {
              const isSelected = selectedNotes.includes(item.id);
              return (
                <React.Fragment key={item.id}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.noteItem, 
                      { 
                        backgroundColor: isSelected 
                          ? colors.text.primary + '08' 
                          : pressed 
                          ? colors.text.primary + '05' 
                          : colors.background,
                      }
                    ]}
                    onPress={() => handleNotePress(item.id)}
                    onLongPress={() => handleNoteLongPress(item.id)}
                    delayLongPress={500}
                  >
                  <View style={styles.noteContent}>
                    <Text style={[styles.notePreview, { 
                      color: colors.text.primary,
                      fontFamily: typography.fonts.regular,
                      fontSize: fontSize,
                    }]} numberOfLines={2}>
                      {item.preview}
                    </Text>
                    <Text style={[styles.noteDate, { 
                      color: colors.text.secondary,
                      fontFamily: typography.fonts.regular,
                      fontSize: fontSize * 0.9,
                    }]}>
                      {formatDate(item.updated_at)}
                    </Text>
                  </View>
                </Pressable>
                {index < notes.length - 1 && (
                  <View style={[styles.noteSeparator, { backgroundColor: colors.border.light }]} />
                )}
                </React.Fragment>
              );
            })}
            
            {/* Search Results Empty State */}
            {searchQuery && notes.length === 0 && (
              <View style={styles.searchEmptyState}>
                <Icon 
                  name="cat" 
                  size={100} 
                  color="#A2ADC2" 
                />
                <Text style={[styles.emptyTitle, { 
                  fontFamily: typography.fonts.regular,
                  color: colors.text.primary 
                }]}>
                  No notes found
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Full Screen Empty State - only show when no notes and no search */}
      {notes.length === 0 && !searchQuery && (
        <View style={styles.fullScreenEmptyState}>
                          <Icon 
                  name={isDark ? 'icon-dark' : 'icon-light'}
                  size={80}
                  color={colors.text.primary}
                />
          <Text style={[styles.emptyTitle, { 
            fontFamily: typography.fonts.regular,
            color: colors.text.primary 
          }]}>
            No notes created
          </Text>
          <Text style={[styles.emptySubtitle, { 
            fontFamily: typography.fonts.regular,
            color: colors.text.secondary 
          }]}>
            Create your first note
          </Text>
        </View>
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewNote}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        actionText="Undo"
        onActionPress={handleUndoDelete}
        onDismiss={handleToastDismiss}
        duration={8000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  selectionCount: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden', // Ensures content doesn't exceed rounded corners
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
  },
  themeButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#4D5461',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  searchContainer: {
    paddingVertical: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    textAlign: 'left',
  },
  list: {
    flex: 1,
  },
  noteItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  noteContent: {
    flex: 1,
  },
  notePreview: {
    lineHeight: 24,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
  },
  noteSeparator: {
    height: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  fullScreenEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  searchEmptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  appIcon: {
    marginBottom: 48,
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
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
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
