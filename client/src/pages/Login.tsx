import { useState } from "react";
import { useSpotifyAuth } from "@/hooks/use-spotify-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const { login, isLoading } = useSpotifyAuth();
  const [showInfo, setShowInfo] = useState(false);

  const handleLogin = () => {
    // Direct link to authentication page in case the hook isn't working
    window.location.href = "/.netlify/functions/api/spotify/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DB954] to-[#121212] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <i className="ri-music-2-line text-[#1DB954] text-2xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-white ml-4">MusuX</h1>
          </div>
          <p className="text-white text-lg">Your personalized Spotify experience</p>
        </div>
        
        <div className="bg-[#121212] p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Connect to Spotify</h2>
          <p className="text-[#B3B3B3] mb-4">Log in with your Spotify account to access your playlists, liked songs, and more.</p>
          
          {showInfo && (
            <Alert className="mb-4 bg-[#282828] border-[#1DB954] text-white">
              <AlertCircle className="h-4 w-4 text-[#1DB954]" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-sm">
                Make sure your Spotify developer app is configured with the correct redirect URI:
                <code className="block mt-1 p-2 bg-black rounded text-xs font-mono overflow-x-auto">
                  {window.location.origin}/callback
                </code>
              </AlertDescription>
            </Alert>
          )}
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#1DB954] hover:bg-opacity-80 text-white py-3 px-6 rounded-full font-medium text-lg transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
            ) : (
              <i className="ri-spotify-fill mr-2 text-xl"></i>
            )}
            {isLoading ? "Connecting..." : "Connect with Spotify"}
          </button>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-[#1DB954] text-sm hover:underline"
            >
              {showInfo ? "Hide setup info" : "Need help setting up?"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-[#B3B3B3]">
            <p>By continuing, you agree to our <a href="#" className="text-[#1DB954] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1DB954] hover:underline">Privacy Policy</a>.</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <h3 className="text-white font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 p-4 rounded-lg">
              <i className="ri-search-line text-[#1DB954] text-2xl mb-2"></i>
              <p className="text-white">Discover new music</p>
            </div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg">
              <i className="ri-playlist-line text-[#1DB954] text-2xl mb-2"></i>
              <p className="text-white">Manage your playlists</p>
            </div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg">
              <i className="ri-headphone-line text-[#1DB954] text-2xl mb-2"></i>
              <p className="text-white">Seamless playback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
