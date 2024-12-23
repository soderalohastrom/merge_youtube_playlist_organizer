import { YouTubePlaylist, YouTubeVideo } from '../types/youtube';

const MOCK_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: 'mock-1',
    snippet: {
      title: 'Mock Favorites',
      description: 'Mock playlist 1',
      channelTitle: 'Mock Channel',
      thumbnails: {
        default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
        medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
        high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
      }
    },
    contentDetails: { itemCount: 2 }
  },
  {
    id: 'mock-2',
    snippet: {
      title: 'Mock Watch Later',
      description: 'Mock playlist 2',
      channelTitle: 'Mock Channel',
      thumbnails: {
        default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
        medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
        high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
      }
    },
    contentDetails: { itemCount: 3 }
  }
];

const MOCK_VIDEOS: Record<string, YouTubeVideo[]> = {
  'mock-1': [
    {
      id: 'video-1',
      snippet: {
        title: 'Mock Video 1',
        description: 'Mock video description 1',
        channelTitle: 'Mock Channel',
        thumbnails: {
          default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
          medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
          high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
        },
        resourceId: { kind: 'youtube#video', videoId: 'video-1' }
      }
    },
    {
      id: 'video-2',
      snippet: {
        title: 'Mock Video 2',
        description: 'Mock video description 2',
        channelTitle: 'Mock Channel',
        thumbnails: {
          default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
          medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
          high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
        },
        resourceId: { kind: 'youtube#video', videoId: 'video-2' }
      }
    }
  ],
  'mock-2': [
    {
      id: 'video-3',
      snippet: {
        title: 'Mock Video 3',
        description: 'Mock video description 3',
        channelTitle: 'Mock Channel',
        thumbnails: {
          default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
          medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
          high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
        },
        resourceId: { kind: 'youtube#video', videoId: 'video-3' }
      }
    }
  ]
};

export default class MockYouTubeService {
  async getPlaylists(): Promise<YouTubePlaylist[]> {
    return MOCK_PLAYLISTS;
  }

  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    return MOCK_VIDEOS[playlistId] || [];
  }

  async createPlaylist(title: string): Promise<YouTubePlaylist> {
    const newPlaylist: YouTubePlaylist = {
      id: `mock-${Date.now()}`,
      snippet: {
        title,
        description: 'New mock playlist',
        channelTitle: 'Mock Channel',
        thumbnails: {
          default: { url: 'https://via.placeholder.com/120x90', width: 120, height: 90 },
          medium: { url: 'https://via.placeholder.com/320x180', width: 320, height: 180 },
          high: { url: 'https://via.placeholder.com/480x360', width: 480, height: 360 }
        }
      },
      contentDetails: { itemCount: 0 }
    };
    MOCK_PLAYLISTS.push(newPlaylist);
    MOCK_VIDEOS[newPlaylist.id] = [];
    return newPlaylist;
  }

  async updatePlaylist(playlistId: string, title: string): Promise<void> {
    const playlist = MOCK_PLAYLISTS.find(p => p.id === playlistId);
    if (playlist) {
      playlist.snippet.title = title;
    }
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const index = MOCK_PLAYLISTS.findIndex(p => p.id === playlistId);
    if (index !== -1) {
      MOCK_PLAYLISTS.splice(index, 1);
      delete MOCK_VIDEOS[playlistId];
    }
  }

  async moveVideo(videoId: string, sourcePlaylistId: string, targetPlaylistId: string): Promise<void> {
    const sourceVideos = MOCK_VIDEOS[sourcePlaylistId];
    const targetVideos = MOCK_VIDEOS[targetPlaylistId];
    
    if (!sourceVideos || !targetVideos) return;
    
    const videoIndex = sourceVideos.findIndex(v => v.snippet?.resourceId?.videoId === videoId);
    if (videoIndex !== -1) {
      const [video] = sourceVideos.splice(videoIndex, 1);
      targetVideos.push(video);
    }
  }
} 