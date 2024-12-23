import React from 'react';
import PlaylistCard from './PlaylistCard';
import { YouTubePlaylist } from '../../types/youtube';

interface PlaylistListProps {
  playlists: YouTubePlaylist[];
  selectedPlaylistId: string | null;
  onPlaylistSelect: (playlistId: string) => void;
}

export const PlaylistList = ({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect
}: PlaylistListProps) => {
  return (
    <div className="space-y-4 p-4">
      {playlists.map(playlist => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isSelected={playlist.id === selectedPlaylistId}
          onClick={() => onPlaylistSelect(playlist.id)}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
