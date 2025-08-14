import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNotesStore } from '../store/notesStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../hooks/useTheme';
import { NotePreview } from '../services/db';
import Icon from '../components/Icon';

interface NotesListScreenProps {
  onNotePress: (noteId: string) => void;
  onNewNote: () => void;
}

export default function NotesListScreen({ onNotePress, onNewNote }: NotesListScreenProps) {
  const {
    notes,
    isLoading,
    error,
    loadNotes,
    createNote,
    deleteNote,
    searchNotes,
    clearError,
  } = useNotesStore();

  const { toggleTheme } = useSettingsStore();
  const { colors, typography, fontSize, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchNotes(query);
  };

  const handleNewNote = async () => {
    try {
      const noteId = await createNote();
      onNotePress(noteId);
    } catch (error) {
      Alert.alert('Error', 'Failed to create new note');
    }
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

  const renderNoteItem = ({ item }: { item: NotePreview }) => (
    <TouchableOpacity
      style={[styles.noteItem, { backgroundColor: colors.surface }]}
      onPress={() => onNotePress(item.id)}
      onLongPress={() => handleDeleteNote(item.id, item.preview)}
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
        }]}>
          {formatDate(item.updated_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border.light }]}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Icon 
            name={isDark ? 'sun' : 'moon'} 
            size={20} 
            color={colors.text.secondary} 
          />
        </TouchableOpacity>
        <Text style={[styles.title, { 
          fontFamily: typography.fonts.bold, 
          color: colors.text.primary 
        }]}>
          Notes
        </Text>
        <TouchableOpacity style={[styles.newButton, { backgroundColor: colors.accent.primary }]} onPress={handleNewNote}>
          <View style={styles.buttonContent}>
            <Icon name="add" size={16} color="#fff" />
            <Text style={[styles.newButtonText, { fontFamily: typography.fonts.regular }]}>New</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border.light }]}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: colors.surfaceSecondary,
            color: colors.text.primary,
            fontFamily: typography.fonts.regular,
            fontSize: fontSize,
          }]}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={colors.text.muted}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={notes.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { 
              fontFamily: typography.fonts.regular,
              color: colors.text.secondary 
            }]}>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={[styles.createFirstButton, { backgroundColor: colors.accent.primary }]} onPress={handleNewNote}>
                <Text style={[styles.createFirstButtonText, { fontFamily: typography.fonts.regular }]}>Create your first note</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
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
    flex: 1,
    textAlign: 'center',
  },
  newButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    flex: 1,
  },
  noteItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  createFirstButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
