import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration?: string;
  channelTitle?: string;
}

export const VideoCard = ({
  id,
  title,
  thumbnailUrl,
  duration,
  channelTitle
}: VideoCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      type: 'video',
      videoId: id
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "video-card group cursor-move p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all",
        isDragging && "opacity-50 shadow-lg"
      )}
      style={style}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full aspect-video object-cover rounded-md"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-75 rounded">
            {duration}
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
        {channelTitle && (
          <p className="text-xs text-gray-500 mt-1">{channelTitle}</p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
