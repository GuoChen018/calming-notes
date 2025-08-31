import { create } from 'zustand';
import { db, Note, NotePreview } from '../services/db';

interface NotesState {
  notes: NotePreview[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadNotes: () => Promise<void>;
  createNote: () => Promise<string>;
  loadNote: (id: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: true,
  error: null,

  loadNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notes = await db.getAllNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load notes',
        isLoading: false 
      });
    }
  },

  createNote: async () => {
    set({ isLoading: true, error: null });
    try {
      const note = await db.createNote();
      const notes = await db.getAllNotes();
      set({ notes, currentNote: note, isLoading: false });
      return note.id;
    } catch (error) {
      console.error('Error creating note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },

  loadNote: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const note = await db.getNote(id);
      if (!note) {
        throw new Error('Note not found');
      }
      set({ currentNote: note, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load note',
        isLoading: false 
      });
    }
  },

  updateNote: async (id: string, content: string) => {
    try {
      await db.updateNote(id, content);
      
      // Only update current note silently without triggering re-renders
      // that could affect editor focus
      const currentNote = get().currentNote;
      if (currentNote && currentNote.id === id) {
        // Update the note object directly without calling set()
        // This prevents unnecessary re-renders during auto-save
        currentNote.content_json = content;
        currentNote.updated_at = Date.now();
      }
      
      // Don't refresh notes list during auto-save to prevent focus loss
      // The list will be refreshed when the user navigates back
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update note'
      });
    }
  },

  deleteNote: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await db.deleteNote(id);
      const notes = await db.getAllNotes();
      
      // Clear current note if it was deleted
      const currentNote = get().currentNote;
      if (currentNote && currentNote.id === id) {
        set({ currentNote: null });
      }
      
      set({ notes, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete note',
        isLoading: false 
      });
    }
  },

  searchNotes: async (query: string) => {
    // Don't set isLoading during search to prevent focus loss in search input
    set({ error: null });
    try {
      const notes = query.trim() 
        ? await db.searchNotes(query)
        : await db.getAllNotes();
      set({ notes });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search notes'
      });
    }
  },

  clearError: () => set({ error: null }),
}));
