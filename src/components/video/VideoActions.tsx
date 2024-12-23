import React from 'react';
import { Search, SortAsc } from 'lucide-react';

interface VideoActionsProps {
  onSearch: (query: string) => void;
  onSort: () => void;
}

export const VideoActions = ({
  onSearch,
  onSort
}: VideoActionsProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search videos..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-youtube-red focus:border-transparent"
        />
      </div>
      <button
        onClick={onSort}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Toggle sort order"
      >
        <SortAsc className="w-5 h-5" />
      </button>
    </div>
  );
};

export default VideoActions;
