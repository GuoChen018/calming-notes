import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

// Fallback UUID generation if crypto is not available
function generateUUID(): string {
  try {
    return uuidv4();
  } catch (error) {
    // Fallback to timestamp + random number
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }) + '-' + Date.now();
  }
}

export interface Note {
  id: string;
  content_json: string;
  updated_at: number;
  created_at: number;
}

export interface NotePreview {
  id: string;
  preview: string;
  updated_at: number;
  created_at: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;
    
    this.db = await SQLite.openDatabaseAsync('notes.db');
    
    // Create notes table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        content_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    // Create index for faster queries
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
    `);
  }

  private extractPreview(contentJson: string): string {
    try {
      const content = JSON.parse(contentJson);
      
      // Check if this is Lexical format (has 'root' and 'children')
      if (content.root && content.root.children) {
        return this.extractLexicalText(content.root);
      }
      
      // Check if this is TipTap format (has 'type' and 'content')
      if (content.type && content.content) {
        return this.extractTipTapText(content);
      }
      
      // Fallback for plain text
      return String(content).slice(0, 100).trim() || 'Untitled Note';
    } catch {
      return 'Untitled Note';
    }
  }

  private extractLexicalText(node: any): string {
    let text = '';
    
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.children && Array.isArray(node.children)) {
      text = node.children.map((child: any) => this.extractLexicalText(child)).join('');
    }
    
    // Add spacing for block elements
    if (node.type === 'paragraph' || node.type === 'heading') {
      text = text + ' ';
    }
    
    return text.slice(0, 100).trim() || 'Untitled Note';
  }

  private extractTipTapText(node: any): string {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child: any) => this.extractTipTapText(child)).join('');
    }
    
    return '';
  }

  async createNote(contentJson: string = ''): Promise<Note> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const note: Note = {
      id: generateUUID(),
      content_json: contentJson || JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      }),
      created_at: now,
      updated_at: now,
    };

    await this.db.runAsync(
      'INSERT INTO notes (id, content_json, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [note.id, note.content_json, note.created_at, note.updated_at]
    );

    return note;
  }

  async updateNote(id: string, contentJson: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const updated_at = Date.now();
    
    await this.db.runAsync(
      'UPDATE notes SET content_json = ?, updated_at = ? WHERE id = ?',
      [contentJson, updated_at, id]
    );
  }

  async getNote(id: string): Promise<Note | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Note>(
      'SELECT * FROM notes WHERE id = ?',
      [id]
    );

    return result || null;
  }

  async getAllNotes(): Promise<NotePreview[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<Note>(
      'SELECT * FROM notes ORDER BY updated_at DESC'
    );

    return results.map(note => ({
      id: note.id,
      preview: this.extractPreview(note.content_json),
      updated_at: note.updated_at,
      created_at: note.created_at,
    }));
  }

  async deleteNote(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  }

  async searchNotes(query: string): Promise<NotePreview[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    // Simple text search in JSON content
    const results = await this.db.getAllAsync<Note>(
      'SELECT * FROM notes WHERE content_json LIKE ? ORDER BY updated_at DESC',
      [`%${query}%`]
    );

    return results.map(note => ({
      id: note.id,
      preview: this.extractPreview(note.content_json),
      updated_at: note.updated_at,
      created_at: note.created_at,
    }));
  }
}

export const db = new DatabaseService();
