import { Link, useLocation } from "wouter";

const MobileNav = () => {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 bg-[#181818] border-t border-[#282828] py-3 px-6 z-20">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === "/" ? "text-[#1DB954]" : "text-[#B3B3B3]"}`}>
            <i className="ri-home-4-line text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center ${location === "/search" ? "text-[#1DB954]" : "text-[#B3B3B3]"}`}>
            <i className="ri-search-line text-xl"></i>
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/library">
          <a className={`flex flex-col items-center ${location === "/library" ? "text-[#1DB954]" : "text-[#B3B3B3]"}`}>
            <i className="ri-album-line text-xl"></i>
            <span className="text-xs mt-1">Library</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center ${location === "/profile" ? "text-[#1DB954]" : "text-[#B3B3B3]"}`}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
