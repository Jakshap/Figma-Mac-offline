const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const sharp = require('sharp');
const ColorThief = require('colorthief');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Spotify API credentials (you'll need to get these from Spotify Developer Dashboard)
const CLIENT_ID = 'your_spotify_client_id';
const CLIENT_SECRET = 'your_spotify_client_secret';

let accessToken = null;

// Get Spotify access token
async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  accessToken = data.access_token;
  return accessToken;
}

// Get track info from Spotify
async function getTrackInfo(trackId) {
  if (!accessToken) {
    await getSpotifyToken();
  }
  
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
  
  return await response.json();
}

// Extract colors from image URL
async function extractColors(imageUrl) {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    // Use ColorThief to extract dominant colors
    const palette = await ColorThief.getPalette(buffer, 5);
    
    // Convert RGB to 0-1 range for Figma
    return palette.map(color => ({
      r: color[0] / 255,
      g: color[1] / 255,
      b: color[2] / 255
    }));
  } catch (error) {
    console.error('Error extracting colors:', error);
    // Return fallback colors
    return [
      {r: 0.1, g: 0.2, b: 0.8},
      {r: 0.8, g: 0.1, b: 0.3},
      {r: 0.2, g: 0.7, b: 0.2},
      {r: 0.9, g: 0.6, b: 0.1},
      {r: 0.6, g: 0.2, b: 0.8}
    ];
  }
}

// Mock data for different tracks
const mockTrackData = {
  '4uLU6hMCjMI75M1A2tKUQC': {
    colors: [{r: 0.8, g: 0.2, b: 0.1}, {r: 0.9, g: 0.7, b: 0.3}, {r: 0.1, g: 0.1, b: 0.8}, {r: 0.6, g: 0.8, b: 0.9}, {r: 0.2, g: 0.2, b: 0.2}],
    trackName: "Never Gonna Give You Up",
    artistName: "Rick Astley",
    albumName: "Whenever You Need Somebody"
  },
  '0VjIjW4GlUK7iL5frIQnWT': {
    colors: [{r: 0.9, g: 0.4, b: 0.1}, {r: 0.8, g: 0.6, b: 0.2}, {r: 0.3, g: 0.7, b: 0.3}, {r: 0.1, g: 0.3, b: 0.8}, {r: 0.6, g: 0.2, b: 0.7}],
    trackName: "Shape of You",
    artistName: "Ed Sheeran",
    albumName: "÷ (Divide)"
  },
  '6habFhsOp2NvshLv26DqMb': {
    colors: [{r: 0.1, g: 0.1, b: 0.1}, {r: 0.9, g: 0.9, b: 0.9}, {r: 0.7, g: 0.3, b: 0.2}, {r: 0.2, g: 0.4, b: 0.6}, {r: 0.8, g: 0.7, b: 0.6}],
    trackName: "Someone Like You",
    artistName: "Adele",
    albumName: "21"
  },
  '7qiZfU4dY1lWllzX7mPBI3': {
    colors: [{r: 0.8, g: 0.8, b: 0.1}, {r: 0.8, g: 0.1, b: 0.1}, {r: 0.1, g: 0.1, b: 0.8}, {r: 0.8, g: 0.8, b: 0.8}, {r: 0.2, g: 0.2, b: 0.2}],
    trackName: "Bohemian Rhapsody",
    artistName: "Queen",
    albumName: "A Night at the Opera"
  },
  '11dFghVXANMlKmJXsNCbNl': {
    colors: [{r: 0.9, g: 0.1, b: 0.4}, {r: 0.1, g: 0.8, b: 0.9}, {r: 0.9, g: 0.8, b: 0.1}, {r: 0.6, g: 0.2, b: 0.8}, {r: 0.2, g: 0.7, b: 0.3}],
    trackName: "Uptown Funk",
    artistName: "Mark Ronson ft. Bruno Mars",
    albumName: "Uptown Special"
  }
};

