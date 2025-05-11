// Spotify API Types

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface User {
  display_name: string;
  id: string;
  images: SpotifyImage[];
  uri: string;
  followers?: {
    total: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
  type: string;
}

export interface Album {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
  artists: Artist[];
  type: string;
  tracks?: {
    total: number;
    items?: Track[];
  };
}

export interface Track {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  preview_url: string | null;
  explicit: boolean;
  artists: Artist[];
  album?: Album;
  added_at?: string;
  type: string;
}

export interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  uri: string;
  images: SpotifyImage[];
  owner: User;
  followers?: {
    total: number;
  };
  tracks?: {
    total: number;
    items?: { track: Track; added_at: string }[];
  };
}

export interface SearchResults {
  tracks?: {
    items: Track[];
    total: number;
  };
  albums?: {
    items: Album[];
    total: number;
  };
  artists?: {
    items: Artist[];
    total: number;
  };
  playlists?: {
    items: PlaylistItem[];
    total: number;
  };
}

export interface PlaybackState {
  is_playing: boolean;
  progress_ms: number;
  item: Track | null;
  shuffle_state: boolean;
  repeat_state: string;
  device: {
    id: string;
    name: string;
    volume_percent: number;
  };
  context?: {
    uri: string;
    type: string;
  };
}
