import React, { createContext, useContext, ReactNode } from 'react';
import { DndContext, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';

interface DragDropContextValue {
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
}

const DragDropContext = createContext<DragDropContextValue | undefined>(undefined);

interface DragDropProviderProps {
  children: ReactNode;
  onVideoMove?: (videoId: string, targetPlaylistId: string) => Promise<void>;
}

export const DragDropProvider = ({ children, onVideoMove }: DragDropProviderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !onVideoMove) return;

    const videoId = active.data.current?.videoId;
    const targetPlaylistId = over.data.current?.playlistId;
    
    if (videoId && targetPlaylistId) {
      try {
        await onVideoMove(videoId, targetPlaylistId);
      } catch (error) {
        console.error('Failed to move video:', error);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

export default DragDropProvider;