// Taylor Swift albums mock data
const taylorSwiftAlbums = [
  {
    name: "Taylor Swift",
    colors: [{r: 0.8, g: 0.7, b: 0.3}, {r: 0.6, g: 0.4, b: 0.2}, {r: 0.9, g: 0.8, b: 0.6}, {r: 0.4, g: 0.3, b: 0.1}, {r: 0.7, g: 0.6, b: 0.4}]
  },
  {
    name: "Fearless",
    colors: [{r: 0.9, g: 0.8, b: 0.1}, {r: 0.8, g: 0.6, b: 0.0}, {r: 0.9, g: 0.9, b: 0.7}, {r: 0.6, g: 0.4, b: 0.0}, {r: 0.4, g: 0.3, b: 0.1}]
  },
  {
    name: "Speak Now",
    colors: [{r: 0.6, g: 0.2, b: 0.8}, {r: 0.8, g: 0.4, b: 0.9}, {r: 0.9, g: 0.7, b: 0.9}, {r: 0.4, g: 0.1, b: 0.5}, {r: 0.7, g: 0.5, b: 0.8}]
  },
  {
    name: "Red",
    colors: [{r: 0.9, g: 0.1, b: 0.1}, {r: 0.7, g: 0.0, b: 0.0}, {r: 0.9, g: 0.6, b: 0.6}, {r: 0.5, g: 0.0, b: 0.0}, {r: 0.2, g: 0.1, b: 0.1}]
  },
  {
    name: "1989",
    colors: [{r: 0.0, g: 0.7, b: 0.9}, {r: 0.4, g: 0.8, b: 0.9}, {r: 0.8, g: 0.9, b: 0.9}, {r: 0.0, g: 0.5, b: 0.7}, {r: 0.6, g: 0.8, b: 0.8}]
  },
  {
    name: "Reputation",
    colors: [{r: 0.1, g: 0.1, b: 0.1}, {r: 0.3, g: 0.3, b: 0.3}, {r: 0.6, g: 0.6, b: 0.6}, {r: 0.0, g: 0.0, b: 0.0}, {r: 0.8, g: 0.8, b: 0.8}]
  },
  {
    name: "Lover",
    colors: [{r: 0.9, g: 0.6, b: 0.8}, {r: 0.8, g: 0.4, b: 0.6}, {r: 0.9, g: 0.8, b: 0.9}, {r: 0.7, g: 0.2, b: 0.5}, {r: 0.6, g: 0.9, b: 0.8}]
  },
  {
    name: "Folklore",
    colors: [{r: 0.5, g: 0.5, b: 0.5}, {r: 0.3, g: 0.4, b: 0.3}, {r: 0.7, g: 0.7, b: 0.6}, {r: 0.2, g: 0.3, b: 0.2}, {r: 0.6, g: 0.6, b: 0.5}]
  },
  {
    name: "Evermore",
    colors: [{r: 0.6, g: 0.4, b: 0.2}, {r: 0.8, g: 0.6, b: 0.3}, {r: 0.9, g: 0.8, b: 0.6}, {r: 0.4, g: 0.2, b: 0.1}, {r: 0.7, g: 0.5, b: 0.3}]
  },
  {
    name: "Midnights",
    colors: [{r: 0.2, g: 0.1, b: 0.4}, {r: 0.4, g: 0.2, b: 0.6}, {r: 0.6, g: 0.4, b: 0.8}, {r: 0.1, g: 0.0, b: 0.2}, {r: 0.8, g: 0.6, b: 0.9}]
  }
];

// API endpoint to get colors for a track (using mock data)
app.post('/api/colors', async (req, res) => {
  try {
    const { trackId } = req.body;
    
    if (!trackId) {
      return res.status(400).json({ error: 'Track ID is required' });
    }
    
    console.log(`Requested track ID: ${trackId}`);
    
    // Check if we have mock data for this track
    if (mockTrackData[trackId]) {
      console.log(`Found mock data for: ${mockTrackData[trackId].trackName}`);
      res.json(mockTrackData[trackId]);
    } else {
      // Generate random colors for unknown tracks
      console.log('Generating random colors for unknown track');
      const randomColors = Array.from({length: 5}, () => ({
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
      }));
      
      res.json({
        colors: randomColors,
        trackName: "Unknown Track",
        artistName: "Unknown Artist",
        albumName: "Unknown Album"
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for Taylor Swift albums
app.post('/api/taylor-swift-albums', async (req, res) => {
  try {
    console.log('Requested Taylor Swift albums');
    res.json({
      albums: taylorSwiftAlbums,
      artistName: "Taylor Swift"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to set your Spotify CLIENT_ID and CLIENT_SECRET!');
});