import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import PlaylistList from '../playlist/PlaylistList';
import PlaylistActions from '../playlist/PlaylistActions';
import { YouTubePlaylist } from '../../types/youtube';

interface PlaylistPanelProps {
  playlists: YouTubePlaylist[];
  selectedPlaylistId: string | null;
  onPlaylistSelect: (playlistId: string) => void;
  onCreatePlaylist: () => void;
  onEditPlaylist: () => void;
  onDeletePlaylist: () => void;
  isLoading: boolean;
}

export const PlaylistPanel = ({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  isLoading
}: PlaylistPanelProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'playlist-panel',
    data: {
      type: 'playlist-panel'
    }
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-lg">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-full flex flex-col p-4",
        isOver && "bg-gray-100"
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <PlaylistList
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={onPlaylistSelect}
        />
      </div>
      <PlaylistActions
        onCreatePlaylist={onCreatePlaylist}
        onEditPlaylist={onEditPlaylist}
        onDeletePlaylist={onDeletePlaylist}
        canEdit={!!selectedPlaylistId}
      />
    </div>
  );
};

export default PlaylistPanel;
