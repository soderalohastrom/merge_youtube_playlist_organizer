import React from 'react';
import VideoCard from './VideoCard';
import { YouTubeVideo } from '../../types/youtube';

interface VideoGridProps {
  videos: YouTubeVideo[];
  onVideoMove: (videoId: string, targetPlaylistId: string) => Promise<void>;
}

export const VideoGrid = ({ videos, onVideoMove }: VideoGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map(video => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.snippet.title}
          thumbnailUrl={video.snippet.thumbnails.medium.url}
          channelTitle={video.snippet.channelTitle}
          duration={video.contentDetails?.duration}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
