import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

interface PlaylistActionsProps {
  onCreatePlaylist: () => void;
  onEditPlaylist: () => void;
  onDeletePlaylist: () => void;
  canEdit: boolean;
}

export const PlaylistActions = ({
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  canEdit
}: PlaylistActionsProps) => {
  return (
    <div className="flex items-center justify-between border-t pt-4 mt-4">
      <button
        onClick={onCreatePlaylist}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-youtube-red rounded-md hover:bg-red-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Playlist
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={onEditPlaylist}
          disabled={!canEdit}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDeletePlaylist}
          disabled={!canEdit}
          className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PlaylistActions;
