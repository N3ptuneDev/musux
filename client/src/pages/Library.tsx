import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlaylistCard from "@/components/music/PlaylistCard";
import AlbumCard from "@/components/music/AlbumCard";
import { Skeleton } from "@/components/ui/skeleton";

const Library = () => {
  const [activeTab, setActiveTab] = useState("playlists");
  
  // User playlists
  const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['/api/spotify/playlists'],
  });
  
  // Saved albums
  const { data: savedAlbums, isLoading: isLoadingAlbums } = useQuery({
    queryKey: ['/api/spotify/albums/saved'],
  });
  
  // Followed artists
  const { data: followedArtists, isLoading: isLoadingArtists } = useQuery({
    queryKey: ['/api/spotify/artists/followed'],
  });

  return (
    <div className="p-4 md:p-8 pt-0 md:pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Your Library</h1>
        
        <Tabs defaultValue="playlists" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#181818]">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playlists" className="mt-6">
            {isLoadingPlaylists ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#181818] rounded-lg p-4">
                    <Skeleton className="w-full aspect-square rounded-md mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : playlists?.items?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {playlists.items.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <div className="bg-[#181818] rounded-xl p-8 text-center">
                <i className="ri-music-2-line text-4xl mb-4 text-[#B3B3B3]"></i>
                <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
                <p className="text-[#B3B3B3] mb-4">Your playlists will appear here</p>
                <button className="bg-white hover:bg-gray-200 transition-colors text-black rounded-full px-6 py-2 font-medium">
                  Create playlist
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="albums" className="mt-6">
            {isLoadingAlbums ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#181818] rounded-lg p-4">
                    <Skeleton className="w-full aspect-square rounded-md mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : savedAlbums?.items?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {savedAlbums.items.map((item) => (
                  <AlbumCard key={item.album.id} album={item.album} />
                ))}
              </div>
            ) : (
              <div className="bg-[#181818] rounded-xl p-8 text-center">
                <i className="ri-album-line text-4xl mb-4 text-[#B3B3B3]"></i>
                <h3 className="text-lg font-semibold mb-2">No saved albums</h3>
                <p className="text-[#B3B3B3] mb-4">Albums you save will appear here</p>
                <button className="bg-white hover:bg-gray-200 transition-colors text-black rounded-full px-6 py-2 font-medium">
                  Find albums
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="artists" className="mt-6">
            {isLoadingArtists ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#181818] rounded-lg p-4">
                    <Skeleton className="w-full aspect-square rounded-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2 rounded mx-auto" />
                    <Skeleton className="h-3 w-1/2 rounded mx-auto" />
                  </div>
                ))}
              </div>
            ) : followedArtists?.artists?.items?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {followedArtists.artists.items.map((artist) => (
                  <div key={artist.id} className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors cursor-pointer">
                    {artist.images?.[0]?.url ? (
                      <img 
                        src={artist.images[0].url} 
                        alt={artist.name} 
                        className="w-full aspect-square object-cover rounded-full mb-4" 
                      />
                    ) : (
                      <div className="w-full aspect-square bg-[#282828] rounded-full mb-4 flex items-center justify-center">
                        <i className="ri-user-3-line text-4xl text-[#B3B3B3]"></i>
                      </div>
                    )}
                    <h3 className="font-semibold text-white mb-1 truncate text-center">{artist.name}</h3>
                    <p className="text-[#B3B3B3] text-sm truncate text-center">Artist</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#181818] rounded-xl p-8 text-center">
                <i className="ri-user-3-line text-4xl mb-4 text-[#B3B3B3]"></i>
                <h3 className="text-lg font-semibold mb-2">No followed artists</h3>
                <p className="text-[#B3B3B3] mb-4">Artists you follow will appear here</p>
                <button className="bg-white hover:bg-gray-200 transition-colors text-black rounded-full px-6 py-2 font-medium">
                  Find artists
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;
