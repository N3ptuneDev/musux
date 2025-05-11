import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Sidebar = () => {
  const [location] = useLocation();
  
  const { data: userPlaylists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['/api/spotify/playlists'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <aside className="hidden md:block w-64 bg-black flex-shrink-0 overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
            <i className="ri-music-2-line text-black"></i>
          </div>
          <h1 className="text-2xl font-bold text-white">MusuX</h1>
        </div>

        <nav className="space-y-6">
          <div>
            <div className="text-[#B3B3B3] font-medium mb-4">MENU</div>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className={`flex items-center ${location === "/" ? "text-white" : "text-[#B3B3B3]"} hover:text-white transition-colors py-2`}>
                    <i className="ri-home-4-line mr-4"></i> Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <a className={`flex items-center ${location === "/search" ? "text-white" : "text-[#B3B3B3]"} hover:text-white transition-colors py-2`}>
                    <i className="ri-search-line mr-4"></i> Search
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/library">
                  <a className={`flex items-center ${location === "/library" ? "text-white" : "text-[#B3B3B3]"} hover:text-white transition-colors py-2`}>
                    <i className="ri-album-line mr-4"></i> Library
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/playlist/liked">
                  <a className={`flex items-center ${location === "/playlist/liked" ? "text-white" : "text-[#B3B3B3]"} hover:text-white transition-colors py-2`}>
                    <i className="ri-heart-line mr-4"></i> Liked Songs
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[#B3B3B3] font-medium mb-4">YOUR PLAYLISTS</div>
            <ul className="space-y-2">
              {isLoadingPlaylists ? (
                Array(4).fill(0).map((_, i) => (
                  <li key={i} className="py-2">
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 rounded mr-4" />
                      <Skeleton className="h-4 w-32 rounded" />
                    </div>
                  </li>
                ))
              ) : userPlaylists?.items?.length ? (
                userPlaylists.items.map((playlist) => (
                  <li key={playlist.id}>
                    <Link href={`/playlist/${playlist.id}`}>
                      <a className={`flex items-center text-[#B3B3B3] hover:text-white transition-colors py-2 truncate ${location === `/playlist/${playlist.id}` ? "text-white" : ""}`}>
                        <i className="ri-folder-music-line mr-4"></i> {playlist.name}
                      </a>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-[#B3B3B3] py-2">No playlists found</li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
