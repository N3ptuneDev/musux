import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import TrackList from "@/components/music/TrackList";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayer } from "@/hooks/use-player";

const Playlist = () => {
  const { id } = useParams();
  const { playContext } = usePlayer();
  
  // Get playlist details
  const { data: playlist, isLoading: isLoadingPlaylist } = useQuery({
    queryKey: ['/api/spotify/playlists', id],
    enabled: !!id,
  });
  
  // Get playlist tracks
  const { data: playlistTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['/api/spotify/playlists', id, 'tracks'],
    enabled: !!id,
  });

  const handlePlay = () => {
    if (playlist) {
      playContext(playlist.uri);
    }
  };

  if (isLoadingPlaylist) {
    return (
      <div className="p-4 md:p-8 pt-0 md:pt-0">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
          <Skeleton className="w-64 h-64 rounded-xl" />
          <div className="flex flex-col">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48 mb-8" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-0 md:pt-0">
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
        {/* Playlist Cover */}
        {playlist?.images?.[0]?.url ? (
          <img 
            src={playlist.images[0].url} 
            alt={playlist.name} 
            className="w-64 h-64 rounded-xl shadow-xl object-cover" 
          />
        ) : (
          <div className="w-64 h-64 rounded-xl bg-[#282828] flex items-center justify-center">
            <i className="ri-music-2-line text-6xl text-[#B3B3B3]"></i>
          </div>
        )}
        
        {/* Playlist Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="text-sm text-white mb-2 font-medium">PLAYLIST</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{playlist?.name}</h1>
            {playlist?.description && (
              <p className="text-[#B3B3B3] text-sm mb-2" dangerouslySetInnerHTML={{ __html: playlist.description }}></p>
            )}
            <div className="flex items-center text-[#B3B3B3] text-sm">
              <span className="font-bold text-white">{playlist?.owner?.display_name}</span>
              <span className="mx-1">•</span>
              <span>{playlist?.followers?.total || 0} likes</span>
              <span className="mx-1">•</span>
              <span>{playlist?.tracks?.total || 0} songs</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="bg-[#1DB954] hover:bg-opacity-80 text-black rounded-full p-3 transition-all"
              onClick={handlePlay}
            >
              <i className="ri-play-fill text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Playlist Tracks */}
      {isLoadingTracks ? (
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
        </div>
      ) : playlistTracks?.items?.length ? (
        <TrackList 
          tracks={playlistTracks.items.map(item => ({
            ...item.track,
            added_at: item.added_at
          }))} 
          contextUri={playlist?.uri}
        />
      ) : (
        <div className="bg-[#181818] rounded-xl p-8 text-center">
          <i className="ri-music-2-line text-4xl mb-4 text-[#B3B3B3]"></i>
          <h3 className="text-lg font-semibold mb-2">No tracks in this playlist</h3>
          <p className="text-[#B3B3B3]">Add some tracks to get started</p>
        </div>
      )}
    </div>
  );
};

export default Playlist;
