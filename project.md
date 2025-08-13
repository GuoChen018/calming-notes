# RFC: Calming Notes App – Mobile MVP with Slate.js Editor

**Author:** [Your Name]  
**Date:** 2025-08-12  
**Status:** Draft  
**Target Release:** MVP in ~4–6 weeks  
**Version:** 0.2

---

## 1. Summary

This document defines the plan for building **Calming Notes**, a mobile-first notes app with a **beautiful, calming, smooth** experience.  
The MVP will focus on **Android + iOS** via **Expo (React Native)**, using **TipTap** within DOM components for Notion-style rich text editing, stored as structured JSON, and synced via Supabase.

---

## 2. Goals

- **Fast & smooth** → Instant typing and navigation.
- **Offline-first** → SQLite local storage.
- **Rich text editing** with inline styles + block types.
- **Notion-like shortcuts** for creating lists, quotes, etc.
- **Font customization** for personal preference.
- **Sync to cloud** in Phase 2 (Supabase).
- **Cross-platform ready** for future web/desktop launch.

---

## 3. Non-Goals (for MVP)

- Real-time collaboration.
- Complex conflict resolution (latest edit wins only).
- Encryption (Phase 3+).
- Advanced organization (tags/folders).

---

## 4. Tech Stack

| Layer              | Choice                               | Notes |
|--------------------|--------------------------------------|-------|
| Framework          | Expo (React Native)                  | Mobile-first, OTA updates |
| Editor             | TipTap in DOM Components             | Rich text with nested lists |
| WebView            | `react-native-webview`               | For DOM component rendering |
| State Management   | Zustand                              | Lightweight store |
| Local Storage      | Expo SQLite                          | Offline persistence |
| Sync (Phase 2)     | Supabase (PostgreSQL + Auth)          | Easy cloud sync |
| Animations         | Moti + Reanimated 3                   | Smooth micro-interactions |
| Fonts              | `expo-font`                          | User font picker |
| Theming            | Tailwind RN (`nativewind`)           | Theme switching support |

---

## 5. Feature Requirements

### 5.1 MVP Editor Features

**Inline formatting:**
- Bold
- Italic
- Underline
- Strikethrough
- Text color
- Highlight color
- Inline code
- Hyperlink

**Block types:**
- Paragraph
- Nested bullet lists (`* ` shortcut)
- Nested numbered lists (`1. ` shortcut)
- Quote blocks
- Code block (`` ``` `` shortcut)

**Other:**
- Debounced auto-save (750ms after typing stops).
- Works fully offline, saves to SQLite immediately.
- Last edit wins on sync.

---

## 6. Storage & Sync

**Format:**  
- Store notes as a **TipTap JSON document** in SQLite (`TEXT` column for serialized JSON).
- Each note row:

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  content_json TEXT,
  updated_at INTEGER,
  created_at INTEGER
);
```

**Note IDs:**
- Use UUIDs (v4) generated client-side for offline compatibility
- No title field - derive preview from first 50-100 characters of content

**Sync logic:**
- Supabase in Phase 2 for cloud storage + auth.
- Sync direction: push/pull on app open, note save, and periodically in background.
- Conflict resolution: last edit wins based on `updated_at`.

---

## 7. File Structure Proposal

```
/src
  /components
    NoteCard.tsx
    Toolbar.tsx
  /screens
    NotesListScreen.tsx
    NoteEditorScreen.tsx
    SettingsScreen.tsx
  /editor
    TipTapEditor.tsx      # DOM component with TipTap
    plugins/              # TipTap extensions and customizations
  /hooks
    useNotes.ts
    useFonts.ts
  /store
    notesStore.ts
    settingsStore.ts
  /services
    db.ts                 # SQLite wrapper
    sync.ts               # Supabase sync (Phase 2)
  /theme
    colors.ts
    typography.ts
  App.tsx
/docs
  RFC-notes-app.mdx       # This file
```

---

## 8. Development Plan

### Phase 1 (Weeks 1–3)
- Set up Expo project with DOM components support.
- Install and configure `react-native-webview`.
- Implement SQLite storage layer with UUID-based note IDs.
- Create TipTap DOM component with inline formatting and nested lists.
- Add toolbar UI for formatting (within DOM component).
- Implement debounced auto-save (750ms).
- Add font picker and theme switching.
- Smooth animations for navigation.

### Phase 2 (Weeks 4–6)
- Integrate Supabase auth + sync.
- Implement background sync.
- Handle last-edit-wins conflict resolution.
- Optimize editor performance.

### Phase 3+ (Post-MVP)
- Encryption.
- Richer block types (tables, images).
- Web + desktop version.