import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import PlaylistCard from "@/components/music/PlaylistCard";
import AlbumCard from "@/components/music/AlbumCard";
import TrackList from "@/components/music/TrackList";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults } from "@/types/spotify";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState("all");

  // Search query
  const { 
    data: searchResults,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch
  } = useQuery<SearchResults>({
    queryKey: ['/api/spotify/search', debouncedQuery],
    enabled: debouncedQuery.length > 1,
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Update the URL query parameter when search changes
  useEffect(() => {
    const newUrl = debouncedQuery 
      ? `/search?q=${encodeURIComponent(debouncedQuery)}` 
      : '/search';
    
    window.history.replaceState(null, '', newUrl);
  }, [debouncedQuery]);

  // Get search query from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q');
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, []);

  return (
    <div className="p-4 md:p-8 pt-0 md:pt-0">
      {/* Search Bar (Mobile only) */}
      <div className="md:hidden mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search songs, artists, albums..." 
            className="w-full bg-[#181818] text-white border-none rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1DB954]" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-[#B3B3B3]"></i>
        </div>
      </div>

      {!debouncedQuery && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4"><i className="ri-search-line"></i></div>
          <h2 className="text-2xl font-bold mb-2">Search for music</h2>
          <p className="text-[#B3B3B3]">Find your favorite songs, artists, albums, and playlists</p>
        </div>
      )}

      {debouncedQuery && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Search results for "{debouncedQuery}"</h1>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[#181818]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="albums">Albums</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="artists">Artists</TabsTrigger>
              </TabsList>
              
              {(isLoadingSearch || isFetchingSearch) && (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1DB954]"></div>
                </div>
              )}

              {!isLoadingSearch && !isFetchingSearch && searchResults && (
                <>
                  <TabsContent value="all">
                    {/* Top Results */}
                    <div className="mb-10">
                      <h2 className="text-xl font-bold mb-4">Top Result</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.tracks?.items?.[0] && (
                          <div className="bg-[#181818] hover:bg-[#282828] transition-colors rounded-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                              {searchResults.tracks.items[0].album?.images?.[0]?.url && (
                                <img 
                                  src={searchResults.tracks.items[0].album.images[0].url} 
                                  alt={searchResults.tracks.items[0].name} 
                                  className="w-24 h-24 rounded shadow-lg mr-4" 
                                />
                              )}
                              <div>
                                <h3 className="text-xl font-bold text-white">{searchResults.tracks.items[0].name}</h3>
                                <p className="text-[#B3B3B3]">
                                  {searchResults.tracks.items[0].artists.map(a => a.name).join(", ")}
                                </p>
                                <p className="text-[#B3B3B3] text-sm mt-1">Song</p>
                              </div>
                            </div>
                            <button className="mt-auto bg-[#1DB954] hover:bg-opacity-80 transition-colors rounded-full px-8 py-2 text-black font-medium self-start">
                              Play
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tracks */}
                    {searchResults.tracks?.items?.length > 0 && (
                      <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Tracks</h2>
                          {searchResults.tracks.items.length > 5 && (
                            <button 
                              className="text-[#B3B3B3] hover:text-white transition-colors text-sm"
                              onClick={() => setActiveTab("tracks")}
                            >
                              See all
                            </button>
                          )}
                        </div>
                        <TrackList 
                          tracks={searchResults.tracks.items.slice(0, 5)} 
                          showAlbum={true}
                          showDateAdded={false}
                        />
                      </div>
                    )}
                    
                    {/* Albums */}
                    {searchResults.albums?.items?.length > 0 && (
                      <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Albums</h2>
                          {searchResults.albums.items.length > 5 && (
                            <button 
                              className="text-[#B3B3B3] hover:text-white transition-colors text-sm"
                              onClick={() => setActiveTab("albums")}
                            >
                              See all
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {searchResults.albums.items.slice(0, 5).map((album) => (
                            <AlbumCard key={album.id} album={album} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Playlists */}
                    {searchResults.playlists?.items?.length > 0 && (
                      <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Playlists</h2>
                          {searchResults.playlists.items.length > 5 && (
                            <button 
                              className="text-[#B3B3B3] hover:text-white transition-colors text-sm"
                              onClick={() => setActiveTab("playlists")}
                            >
                              See all
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {searchResults.playlists.items.slice(0, 5).map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Artists */}
                    {searchResults.artists?.items?.length > 0 && (
                      <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Artists</h2>
                          {searchResults.artists.items.length > 5 && (
                            <button 
                              className="text-[#B3B3B3] hover:text-white transition-colors text-sm"
                              onClick={() => setActiveTab("artists")}
                            >
                              See all
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {searchResults.artists.items.slice(0, 5).map((artist) => (
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
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="tracks">
                    {searchResults.tracks?.items?.length > 0 ? (
                      <TrackList 
                        tracks={searchResults.tracks.items} 
                        showAlbum={true}
                        showDateAdded={false}
                      />
                    ) : (
                      <div className="py-6 text-center text-[#B3B3B3]">No tracks found</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="albums">
                    {searchResults.albums?.items?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {searchResults.albums.items.map((album) => (
                          <AlbumCard key={album.id} album={album} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-[#B3B3B3]">No albums found</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="playlists">
                    {searchResults.playlists?.items?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {searchResults.playlists.items.map((playlist) => (
                          <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-[#B3B3B3]">No playlists found</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="artists">
                    {searchResults.artists?.items?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {searchResults.artists.items.map((artist) => (
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
                      <div className="py-6 text-center text-[#B3B3B3]">No artists found</div>
                    )}
                  </TabsContent>
                </>
              )}
              
              {!isLoadingSearch && debouncedQuery && !searchResults && (
                <div className="py-8 text-center">
                  <p className="text-[#B3B3B3]">No results found for "{debouncedQuery}"</p>
                </div>
              )}
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
