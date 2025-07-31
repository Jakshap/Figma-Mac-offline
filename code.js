// This plugin template uses Figma's API to interact with the design file

figma.showUI(__html__, { width: 300, height: 400 });

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-palette') {
    try {
      // Extract track ID from Spotify URL
      const trackId = extractSpotifyTrackId(msg.url);
      if (!trackId) {
        figma.notify('Invalid Spotify URL');
        return;
      }

      figma.notify('Checking server...');
      
      // First check if server is running, start if needed
      let serverCheck;
      try {
        serverCheck = await fetch('http://localhost:3001/api/colors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackId: 'health-check' })
        });
      } catch (error) {
        figma.notify('Server not running - please start with "npm start" in Terminal');
        return;
      }
      
      figma.notify('Fetching album artwork...');
      
      // Call backend API to get colors
      const response = await fetch('http://localhost:3001/api/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: trackId })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        figma.notify(`Server error: ${response.status}`);
        console.error('Server response:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      createColorPalette(data.colors);
      figma.notify(`Palette created for "${data.trackName}" by ${data.artistName}`);
      
    } catch (error) {
      console.error('Plugin error:', error);
      figma.notify(`Error: ${error.message}`);
    }
  }

  if (msg.type === 'create-rectangle') {
    const rect = figma.createRectangle();
    rect.x = 150;
    rect.y = 150;
    rect.resize(800, 800);
    rect.fills = [{type: 'SOLID', color: {r: 0.5, g: 0, b: 1}}];
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }

  if (msg.type === 'taylor-swift-albums') {
    try {
      figma.notify('Checking server...');
      
      // Check if server is running
      let serverCheck;
      try {
        serverCheck = await fetch('http://localhost:3001/api/taylor-swift-albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      } catch (error) {
        figma.notify('Server not running - please start with "npm start" in Terminal');
        return;
      }
      
      figma.notify('Fetching Taylor Swift albums...');
      
      const response = await fetch('http://localhost:3001/api/taylor-swift-albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        figma.notify(`Server error: ${response.status}`);
        console.error('Server response:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log('Received Taylor Swift data:', data);
      
      await createTaylorSwiftAlbumPalettes(data.albums);
      figma.notify(`Created ${data.albums.length} Taylor Swift album palettes!`);
      
    } catch (error) {
      console.error('Plugin error:', error);
      figma.notify(`Error: ${error.message}`);
    }
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

function extractSpotifyTrackId(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function createColorPalette(colors) {
  const swatches = [];
  const swatchSize = 100;
  const spacing = 20;
  
  colors.forEach((color, index) => {
    const swatch = figma.createRectangle();
    swatch.x = index * (swatchSize + spacing);
    swatch.y = 100;
    swatch.resize(swatchSize, swatchSize);
    swatch.fills = [{type: 'SOLID', color: color}];
    swatch.name = `Color ${index + 1}`;
    
    figma.currentPage.appendChild(swatch);
    swatches.push(swatch);
  });
  
  figma.currentPage.selection = swatches;
  figma.viewport.scrollAndZoomIntoView(swatches);
}

async function createTaylorSwiftAlbumPalettes(albums) {
  const allElements = [];
  const swatchSize = 80;
  const spacing = 10;
  const albumSpacing = 150;
  
  // Load font first
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  albums.forEach((album, albumIndex) => {
    // Create album title
    const titleText = figma.createText();
    titleText.characters = album.name;
    titleText.fontSize = 16;
    titleText.x = albumIndex * albumSpacing;
    titleText.y = 50;
    titleText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
    figma.currentPage.appendChild(titleText);
    allElements.push(titleText);
    
    // Create color swatches for this album
    album.colors.forEach((color, colorIndex) => {
      const swatch = figma.createRectangle();
      swatch.x = albumIndex * albumSpacing;
      swatch.y = 80 + (colorIndex * (swatchSize + spacing));
      swatch.resize(swatchSize, swatchSize);
      swatch.fills = [{type: 'SOLID', color: color}];
      swatch.name = `${album.name} - Color ${colorIndex + 1}`;
      
      figma.currentPage.appendChild(swatch);
      allElements.push(swatch);
    });
  });
  
  figma.currentPage.selection = allElements;
  figma.viewport.scrollAndZoomIntoView(allElements);
}