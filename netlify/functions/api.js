const express = require('express');
const serverless = require('serverless-http');
const passport = require('passport');
const session = require('express-session');
const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyWebApi = require('spotify-web-api-node');
const MemoryStore = require('memorystore')(session);

const app = express();

// Get the redirect URI from environment
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://your-netlify-site.netlify.app/.netlify/functions/api/callback";

// Create a new Spotify API instance
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  redirectUri: redirectUri
});

// Configure session
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "musux-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set up the Spotify strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      callbackURL: redirectUri,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      // Store tokens and profile in the user object
      const user = {
        id: profile.id,
        username: profile.displayName,
        accessToken,
        refreshToken,
        expiresIn: expires_in,
        profile
      };

      // Store tokens in the Spotify API instance for future use
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      return done(null, user);
    }
  )
);

// Authentication routes
app.get("/spotify/login", passport.authenticate("spotify", {
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
app.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/.netlify/functions/api/auth-failed" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Auth failure route
app.get("/auth-failed", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

app.post("/spotify/logout", (req, res) => {
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
app.get("/spotify/me", ensureAuthenticated, async (req, res) => {
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
app.get("/spotify/playlists", ensureAuthenticated, async (req, res) => {
  try {
    spotifyApi.setAccessToken(req.user.accessToken);
    const response = await spotifyApi.getUserPlaylists();
    res.json(response.body);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Failed to fetch playlists" });
  }
});

// Add all other API routes from your application here
// ...

// Redirect root to frontend
app.get('/', (req, res) => {
  res.redirect('/');
});

// Export the serverless function
module.exports.handler = serverless(app);