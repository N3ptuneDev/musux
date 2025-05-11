import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import TrackList from "@/components/music/TrackList";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayer } from "@/hooks/use-player";

const Album = () => {
  const { id } = useParams();
  const { playContext } = usePlayer();
  
  // Get album details
  const { data: album, isLoading: isLoadingAlbum } = useQuery({
    queryKey: ['/api/spotify/albums', id],
    enabled: !!id,
  });
  
  // Get album tracks
  const { data: albumTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['/api/spotify/albums', id, 'tracks'],
    enabled: !!id,
  });

  const handlePlay = () => {
    if (album) {
      playContext(album.uri);
    }
  };

  const formatReleaseDate = (date: string) => {
    if (!date) return "";
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch {
      return date;
    }
  };

  if (isLoadingAlbum) {
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

  // Convert album tracks to standard track format
  const tracks = albumTracks?.items?.map(track => ({
    ...track,
    album: {
      id: album?.id,
      name: album?.name,
      images: album?.images,
      uri: album?.uri
    }
  })) || [];

  return (
    <div className="p-4 md:p-8 pt-0 md:pt-0">
      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
        {/* Album Cover */}
        {album?.images?.[0]?.url ? (
          <img 
            src={album.images[0].url} 
            alt={album.name} 
            className="w-64 h-64 rounded-xl shadow-xl object-cover" 
          />
        ) : (
          <div className="w-64 h-64 rounded-xl bg-[#282828] flex items-center justify-center">
            <i className="ri-album-line text-6xl text-[#B3B3B3]"></i>
          </div>
        )}
        
        {/* Album Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="text-sm text-white mb-2 font-medium">ALBUM</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{album?.name}</h1>
            <div className="flex items-center text-[#B3B3B3] text-sm">
              {album?.artists?.map((artist, index) => (
                <span key={artist.id}>
                  <span className="font-bold text-white">{artist.name}</span>
                  {index < album.artists.length - 1 && <span className="mx-1">•</span>}
                </span>
              ))}
              {album?.release_date && (
                <>
                  <span className="mx-1">•</span>
                  <span>{formatReleaseDate(album.release_date)}</span>
                </>
              )}
              {album?.tracks?.total && (
                <>
                  <span className="mx-1">•</span>
                  <span>{album.tracks.total} songs</span>
                </>
              )}
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
      
      {/* Album Tracks */}
      {isLoadingTracks ? (
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
          <Skeleton className="h-14 w-full rounded" />
        </div>
      ) : tracks.length ? (
        <TrackList 
          tracks={tracks} 
          contextUri={album?.uri}
          showAlbum={false}
          showDateAdded={false}
        />
      ) : (
        <div className="bg-[#181818] rounded-xl p-8 text-center">
          <i className="ri-music-2-line text-4xl mb-4 text-[#B3B3B3]"></i>
          <h3 className="text-lg font-semibold mb-2">No tracks in this album</h3>
        </div>
      )}
    </div>
  );
};

export default Album;
