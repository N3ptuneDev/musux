import { useQuery } from "@tanstack/react-query";
import PlaylistCard from "@/components/music/PlaylistCard";
import AlbumCard from "@/components/music/AlbumCard";
import { Skeleton } from "@/components/ui/skeleton";
import TrackList from "@/components/music/TrackList";

const Home = () => {
  // Featured playlists
  const { data: featuredPlaylists, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['/api/spotify/browse/featured-playlists'],
  });

  // New releases
  const { data: newReleases, isLoading: isLoadingReleases } = useQuery({
    queryKey: ['/api/spotify/browse/new-releases'],
  });

  // Recently played tracks
  const { data: recentlyPlayed, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/spotify/player/recently-played'],
  });

  return (
    <div className="p-4 md:p-8 pt-0 md:pt-0">
      {/* Featured For You Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">For You</h2>
          <a href="#" className="text-[#B3B3B3] hover:text-white text-sm transition-colors">See All</a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoadingFeatured ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-[#181818] rounded-lg p-4">
                <Skeleton className="w-full aspect-square rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))
          ) : featuredPlaylists?.playlists?.items?.length ? (
            featuredPlaylists.playlists.items.slice(0, 5).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-[#B3B3B3]">No featured playlists available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recently Played Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recently Played</h2>
          <a href="#" className="text-[#B3B3B3] hover:text-white text-sm transition-colors">View History</a>
        </div>
        
        {isLoadingRecent ? (
          <div className="bg-[#181818] rounded-xl p-4">
            <div className="animate-pulse space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : recentlyPlayed?.items?.length ? (
          <TrackList 
            tracks={recentlyPlayed.items.map((item) => item.track)}
          />
        ) : (
          <div className="bg-[#181818] rounded-xl p-8 text-center">
            <p className="text-[#B3B3B3]">No recently played tracks</p>
          </div>
        )}
      </div>
      
      {/* New Releases Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <a href="#" className="text-[#B3B3B3] hover:text-white text-sm transition-colors">Explore More</a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingReleases ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-[#181818] rounded-lg p-4">
                <Skeleton className="w-full aspect-square rounded-md mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))
          ) : newReleases?.albums?.items?.length ? (
            newReleases.albums.items.slice(0, 4).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-[#B3B3B3]">No new releases available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
