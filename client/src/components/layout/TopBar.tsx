import { useState } from "react";
import { useLocation } from "wouter";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpotifyAuth } from "@/hooks/use-spotify-auth";

const TopBar = () => {
  const [location, navigate] = useLocation();
  const { user, logout } = useSpotifyAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const isSearchPage = location === "/search";

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['/api/spotify/me'],
    enabled: !!user,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isSearchPage) {
      navigate("/search");
    }
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-between sticky top-0 bg-opacity-80 backdrop-blur-md z-10">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <button 
            className="w-8 h-8 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white"
            onClick={() => window.history.back()}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white"
            onClick={() => window.history.forward()}
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        <div className="relative hidden md:block w-64">
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

      {/* User Profile */}
      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center space-x-2 bg-black bg-opacity-40 rounded-full py-1 px-2 hover:bg-opacity-60 transition-colors">
            {isLoadingProfile ? (
              <>
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="w-20 h-4 rounded hidden md:inline" />
              </>
            ) : (
              <>
                <img 
                  src={userProfile?.images?.[0]?.url || "https://via.placeholder.com/40"} 
                  alt="User profile" 
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <span className="text-sm font-medium text-white hidden md:inline">
                  {userProfile?.display_name || user?.username || "User"}
                </span>
              </>
            )}
            <i className="ri-arrow-down-s-line text-white"></i>
          </button>
          
          {/* Dropdown menu (hidden by default) */}
          <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-lg p-1 hidden group-hover:block">
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#383838] rounded"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
