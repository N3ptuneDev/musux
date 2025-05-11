# Deploying MusuX to Netlify

This guide will help you deploy your MusuX Spotify application to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. A GitHub account (to store your code repository)

## Step 1: Push Your Code to GitHub

1. Create a new GitHub repository
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/musux.git
   git push -u origin main
   ```

## Step 2: Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose GitHub as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your MusuX repository

## Step 3: Configure Build Settings

In the Netlify deploy settings, configure the following:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

## Step 4: Set Environment Variables

Add the following environment variables in the Netlify site settings:

1. Go to Site settings > Build & deploy > Environment variables
2. Add the following variables with your Spotify API credentials:

   - `SPOTIFY_CLIENT_ID` - Your Spotify application client ID
   - `SPOTIFY_CLIENT_SECRET` - Your Spotify application client secret
   - `SPOTIFY_REDIRECT_URI` - Set this to `https://your-netlify-site.netlify.app/.netlify/functions/api/callback`
   - `SESSION_SECRET` - A random string for session encryption (generate with `openssl rand -hex 32`)

## Step 5: Update Redirect URI in Spotify Developer Dashboard

1. Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your application
3. Click "Edit Settings"
4. In the "Redirect URIs" section, add `https://your-netlify-site.netlify.app/.netlify/functions/api/callback`
5. Save changes

## Step 6: Deploy!

1. Click "Deploy site" in Netlify
2. Wait for the build and deployment process to complete
3. Once deployed, your application will be accessible at `https://your-netlify-site.netlify.app`

## Troubleshooting

If you encounter authentication issues:

1. Double-check that your environment variables are set correctly in Netlify
2. Verify that the redirect URI in your Spotify Developer Dashboard matches exactly what you've set in your SPOTIFY_REDIRECT_URI environment variable
3. Check the Netlify function logs for any errors
4. Make sure all API paths in your frontend code use the `/.netlify/functions/api/` prefix

## Function Limits

Be aware that Netlify has limits on the free tier:
- 125K function executions per month
- 100 hours of function runtime per month
- Function timeouts after 10 seconds

This should be sufficient for development and personal use, but for higher traffic you may need to upgrade to a paid plan.