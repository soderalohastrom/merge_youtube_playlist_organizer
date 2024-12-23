import { YouTubePlaylist, YouTubeVideo } from '../types/youtube';

export default class YouTubeService {
  private accessToken: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getPlaylists(): Promise<YouTubePlaylist[]> {
    const response = await this.fetchWithAuth(
      '/playlists?part=snippet,contentDetails&mine=true&maxResults=50'
    );
    return response.items;
  }

  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    const response = await this.fetchWithAuth(
      `/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50`
    );
    return response.items;
  }

  async createPlaylist(title: string): Promise<YouTubePlaylist> {
    const response = await this.fetchWithAuth('/playlists?part=snippet,contentDetails', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          title,
          description: '',
          privacyStatus: 'private'
        }
      })
    });
    return response;
  }

  async updatePlaylist(playlistId: string, title: string): Promise<void> {
    await this.fetchWithAuth(`/playlists?part=snippet`, {
      method: 'PUT',
      body: JSON.stringify({
        id: playlistId,
        snippet: {
          title
        }
      })
    });
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await this.fetchWithAuth(`/playlists?id=${playlistId}`, {
      method: 'DELETE'
    });
  }

  async moveVideo(videoId: string, sourcePlaylistId: string, targetPlaylistId: string): Promise<void> {
    // First, get the video details from the source playlist
    const response = await this.fetchWithAuth(
      `/playlistItems?part=snippet&playlistId=${sourcePlaylistId}&videoId=${videoId}`
    );
    const videoItem = response.items[0];

    // Insert the video into the target playlist
    await this.fetchWithAuth('/playlistItems?part=snippet', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          playlistId: targetPlaylistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      })
    });

    // Remove the video from the source playlist
    await this.fetchWithAuth(`/playlistItems?id=${videoItem.id}`, {
      method: 'DELETE'
    });
  }
}
