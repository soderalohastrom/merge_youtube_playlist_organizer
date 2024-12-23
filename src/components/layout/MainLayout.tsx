import React, { useState } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useYouTube } from '../../contexts/YouTubeContext';
import { ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable';
import PlaylistPanel from './PlaylistPanel';
import VideoPanel from './VideoPanel';
import { YouTubePlaylist, YouTubeVideo } from '../../types/youtube';

type QueryKeys = ['playlists'] | ['playlist-videos', string | null];

export const MainLayout = () => {
  const { youtubeService } = useYouTube();
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const playlistsQuery: UseQueryResult<YouTubePlaylist[], Error> = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const result = await youtubeService?.getPlaylists();
      return result ?? [];
    },
    enabled: !!youtubeService,
  });

  const videosQuery: UseQueryResult<YouTubeVideo[], Error> = useQuery({
    queryKey: ['playlist-videos', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return [];
      const result = await youtubeService?.getPlaylistVideos(selectedPlaylistId);
      return result ?? [];
    },
    enabled: !!youtubeService && !!selectedPlaylistId,
  });

  const playlists = playlistsQuery.data ?? [];
  const videos = videosQuery.data ?? [];

  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  const handleVideoMove = async (videoId: string, targetPlaylistId: string) => {
    if (!youtubeService || !selectedPlaylistId) return;

    try {
      await youtubeService.moveVideo(videoId, selectedPlaylistId, targetPlaylistId);
      await queryClient.invalidateQueries<QueryKeys>(['playlist-videos']);
      await queryClient.invalidateQueries<QueryKeys>(['playlists']);
    } catch (error) {
      console.error('Error moving video:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!youtubeService) return;

    try {
      const title = prompt('Enter playlist name:');
      if (!title) return;

      await youtubeService.createPlaylist(title);
      await queryClient.invalidateQueries<QueryKeys>(['playlists']);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleEditPlaylist = async () => {
    if (!youtubeService || !selectedPlaylistId) return;

    try {
      const playlist = playlists.find((p: YouTubePlaylist) => p.id === selectedPlaylistId);
      if (!playlist) return;

      const title = prompt('Enter new playlist name:', playlist.snippet.title);
      if (!title) return;

      await youtubeService.updatePlaylist(selectedPlaylistId, title);
      await queryClient.invalidateQueries<QueryKeys>(['playlists']);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!youtubeService || !selectedPlaylistId) return;

    try {
      const confirmed = window.confirm('Are you sure you want to delete this playlist?');
      if (!confirmed) return;

      await youtubeService.deletePlaylist(selectedPlaylistId);
      setSelectedPlaylistId(null);
      await queryClient.invalidateQueries<QueryKeys>(['playlists']);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={20}>
        <PlaylistPanel
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={handlePlaylistSelect}
          onCreatePlaylist={handleCreatePlaylist}
          onEditPlaylist={handleEditPlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          isLoading={playlistsQuery.isLoading}
        />
      </ResizablePanel>
      <ResizablePanel defaultSize={70} minSize={30}>
        <VideoPanel
          videos={videos}
          isLoading={videosQuery.isLoading}
          onVideoMove={handleVideoMove}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MainLayout;
