# Spotify Color Palette Plugin Setup

## Prerequisites
1. Node.js installed on your computer
2. Spotify Developer Account

## Setup Steps

### 1. Get Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in app details:
   - App name: "Figma Color Palette"
   - App description: "Extract colors from Spotify album artwork"
   - Redirect URI: `http://localhost:3001` (not used but required)
5. Copy your **Client ID** and **Client Secret**

### 2. Configure Backend
1. Open `server.js`
2. Replace these lines:
   ```javascript
   const CLIENT_ID = 'your_spotify_client_id';
   const CLIENT_SECRET = 'your_spotify_client_secret';
   ```
   With your actual credentials:
   ```javascript
   const CLIENT_ID = 'your_actual_client_id_here';
   const CLIENT_SECRET = 'your_actual_client_secret_here';
   ```

### 3. Install Dependencies & Start Server
```bash
cd "/Users/jackshapiro/Desktop/!Figma"
npm install
npm start
```

### 4. Test in Figma
1. Open Figma
2. Go to Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` file
4. Run the plugin
5. Paste a Spotify URL and click "Generate Color Palette"

## Testing URLs
- https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC (Rick Astley - Never Gonna Give You Up)
- https://open.spotify.com/track/0VjIjW4GlUK7iL5frIQnWT (Ed Sheeran - Shape of You)

Each URL should now generate different color palettes based on the actual album artwork!