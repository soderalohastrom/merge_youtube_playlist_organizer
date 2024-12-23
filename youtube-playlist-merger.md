# YouTube Playlist Organizer Feature Merge Implementation Guide

## Overview
This document outlines the implementation plan for merging two YouTube Playlist Organizer codebases into a single, improved application featuring a split-panel interface with drag-and-drop functionality.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Core Features](#core-features)
- [Implementation Steps](#implementation-steps)
- [Code Integration Points](#code-integration-points)
- [Authentication Implementation](#authentication-implementation)
- [Component Structure](#component-structure)
- [Technical Requirements](#technical-requirements)

## Architecture Overview

### Layout Structure
- Split-screen (50/50) layout
  - Left panel: Playlist categories with edit/delete functionality
  - Right panel: Video content with drag-drop capabilities
- Responsive design with collapsible panels for mobile

### Tech Stack
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- @dnd-kit/core for drag and drop
- @tanstack/react-query for data fetching
- Google OAuth + Supabase Auth
- YouTube Data API

## Core Features

### Preserved Features
1. From playlist-dreamweaver:
   - shadcn/ui components
   - Google OAuth implementation
   - Playlist management UI
   - Toast notifications system

2. From youtube_auth_attempt:
   - Drag and drop functionality
   - Video thumbnail display
   - Session management
   - Error handling

## Implementation Steps

### 1. Base Setup and Authentication
```typescript
// AuthContext.tsx - Extend existing implementation
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  provider: 'google' | 'supabase' | null;
}

const AuthContext = createContext<AuthContextType | null>(null);
```

### 2. Layout Implementation
```typescript
// MainLayout.tsx
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export const MainLayout = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50} minSize={30}>
        <PlaylistPanel />
      </ResizablePanel>
      <ResizablePanel defaultSize={50} minSize={30}>
        <VideoPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
```

### 3. Playlist Panel Integration
```typescript
// PlaylistPanel.tsx - Combine existing Playlist.tsx with drop zone
import { useDroppable } from '@dnd-kit/core';

export const PlaylistPanel = ({ playlist }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `playlist-${playlist.id}`,
    data: { playlistId: playlist.id }
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "playlist-card",
        isOver && "border-2 border-dashed border-youtube-red"
      )}
    >
      {/* Existing Playlist component content */}
    </div>
  );
};
```

### 4. Video Panel Implementation
```typescript
// VideoPanel.tsx - Adapt from youtube_auth_attempt/app.js
import { useDraggable } from '@dnd-kit/core';

export const VideoItem = ({ video }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: video.id,
    data: { videoId: video.id }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="video-item"
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
    >
      <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
      <h3>{video.snippet.title}</h3>
    </div>
  );
};
```

### 5. Drag and Drop Integration
```typescript
// DragDropContext.tsx
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export const DragDropProvider = ({ children }) => {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const videoId = active.data.current?.videoId;
      const targetPlaylistId = over.data.current?.playlistId;
      
      await moveVideoToPlaylist(videoId, targetPlaylistId);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};
```

## Code Integration Points

### Video Loading
```typescript
// Convert to React Query:
export const usePlaylistVideos = (playlistId: string) => {
  return useQuery(['videos', playlistId], () => loadVideos(playlistId));
};
```

### Video Movement
```typescript
export const moveVideoToPlaylist = async (
  videoId: string,
  sourcePlaylistId: string,
  targetPlaylistId: string
) => {
  const response = await fetch('/api/move-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId,
      sourcePlaylistId,
      targetPlaylistId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to move video');
  }

  return response.json();
};
```

## Component Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── PlaylistPanel.tsx
│   │   └── VideoPanel.tsx
│   ├── playlist/
│   │   ├── PlaylistCard.tsx
│   │   ├── PlaylistList.tsx
│   │   └── PlaylistActions.tsx
│   └── video/
│       ├── VideoGrid.tsx
│       ├── VideoCard.tsx
│       └── VideoActions.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── DragDropContext.tsx
└── services/
    ├── youtube.ts
    └── supabase.ts
```

## Technical Requirements

### Dependencies
```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@tanstack/react-query": "^4.0.0"
  }
}
```

### Environment Variables
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Implementation Order
1. Set up project structure and dependencies
2. Implement basic layout with ResizablePanel
3. Port existing Playlist component
4. Add drag and drop infrastructure
5. Implement video panel and grid
6. Add authentication integration
7. Implement data fetching with React Query
8. Add error handling and loading states
9. Implement Supabase integration
10. Add responsive design and mobile support

## Additional Considerations

### Error Handling
- Implement error boundaries
- Add toast notifications for operations
- Handle API rate limiting

### Performance
- Implement virtualization for large playlists
- Use React.memo for video items
- Implement proper suspense boundaries

### Accessibility
- Ensure proper ARIA attributes for drag and drop
- Add keyboard navigation support
- Maintain focus management

### Mobile Support
- Add touch gestures for drag and drop
- Implement responsive layout adjustments
- Add mobile-specific UI improvements