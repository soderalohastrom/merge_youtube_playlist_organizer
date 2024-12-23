import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import { YouTubePlaylist } from '../../types/youtube';
import { List } from 'lucide-react';

interface PlaylistCardProps {
  playlist: YouTubePlaylist;
  isSelected: boolean;
  onClick: () => void;
}

export const PlaylistCard = ({
  playlist,
  isSelected,
  onClick
}: PlaylistCardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: playlist.id,
    data: {
      type: 'playlist',
      playlistId: playlist.id
    }
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg cursor-pointer transition-all",
        isSelected ? "bg-youtube-red text-white" : "bg-white hover:bg-gray-50",
        isOver && !isSelected && "bg-gray-100 ring-2 ring-youtube-red ring-opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          {playlist.snippet.thumbnails.default ? (
            <img
              src={playlist.snippet.thumbnails.default.url}
              alt={playlist.snippet.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <List className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-sm font-medium truncate",
            isSelected ? "text-white" : "text-gray-900"
          )}>
            {playlist.snippet.title}
          </h3>
          <p className={cn(
            "text-xs truncate mt-1",
            isSelected ? "text-white/80" : "text-gray-500"
          )}>
            {playlist.contentDetails.itemCount} videos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
