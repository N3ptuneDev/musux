import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import MemoryStore from "memorystore";
import { setupSpotifyPassport, spotifyApi } from "./spotify";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "musux-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
        secure: false,
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Spotify authentication
  setupSpotifyPassport();

  // Authentication routes
  app.get("/api/spotify/login", passport.authenticate("spotify", {
    scope: [
      "user-read-email", 
      "user-read-private", 
      "user-read-playback-state", 
      "user-modify-playback-state",
      "user-read-currently-playing",
      "streaming",
      "playlist-read-private",
      "playlist-read-collaborative",
      "user-library-read",
      "user-top-read",
      "user-read-recently-played",
      "user-follow-read"
    ]
  }));

  // Get the callback path from the redirect URI
  const callbackUrl = new URL(process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5000/api/spotify/callback");
  const callbackPath = callbackUrl.pathname;
  
  console.log(`Setting up Spotify callback route at: ${callbackPath}`);
  
  app.get(
    callbackPath,
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/api/spotify/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Authentication check middleware
  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // User profile
  app.get("/api/spotify/me", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getMe();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Playlists
  app.get("/api/spotify/playlists", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getUserPlaylists();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get("/api/spotify/playlists/:id", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getPlaylist(req.params.id);
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.get("/api/spotify/playlists/:id/tracks", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getPlaylistTracks(req.params.id);
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      res.status(500).json({ message: "Failed to fetch playlist tracks" });
    }
  });

  // Albums
  app.get("/api/spotify/albums/:id", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getAlbum(req.params.id);
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching album:", error);
      res.status(500).json({ message: "Failed to fetch album" });
    }
  });

  app.get("/api/spotify/albums/:id/tracks", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getAlbumTracks(req.params.id);
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching album tracks:", error);
      res.status(500).json({ message: "Failed to fetch album tracks" });
    }
  });

  app.get("/api/spotify/albums/saved", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getMySavedAlbums();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching saved albums:", error);
      res.status(500).json({ message: "Failed to fetch saved albums" });
    }
  });

  // Artists
  app.get("/api/spotify/artists/followed", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getFollowedArtists();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching followed artists:", error);
      res.status(500).json({ message: "Failed to fetch followed artists" });
    }
  });

  // Tracks
  app.get("/api/spotify/track/:id", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getTrack(req.params.id);
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  // Browse
  app.get("/api/spotify/browse/featured-playlists", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getFeaturedPlaylists();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching featured playlists:", error);
      res.status(500).json({ message: "Failed to fetch featured playlists" });
    }
  });

  app.get("/api/spotify/browse/new-releases", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getNewReleases();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching new releases:", error);
      res.status(500).json({ message: "Failed to fetch new releases" });
    }
  });

  // Search
  app.get("/api/spotify/search", ensureAuthenticated, async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.search(
        q as string, 
        (type as string || "track,album,artist,playlist").split(",")
      );
      res.json(response.body);
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Failed to search" });
    }
  });

  // Player
  app.get("/api/spotify/player", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getMyCurrentPlaybackState();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching playback state:", error);
      res.status(500).json({ message: "Failed to fetch playback state" });
    }
  });

  app.get("/api/spotify/player/recently-played", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      const response = await spotifyApi.getMyRecentlyPlayedTracks();
      res.json(response.body);
    } catch (error) {
      console.error("Error fetching recently played:", error);
      res.status(500).json({ message: "Failed to fetch recently played tracks" });
    }
  });

  app.put("/api/spotify/player/play", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.play(req.body);
      res.status(204).send();
    } catch (error) {
      console.error("Error starting playback:", error);
      res.status(500).json({ message: "Failed to start playback" });
    }
  });

  app.put("/api/spotify/player/pause", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.pause();
      res.status(204).send();
    } catch (error) {
      console.error("Error pausing playback:", error);
      res.status(500).json({ message: "Failed to pause playback" });
    }
  });

  app.post("/api/spotify/player/next", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.skipToNext();
      res.status(204).send();
    } catch (error) {
      console.error("Error skipping to next:", error);
      res.status(500).json({ message: "Failed to skip to next track" });
    }
  });

  app.post("/api/spotify/player/previous", ensureAuthenticated, async (req, res) => {
    try {
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.skipToPrevious();
      res.status(204).send();
    } catch (error) {
      console.error("Error skipping to previous:", error);
      res.status(500).json({ message: "Failed to skip to previous track" });
    }
  });

  app.put("/api/spotify/player/seek", ensureAuthenticated, async (req, res) => {
    try {
      const { position_ms } = req.query;
      if (!position_ms) {
        return res.status(400).json({ message: "Position is required" });
      }
      
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.seek(parseInt(position_ms as string));
      res.status(204).send();
    } catch (error) {
      console.error("Error seeking:", error);
      res.status(500).json({ message: "Failed to seek" });
    }
  });

  app.put("/api/spotify/player/volume", ensureAuthenticated, async (req, res) => {
    try {
      const { volume_percent } = req.query;
      if (!volume_percent) {
        return res.status(400).json({ message: "Volume is required" });
      }
      
      spotifyApi.setAccessToken(req.user.accessToken);
      await spotifyApi.setVolume(parseInt(volume_percent as string));
      res.status(204).send();
    } catch (error) {
      console.error("Error setting volume:", error);
      res.status(500).json({ message: "Failed to set volume" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
