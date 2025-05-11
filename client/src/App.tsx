import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import Login from "@/pages/Login";
import Playlist from "@/pages/Playlist";
import Album from "@/pages/Album";
import Sidebar from "@/components/layout/Sidebar";
import PlayerBar from "@/components/layout/PlayerBar";
import MobileNav from "@/components/layout/MobileNav";
import TopBar from "@/components/layout/TopBar";
import { useState, useEffect } from "react";

// Loading component
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#121212]">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center animate-pulse mb-4">
        <i className="ri-music-2-line text-black text-xl"></i>
      </div>
      <h1 className="text-white text-xl font-bold">Loading MusuX...</h1>
      <button 
        onClick={() => window.location.href = "/.netlify/functions/api/spotify/login"}
        className="mt-6 bg-[#1DB954] hover:bg-opacity-90 text-black font-medium py-2 px-4 rounded-full"
      >
        Login with Spotify
      </button>
    </div>
  </div>
);

// Main application component
function App() {
  // We'll use a simplified authentication check in App.tsx
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  // Check authentication status
  useEffect(() => {
    fetch('/.netlify/functions/api/spotify/me')
      .then(res => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);
  
  // Show loading screen while checking authentication
  if (isLoggedIn === null) {
    return <LoadingScreen />;
  }
  
  // Show login if not authenticated
  if (isLoggedIn === false) {
    return <Login />;
  }
  
  // Show main application once authenticated
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-gradient-to-b from-[#282828] to-[#121212] overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/search" component={Search} />
              <Route path="/library" component={Library} />
              <Route path="/playlist/:id" component={Playlist} />
              <Route path="/album/:id" component={Album} />
              <Route component={NotFound} />
            </Switch>
            {/* Bottom padding for player */}
            <div className="h-24"></div>
          </div>
        </main>
      </div>
      <MobileNav />
      <PlayerBar />
    </div>
  );
}

export default App;
