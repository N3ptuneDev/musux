import { Link } from "wouter";
import { Album } from "@/types/spotify";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <Link href={`/album/${album.id}`}>
      <a className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors cursor-pointer">
        <img 
          src={album.images[0]?.url || "https://via.placeholder.com/300"} 
          alt={album.name} 
          className="w-full aspect-square object-cover rounded-md mb-4 shadow-md" 
        />
        <h3 className="font-semibold text-white mb-1 truncate">{album.name}</h3>
        <p className="text-[#B3B3B3] text-sm truncate">
          {album.artists.map(artist => artist.name).join(", ")}
        </p>
      </a>
    </Link>
  );
};

export default AlbumCard;
