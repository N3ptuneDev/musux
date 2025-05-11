import { useState } from "react";
import { format } from "date-fns";
import { Track } from "@/types/spotify";
import { usePlayer } from "@/hooks/use-player";

interface TrackListProps {
  tracks: Track[];
  contextUri?: string;
  showAlbum?: boolean;
  showDateAdded?: boolean;
}

const TrackList = ({ 
  tracks, 
  contextUri,
  showAlbum = true,
  showDateAdded = true
}: TrackListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track, index: number) => {
    playTrack(track, contextUri, index);
  };

  return (
    <div className="bg-[#181818] rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#282828] text-[#B3B3B3] text-sm">
          <tr>
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Title</th>
            {showAlbum && <th className="py-3 px-4 hidden md:table-cell">Album</th>}
            {showDateAdded && <th className="py-3 px-4 hidden md:table-cell">Date Added</th>}
            <th className="py-3 px-4 text-right"><i className="ri-time-line"></i></th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const isHovered = hoveredIndex === index;

            return (
              <tr 
                key={track.id} 
                className={`border-b border-[#282828] hover:bg-[#282828] transition-colors group ${
                  isCurrentTrack ? "bg-[#282828] bg-opacity-40" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <td className="py-3 px-4 text-[#B3B3B3]">
                  {isHovered ? (
                    <button onClick={() => handlePlayTrack(track, index)}>
                      <i className={`${isCurrentTrack && isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-white`}></i>
                    </button>
                  ) : (
                    <span className={isCurrentTrack ? "text-[#1DB954]" : ""}>
                      {isCurrentTrack && isPlaying ? (
                        <i className="ri-volume-up-fill text-[#1DB954]"></i>
                      ) : (
                        index + 1
                      )}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {track.album?.images?.[0]?.url && (
                      <img 
                        src={track.album.images[0].url} 
                        alt={track.name} 
                        className="w-10 h-10 mr-3 rounded" 
                      />
                    )}
                    <div>
                      <div className={`font-medium ${isCurrentTrack ? "text-[#1DB954]" : "text-white"}`}>
                        {track.name}
                      </div>
                      <div className="text-[#B3B3B3] text-sm">
                        {track.artists.map(artist => artist.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
                {showAlbum && (
                  <td className="py-3 px-4 text-[#B3B3B3] hidden md:table-cell">
                    {track.album?.name}
                  </td>
                )}
                {showDateAdded && (
                  <td className="py-3 px-4 text-[#B3B3B3] hidden md:table-cell">
                    {track.added_at ? format(new Date(track.added_at), "MMM d, yyyy") : "-"}
                  </td>
                )}
                <td className="py-3 px-4 text-[#B3B3B3] text-right">
                  {formatDuration(track.duration_ms)}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#B3B3B3] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <i className="ri-more-2-fill"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
