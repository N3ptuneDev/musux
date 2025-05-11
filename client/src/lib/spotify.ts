import { apiRequest } from "./queryClient";
import {
  SearchResults,
  PlaylistItem,
  Track,
  Album,
  Artist,
  User,
  PlaybackState
} from "@/types/spotify";

// Spotify API client
export const spotify = {
  // Authentication
  login: async () => {
    window.location.href = "/.netlify/functions/api/spotify/login";
  },

  logout: async () => {
    await apiRequest("POST", "/.netlify/functions/api/spotify/logout", {});
    window.location.href = "/login";
  },

  // User
  getMe: async (): Promise<User> => {
    const response = await apiRequest("GET", "/.netlify/functions/api/spotify/me");
    return response.json();
  },

  // Browse
  getFeaturedPlaylists: async (): Promise<{ playlists: { items: PlaylistItem[] } }> => {
    const response = await apiRequest("GET", "/.netlify/functions/api/spotify/browse/featured-playlists");
    return response.json();
  },

  getNewReleases: async (): Promise<{ albums: { items: Album[] } }> => {
    const response = await apiRequest("GET", "/.netlify/functions/api/spotify/browse/new-releases");
    return response.json();
  },

  // Playlists
  getUserPlaylists: async (): Promise<{ items: PlaylistItem[] }> => {
    const response = await apiRequest("GET", "/.netlify/functions/api/spotify/playlists");
    return response.json();
  },

  getPlaylist: async (playlistId: string): Promise<PlaylistItem> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/playlists/${playlistId}`);
    return response.json();
  },

  getPlaylistTracks: async (playlistId: string): Promise<{ items: { track: Track, added_at: string }[] }> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/playlists/${playlistId}/tracks`);
    return response.json();
  },

  // Albums
  getAlbum: async (albumId: string): Promise<Album> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/albums/${albumId}`);
    return response.json();
  },

  getAlbumTracks: async (albumId: string): Promise<{ items: Track[] }> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/albums/${albumId}/tracks`);
    return response.json();
  },

  // Tracks
  getTrack: async (trackId: string): Promise<Track> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/tracks/${trackId}`);
    return response.json();
  },

  // Search
  search: async (query: string, types: string[] = ["track", "album", "artist", "playlist"]): Promise<SearchResults> => {
    const response = await apiRequest("GET", `/.netlify/functions/api/spotify/search?q=${encodeURIComponent(query)}&type=${types.join(",")}`);
    return response.json();
  },

  // Player
  getPlaybackState: async (): Promise<PlaybackState> => {
    const response = await apiRequest("GET", "/.netlify/functions/api/spotify/player");
    return response.json();
  },

  play: async (params?: { context_uri?: string; uris?: string[]; offset?: number }): Promise<void> => {
    await apiRequest("PUT", "/.netlify/functions/api/spotify/player/play", params);
  },

  pause: async (): Promise<void> => {
    await apiRequest("PUT", "/.netlify/functions/api/spotify/player/pause");
  },

  next: async (): Promise<void> => {
    await apiRequest("POST", "/.netlify/functions/api/spotify/player/next");
  },

  previous: async (): Promise<void> => {
    await apiRequest("POST", "/.netlify/functions/api/spotify/player/previous");
  },

  seek: async (position_ms: number): Promise<void> => {
    await apiRequest("PUT", `/.netlify/functions/api/spotify/player/seek?position_ms=${position_ms}`);
  },

  setVolume: async (volume_percent: number): Promise<void> => {
    await apiRequest("PUT", `/.netlify/functions/api/spotify/player/volume?volume_percent=${volume_percent}`);
  },
};
