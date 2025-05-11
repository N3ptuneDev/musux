import { useState } from "react";
import { Link } from "wouter";
import { PlaylistItem } from "@/types/spotify";
import { usePlayer } from "@/hooks/use-player";

interface PlaylistCardProps {
  playlist: PlaylistItem;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playContext } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playContext(playlist.uri);
  };

  return (
    <Link href={`/playlist/${playlist.id}`}>
      <a 
        className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors cursor-pointer group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={playlist.images[0]?.url || "https://via.placeholder.com/300"} 
          alt={playlist.name} 
          className="w-full aspect-square object-cover rounded-md mb-4 shadow-md" 
        />
        <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
        <p className="text-[#B3B3B3] text-sm truncate">{playlist.description}</p>
        
        {isHovered && (
          <div className="absolute bottom-16 right-4 opacity-100 transition-opacity">
            <button 
              className="bg-[#1DB954] rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-black hover:scale-105 transition-transform"
              onClick={handlePlayClick}
            >
              <i className="ri-play-fill text-xl"></i>
            </button>
          </div>
        )}
      </a>
    </Link>
  );
};

export default PlaylistCard;
