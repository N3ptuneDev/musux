import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePlayer } from "@/hooks/use-player";
import ProgressSlider from "@/components/ui/progress-slider";
import VolumeSlider from "@/components/ui/volume-slider";
import Equalizer from "@/components/ui/equalizer";
import { Skeleton } from "@/components/ui/skeleton";

const PlayerBar = () => {
  const [volume, setVolume] = useState(70);
  const { 
    isPlaying,
    currentTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    progress,
    duration,
    seek,
    setVolume: setPlayerVolume,
  } = usePlayer();

  const { data: trackInfo, isLoading: isLoadingTrack } = useQuery({
    queryKey: ['/api/spotify/track', currentTrack?.id],
    enabled: !!currentTrack?.id,
  });

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setPlayerVolume(value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#282828] border-t border-[#181818] z-30 py-3 px-4">
      <div className="flex items-center justify-between">
        {/* Currently Playing Track */}
        <div className="flex items-center w-1/4">
          {isLoadingTrack ? (
            <>
              <Skeleton className="w-12 h-12 rounded mr-3 hidden sm:block" />
              <div>
                <Skeleton className="h-4 w-24 mb-1 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </>
          ) : currentTrack ? (
            <>
              {trackInfo?.album?.images?.[0]?.url && (
                <img 
                  src={trackInfo.album.images[0].url} 
                  alt={trackInfo.name || "Now playing"} 
                  className="w-12 h-12 rounded object-cover mr-3 hidden sm:block" 
                />
              )}
              <div className="truncate">
                <div className="text-white text-sm font-medium truncate">{trackInfo?.name || currentTrack.name}</div>
                <div className="text-[#B3B3B3] text-xs truncate">
                  {trackInfo?.artists?.map(a => a.name).join(", ") || currentTrack.artists?.map(a => a.name).join(", ")}
                </div>
              </div>
              <button className="text-[#B3B3B3] hover:text-white ml-4 hidden sm:block">
                <i className="ri-heart-line"></i>
              </button>
            </>
          ) : (
            <div className="text-[#B3B3B3] text-sm">No track playing</div>
          )}
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center w-2/4">
          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-1">
            <button className="text-[#B3B3B3] hover:text-white transition-colors">
              <i className="ri-shuffle-line"></i>
            </button>
            <button 
              className="text-[#B3B3B3] hover:text-white transition-colors"
              onClick={previousTrack}
            >
              <i className="ri-skip-back-fill"></i>
            </button>
            <button 
              className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-black`}></i>
            </button>
            <button 
              className="text-[#B3B3B3] hover:text-white transition-colors"
              onClick={nextTrack}
            >
              <i className="ri-skip-forward-fill"></i>
            </button>
            <button className="text-[#B3B3B3] hover:text-white transition-colors">
              <i className="ri-repeat-line"></i>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center justify-center">
            <span className="text-[#B3B3B3] text-xs mr-2 hidden sm:block">
              {formatTime(progress)}
            </span>
            <ProgressSlider
              value={progress}
              max={duration || 100}
              onChange={seek}
            />
            <span className="text-[#B3B3B3] text-xs ml-2 hidden sm:block">
              {formatTime(duration || 0)}
            </span>
          </div>
        </div>
        
        {/* Volume Controls */}
        <div className="flex items-center justify-end w-1/4">
          <div className="flex items-center space-x-2 hidden md:flex">
            <button className="text-[#B3B3B3] hover:text-white transition-colors">
              <i className="ri-volume-up-line"></i>
            </button>
            <VolumeSlider
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          
          {/* Equalizer Animation */}
          {isPlaying && <Equalizer className="ml-4" />}
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
