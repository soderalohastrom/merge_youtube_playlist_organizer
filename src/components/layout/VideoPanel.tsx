import React, { useState, useMemo } from 'react';
import { YouTubeVideo } from '../../types/youtube';
import VideoGrid from '../video/VideoGrid';
import VideoActions from '../video/VideoActions';

interface VideoPanelProps {
  videos: YouTubeVideo[];
  isLoading: boolean;
  onVideoMove: (videoId: string, targetPlaylistId: string) => Promise<void>;
}

export const VideoPanel = ({
  videos,
  isLoading,
  onVideoMove
}: VideoPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'date'>('title');

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(video => 
      video.snippet.title.toLowerCase().includes(query) ||
      video.snippet.description.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  const sortedVideos = useMemo(() => {
    return [...filteredVideos].sort((a, b) => {
      if (sortBy === 'title') {
        return a.snippet.title.localeCompare(b.snippet.title);
      }
      // Sort by date if contentDetails exists, otherwise keep original order
      const dateA = a.contentDetails?.videoPublishedAt;
      const dateB = b.contentDetails?.videoPublishedAt;
      if (dateA && dateB) {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      return 0;
    });
  }, [filteredVideos, sortBy]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-lg">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <VideoActions
        onSearch={setSearchQuery}
        onSort={() => setSortBy(sortBy === 'title' ? 'date' : 'title')}
      />
      <div className="flex-1 overflow-y-auto">
        <VideoGrid videos={sortedVideos} onVideoMove={onVideoMove} />
      </div>
    </div>
  );
};

export default VideoPanel;
