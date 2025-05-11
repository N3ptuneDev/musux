import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import SpotifyWebApi from "spotify-web-api-node";

// Get the redirect URI from environment
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5000/api/spotify/callback";

// Create a new Spotify API instance
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  redirectUri: redirectUri
});

// Set up Spotify authentication
export function setupSpotifyPassport() {
  // Serialize the user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  // Deserialize the user from the session
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  console.log("Setting up Spotify authentication with redirect URI:", redirectUri);

  // Set up the Spotify strategy
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID || "",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
        callbackURL: redirectUri,
      },
      (accessToken: string, refreshToken: string, expires_in: number, profile: any, done: any) => {
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
}

// Handle token refresh
export async function refreshAccessToken(refreshToken: string) {
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    return data.body.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}
