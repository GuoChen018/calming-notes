# Editor Versions

This project has two complete editor implementations saved in different Git branches:

## 🎯 Current Version (TipTap)
**Branch:** `main`
- **Editor:** TipTap with Expo DOM Components
- **Status:** Stable, fully working
- **Features:** All formatting, custom icons, smooth animations
- **Data:** All your existing notes

## 🚀 Alternative Version (Lexical)
**Branch:** `lexical-migration`  
- **Editor:** Lexical with DOM Components
- **Status:** Complete implementation with data migration
- **Performance:** ~1.5-2x faster than TipTap
- **Features:** All same features + better performance
- **Data Migration:** Safely converts TipTap notes to preserve content

## How to Switch Versions

### Switch to Lexical (faster performance):
```bash
git checkout lexical-migration
npm install  # Install Lexical dependencies
```

### Switch back to TipTap (current stable):
```bash
git checkout main
```

### Check which version you're on:
```bash
git branch
```

## Notes
- Both versions have identical features and UI
- Lexical version includes data migration to preserve existing notes
- Switching is instant and safe - no data loss
- All commits and history preserved on both branches

Last updated: December 2024
