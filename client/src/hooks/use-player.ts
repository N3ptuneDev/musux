import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { spotify } from "@/lib/spotify";
import { Track } from "@/types/spotify";
import { useToast } from "@/hooks/use-toast";

export function usePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressInterval = useRef<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current playback state
  const { data: playbackState } = useQuery({
    queryKey: ['/api/spotify/player'],
    refetchInterval: 10000, // Poll every 10 seconds
    onSuccess: (data) => {
      if (data) {
        setIsPlaying(data.is_playing);
        setCurrentTrack(data.item);
        setProgress(data.progress_ms / 1000);
        setDuration(data.item?.duration_ms / 1000 || 0);

        // Start progress timer if playing
        if (data.is_playing) {
          startProgressTimer();
        } else {
          stopProgressTimer();
        }
      }
    },
    onError: () => {
      stopProgressTimer();
    }
  });

  // Play mutation
  const playMutation = useMutation({
    mutationFn: (params: { 
      context_uri?: string; 
      uris?: string[]; 
      offset?: number 
    }) => spotify.play(params),
    onSuccess: () => {
      setIsPlaying(true);
      queryClient.invalidateQueries({ queryKey: ['/api/spotify/player'] });
      startProgressTimer();
    },
    onError: (error) => {
      console.error("Play error:", error);
      toast({
        title: "Playback Failed",
        description: "Could not play track. Make sure Spotify is active on a device.",
        variant: "destructive"
      });
    }
  });

  // Pause mutation
  const pauseMutation = useMutation({
    mutationFn: spotify.pause,
    onSuccess: () => {
      setIsPlaying(false);
      queryClient.invalidateQueries({ queryKey: ['/api/spotify/player'] });
      stopProgressTimer();
    },
    onError: (error) => {
      console.error("Pause error:", error);
      toast({
        title: "Pause Failed",
        description: "Could not pause playback",
        variant: "destructive"
      });
    }
  });

  // Next track mutation
  const nextTrackMutation = useMutation({
    mutationFn: spotify.next,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotify/player'] });
    },
    onError: (error) => {
      console.error("Next track error:", error);
      toast({
        title: "Skip Failed",
        description: "Could not skip to next track",
        variant: "destructive"
      });
    }
  });

  // Previous track mutation
  const previousTrackMutation = useMutation({
    mutationFn: spotify.previous,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotify/player'] });
    },
    onError: (error) => {
      console.error("Previous track error:", error);
      toast({
        title: "Previous Failed",
        description: "Could not go to previous track",
        variant: "destructive"
      });
    }
  });

  // Seek mutation
  const seekMutation = useMutation({
    mutationFn: (position_ms: number) => spotify.seek(position_ms),
    onSuccess: (_, position_ms) => {
      setProgress(position_ms / 1000);
    },
    onError: (error) => {
      console.error("Seek error:", error);
    }
  });

  // Volume mutation
  const volumeMutation = useMutation({
    mutationFn: (volume_percent: number) => spotify.setVolume(volume_percent),
    onError: (error) => {
      console.error("Volume error:", error);
    }
  });

  // Start progress timer
  const startProgressTimer = useCallback(() => {
    stopProgressTimer();
    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) {
          stopProgressTimer();
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  }, [duration]);

  // Stop progress timer
  const stopProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      stopProgressTimer();
    };
  }, [stopProgressTimer]);

  // Play a track
  const playTrack = useCallback((track: Track, contextUri?: string, offset?: number) => {
    if (contextUri) {
      playMutation.mutate({
        context_uri: contextUri,
        offset: { position: offset || 0 }
      });
    } else {
      playMutation.mutate({
        uris: [track.uri]
      });
    }
    setCurrentTrack(track);
  }, [playMutation]);

  // Play a context (album, playlist)
  const playContext = useCallback((contextUri: string, offset?: number) => {
    playMutation.mutate({
      context_uri: contextUri,
      offset: offset !== undefined ? { position: offset } : undefined
    });
  }, [playMutation]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseMutation.mutate();
    } else if (currentTrack) {
      playMutation.mutate({});
    }
  }, [isPlaying, currentTrack, pauseMutation, playMutation]);

  // Next track
  const nextTrack = useCallback(() => {
    nextTrackMutation.mutate();
  }, [nextTrackMutation]);

  // Previous track
  const previousTrack = useCallback(() => {
    previousTrackMutation.mutate();
  }, [previousTrackMutation]);

  // Seek to position
  const seek = useCallback((seconds: number) => {
    const position_ms = Math.floor(seconds * 1000);
    seekMutation.mutate(position_ms);
  }, [seekMutation]);

  // Set volume
  const setVolume = useCallback((volume_percent: number) => {
    volumeMutation.mutate(volume_percent);
  }, [volumeMutation]);

  return {
    isPlaying,
    currentTrack,
    progress,
    duration,
    playTrack,
    playContext,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume
  };
}
