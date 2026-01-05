# MotionDeck

YouTube content creators presentation editor with animated slides.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- IndexedDB for storage
- lucide-react for icons

## Project Structure

```
src/app/
  page.tsx      # Main editor component (~2000 lines)
  db.ts         # IndexedDB helpers
  layout.tsx    # Root layout with metadata
  globals.css   # Global styles
```

## Key Features

- Project management (create/save/load)
- Slide editor (text/image/icon/code/shape elements)
- Drag & resize for all elements
- Slide reorder, duplicate, delete
- Element layer ordering (move up/down/top/bottom)
- Undo/Redo (Ctrl+Z, Ctrl+Shift+Z)
- Font options (family, bold, italic, underline, alignment)
- Gradient backgrounds (12 presets)
- Dual monitor presenter mode (audience window + presenter notes)
- Image auto-compression
- Export/Import (JSON)

## Development

```bash
npm run dev    # Start dev server (default port 3000)
npm run build  # Production build
npm run lint   # ESLint
```

## Architecture Notes

- BroadcastChannel API for cross-window sync (presenter mode)
- IndexedDB for large data storage (replaces localStorage)
- Canvas API for image compression
- HTML5 Drag and Drop for slide reordering
- History state management for Undo/Redo
